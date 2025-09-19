# AI Interview Platform - Technical Architecture Overview

## Project Overview

An AI-powered interview platform that combines real-time video monitoring, voice transcription, and
intelligent interview management. This is a project-focused implementation using free and
open-source technologies.

## System Architecture

### Core Components

#### 1. Frontend (React + Vite)

- **Technology**: React 19, Vite, TailwindCSS
- **Authentication**: Clerk (free tier)
- **Routing**: React Router DOM
- **UI Components**: Lucide React icons
- **Deployment**: Vercel (free tier)

#### 2. Main Server (Node.js)

- **Technology**: Express.js
- **Purpose**:
  - User management & authentication
  - Interview session orchestration
  - API gateway for microservices
  - Voice transcription management
- **Database**: MongoDB Atlas (free tier - 512MB)
- **Voice Transcription**: Web Speech API (free) or Google Speech-to-Text API (free tier)

#### 3. AI Service (Python FastAPI)

- **Technology**: FastAPI, Python
- **Purpose**:
  - PDF parsing and resume analysis
  - AI interview question generation
  - Performance evaluation
  - Response analysis
- **AI Model**: Google Gemini API (free tier)
- **Deployment**: Railway/Render (free tier)

#### 4. Video Monitoring Service (Python OpenCV)

- **Technology**: OpenCV, Flask/FastAPI
- **Purpose**:
  - Real-time face detection
  - Eye tracking/attention monitoring
  - Posture analysis
  - Suspicious activity detection
- **Deployment**: Local/Railway (free tier)

## Detailed Flow Analysis

### Phase 1: User Onboarding

```
User Registration → Profile Setup → Document Upload → Verification
```

**Implementation:**

- Clerk handles authentication
- MongoDB stores user profiles
- Python service extracts resume data using PyPDF2/pdfplumber
- Store processed data in user database

### Phase 2: Interview Preparation

```
Tech Stack Selection → Skill Level Assessment → Question Generation
```

**Implementation:**

- Frontend collects tech preferences
- Gemini API generates personalized questions based on:
  - Resume analysis
  - Selected tech stack
  - Experience level
- Node.js stores interview configuration

### Phase 3: Live Interview

```
Video Setup → AI Introduction → Question-Answer Cycle → Real-time Monitoring
```

**Implementation:**

- WebRTC for video/audio capture
- OpenCV processes video stream for monitoring
- Web Speech API transcribes voice to text
- Gemini AI evaluates responses in real-time
- Socket.io for real-time communication

### Phase 4: Results & Feedback

```
Performance Analysis → Score Calculation → Detailed Feedback → Recommendations
```

**Implementation:**

- Python service analyzes all collected data
- Gemini generates detailed feedback
- Results stored in MongoDB
- PDF report generation using ReportLab

## Free Technology Stack Recommendations

### Core Services

#### Frontend Stack

```javascript
// Package.json additions for enhanced functionality
{
  "dependencies": {
    "socket.io-client": "^4.7.5",    // Real-time communication
    "react-webcam": "^7.2.0",       // Video capture
    "react-speech-kit": "^3.0.1",   // Voice recognition
    "react-pdf": "^7.7.1",          // PDF viewing
    "framer-motion": "^11.0.0"      // Animations
  }
}
```

#### Backend Stack (Node.js)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.5",
    "mongoose": "^8.0.0",
    "multer": "^1.4.5",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "node-cron": "^3.0.3"
  }
}
```

#### Python AI Service

```python
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
google-generativeai==0.3.2
PyPDF2==3.0.1
python-multipart==0.0.6
opencv-python==4.8.1.78
numpy==1.24.3
pandas==2.1.4
python-jose==3.3.0
passlib==1.7.4
aiofiles==23.2.1
```

### Free API Services

#### 1. Google Gemini API

- **Free Tier**: 60 requests per minute
- **Use Cases**:
  - Question generation
  - Response evaluation
  - Feedback generation
- **Implementation**:

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_FREE_API_KEY")
model = genai.GenerativeModel('gemini-pro')

# Generate interview questions
def generate_questions(resume_text, tech_stack, level):
    prompt = f"""
    Based on this resume: {resume_text}
    Tech stack: {tech_stack}
    Experience level: {level}

    Generate 10 interview questions with expected answers.
    """
    response = model.generate_content(prompt)
    return response.text
```

#### 2. MongoDB Atlas (Free Tier)

- **Storage**: 512MB
- **Connections**: 500
- **Perfect for**: User data, interview sessions, results

#### 3. Clerk Authentication (Free Tier)

- **Monthly Active Users**: 10,000
- **Features**: OAuth, JWT, user management

