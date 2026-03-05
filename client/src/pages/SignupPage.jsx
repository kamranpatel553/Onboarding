import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ALLOWED_DOMAIN = "@viiibits.com";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (pwd.length < 8) return { label: "Fair", color: "bg-orange-400", width: "w-2/4" };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { label: "Strong", color: "bg-green-500", width: "w-full" };
    return { label: "Good", color: "bg-yellow-400", width: "w-3/4" };
  };
  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirmPassword) { setError("Please fill in all fields."); return; }
    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) { setError(`Only ${ALLOWED_DOMAIN} company email addresses are allowed.`); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Signup failed."); return; }
      login(data.token, data.user);
      navigate("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
  const EyeClosed = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.96 9.96 0 016.213 2.162M9.879 9.879A3 3 0 0115 12m-3 3a3 3 0 01-2.121-5.121M3 3l18 18" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg hover:text-yellow-400 transition-colors">DevRoadmap</Link>
        <span className="text-zinc-400 text-sm">Already have an account? <Link to="/login" className="text-yellow-400 hover:underline font-medium">Log In</Link></span>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-zinc-400 text-sm mb-8">Use your <span className="text-yellow-400 font-medium">@viiibits.com</span> company email to sign up.</p>
          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="bg-red-900/40 border border-red-600 text-red-300 text-sm rounded-lg px-4 py-2.5 mb-5">{error}</div>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Company email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@viiibits.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors" />
              {email && !email.toLowerCase().endsWith(ALLOWED_DOMAIN) && <p className="text-xs text-red-400 mt-1">Must be a @viiibits.com email address</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="h-1 bg-zinc-700 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} /></div>
                  <p className="text-xs text-zinc-400 mt-1">{strength.label} password</p>
                </div>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Confirm password</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                  className={`w-full bg-zinc-800 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors pr-10 ${confirmPassword && confirmPassword !== password ? "border-red-500" : "border-zinc-700 focus:border-yellow-400"}`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showConfirm ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && <p className="text-xs text-red-400 mt-1">Passwords do not match</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-2.5 rounded-lg transition-colors text-sm">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <p className="text-center text-zinc-500 text-xs mt-6">Already have an account? <Link to="/login" className="text-yellow-400 hover:underline">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}
