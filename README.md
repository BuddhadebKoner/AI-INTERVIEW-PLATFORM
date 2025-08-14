# FINAL-YEAR-PROJECT-2025-2026
## **AI Interviewer Platform**

**Goal:** Advanced AI-powered interview platform with real-time video conversation and intelligent analysis.

---

### **Tech Stack**

* **Frontend** → React.js with Vite — Premium UI, WebRTC video streaming, real-time AI conversation
* **Backend (Main)** → Node.js + Express — handles user data, CV processing, interview session management
* **AI Service** → Python + FastAPI — CV analysis, real-time conversation AI, performance evaluation
* **Database** → MongoDB — comprehensive user profiles, interview analytics, performance metrics
* **Video Technology** → WebRTC — Real-time peer-to-peer video communication
* **AI Integration** → Google Gemini API — Dynamic conversation, personalized questions, instant feedback

---

### **Workflow**

1. **User provides detailed information** → React collects comprehensive candidate profile
2. **CV upload and analysis** → React sends file to Node.js backend
3. **Node.js processes CV** → forwards to Python microservice for text extraction
4. **Python extracts and analyzes CV** → sends to Gemini API for personalized questions
5. **Real-time video interview** → WebRTC establishes direct video connection with AI interviewer
6. **AI conversation flow** → Dynamic questions based on CV analysis and real-time responses
7. **Live audio processing** → Speech-to-text conversion and real-time AI feedback
8. **Performance analysis** → Comprehensive evaluation and scoring
9. **Results and feedback** → Detailed report with recommendations and insights

---

### **Minimal API Routes**

**Node.js Backend**

* `POST /upload-cv` → Receives CV, forwards to Python
* `GET /questions/:userId` → Fetch AI-generated questions from Python
* `POST /start-interview` → Initialize interview session with WebRTC
* `POST /conversation` → Handle real-time AI conversation
* `POST /end-interview` → Process interview completion and generate results

**Python Microservice**

* `POST /parse-cv` → Extracts text from CV
* `POST /generate-questions` → Calls Gemini API for interview questions
* `POST /process-conversation` → Real-time speech processing and AI response
* `POST /evaluate-interview` → Comprehensive analysis and scoring

---

### **Free Tools**

* **CV Parsing** → PyPDF2 / pdfplumber (free)
* **AI Q\&A** → Google Gemini API free tier
* **Video Call** → WebRTC (free)
* **Voice-to-Text** → Vosk (offline, free)
* **Text-to-Speech** → Browser `speechSynthesis` API (free)

---

If you want, I can now **give you the architecture diagram** so your team knows exactly:

* Which tech runs where
* How Node.js and Python communicate
* Where Gemini API fits in

This way you can start coding without confusion.