## Microservice Architecture

### Service Communication

```
Frontend ←→ Node.js API Gateway ←→ Python AI Service
                ↓
            MongoDB Atlas
                ↓
        OpenCV Video Service
```

### API Endpoints Structure

#### Node.js Main Server

```javascript
// Interview Management
POST /api/interview/create
GET  /api/interview/:id
PUT  /api/interview/:id/update
POST /api/interview/:id/submit

// User Management
GET  /api/user/profile
PUT  /api/user/profile
POST /api/user/upload-resume

// Real-time endpoints
WebSocket /ws/interview/:sessionId
```

#### Python AI Service

```python
# Resume Processing
POST /ai/resume/extract
POST /ai/resume/analyze

# Question Generation
POST /ai/questions/generate
POST /ai/questions/evaluate

# Performance Analysis
POST /ai/performance/analyze
POST /ai/feedback/generate
```

#### OpenCV Video Service

```python
# Video Monitoring
POST /video/session/start
GET  /video/session/:id/status
POST /video/session/:id/stop
WebSocket /ws/video/:sessionId
```

## Real-time Features Implementation

### Voice Transcription

```javascript
// Using Web Speech API (Free)
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = event => {
  const transcript = event.results[event.results.length - 1][0].transcript;
  socket.emit('voice-transcript', { text: transcript, sessionId });
};
```

### Video Monitoring

```python
import cv2
import numpy as np

class InterviewMonitor:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

    def analyze_frame(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        analysis = {
            'faces_detected': len(faces),
            'attention_score': self.calculate_attention(gray, faces),
            'posture_score': self.analyze_posture(frame, faces)
        }
        return analysis
```

## Deployment Strategy

### Free Hosting Options

1. **Frontend**: Vercel (Free tier)
   - Automatic deployments from GitHub
   - Custom domains
   - Analytics

2. **Node.js Backend**: Railway/Render (Free tier)
   - 500 hours/month
   - Auto-deploy from GitHub
   - Environment variables

3. **Python Services**: Railway/Render (Free tier)
   - Docker deployments
   - Auto-scaling
   - Logs and monitoring

4. **Database**: MongoDB Atlas (Free tier)
   - 512MB storage
   - Automated backups
   - Security features

## Security Considerations

### Free Security Measures

- **HTTPS**: Let's Encrypt (Free SSL)
- **Rate Limiting**: Express rate limiter
- **CORS**: Properly configured origins
- **JWT**: Secure token management
- **Input Validation**: Joi/Yup validation
- **Environment Variables**: Secure API key storage

## Performance Optimization

### Free Optimization Tools

- **CDN**: Cloudflare (Free tier)
- **Image Optimization**: Sharp.js
- **Caching**: Redis (Free tier on Upstash)
- **Monitoring**: Sentry (Free tier)

## Development Workflow

### Git Workflow

```bash
# Feature development
git checkout -b feature/interview-ai
git commit -m "feat: add AI question generation"
git push origin feature/interview-ai

# Deployment (automatic via GitHub Actions)
git checkout main
git merge feature/interview-ai
git push origin main  # Triggers auto-deployment
```

### Environment Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev

# Python AI Service
cd service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# OpenCV Service
cd video-service
pip install -r requirements.txt
python app.py
```

## Cost Breakdown (All Free Tiers)

| Service       | Free Tier Limit | Usage Estimate |
| ------------- | --------------- | -------------- |
| Vercel        | 100GB bandwidth | ✅ Sufficient  |
| Railway       | 500 hours/month | ✅ Sufficient  |
| MongoDB Atlas | 512MB storage   | ✅ Sufficient  |
| Gemini API    | 60 req/min      | ✅ Sufficient  |
| Clerk Auth    | 10K MAU         | ✅ Sufficient  |
| Cloudflare    | Unlimited       | ✅ Perfect     |

## Next Steps for Implementation

1. **Week 1**: Set up basic Node.js API and React frontend
2. **Week 2**: Implement Python FastAPI service with Gemini integration
3. **Week 3**: Add OpenCV video monitoring service
4. **Week 4**: Integrate real-time features (Socket.io, WebRTC)
5. **Week 5**: Testing, optimization, and deployment

## Recommended File Structure

```
FINAL-YEAR-PROJECT-2025-2026/
├── frontend/                 # React app
├── backend/                  # Node.js API Gateway
├── service/                  # Python AI service
├── video-service/            # OpenCV monitoring
├── docker-compose.yml        # Local development
├── docs/                     # Documentation
└── .github/workflows/        # CI/CD pipelines
```

This architecture provides a robust, scalable, and completely free solution for your AI interview
platform while maintaining professional-grade features and security.
