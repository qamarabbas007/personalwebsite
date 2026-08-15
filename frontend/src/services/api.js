import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("qa_auth");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize error unwrapping so callers just get a clean message
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
