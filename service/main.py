from fastapi import FastAPI, File, Form, UploadFile, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import asyncio
import logging
import time
import cv2
import numpy as np
from typing import Dict, Any, List
import uvicorn
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import tempfile
from pathlib import Path
from gtts import gTTS
import base64
from pydantic import BaseModel
from io import BytesIO

try:
    from faster_whisper import WhisperModel
except ImportError:
    WhisperModel = None

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('ai_interview_service')

app = FastAPI(title="PDF Processing API", version="1.0.0")

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

GEMINI_FALLBACK_MODELS = [
    "models/gemini-3.5-flash",
    "models/gemini-3.1-flash",
    "models/gemini-3.1-flash-lite",
    "models/gemini-2.5-flash-lite",
    "models/gemini-2.5-flash",
    "models/gemini-2.5-pro",
    "models/gemini-2.0-flash",
    "models/gemini-2.0-flash-lite",
    "models/gemini-1.5-flash",
    "models/gemini-pro",
]
_gemini_model_name = None
_gemini_available_models = None


def normalize_gemini_model_name(model_name: str) -> str:
    model_name = (model_name or "").strip()
    if not model_name:
        return ""

    return model_name if model_name.startswith("models/") else f"models/{model_name}"


def list_available_models(log: bool = True):
    """Return Gemini models that support generateContent for this API key."""
    try:
        models = [
            m.name
            for m in genai.list_models()
            if "generateContent" in m.supported_generation_methods
        ]
        if log:
            print("[OK] Available Gemini text models:")
            for model_name in models:
                print(f"  - {model_name}")
        return models
    except Exception as e:
        if log:
            print(f"[ERROR] Error listing models: {e}")
        return []


def get_available_gemini_models():
    global _gemini_available_models

    if _gemini_available_models is None:
        _gemini_available_models = list_available_models()

    return _gemini_available_models


def get_gemini_candidates():
    configured_model = normalize_gemini_model_name(os.getenv("GEMINI_MODEL", ""))
    available_models = get_available_gemini_models()
    preferred_tokens = [
        "gemini-3.5-flash",
        "gemini-3.1-flash",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-pro",
    ]
    candidates = []

    if configured_model:
        candidates.append(configured_model)

    for token in preferred_tokens:
        candidates.extend(model_name for model_name in available_models if token in model_name)

    candidates.extend(GEMINI_FALLBACK_MODELS)

    return list(dict.fromkeys(candidates))


def is_model_unavailable_error(exc: Exception) -> bool:
    message = str(exc).lower()
    return any(
        phrase in message
        for phrase in [
            "404",
            "not found",
            "not available",
            "no longer available",
            "not supported",
        ]
    )


def generate_gemini_content(prompt: str):
    """Generate content with the first Gemini model available to this key."""
    global _gemini_model_name

    last_error = None

    for model_name in get_gemini_candidates():
        try:
            response = genai.GenerativeModel(model_name).generate_content(prompt)
            if _gemini_model_name != model_name:
                logger.info("Using Gemini model: %s", model_name)
                _gemini_model_name = model_name
            return response
        except Exception as exc:
            last_error = exc
            if is_model_unavailable_error(exc):
                logger.warning("Gemini model unavailable, trying next: %s", model_name)
                continue
            raise

    raise HTTPException(
        status_code=503,
        detail=f"No usable Gemini text model was available. Last error: {last_error}",
    )

WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL", "base.en")
WHISPER_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
WHISPER_COMPUTE_TYPE = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
MAX_TRANSCRIPTION_UPLOAD_BYTES = (
    int(os.getenv("MAX_TRANSCRIPTION_UPLOAD_MB", "25")) * 1024 * 1024
)
_whisper_model = None


