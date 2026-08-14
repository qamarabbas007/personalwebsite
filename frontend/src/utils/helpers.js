export const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

export const truncate = (text = "", length = 120) =>
  text.length > length ? `${text.slice(0, length).trim()}…` : text;

export const classNames = (...args) => args.filter(Boolean).join(" ");

// Stable per-browser id for anonymous AI-chat sessions (kept in localStorage)
export const getAiSessionId = () => {
  const key = "qa_ai_session";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
};

// Uploaded files are served from the backend origin at /uploads/..., not under /api,
// and not through any CDN — so relative upload URLs need the backend's base origin
// prepended for <img>/<a> tags. Full URLs (http.../https...) pass through unchanged.
export const getFileUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};
