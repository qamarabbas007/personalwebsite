import api from "./api";

// AI assistant is public — no auth token required, just a per-browser sessionId
export const sendAiMessage = (sessionId, message) =>
  api.post("/ai-chat", { sessionId, message }).then((r) => r.data);

export const getAiHistory = (sessionId) =>
  api.get(`/ai-chat/${sessionId}`).then((r) => r.data);
