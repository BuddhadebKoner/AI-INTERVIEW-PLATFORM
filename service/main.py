from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
from typing import Dict, Any
import uvicorn
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from gtts import gTTS
import base64
from pydantic import BaseModel
from io import BytesIO

# Load environment variables
load_dotenv()

app = FastAPI(title="PDF Processing API", version="1.0.0")

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def list_available_models():
    """List all available Gemini models"""
    try:
        models = genai.list_models()
        print("✅ Available Gemini models:")
        for m in models:
            if 'generateContent' in m.supported_generation_methods:
                print(f"  - {m.name}")
    except Exception as e:
        print(f"❌ Error listing models: {e}")

# List available models on startup
list_available_models()

model = genai.GenerativeModel('models/gemini-2.5-flash')

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
        response = model.generate_content(prompt)
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

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Upload and process a PDF resume to extract structured information
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        print(f"📄 Processing file: {file.filename}")

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
        print("🤖 Extracting resume data with Gemini AI...")
        resume_data = extract_resume_data(full_text)

        print("✅ Resume processed successfully")

        return {
            "success": True,
            "message": "Resume processed successfully",
            "data": {
                "pdf_info": pdf_info,
                "resume_data": resume_data
            }
        }

    except Exception as e:
        print(f"❌ Error processing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

# Pydantic models for voice endpoints
class TextToSpeechRequest(BaseModel):
    text: str
    language: str = "en"

class SpeechToTextRequest(BaseModel):
    audio_data: str  # base64 encoded audio

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
        print(f"🔊 Converting text to speech: {request.text[:50]}...")

        # Create gTTS object
        tts = gTTS(text=request.text, lang=request.language, slow=False)

        # Save to BytesIO buffer
        audio_buffer = BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)

        # Convert to base64
        audio_base64 = base64.b64encode(audio_buffer.read()).decode('utf-8')

        print("✅ Text-to-speech conversion successful")

        return {
            "success": True,
            "audio_data": audio_base64,
            "format": "mp3"
        }
    except Exception as e:
        print(f"❌ Error in text-to-speech: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error converting text to speech: {str(e)}")

@app.post("/speech-to-text")
async def speech_to_text(data: dict) -> Dict[str, Any]:
    """
    Receive transcribed text from browser's Web Speech API
    This endpoint just validates and returns the text since transcription happens in browser
    """
    try:
        text = data.get("text", "")

        if not text:
            raise HTTPException(status_code=400, detail="No text provided")

        print(f"✅ Speech text received: {text}")

        return {
            "success": True,
            "text": text,
            "confidence": 1.0
        }
    except Exception as e:
        print(f"❌ Error in speech-to-text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")

@app.post("/analyze-answer")
async def analyze_answer(data: dict) -> Dict[str, Any]:
    """
    Analyze interview answer using Gemini AI and provide feedback
    """
    try:
        question = data.get("question", "")
        answer = data.get("answer", "")
        expected_answer = data.get("expectedAnswer", "")

        print(f"🤖 Analyzing answer for question: {question[:50]}...")

        prompt = f"""
        You are an expert interview evaluator. Analyze the candidate's answer and provide constructive feedback.

        Question: {question}
        Expected Answer Guidelines: {expected_answer}
        Candidate's Answer: {answer}

        Provide a JSON response with:
        {{
            "score": <number from 0-10>,
            "feedback": "Brief constructive feedback on the answer",
            "strengths": ["list", "of", "strengths"],
            "improvements": ["list", "of", "areas", "to", "improve"],
            "is_satisfactory": <true/false>
        }}

        Return only valid JSON, no additional text.
        """

        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Clean up markdown formatting
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        response_text = response_text.strip()

        analysis = json.loads(response_text)

        print("✅ Answer analysis complete")

        return {
            "success": True,
            "analysis": analysis
        }
    except Exception as e:
        print(f"❌ Error analyzing answer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing answer: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
