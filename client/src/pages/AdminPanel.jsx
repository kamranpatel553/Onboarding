import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminPanel() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("emails");

  // Allowed emails state
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchAllowedEmails = async () => {
    const res = await fetch("/api/admin/allowed-emails", { headers: authHeaders });
    const data = await res.json();
    setAllowedEmails(Array.isArray(data) ? data : []);
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    const res = await fetch("/api/admin/users", { headers: authHeaders });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setUsersLoading(false);
  };

  useEffect(() => {
    fetchAllowedEmails();
    fetchUsers();
  }, []);

  const addEmail = async (e) => {
    e.preventDefault();
    setEmailError(""); setEmailSuccess("");
    if (!newEmail) { setEmailError("Please enter an email."); return; }
    if (!newEmail.toLowerCase().endsWith("@viiibits.com")) { setEmailError("Only @viiibits.com emails allowed."); return; }
    setEmailLoading(true);
    try {
      const res = await fetch("/api/admin/allowed-emails", {
        method: "POST", headers: authHeaders, body: JSON.stringify({ email: newEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setEmailError(data.message); return; }
      setEmailSuccess(`${newEmail} added successfully.`);
      setNewEmail(""); fetchAllowedEmails();
    } catch { setEmailError("Network error."); }
    finally { setEmailLoading(false); }
  };

  const removeEmail = async (id, email) => {
    if (!window.confirm(`Remove ${email} from allowed list?`)) return;
    await fetch(`/api/admin/allowed-emails/${id}`, { method: "DELETE", headers: authHeaders });
    fetchAllowedEmails();
  };

  // Compute progress summary for a user
  const getProgressSummary = (progress) => {
    if (!progress || Object.keys(progress).length === 0) return "No progress yet";
    const roadmaps = Object.keys(progress);
    const summaries = roadmaps.map((r) => {
      const steps = Object.keys(progress[r]).length;
      return `${r}: ${steps} steps`;
    });
    return summaries.join(" | ");
  };

  const getTotalSteps = (progress) => {
    if (!progress) return 0;
    return Object.values(progress).reduce((sum, roadmap) => sum + Object.keys(roadmap).length, 0);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Admin Panel</h1>
          <p className="text-zinc-400 text-sm">Manage authorized emails and view user progress</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-zinc-900 rounded-xl p-1 w-fit border border-zinc-800">
          {[["emails", "Allowed Emails"], ["users", "User Progress"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? "bg-yellow-400 text-black" : "text-zinc-400 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Allowed Emails Tab */}
        {tab === "emails" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-1">Add Allowed Email</h2>
              <p className="text-zinc-400 text-sm mb-4">Only emails added here can sign up to the platform.</p>
              <form onSubmit={addEmail} className="flex gap-3 flex-wrap">
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@viiibits.com"
                  className="flex-1 min-w-48 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors" />
                <button type="submit" disabled={emailLoading}
                  className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap">
                  {emailLoading ? "Adding…" : "Add Email"}
                </button>
              </form>
              {emailError && <p className="text-red-400 text-sm mt-2">{emailError}</p>}
              {emailSuccess && <p className="text-green-400 text-sm mt-2">{emailSuccess}</p>}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Authorized Emails</h2>
                <span className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full">{allowedEmails.length} emails</span>
              </div>
              {allowedEmails.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <p className="text-sm">No emails added yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allowedEmails.map((item) => {
                    const isRegistered = users.some((u) => u.email === item.email);
                    return (
                      <div key={item.id} className="flex items-center justify-between bg-zinc-800 rounded-lg px-4 py-3 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-semibold text-xs">
                            {item.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.email}</p>
                            <p className="text-xs text-zinc-500">{new Date(item.addedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${isRegistered ? "bg-green-900/50 text-green-400" : "bg-zinc-700 text-zinc-400"}`}>
                            {isRegistered ? "Registered" : "Not registered"}
                          </span>
                          <button onClick={() => removeEmail(item.id, item.email)}
                            className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Progress Tab */}
        {tab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Users & Progress</h2>
              <button onClick={fetchUsers} className="text-xs text-zinc-400 hover:text-white border border-zinc-700 px-3 py-1.5 rounded-lg transition-colors">Refresh</button>
            </div>
            {usersLoading ? (
              <div className="text-center py-12 text-zinc-500">Loading users…</div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 bg-zinc-900 rounded-2xl border border-zinc-800">
                <p className="text-sm">No registered users yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((u) => {
                  const totalSteps = getTotalSteps(u.progress);
                  const roadmaps = Object.keys(u.progress || {});
                  return (
                    <div key={u.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                      <button className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                        onClick={() => setSelectedUser(selectedUser === u.id ? null : u.id)}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-xs text-zinc-400">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-yellow-400">{totalSteps} steps done</p>
                            <p className="text-xs text-zinc-500">{roadmaps.length} roadmap{roadmaps.length !== 1 ? "s" : ""}</p>
                          </div>
                          <svg className={`w-5 h-5 text-zinc-500 transition-transform ${selectedUser === u.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {selectedUser === u.id && (
                        <div className="border-t border-zinc-800 px-6 py-4">
                          {roadmaps.length === 0 ? (
                            <p className="text-sm text-zinc-500">No roadmap progress yet.</p>
                          ) : (
                            <div className="space-y-4">
                              {roadmaps.map((roadmap) => {
                                const steps = Object.keys(u.progress[roadmap]);
                                return (
                                  <div key={roadmap}>
                                    <div className="flex justify-between items-center mb-2">
                                      <h4 className="text-sm font-semibold capitalize">{roadmap}</h4>
                                      <span className="text-xs text-zinc-400">{steps.length} steps completed</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {steps.map((step) => (
                                        <span key={step} className="text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 px-2 py-1 rounded-full">{step}</span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <p className="text-xs text-zinc-600 mt-4">Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