def get_whisper_model():
    """Load faster-whisper once and reuse it across transcription requests."""
    global _whisper_model

    if WhisperModel is None:
        raise HTTPException(
            status_code=503,
            detail="Speech transcription is not installed. Run pip install -r service/requirements.txt.",
        )

    if _whisper_model is None:
        logger.info(
            "Loading Whisper model %s on %s with %s compute",
            WHISPER_MODEL_NAME,
            WHISPER_DEVICE,
            WHISPER_COMPUTE_TYPE,
        )
        _whisper_model = WhisperModel(
            WHISPER_MODEL_NAME,
            device=WHISPER_DEVICE,
            compute_type=WHISPER_COMPUTE_TYPE,
        )

    return _whisper_model


def normalize_transcription_language(language: str):
    language_code = (language or "en").strip().lower()

    if language_code in {"english", "en-us", "en-in", "en-gb"}:
        return "en"

    return language_code.split("-", 1)[0] if language_code else None


def get_audio_suffix(filename: str, content_type: str) -> str:
    suffix = Path(filename or "").suffix.lower()

    if suffix in {".webm", ".ogg", ".oga", ".mp4", ".m4a", ".wav", ".mp3"}:
        return suffix

    return {
        "audio/webm": ".webm",
        "video/webm": ".webm",
        "audio/ogg": ".ogg",
        "audio/mp4": ".m4a",
        "audio/wav": ".wav",
        "audio/mpeg": ".mp3",
    }.get((content_type or "").split(";", 1)[0], ".webm")


def transcribe_audio_file(file_path: str, language: str) -> Dict[str, Any]:
    whisper_model = get_whisper_model()
    transcription_language = normalize_transcription_language(language)
    segments_iterator, info = whisper_model.transcribe(
        file_path,
        language=transcription_language,
        beam_size=5,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 500},
    )

    segments = []
    text_parts = []

    for segment in segments_iterator:
        segment_text = segment.text.strip()
        if not segment_text:
            continue

        text_parts.append(segment_text)
        segments.append(
            {
                "start": round(float(segment.start), 2),
                "end": round(float(segment.end), 2),
                "text": segment_text,
            }
        )

    duration = getattr(info, "duration", None)

    return {
        "text": " ".join(text_parts).strip(),
        "language": (
            getattr(info, "language", transcription_language) or transcription_language
        ),
        "duration": round(float(duration), 2) if duration is not None else None,
        "segments": segments,
    }


class MonitoringConnectionManager:
    """Tracks only Python face-monitoring WebSocket connections."""

    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.monitoring_sessions: Dict[int, Dict[str, Any]] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        client_id = id(websocket)
        now = time.monotonic()
        self.monitoring_sessions[client_id] = {
            "connected_at": now,
            "is_monitoring": False,
            "last_activity": now,
            "frames_processed": 0,
            "warnings": 0,
        }
        logger.info(
            "Monitoring client %s connected. Total monitoring clients: %s",
            client_id,
            len(self.active_connections),
        )

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        client_id = id(websocket)
        self.monitoring_sessions.pop(client_id, None)
        logger.info(
            "Monitoring client %s disconnected. Total monitoring clients: %s",
            client_id,
            len(self.active_connections),
        )

    def update_monitoring_status(self, websocket: WebSocket, is_monitoring: bool):
        session = self.monitoring_sessions.get(id(websocket))
        if session:
            session["is_monitoring"] = is_monitoring
            session["last_activity"] = time.monotonic()

    def record_analysis(self, websocket: WebSocket, status: str):
        session = self.monitoring_sessions.get(id(websocket))
        if session:
            session["frames_processed"] += 1
            session["last_activity"] = time.monotonic()
            if status == "WARNING":
                session["warnings"] += 1

    def get_active_sessions(self):
        return {
            "total_connections": len(self.active_connections),
            "active_monitoring_sessions": sum(
                1
                for session in self.monitoring_sessions.values()
                if session["is_monitoring"]
            ),
            "sessions": self.monitoring_sessions,
        }

    async def send_personal_message(self, websocket: WebSocket, payload: Dict[str, Any]):
        await websocket.send_text(json.dumps(payload))
        session = self.monitoring_sessions.get(id(websocket))
        if session:
            session["last_activity"] = time.monotonic()


