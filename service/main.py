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
import hashlib
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

app = FastAPI(title="PDF Processing API", version="1.0.0")

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# In-memory cache for resume data (in production, use Redis or database)
resume_cache = {}

def get_file_hash(file_content: bytes) -> str:
    """Generate SHA-256 hash of file content for caching"""
    return hashlib.sha256(file_content).hexdigest()

def is_cache_valid(cache_entry: dict, max_age_hours: int = 24) -> bool:
    """Check if cache entry is still valid"""
    if not cache_entry or 'timestamp' not in cache_entry:
        return False

    cache_time = datetime.fromisoformat(cache_entry['timestamp'])
    return datetime.now() - cache_time < timedelta(hours=max_age_hours)

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

@app.get("/cache-status")
async def cache_status():
    """Get cache statistics"""
    cache_info = []
    for file_hash, data in resume_cache.items():
        cache_info.append({
            "file_hash": file_hash[:8] + "...",
            "filename": data.get('filename', 'Unknown'),
            "timestamp": data.get('timestamp'),
            "is_valid": is_cache_valid(data)
        })

    return {
        "total_cached_files": len(resume_cache),
        "cache_entries": cache_info
    }

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Upload and process a PDF resume to extract structured information
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        # Read the PDF file
        pdf_content = await file.read()

        # Generate file hash for caching
        file_hash = get_file_hash(pdf_content)

        # Check cache first
        if file_hash in resume_cache and is_cache_valid(resume_cache[file_hash]):
            print(f"📦 CACHE HIT: Using cached data for file: {file.filename}")
            cached_data = resume_cache[file_hash]
            return {
                "success": True,
                "message": "Resume processed successfully (from cache)",
                "data": cached_data['data'],
                "cached": True
            }

        print(f"🔄 CACHE MISS: Processing new file: {file.filename}")

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
            "content_type": file.content_type,
            "file_hash": file_hash
        }

        # Extract resume data using Gemini AI
        print("🤖 Extracting resume data with Gemini AI...")
        resume_data = extract_resume_data(full_text)

        response_data = {
            "pdf_info": pdf_info,
            "resume_data": resume_data
        }

        # Cache the result
        resume_cache[file_hash] = {
            "data": response_data,
            "timestamp": datetime.now().isoformat(),
            "filename": file.filename
        }

        print(f"💾 CACHED: Saved data for file hash: {file_hash[:8]}...")

        return {
            "success": True,
            "message": "Resume processed successfully",
            "data": response_data,
            "cached": False
        }

    except Exception as e:
        print(f"❌ Error processing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
