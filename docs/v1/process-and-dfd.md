- **End-to-End Flow:**
  - User logs in (Clerk) on frontend; axios carries bearer token.
  - User uploads resume PDF to Python FastAPI (`/upload-pdf`); PyPDF2 extracts text; Gemini maps to
    structured JSON.
  - Frontend calls backend `POST /api/user/profile` to save extracted data; Mongoose persists under
    `clerkId`.
  - User starts interview via `POST /api/interview`; backend fetches profile, invokes Gemini-based
    question generator (Node) or fallback; creates `Interview` record.
  - Frontend joins a Socket.IO room (`join-interview:{interviewId}`) and conducts Q&A. For each
    answer, frontend can call Python `/analyze-answer` to get score and feedback; backend
    `PATCH /api/interview/:id` updates records.
  - Completion updates `status=completed`, `completedAt`, aggregate `score`.

- **Data Stores:** MongoDB collections: `users`, `interviews` with indexes on `clerkId`,
  `createdAt`.

- **DFD (Textual):**
  - Process P1: Authentication (Clerk) → emits `token` to Client.
  - Process P2: Resume Parse (FastAPI + Gemini) → outputs `resume_data`.
  - Process P3: Profile CRUD (Express/Mongoose) ↔ MongoDB `users`.
  - Process P4: Interview Creation (Express + Gemini) ↔ MongoDB `interviews`.
  - Process P5: Realtime Orchestration (Socket.IO) ↔ Client event stream.
  - Process P6: Answer Analysis (FastAPI + Gemini) → `analysis {score, feedback}`.

- **Interfaces:**
  - REST: `/api/user/profile`, `/api/interview`, `/api/interview/:id`, `/api/health`.
  - Python: `/upload-pdf`, `/analyze-answer`, `/text-to-speech`, `/speech-to-text`, `/health`.
  - Realtime: Socket events `join-interview`, `question-asked`, `answer-submitted`,
    `answer-analyzed`.

- **Error Handling & Resilience:** Strict prompts, JSON cleanup, fallbacks; 401 retry; connection
  health checks; server-side validation.