monitoring_manager = MonitoringConnectionManager()
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


def detect_faces(image_data: str) -> Dict[str, Any]:
    """Detect whether the candidate's face is visible in a base64 frame."""
    try:
        if not image_data:
            return {
                "status": "ERROR",
                "message": "No video frame received",
                "faces_detected": 0,
                "alert_level": "medium",
                "violations": ["Camera frame missing"],
                "detection_details": {"student_present": False},
                "timestamp": time.monotonic(),
            }

        base64_payload = image_data.split(",", 1)[1] if "," in image_data else image_data
        img_data = base64.b64decode(base64_payload)
        np_buffer = np.frombuffer(img_data, np.uint8)
        image = cv2.imdecode(np_buffer, cv2.IMREAD_COLOR)

        if image is None:
            return {
                "status": "ERROR",
                "message": "Could not decode camera frame",
                "faces_detected": 0,
                "alert_level": "medium",
                "violations": ["Camera frame could not be read"],
                "detection_details": {"student_present": False},
                "timestamp": time.monotonic(),
            }

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(50, 50),
            flags=cv2.CASCADE_SCALE_IMAGE,
        )

        num_faces = len(faces)
        student_present = num_faces > 0
        violations = [] if student_present else ["Please position yourself in the camera view"]

        if student_present:
            status = "NORMAL"
            message = "Monitoring active"
            alert_level = "none"
        else:
            status = "WARNING"
            message = "Candidate not visible in frame"
            alert_level = "medium"

        return {
            "status": status,
            "message": message,
            "faces_detected": num_faces,
            "alert_level": alert_level,
            "violations": violations,
            "detection_details": {"student_present": student_present},
            "timestamp": time.monotonic(),
        }
    except Exception as exc:
        logger.exception("Face monitoring failed: %s", exc)
        return {
            "status": "ERROR",
            "message": "Camera monitoring issue. Please refresh if it persists.",
            "faces_detected": 0,
            "alert_level": "medium",
            "violations": ["Technical issue during camera monitoring"],
            "detection_details": {"student_present": False},
            "timestamp": time.monotonic(),
        }

def extract_resume_data(resume_text: str) -> dict:
    """
    Extract structured data from resume text using Gemini AI
    """
    prompt = f"""
    Extract the following information from this resume text and return it as a JSON object:

    {{
        "name": "Full name of the person",
        "email": "Email address",
        "phone": "Phone number",
        "location": "City, State/Country",
        "skills": ["list", "of", "technical", "skills"],
        "experience": [
            {{
                "company": "Company name",
                "position": "Job title",
                "duration": "Employment period",
                "responsibilities": ["key", "responsibilities"]
            }}
        ],
        "education": [
            {{
                "institution": "School/University name",
                "degree": "Degree/Certification",
                "year": "Graduation year"
            }}
        ],
        "summary": "Brief professional summary"
    }}

    Resume text:
    {resume_text}

    Return only valid JSON, no additional text or markdown formatting.
    """

    try:
        response = generate_gemini_content(prompt)
        response_text = response.text.strip()

        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        response_text = response_text.strip()

        # Parse the JSON response
        resume_data = json.loads(response_text)
        return resume_data
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {str(e)}")
        print(f"Raw response: {response.text}")
        return {
            "error": f"Failed to parse JSON response: {str(e)}",
            "raw_response": response.text if 'response' in locals() else "No response",
            "raw_text": resume_text[:500] + "..." if len(resume_text) > 500 else resume_text
        }
    except Exception as e:
        print(f"Error extracting resume data: {str(e)}")
        return {
            "error": f"Failed to extract resume data: {str(e)}",
            "raw_text": resume_text[:500] + "..." if len(resume_text) > 500 else resume_text
        }

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PDF Processing API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "PDF Processing API",
        "version": "1.0.0"
    }


