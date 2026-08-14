import api from "./api";

// Uploads a single file (image or PDF) and returns its public URL, e.g. "/uploads/169...-abc.jpg"
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};
