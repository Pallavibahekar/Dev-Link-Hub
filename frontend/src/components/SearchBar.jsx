export default function SearchBar({ search, onSearchChange, selectedTag, onTagSelect, allTags, totalCount }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Search input */}
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#6b7280" }}>
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, URL, or description..."
          className="input-field"
          style={{ paddingLeft: "2.5rem" }}
        />
        {search && (
          <button onClick={() => onSearchChange("")}
            style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "1.25rem", padding: 0 }}>
            ×
          </button>
        )}
      </div>

      {/* Tag filter pills */}
      {allTags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>Filter:</span>

          <button onClick={() => onTagSelect("")}
            style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "500", border: "1px solid", cursor: "pointer", transition: "all 0.15s",
              background: selectedTag === "" ? "#2563eb" : "#1f2937",
              borderColor: selectedTag === "" ? "#3b82f6" : "#374151",
              color: selectedTag === "" ? "white" : "#9ca3af" }}>
            All ({totalCount})
          </button>

          {allTags.map((tag) => (
            <button key={tag} onClick={() => onTagSelect(tag === selectedTag ? "" : tag)}
              style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "500", border: "1px solid", cursor: "pointer", transition: "all 0.15s",
                background: selectedTag === tag ? "#2563eb" : "#1f2937",
                borderColor: selectedTag === tag ? "#3b82f6" : "#374151",
                color: selectedTag === tag ? "white" : "#9ca3af" }}>
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