@app.get("/sessions")
async def get_active_sessions():
    """Return live Python monitoring session metadata."""
    try:
        return {
            "status": "success",
            "data": monitoring_manager.get_active_sessions(),
            "timestamp": time.monotonic(),
        }
    except Exception as exc:
        logger.exception("Could not read monitoring sessions: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to get sessions information")


@app.get("/stats")
async def get_monitoring_stats():
    """Return aggregate live monitoring statistics."""
    try:
        sessions_info = monitoring_manager.get_active_sessions()
        return {
            "status": "success",
            "stats": {
                "total_connections": sessions_info["total_connections"],
                "active_monitoring": sessions_info["active_monitoring_sessions"],
                "server_uptime": time.monotonic(),
                "service_status": "running",
            },
            "timestamp": time.monotonic(),
        }
    except Exception as exc:
        logger.exception("Could not read monitoring stats: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to get monitoring statistics")


@app.websocket("/ws/monitor")
async def monitor_websocket(websocket: WebSocket):
    """Native WebSocket endpoint for live webcam face monitoring."""
    client_id = id(websocket)
    await monitoring_manager.connect(websocket)
    await monitoring_manager.send_personal_message(
        websocket,
        {
            "type": "connection_established",
            "message": "Connected to AI monitoring service",
            "client_id": client_id,
            "timestamp": time.monotonic(),
        },
    )

    try:
        while True:
            raw_data = await websocket.receive_text()

            try:
                message = json.loads(raw_data)
                message_type = message.get("type")

                if message_type == "start_monitoring":
                    monitoring_manager.update_monitoring_status(websocket, True)
                    await monitoring_manager.send_personal_message(
                        websocket,
                        {
                            "type": "monitoring_started",
                            "message": "AI monitoring session started",
                            "client_id": client_id,
                            "timestamp": time.monotonic(),
                        },
                    )

                elif message_type == "stop_monitoring":
                    monitoring_manager.update_monitoring_status(websocket, False)
                    await monitoring_manager.send_personal_message(
                        websocket,
                        {
                            "type": "monitoring_stopped",
                            "message": "AI monitoring session stopped",
                            "client_id": client_id,
                            "timestamp": time.monotonic(),
                        },
                    )

                elif message_type == "ping":
                    await monitoring_manager.send_personal_message(
                        websocket,
                        {
                            "type": "pong",
                            "client_id": client_id,
                            "timestamp": time.monotonic(),
                        },
                    )

                elif message_type == "video_frame":
                    image_data = message.get("data")
                    analysis_result = await asyncio.to_thread(detect_faces, image_data)
                    monitoring_manager.record_analysis(
                        websocket, analysis_result.get("status", "ERROR")
                    )
                    await monitoring_manager.send_personal_message(
                        websocket,
                        {
                            "type": "analysis_result",
                            "data": analysis_result,
                            "client_id": client_id,
                        },
                    )

                    if analysis_result.get("status") == "WARNING":
                        logger.warning(
                            "Monitoring client %s warning: %s",
                            client_id,
                            analysis_result.get("message"),
                        )

                else:
                    await monitoring_manager.send_personal_message(
                        websocket,
                        {
                            "type": "error",
                            "message": f"Unknown message type: {message_type}",
                            "client_id": client_id,
                        },
                    )

            except json.JSONDecodeError:
                await monitoring_manager.send_personal_message(
                    websocket,
                    {
                        "type": "error",
                        "message": "Invalid JSON format",
                        "client_id": client_id,
                    },
                )
            except Exception as exc:
                logger.exception("Monitoring message failed for %s: %s", client_id, exc)
                await monitoring_manager.send_personal_message(
                    websocket,
                    {
                        "type": "error",
                        "message": "Server error while processing monitoring frame",
                        "client_id": client_id,
                    },
                )

    except WebSocketDisconnect:
        monitoring_manager.disconnect(websocket)
    except Exception as exc:
        logger.exception("Monitoring WebSocket failed for %s: %s", client_id, exc)
        monitoring_manager.disconnect(websocket)

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Upload and process a PDF resume to extract structured information
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        print(f"[PDF] Processing file: {file.filename}")

        # Read the PDF file
        pdf_content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))

        # Extract all text from PDF
        full_text = ""
        for page in pdf_reader.pages:
            full_text += page.extract_text() + "\n"

        # Extract basic PDF information
        pdf_info = {
            "filename": file.filename,
            "file_size_bytes": len(pdf_content),
            "file_size_mb": round(len(pdf_content) / (1024 * 1024), 2),
            "total_pages": len(pdf_reader.pages),
            "content_type": file.content_type
        }

        # Extract resume data using Gemini AI
        print("[AI] Extracting resume data with Gemini AI...")
        resume_data = extract_resume_data(full_text)

        print("[OK] Resume processed successfully")

        return {
            "success": True,
            "message": "Resume processed successfully",
            "data": {
                "pdf_info": pdf_info,
                "resume_data": resume_data
            }
        }

    except Exception as e:
        print(f"[ERROR] Error processing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

# Pydantic models for voice endpoints
class TextToSpeechRequest(BaseModel):
    text: str
    language: str = "en"

class InterviewQuestionRequest(BaseModel):
    question: str
    previous_answer: str = ""
    context: dict = {}

@app.post("/text-to-speech")
async def text_to_speech(request: TextToSpeechRequest) -> Dict[str, Any]:
    """
    Convert text to speech and return as base64 encoded audio
    """
    try:
        print(f"[TTS] Converting text to speech: {request.text[:50]}...")

        # Create gTTS object
        tts = gTTS(text=request.text, lang=request.language, slow=False)

        # Save to BytesIO buffer
        audio_buffer = BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)

        # Convert to base64
        audio_base64 = base64.b64encode(audio_buffer.read()).decode('utf-8')

        print("[OK] Text-to-speech conversion successful")

        return {
            "success": True,
            "audio_data": audio_base64,
            "format": "mp3"
        }
    except Exception as e:
        print(f"[ERROR] Error in text-to-speech: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error converting text to speech: {str(e)}")

