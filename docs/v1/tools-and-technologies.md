- **Frontend:** Vite + React, TailwindCSS; axios with token interceptors; Clerk for authentication;
  Socket.IO client.
- **Backend:** Node.js (Express), Clerk middleware, MongoDB/Mongoose models (`User`, `Interview`),
  Socket.IO server, CORS.
- **AI & Services:** Google Generative AI (Gemini 2.x/2.5) via `@google/generative-ai` (Node) and
  `google.generativeai` (Python) for question generation and answer evaluation.
- **Python Service:** FastAPI for PDF upload and AI-based extraction; PyPDF2 for text extraction;
  gTTS for text-to-speech; uvicorn runtime.
- **Database:** MongoDB with indexes on `clerkId` and user/interview timestamps.
- **Auth:** Clerk (`@clerk/express`) with `getAuth()`; bearer tokens propagated via axios
  interceptors.
- **Realtime:** Socket.IO rooms for interview sessions: `join-interview`, `question-asked`,
  `answer-submitted`, `answer-analyzed`.
- **DevOps (current):** Local `.env` files; health endpoints `/api/health` and `/health`; Vercel
  config in frontend; future containerization recommended.
