import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LinkCard({ link, onDelete, onToggleFavorite, onEdit }) {
  const { user } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isOwner = user && (link.userId._id === user.id || link.userId === user.id);

  const getDomain = (url) => {
    try { return new URL(url).hostname; } catch { return ""; }
  };
  const domain = getDomain(link.url);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(link._id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
          <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt=""
            style={{ width: "1.25rem", height: "1.25rem", borderRadius: "0.25rem", flexShrink: 0 }}
            onError={(e) => { e.target.style.display = "none"; }} />
          <a href={link.url} target="_blank" rel="noopener noreferrer"
            style={{ color: "white", fontWeight: "600", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            onMouseOver={(e) => e.target.style.color = "#60a5fa"}
            onMouseOut={(e) => e.target.style.color = "white"}>
            {link.title}
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", color: link.isPublic ? "#22c55e" : "#f59e0b", background: link.isPublic ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", padding: "0.125rem 0.375rem", borderRadius: "0.25rem", border: "1px solid rgba(255,255,255,0.1)" }}>
            {link.isPublic ? "Public" : "Private"}
          </span>
          <button onClick={() => isOwner && onToggleFavorite(link._id, !link.isFavorite)}
            style={{ background: "none", border: "none", cursor: isOwner ? "pointer" : "default", fontSize: "1.25rem", flexShrink: 0, color: link.isFavorite ? "#facc15" : "#4b5563", padding: 0, opacity: isOwner ? 1 : 0.4 }}
            disabled={!isOwner}
            title={isOwner ? (link.isFavorite ? "Remove from favorites" : "Add to favorites") : "Only owners can favorite"}>
            {link.isFavorite ? "★" : "☆"}
          </button>
        </div>
      </div>

      {/* Shared by */}
      {!isOwner && link.userId?.username && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", transform: "translateY(-0.25rem)" }}>
          <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", fontWeight: "700" }}>
            {link.userId.username[0].toUpperCase()}
          </div>
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>shared by @{link.userId.username}</span>
        </div>
      )}

      {/* URL */}
      <p style={{ color: "#3b82f6", fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
        {link.url}
      </p>

      {/* Description */}
      {link.description && (
        <p style={{ color: "#9ca3af", fontSize: "0.875rem", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {link.description}
        </p>
      )}

      {/* Tags */}
      {link.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
          {link.tags.map((tag) => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px solid #1f2937" }}>
        <span style={{ color: "#4b5563", fontSize: "0.75rem" }}>
          {new Date(link.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        {isOwner && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => onEdit(link)}
              style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "0.875rem", padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}
              onMouseOver={(e) => e.target.style.color = "#60a5fa"}
              onMouseOut={(e) => e.target.style.color = "#6b7280"}>
              Edit
            </button>
            <button onClick={handleDeleteClick}
              style={{ border: "none", cursor: "pointer", fontSize: "0.875rem", padding: "0.25rem 0.5rem", borderRadius: "0.25rem",
                background: confirmDelete ? "#dc2626" : "none",
                color: confirmDelete ? "white" : "#6b7280" }}
              onMouseOver={(e) => { if (!confirmDelete) e.target.style.color = "#f87171"; }}
              onMouseOut={(e) => { if (!confirmDelete) e.target.style.color = "#6b7280"; }}>
              {confirmDelete ? "Confirm?" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