@app.post("/speech-to-text")
async def speech_to_text(
    audio: UploadFile = File(...),
    language: str = Form("en"),
    interviewId: str = Form(""),
    questionNumber: str = Form(""),
) -> Dict[str, Any]:
    """Transcribe uploaded candidate answer audio with local Whisper."""
    temp_path = None

    try:
        content_type = (audio.content_type or "").lower()
        allowed_content_type = (
            not content_type
            or content_type.startswith("audio/")
            or content_type in {"video/webm", "application/octet-stream"}
        )

        if not allowed_content_type:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file must be an audio recording",
            )

        suffix = get_audio_suffix(audio.filename, content_type)
        total_bytes = 0

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_audio:
            temp_path = temp_audio.name

            while True:
                chunk = await audio.read(1024 * 1024)
                if not chunk:
                    break

                total_bytes += len(chunk)
                if total_bytes > MAX_TRANSCRIPTION_UPLOAD_BYTES:
                    max_mb = MAX_TRANSCRIPTION_UPLOAD_BYTES // (1024 * 1024)
                    raise HTTPException(
                        status_code=413,
                        detail=f"Audio recording is too large. Maximum size is {max_mb} MB.",
                    )

                temp_audio.write(chunk)

        if total_bytes == 0:
            raise HTTPException(status_code=400, detail="No audio data was received")

        logger.info(
            "Transcribing %s bytes for interview=%s question=%s",
            total_bytes,
            interviewId or "unknown",
            questionNumber or "unknown",
        )
        transcription = await asyncio.to_thread(
            transcribe_audio_file, temp_path, language
        )
        text = transcription["text"].strip()

        if not text:
            raise HTTPException(
                status_code=400,
                detail="No speech was detected in the recording",
            )

        logger.info(
            "Transcription complete for interview=%s question=%s: %s characters",
            interviewId or "unknown",
            questionNumber or "unknown",
            len(text),
        )

        return {
            "success": True,
            "text": text,
            "language": transcription["language"],
            "duration": transcription["duration"],
            "segments": transcription["segments"],
            "metadata": {
                "bytes": total_bytes,
                "content_type": content_type,
                "interviewId": interviewId,
                "questionNumber": questionNumber,
            },
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error in speech-to-text: %s", exc)
        raise HTTPException(
            status_code=500,
            detail=f"Error transcribing speech: {str(exc)}",
        )
    finally:
        await audio.close()

        if temp_path:
            try:
                os.unlink(temp_path)
            except OSError as exc:
                logger.warning(
                    "Could not delete temporary audio file %s: %s", temp_path, exc
                )


@app.post("/analyze-answer")
async def analyze_answer(data: dict) -> Dict[str, Any]:
    """Analyze an answer and decide whether an interviewer follow-up is needed."""
    try:
        question = data.get("question", "")
        answer = data.get("answer", "")
        latest_answer = data.get("latestAnswer", answer)
        expected_answer = data.get("expectedAnswer", "")
        follow_up_count = int(data.get("followUpCount", 0) or 0)

        print(f"[AI] Reviewing answer for question: {question[:50]}...")

        prompt = f"""
        You are a live technical interviewer, not a grading bot.

        Decide whether the candidate's answer is complete enough to move on, or whether you should ask one short follow-up question first.

        Rules:
        - If the answer looks cut off, unclear, accidental, or too short to evaluate, set needs_follow_up to true.
        - If the answer lacks important interview detail, ask one natural follow-up that helps the candidate provide specifics.
        - Do not nitpick grammar or pronunciation when the meaning is clear.
        - Do not ask more than one thing in the follow-up.
        - If follow_up_count is 2 or more, do not ask another follow-up; evaluate the combined answer.
        - Keep follow_up_question conversational and under 25 words.
        - Feedback is for the final report, not something spoken to the candidate during the interview.

        Interview Question: {question}
        Expected Answer Guidelines: {expected_answer}
        Combined Candidate Answer So Far: {answer}
        Latest Candidate Utterance: {latest_answer}
        Follow-ups Already Asked: {follow_up_count}

        Return only valid JSON with this exact shape:
        {{
            "needs_follow_up": <true/false>,
            "follow_up_question": "short interviewer follow-up or empty string",
            "score": <number from 0-10>,
            "feedback": "final report feedback in 1-3 sentences",
            "strengths": ["specific strengths"],
            "improvements": ["specific improvements"],
            "is_satisfactory": <true/false>
        }}
        """

        response = generate_gemini_content(prompt)
        response_text = response.text.strip()

        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        response_text = response_text.strip()
        analysis = json.loads(response_text)

        analysis["score"] = max(0, min(10, float(analysis.get("score", 0))))
        analysis["feedback"] = str(analysis.get("feedback", "")).strip()
        analysis["strengths"] = (
            analysis.get("strengths") if isinstance(analysis.get("strengths"), list) else []
        )
        analysis["improvements"] = (
            analysis.get("improvements") if isinstance(analysis.get("improvements"), list) else []
        )
        analysis["is_satisfactory"] = bool(analysis.get("is_satisfactory", False))

        follow_up_question = str(analysis.get("follow_up_question", "")).strip()
        analysis["needs_follow_up"] = bool(
            analysis.get("needs_follow_up") and follow_up_question and follow_up_count < 2
        )
        analysis["follow_up_question"] = follow_up_question if analysis["needs_follow_up"] else ""

        print("[OK] Answer review complete")

        return {
            "success": True,
            "analysis": analysis,
        }
    except Exception as e:
        print(f"[ERROR] Error analyzing answer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing answer: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
