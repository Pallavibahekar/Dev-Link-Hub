import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "", email: "", intro: "", skills: "", availability: ""
  });
  const { isLoggedIn, user } = useAuth();
  const [stats, setStats] = useState({ seeking: 0, offering: 0, resolved: 0 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/stats");
      if (data.success && data.stats?.support) {
        setStats(data.stats.support);
      }
    } catch (err) {
      console.error("Failed to fetch support stats:", err);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const { data } = await api.post("/support", formData);
      if (data.success) {
        setStatus({ type: "success", message: data.message });
        setFormData({ name: "", email: "", intro: "", skills: "", availability: "" });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to send request. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "white" }}>
      <Navbar />
      <main style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>Developer Support</h1>
        <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>Connect with other developers for support and guidance.</p>

        {status.message && (
          <div style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.875rem",
            background: status.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(127,29,29,0.4)",
            border: `1px solid ${status.type === "success" ? "#10b981" : "#b91c1c"}`,
            color: status.type === "success" ? "#10b981" : "#fca5a5" }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { label: "Name", name: "name", type: "text", placeholder: "Your name" },
            { label: "Email", name: "email", type: "email", placeholder: "your@email.com" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label style={{ display: "block", fontSize: "0.875rem", color: "#d1d5db", marginBottom: "0.25rem" }}>{label}</label>
              <input type={type} value={formData[name]} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                placeholder={placeholder} className="input-field" required />
            </div>
          ))}
          {[
            { label: "Introduction", name: "intro", placeholder: "Tell us about yourself..." },
            { label: "Skills", name: "skills", placeholder: "e.g. React, Node.js, MongoDB..." },
            { label: "Availability", name: "availability", placeholder: "e.g. Weekends, evenings..." },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label style={{ display: "block", fontSize: "0.875rem", color: "#d1d5db", marginBottom: "0.25rem" }}>{label}</label>
              <textarea value={formData[name]} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                placeholder={placeholder} rows={3} className="input-field" style={{ resize: "none" }} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center" }}>
            {loading ? "Sending..." : "Submit Request"}
          </button>
        </form>
      </main>
    </div>
  );
}
