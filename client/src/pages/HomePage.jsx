import Navbar from "../components/Navbar";
import RoleCard from "../components/RoleCard";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="mb-4 bg-gradient-to-b from-amber-500 via-orange-500 to-purple-600 bg-clip-text text-transparent font-bold text-3xl sm:text-4xl md:text-5xl leading-tight">
            VIIIbits Innovations Developer Roadmaps and Training
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">Learn by building. Validate with proof of work.</p>
          {!user && (
            <p className="mt-4 text-zinc-500 text-sm">
              <Link to="/login" className="text-yellow-400 hover:underline">Log in</Link> or <Link to="/signup" className="text-yellow-400 hover:underline">sign up</Link> to access roadmaps and track your progress.
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <RoleCard title="Onboarding" highlight={true} />
          <RoleCard title="Developer Readiness" />
          <RoleCard title="Frontend" />
          <RoleCard title="Backend" locked />
          <RoleCard title="Full Stack" locked />
          <RoleCard title="DevOps" locked />
          <RoleCard title="DevSecOps" locked />
          <RoleCard title="Data Analyst" locked />
        </div>
      </div>
    </div>
  );
}
