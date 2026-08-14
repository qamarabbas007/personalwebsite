import api from "./api";

export const getProjects = (params) => api.get("/projects", { params }).then((r) => r.data);
export const getProjectBySlug = (slug) => api.get(`/projects/slug/${slug}`).then((r) => r.data);
export const createProject = (payload) => api.post("/projects", payload).then((r) => r.data);
export const updateProject = (id, payload) => api.put(`/projects/${id}`, payload).then((r) => r.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`).then((r) => r.data);
