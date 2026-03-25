import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Signup failed. Try again.";
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
          <p style={{ color: "#9ca3af" }}>Save, tag, and search your dev resources</p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "white", marginBottom: "1.5rem" }}>
            Create your account
          </h2>

          {error && (
            <div style={{ background: "rgba(127,29,29,0.4)", border: "1px solid #b91c1c", color: "#fca5a5", borderRadius: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Username", name: "username", type: "text", placeholder: "devuser123" },
              { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "Min 6 characters" },
              { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "••••••••" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#d1d5db", marginBottom: "0.25rem" }}>
                  {label}
                </label>
                <input type={type} name={name} value={form[name]} onChange={handleChange}
                  placeholder={placeholder} className="input-field" required />
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.875rem", marginTop: "1.5rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#60a5fa", fontWeight: "500" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
