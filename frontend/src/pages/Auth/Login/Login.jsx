import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "./Login.css";

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/chat");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper auth-page">
      <div className="container">
        <form className="glass-card auth-card" onSubmit={onSubmit}>
          <h2>{mode === "login" ? "Welcome Back" : "Create an Account"}</h2>
          <p className="text-muted mt-1 mb-3">
            {mode === "login" ? "Log in to chat and track your project requests." : "Sign up to start a conversation."}
          </p>

          {mode === "register" && (
            <div className="form-group">
              <label>Name</label>
              <input className="form-control" name="name" value={form.name} onChange={onChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password" value={form.password} onChange={onChange} required />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn-primary btn-block mt-2" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
          </button>

          <p className="text-center text-muted mt-3">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="gradient-text"
              style={{ background: "non", border: "none", cursor: "pointer" }}
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
               {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>

          <p className="text-center text-muted mt-2">
            <Link to="/admin/login" style={{ fontSize: "0.82rem" }}>Admin login →</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;
