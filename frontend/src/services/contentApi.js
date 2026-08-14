import api from "./api";

// Shared helper for the simple CRUD resources: skills, services, experience, testimonials
const resource = (path) => ({
  getAll: (params) => api.get(`/${path}`, { params }).then((r) => r.data),
  getOne: (id) => api.get(`/${path}/${id}`).then((r) => r.data),
  create: (payload) => api.post(`/${path}`, payload).then((r) => r.data),
  update: (id, payload) => api.put(`/${path}/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/${path}/${id}`).then((r) => r.data),
});

export const skillsApi = resource("skills");
export const servicesApi = resource("services");
export const experienceApi = resource("experience");
export const testimonialsApi = resource("testimonials");
export const clientsApi = resource("clients");

export const profileApi = {
  get: () => api.get("/profile").then((r) => r.data),
  update: (payload) => api.put("/profile", payload).then((r) => r.data),
};
