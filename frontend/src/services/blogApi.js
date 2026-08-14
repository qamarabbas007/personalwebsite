import api from "./api";

export const getBlogs = (params) => api.get("/blogs", { params }).then((r) => r.data);
export const getBlogBySlug = (slug) => api.get(`/blogs/slug/${slug}`).then((r) => r.data);
export const createBlog = (payload) => api.post("/blogs", payload).then((r) => r.data);
export const updateBlog = (id, payload) => api.put(`/blogs/${id}`, payload).then((r) => r.data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`).then((r) => r.data);
