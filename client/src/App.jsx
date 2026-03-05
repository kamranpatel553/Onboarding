import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DeveloperReadiness from "./pages/roadmap/DeveloperReadiness";
import FrontendRoadmap from "./pages/roadmap/FrontendRoadmap";
import OnboardingRoadmap from "./pages/roadmap/OnboardingRoadmap";
import AdminPanel from "./pages/AdminPanel";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/roadmap/readiness" element={<ProtectedRoute><DeveloperReadiness /></ProtectedRoute>} />
      <Route path="/roadmap/frontend" element={<ProtectedRoute><FrontendRoadmap /></ProtectedRoute>} />
      <Route path="/roadmap/onboarding" element={<ProtectedRoute><OnboardingRoadmap /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
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
