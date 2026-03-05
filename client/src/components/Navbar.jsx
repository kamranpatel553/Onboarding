import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full bg-black text-white border-b border-zinc-800">
      <div className="px-4 sm:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg cursor-pointer hover:text-yellow-500">DevRoadmap</Link>
        <div className="hidden md:flex gap-4 items-center">
          <button className="hover:text-yellow-400">Roadmaps</button>
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-yellow-400 hover:underline text-sm font-medium">Admin Panel</Link>
              )}
              <span className="text-zinc-400 text-sm">{user.name}</span>
              <button onClick={handleLogout} className="border border-zinc-700 px-3 py-1 rounded hover:border-red-400 hover:text-red-400 transition-colors text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="border border-zinc-700 px-3 py-1 rounded hover:border-yellow-400 hover:text-yellow-400 transition-colors">Login</Link>
              <Link to="/signup" className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors font-medium">Sign Up</Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4">
          <button className="hover:text-yellow-400 text-left">Roadmaps</button>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" className="text-yellow-400 text-sm font-medium">Admin Panel</Link>}
              <span className="text-zinc-400 text-sm">{user.name}</span>
              <button onClick={handleLogout} className="border border-zinc-700 px-3 py-2 rounded text-left hover:border-red-400 hover:text-red-400 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="border border-zinc-700 px-3 py-2 rounded w-full text-center hover:border-yellow-400 hover:text-yellow-400 transition-colors">Login</Link>
              <Link to="/signup" className="bg-yellow-400 text-black px-3 py-2 rounded w-full text-center hover:bg-yellow-300 transition-colors font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
