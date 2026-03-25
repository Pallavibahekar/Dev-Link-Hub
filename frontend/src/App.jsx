import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login     from "./pages/Login";
import Signup    from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Landing   from "./pages/Landing";
import Support   from "./pages/Support";

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "1.125rem" }}>Loading...</div>;
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "1.125rem" }}>Loading...</div>;
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup"   element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/support"  element={<Support />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*" element={
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1rem" }}>
          <div style={{ fontSize: "3.75rem", marginBottom: "1rem" }}>404</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "white", marginBottom: "0.5rem" }}>Page not found</h1>
          <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>The page you are looking for does not exist.</p>
          <a href="/dashboard" className="btn-primary" style={{ textDecoration: "none" }}>Go to Dashboard</a>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
