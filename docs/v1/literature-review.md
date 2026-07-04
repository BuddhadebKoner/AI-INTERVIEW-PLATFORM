- **AI Interviewing Systems:** Prior work leverages LLMs for question generation and answer
  evaluation. Typical architectures separate orchestration (Node/Express) from inference services
  (Python/FastAPI) for flexibility and scaling.
- **Resume Parsing:** Classical PDF parsing (PyPDF2, Tika) combined with rule-based extractors often
  struggles with varied formats; LLMs (Gemini) improve robustness by mapping unstructured text to
  structured JSON schemas.
- **Identity & Access:** Hosted auth providers (Clerk) simplify token issuance and user management;
  JWT propagation from frontend to backend is standard via axios interceptors.
- **Realtime UX:** Socket.IO provides room-based signaling for interviews, complementing REST flows,
  and enabling immediate feedback loops during question/answer cycles.
- **Data Modeling:** MongoDB’s document model suits nested resume and interview data (skills,
  experience arrays). Indexes on `clerkId`, `createdAt` support user-centric queries.
- **Fallback Design:** Resilience patterns for LLMs include deterministic fallback question sets
  when model calls fail or return malformed JSON.
- **Ethics & Bias:** LLM evaluations can embed bias; literature recommends transparent scoring,
  multi-signal assessments, and opt-in explainability for candidates.
