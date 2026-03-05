import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleCard({ title, highlight, locked }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (locked) return;
    if (!user) { navigate("/login"); return; }
    if (title === "Onboarding") navigate("/roadmap/onboarding");
    else if (title === "Developer Readiness") navigate("/roadmap/readiness");
    else if (title === "Frontend") navigate("/roadmap/frontend");
  };

  return (
    <div onClick={handleClick}
      className={`rounded-xl p-6 transition border relative
        ${locked ? "bg-zinc-900 border-zinc-800 opacity-50 cursor-not-allowed" :
          highlight ? "bg-yellow-400 text-black border-yellow-400 cursor-pointer" :
          "bg-zinc-900 border-zinc-800 hover:border-yellow-400 cursor-pointer"}`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      {locked && (
        <span className="absolute top-3 right-3 text-zinc-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </span>
      )}
      {!user && !locked && (
        <span className="absolute top-3 right-3 text-zinc-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </span>
      )}
    </div>
  );
}
