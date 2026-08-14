import api from "./api";

export const getConversations = () => api.get("/chat/conversations").then((r) => r.data);
export const getMyConversation = () => api.get("/chat/mine").then((r) => r.data);
export const getConversationMessages = (conversationId) =>
  api.get(`/chat/${conversationId}`).then((r) => r.data);
export const markMessageRead = (id) => api.put(`/chat/message/${id}/read`).then((r) => r.data);
