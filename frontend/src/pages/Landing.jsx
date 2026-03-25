import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Landing() {
  const { isLoggedIn } = useAuth();
  const [stats, setStats] = useState({ users: 0, links: 0, daily: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/stats");
        if (data.success) setStats({
           users: data.stats.users,
           links: data.stats.links,
           daily: data.stats.daily
        });
      } catch (err) {
        console.error("Failed to fetch landing stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "white", overflowX: "hidden" }}>
      {/* Navigation */}
      <nav style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "1.5rem 2rem", 
        maxWidth: "80rem", 
        margin: "0 auto",
        background: "rgba(3, 7, 18, 0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.5rem", fontWeight: "700" }}>
          <span style={{ color: "#3b82f6" }}>🔗</span> DevLinkHub
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link to="/support" style={{ color: "#9ca3af", textDecoration: "none", fontWeight: "500" }}>Support</Link>
          {!isLoggedIn ? (
            <>
              <Link to="/login" style={{ color: "#9ca3af", textDecoration: "none", fontWeight: "500" }}>Login</Link>
              <Link to="/signup" className="btn-primary" style={{ textDecoration: "none" }}>Get Started</Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>Dashboard</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{ 
        padding: "6rem 1.5rem", 
        textAlign: "center", 
        maxWidth: "60rem", 
        margin: "0 auto",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40rem",
          height: "40rem",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(3, 7, 18, 0) 70%)",
          zIndex: -1,
          pointerEvents: "none"
        }} />
        
        <div style={{ 
          display: "inline-block", 
          padding: "0.25rem 0.75rem", 
          background: "rgba(37, 99, 235, 0.1)", 
          border: "1px solid rgba(37, 99, 235, 0.2)", 
          borderRadius: "9999px", 
          color: "#60a5fa", 
          fontSize: "0.875rem", 
          fontWeight: "600",
          marginBottom: "1.5rem"
        }}>
          Built for Developers, by Developers
        </div>
        
        <h1 style={{ 
          fontSize: "clamp(2.5rem, 8vw, 4.5rem)", 
          fontWeight: "800", 
          lineHeight: "1.1", 
          marginBottom: "1.5rem",
          background: "linear-gradient(to right, #fff, #94a3b8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          The ultimate hub for your <span style={{ color: "#3b82f6", WebkitTextFillColor: "#3b82f6" }}>Dev resources</span>
        </h1>
        
        <p style={{ 
          fontSize: "1.25rem", 
          color: "#9ca3af", 
          marginBottom: "2.5rem",
          lineHeight: "1.6",
          maxWidth: "40rem",
          margin: "0 auto 2.5rem"
        }}>
          Save, tag, and discover the best development links. Stop losing productive tools in browser bookmarks.
        </p>
        
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/signup" className="btn-primary" style={{ 
            padding: "1rem 2rem", 
            fontSize: "1.125rem", 
            textDecoration: "none",
            boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)"
          }}>
            Start Saving Links Free
          </Link>
          <a href="#features" style={{ 
            padding: "1rem 2rem", 
            fontSize: "1.125rem", 
            textDecoration: "none",
            color: "white",
            background: "transparent",
            border: "1px solid #374151",
            borderRadius: "0.5rem",
            fontWeight: "600",
            transition: "all 0.2s"
          }} 
          onMouseEnter={(e) => e.target.style.background = "#1f2937"}
          onMouseLeave={(e) => e.target.style.background = "transparent"}>
            Explore Community
          </a>
        </div>
      </header>

      {/* Features Support Section (matching user's screenshot vibe) */}
      <section id="features" style={{ padding: "4rem 1.5rem", maxWidth: "80rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "1rem" }}>Tell us where you need help.</h2>
          <p style={{ color: "#9ca3af", maxWidth: "36rem", margin: "0 auto" }}>
            This platform is for developers who want to manage their knowledge base efficiently. 
            Use tags, search, and community feedback to level up.
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "2rem" 
        }}>
          {[
            { 
              title: "Discover Tutorials", 
              desc: "Access a curated list of tutorials shared by the community. Filter by language or framework.",
              icon: "📚",
              link: "/dashboard?view=community"
            },
            { 
              title: "Save Productive Tools", 
              desc: "Keep all your favorite dev tools in one place. No more digging through history.",
              icon: "🛠️",
              link: isLoggedIn ? "/dashboard" : "/signup"
            },
            { 
              title: "Auto-Tagging AI", 
              desc: "We automatically suggest tags based on the link content, saving you time and effort.",
              icon: "⚡",
              link: isLoggedIn ? "/dashboard" : "/signup"
            },
            { 
              title: "Bulk Import", 
              desc: "Paste multiple URLs at once to quickly build your library in seconds.",
              icon: "📥",
              link: isLoggedIn ? "/dashboard" : "/signup"
            }
          ].map((feature, i) => (
            <Link key={i} to={feature.link} className="card" style={{ 
              padding: "2rem", 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem",
              background: "rgba(17, 24, 39, 0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              textDecoration: "none",
              color: "white",
              transition: "transform 0.2s, border-color 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "#3b82f6"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)"; }}>
              <div style={{ fontSize: "2.5rem" }}>{feature.icon}</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600" }}>{feature.title}</h3>
              <p style={{ color: "#9ca3af", lineHeight: "1.6" }}>{feature.desc}</p>
              <div style={{ marginTop: "auto", color: "#3b82f6", fontWeight: "600", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                Try it now <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: "6rem 1.5rem", 
        background: "linear-gradient(to bottom, #030712, #0f172a)",
        borderTop: "1px solid #1f2937",
        borderBottom: "1px solid #1f2937",
        marginTop: "4rem"
      }}>
        <div style={{ 
          maxWidth: "80rem", 
          margin: "0 auto", 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "3rem",
          textAlign: "center"
        }}>
          {[
            { label: "Community Members", value: stats.users.toLocaleString() },
            { label: "Links Saved", value: stats.links.toLocaleString() },
            { label: "Daily discovered", value: stats.daily.toLocaleString() }
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#3b82f6", marginBottom: "0.5rem" }}>{stat.value}</div>
              <div style={{ color: "#9ca3af", fontWeight: "500", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "4rem 1.5rem", textAlign: "center", color: "#6b7280", fontSize: "0.875rem" }}>
        <p>&copy; {new Date().getFullYear()} DevLinkHub. All rights reserved.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1rem" }}>
          <span>Privacy</span>
          <span>Terms</span>
          <Link to="/support" style={{ color: "#6b7280", textDecoration: "none" }}>Support</Link>
        </div>
      </footer>
    </div>
  );
}
