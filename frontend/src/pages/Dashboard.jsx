import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import LinkCard from "../components/LinkCard";
import SearchBar from "../components/SearchBar";
import AddLinkModal from "../components/AddLinkModal";

export default function Dashboard() {
  const [links, setLinks]               = useState([]);
  const [allTags, setAllTags]           = useState([]);
  const [search, setSearch]             = useState("");
  const [selectedTag, setSelectedTag]   = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchParams, setSearchParams]   = useSearchParams();
  const [view, setView]                 = useState(searchParams.get("view") || "my"); // "my" or "community"
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingLink, setEditingLink]   = useState(null);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search)        params.search   = search;
      if (selectedTag)   params.tag      = selectedTag;
      if (showFavorites && view === "my") params.favorite = true;
      
      const endpoint = view === "community" ? "/links/community" : "/links";
      const { data } = await api.get(endpoint, { params });
      setLinks(data.links);
    } catch (err) {
      setError("Failed to load links. Please refresh.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedTag, showFavorites, view]);

  const fetchTags = useCallback(async () => {
    try {
      const { data } = await api.get("/links/tags");
      setAllTags(data.tags);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(fetchLinks, 300);
    return () => clearTimeout(debounce);
  }, [fetchLinks]);

  useEffect(() => { fetchTags(); }, [fetchTags]);

  const handleSave = (savedLink, mode) => {
    if (mode === "bulk") {
      setLinks((prev) => [...savedLink, ...prev]);
    } else if (mode === "add") {
      setLinks((prev) => [savedLink, ...prev]);
    } else {
      setLinks((prev) => prev.map((l) => (l._id === savedLink._id ? savedLink : l)));
    }
    fetchTags();
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/links/${id}`);
      setLinks((prev) => prev.filter((l) => l._id !== id));
      fetchTags();
    } catch {
      alert("Failed to delete link. Try again.");
    }
  };

  const handleToggleFavorite = async (id, isFavorite) => {
    try {
      const { data } = await api.put(`/links/${id}`, { isFavorite });
      setLinks((prev) => prev.map((l) => (l._id === id ? data.link : l)));
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleEdit = (link) => { setEditingLink(link); setModalOpen(true); };
  const handleAddClick = () => { setEditingLink(null); setModalOpen(true); };

  return (
    <div style={{ minHeight: "100vh", background: "#030712" }}>
      <Navbar onAddClick={handleAddClick} />

      <main style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "2rem", borderBottom: "1px solid #1f2937", marginBottom: "2rem" }}>
          <button onClick={() => { setView("my"); setSearchParams({ view: "my" }); }} 
            style={{ padding: "0.75rem 0", background: "none", border: "none", borderBottom: `2px solid ${view === "my" ? "#2563eb" : "transparent"}`, color: view === "my" ? "white" : "#6b7280", fontWeight: "600", cursor: "pointer", fontSize: "1rem" }}>
            My Links
          </button>
          <button onClick={() => { setView("community"); setSearchParams({ view: "community" }); }} 
            style={{ padding: "0.75rem 0", background: "none", border: "none", borderBottom: `2px solid ${view === "community" ? "#2563eb" : "transparent"}`, color: view === "community" ? "white" : "#6b7280", fontWeight: "600", cursor: "pointer", fontSize: "1rem" }}>
            Community
          </button>
        </div>

        {/* Header content depends on view */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "white", margin: 0 }}>
              {view === "my" ? "Personal Library" : "Global Community"}
            </h1>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
              {links.length} {links.length === 1 ? "resource" : "resources"} found
            </p>
          </div>
          {view === "my" && (
            <button onClick={() => setShowFavorites((p) => !p)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: "500", cursor: "pointer", transition: "all 0.2s",
                background: showFavorites ? "rgba(113,63,18,0.3)" : "#1f2937",
                border: `1px solid ${showFavorites ? "#a16207" : "#374151"}`,
                color: showFavorites ? "#fbbf24" : "#9ca3af" }}>
              <span>{showFavorites ? "★" : "☆"}</span>
              <span>{showFavorites ? "Showing Favorites" : "Show Favorites"}</span>
            </button>
          )}
        </div>

        {/* Search + filters */}
        <div style={{ marginBottom: "2rem" }}>
          <SearchBar search={search} onSearchChange={setSearch} selectedTag={selectedTag}
            onTagSelect={setSelectedTag} allTags={allTags} totalCount={links.length} />
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(127,29,29,0.4)", border: "1px solid #b91c1c", color: "#fca5a5", borderRadius: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{error}</span>
            <button onClick={fetchLinks} style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", textDecoration: "underline" }}>Retry</button>
          </div>
        )}

        {/* Skeleton loading */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card" style={{ animation: "pulse 1.5s infinite" }}>
                <div style={{ height: "1rem", background: "#1f2937", borderRadius: "0.25rem", width: "75%", marginBottom: "0.75rem" }} />
                <div style={{ height: "0.75rem", background: "#1f2937", borderRadius: "0.25rem", width: "100%", marginBottom: "0.5rem" }} />
                <div style={{ height: "0.75rem", background: "#1f2937", borderRadius: "0.25rem", width: "67%", marginBottom: "1rem" }} />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ height: "1.25rem", background: "#1f2937", borderRadius: "9999px", width: "4rem" }} />
                  <div style={{ height: "1.25rem", background: "#1f2937", borderRadius: "9999px", width: "5rem" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && links.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 0", textAlign: "center" }}>
            <div style={{ fontSize: "3.75rem", marginBottom: "1rem" }}>{search || selectedTag ? "🔍" : "🔗"}</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "white", marginBottom: "0.5rem" }}>
              {search || selectedTag ? "No links match your search" : "No links saved yet"}
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem", maxWidth: "24rem" }}>
              {search || selectedTag
                ? "Try a different search term or clear the filters."
                : "Start building your developer resource library by adding your first link."}
            </p>
            {!search && !selectedTag && (
              <button onClick={handleAddClick} className="btn-primary">+ Add Your First Link</button>
            )}
            {(search || selectedTag) && (
              <button onClick={() => { setSearch(""); setSelectedTag(""); }} className="btn-secondary">Clear Filters</button>
            )}
          </div>
        )}

        {/* Links grid */}
        {!loading && links.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {links.map((link) => (
              <LinkCard key={link._id} link={link} onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </main>

      <AddLinkModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingLink(null); }}
        onSave={handleSave} editingLink={editingLink} />
    </div>
  );
}
