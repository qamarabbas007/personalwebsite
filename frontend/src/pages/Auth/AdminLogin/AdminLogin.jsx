import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "./AdminLogin.css";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.role !== "admin") {
        setError("This account does not have admin access.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <form className="glass-card auth-card" onSubmit={onSubmit}>
        <h2><span className="gradient-text">Admin</span> Login</h2>
        <p className="text-muted mt-1 mb-3">Restricted area — Qamar Abbas only.</p>

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
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
};

export default AdminLogin;
