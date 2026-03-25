import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AddLinkModal({ isOpen, onClose, onSave, editingLink }) {
  const [tab, setTab]   = useState("single"); // "single" or "bulk"
  const [form, setForm] = useState({ url: "", title: "", description: "", tags: "" });
  const [bulkText, setBulkText]     = useState("");
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [tagLoading, setTagLoading] = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    if (editingLink) {
      setForm({ url: editingLink.url, title: editingLink.title, description: editingLink.description || "", tags: editingLink.tags.join(", ") });
      setSuggestedTags([]);
      setTab("single");
    } else {
      setForm({ url: "", title: "", description: "", tags: "" });
      setBulkText("");
      setSuggestedTags([]);
    }
    setError("");
  }, [editingLink, isOpen]);

  useEffect(() => {
    if (!form.title || form.title.length < 3) { setSuggestedTags([]); return; }
    const debounce = setTimeout(async () => {
      setTagLoading(true);
      try {
        const { data } = await api.post("/links/autotag", { title: form.title, description: form.description });
        setSuggestedTags(data.suggestedTags);
      } catch { /* silently fail */ }
      finally { setTagLoading(false); }
    }, 600);
    return () => clearTimeout(debounce);
  }, [form.title, form.description]);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const addSuggestedTag = (tag) => {
    const currentTags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      setForm({ ...form, tags: [...currentTags, tag].join(", ") });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "bulk") {
        const urls = bulkText.split("\n").map((u) => u.trim()).filter(Boolean);
        if (urls.length === 0) throw new Error("Please enter at least one URL.");
        
        const validLinks = urls.map((u) => {
          try { new URL(u); return { url: u }; } catch { throw new Error(`Invalid URL: ${u}`); }
        });

        const { data } = await api.post("/links/bulk", { links: validLinks });
        onSave(data.links, "bulk");
      } else {
        if (!form.url || !form.title) throw new Error("URL and title are required.");
        try { new URL(form.url); } catch { throw new Error("Please enter a valid URL (include https://)."); }

        const tagsArray = form.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
        
        if (editingLink) {
          const { data } = await api.put(`/links/${editingLink._id}`, { url: form.url, title: form.title, description: form.description, tags: tagsArray });
          onSave(data.link, "edit");
        } else {
          const { data } = await api.post("/links", { url: form.url, title: form.title, description: form.description, tags: tagsArray });
          onSave(data.link, "add");
        }
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save link.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const labelStyle = { display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#d1d5db", marginBottom: "0.25rem" };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
      <div style={{ background: "#111827", border: "1px solid #374151", borderRadius: "1rem", width: "100%", maxWidth: "32rem", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
        {/* Tabs (only when adding) */}
        {!editingLink && (
          <div style={{ display: "flex", borderBottom: "1px solid #1f2937" }}>
            <button type="button" onClick={() => setTab("single")} 
              style={{ flex: 1, padding: "0.75rem", background: "none", border: "none", borderBottom: `2px solid ${tab === "single" ? "#2563eb" : "transparent"}`, color: tab === "single" ? "white" : "#6b7280", fontWeight: "600", cursor: "pointer" }}>
              Single Link
            </button>
            <button type="button" onClick={() => setTab("bulk")} 
              style={{ flex: 1, padding: "0.75rem", background: "none", border: "none", borderBottom: `2px solid ${tab === "bulk" ? "#2563eb" : "transparent"}`, color: tab === "bulk" ? "white" : "#6b7280", fontWeight: "600", cursor: "pointer" }}>
              Bulk Add
            </button>
          </div>
        )}

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {error && (
            <div style={{ background: "rgba(127,29,29,0.4)", border: "1px solid #b91c1c", color: "#fca5a5", borderRadius: "0.5rem", padding: "0.75rem 1rem", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          {tab === "single" ? (
            <>
              <div>
                <label style={labelStyle}>URL <span style={{ color: "#f87171" }}>*</span></label>
                <input type="text" name="url" value={form.url} onChange={handleChange} placeholder="https://example.com/article" className="input-field" required />
              </div>

              <div>
                <label style={labelStyle}>Title <span style={{ color: "#f87171" }}>*</span></label>
                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. React useEffect Deep Dive" className="input-field" required />
              </div>

              <div>
                <label style={labelStyle}>Description <span style={{ color: "#6b7280", fontWeight: 400 }}>(optional)</span></label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="What is this link about?" rows={3} className="input-field" style={{ resize: "none" }} />
              </div>

              <div>
                <label style={labelStyle}>Tags <span style={{ color: "#6b7280", fontWeight: 400 }}>(comma separated)</span></label>
                <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="react, javascript, hooks" className="input-field" />

                {(suggestedTags.length > 0 || tagLoading) && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem", margin: "0 0 0.25rem" }}>
                      {tagLoading ? "Analyzing..." : "✨ Auto-suggested tags:"}
                    </p>
                    {!tagLoading && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                        {suggestedTags.map((tag) => (
                          <button key={tag} type="button" onClick={() => addSuggestedTag(tag)}
                            className="tag-badge" style={{ cursor: "pointer", background: "none", border: "1px solid rgba(30,64,175,0.5)" }}>
                            + {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <label style={labelStyle}>Pasted URLs <span style={{ color: "#6b7280", fontWeight: 400 }}>(one per line)</span></label>
              <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)}
                placeholder={"https://google.com\nhttps://react.dev\nhttps://github.com"}
                rows={10} className="input-field" style={{ resize: "none", fontFamily: "monospace", fontSize: "0.875rem" }} />
              <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                URLs will be automatically processed. Titles will be generated from domains, which you can edit later.
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
              {loading ? (editingLink ? "Saving..." : "Adding...") : (editingLink ? "Save Changes" : "Add Link")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
