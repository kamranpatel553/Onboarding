import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ALLOWED_DOMAIN = "@viiibits.com";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) { setError(`Only ${ALLOWED_DOMAIN} company email addresses are allowed.`); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed."); return; }
      login(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg hover:text-yellow-400 transition-colors">DevRoadmap</Link>
        <span className="text-zinc-400 text-sm">No account? <Link to="/signup" className="text-yellow-400 hover:underline font-medium">Sign Up</Link></span>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-zinc-400 text-sm mb-8">Log in with your <span className="text-yellow-400 font-medium">@viiibits.com</span> company email.</p>
          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="bg-red-900/40 border border-red-600 text-red-300 text-sm rounded-lg px-4 py-2.5 mb-5">{error}</div>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Company email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@viiibits.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors" autoComplete="email" />
              {email && !email.toLowerCase().endsWith(ALLOWED_DOMAIN) && <p className="text-xs text-red-400 mt-1">Must be a @viiibits.com email address</p>}
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <div className="relative mt-1.5">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors pr-10" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.96 9.96 0 016.213 2.162M9.879 9.879A3 3 0 0115 12m-3 3a3 3 0 01-2.121-5.121M3 3l18 18" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-2.5 rounded-lg transition-colors text-sm">
              {loading ? "Logging in…" : "Log In"}
            </button>
          </form>
          <p className="text-center text-zinc-500 text-xs mt-6">Don't have an account? <Link to="/signup" className="text-yellow-400 hover:underline">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}
