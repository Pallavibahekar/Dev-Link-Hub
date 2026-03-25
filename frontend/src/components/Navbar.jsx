import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar({ onAddClick }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ background: "#111827", borderBottom: "1px solid #1f2937", padding: "1rem 1.5rem" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🔗</span>
          <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "white" }}>Dev Link Hub</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link to="/support" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.875rem", fontWeight: "500" }}>Support</Link>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
            Hey, {user?.username} 👋
          </span>
          <button onClick={onAddClick} className="btn-primary">
            <span style={{ fontSize: "1.125rem", lineHeight: 1 }}>+</span>
            <span>Add Link</span>
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ fontSize: "0.875rem" }}>
            Logout
          </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
