import api from "./api";

export const sendContactMessage = (payload) => api.post("/messages", payload).then((r) => r.data);
export const getMessages = (params) => api.get("/messages", { params }).then((r) => r.data);
export const getMessage = (id) => api.get(`/messages/${id}`).then((r) => r.data);
export const updateMessageStatus = (id, status) =>
  api.put(`/messages/${id}/status`, { status }).then((r) => r.data);
export const deleteMessage = (id) => api.delete(`/messages/${id}`).then((r) => r.data);
