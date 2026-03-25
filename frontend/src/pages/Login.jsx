import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate        = useNavigate();
  const { login }       = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: "28rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", marginBottom: "0.5rem" }}>
            🔗 Dev Link Hub
          </h1>
          <p style={{ color: "#9ca3af" }}>Your personal developer resource library</p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "white", marginBottom: "1.5rem" }}>
            Welcome back
          </h2>

          {error && (
            <div style={{ background: "rgba(127,29,29,0.4)", border: "1px solid #b91c1c", color: "#fca5a5", borderRadius: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#d1d5db", marginBottom: "0.25rem" }}>
                Email
              </label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" className="input-field" required />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#d1d5db", marginBottom: "0.25rem" }}>
                Password
              </label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" className="input-field" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.875rem", marginTop: "1.5rem" }}>
            Don&apos;t have an account?{" "}
            <Link to="/signup" style={{ color: "#60a5fa", fontWeight: "500" }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
