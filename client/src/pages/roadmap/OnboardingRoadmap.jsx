import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import RoadmapNode from "../../components/RoadmapNode";
import RoadmapConnector from "../../components/RoadmapConnector";
import { useAuth } from "../../context/AuthContext";

const RESOURCES = {
  Email: {
    description:
      "Your Viiibits company email and temporary password will be provided by HR. The credentials will be received on your personal email. Use Zoho Mail to log in, reset your password, and set up your account for daily communication.",
    free: [
      "Check your personal email for zoho credentials (e.g., yourname@viiibits.com)",
      "Open Zoho Mail at mail.zoho.com",
      "Enter your provided company email and temporary password to log in",
      "You will be prompted to reset your password — choose a strong new password",
      "Update your profile picture and display name",
      "Enable desktop and mobile notifications so you don't miss messages",
      "Download the Zoho Mail mobile app for iOS or Android",
      "Send a test email to @all confirming your account is active",
    ],
    links: [
      {
        label: "Open Zoho Mail — Login",
        url: "https://mail.zoho.com",
      },
      {
        label: "Reset / Change Zoho Password",
        url: "https://accounts.zoho.com/signin?servicename=ZohoMail",
      },
      {
        label: "Change Your Profile picture and display name",
        url: "https://accounts.zoho.in/home#profile/personal",
      },
      {
        label: "Zoho Mail Getting Started Guide",
        url: "https://www.zoho.com/mail/help/getting-started.html",
      },
      {
        label: "Zoho Mail Mobile App (iOS)",
        url: "https://apps.apple.com/app/zoho-mail/id909262651",
      },
      {
        label: "Zoho Mail Mobile App (Android)",
        url: "https://play.google.com/store/apps/details?id=com.zoho.mail",
      },
    ],
    tips: [],
    video: {
      title: "Watch how to reset zoho mail password",
      description:
        "Learn how to to reset zoho mail password",
      url: "https://www.youtube.com/watch?v=Rij2_h2YkgI",
      embedId: "Rij2_h2YkgI",
    },
    alert:
      "⚠️ Do NOT sign up for a new Zoho account. Your email and temporary password will be provided by HR. Just log in and reset your password.",
  },
  Chat: {
    description:
      "Join the team on Zoho Cliq, learn channels vs direct messages, and how to search past conversations. Your Zoho Cliq account is automatically linked to your company email.",
    free: [
      "Open Zoho Cliq at cliq.zoho.com or from the Zoho apps menu",
      "Log in using your Viiibits company email credentials",
      "Send a hello message in #viiibits-onboarding to introduce yourself",
      "Learn the difference between channels, direct messages, and threads",
      "Enable desktop and mobile notifications",
      "Download the Zoho Cliq mobile app for iOS or Android",
    ],
    links: [
      {
        label: "Open Zoho Cliq — Login",
        url: "https://cliq.zoho.com",
      },
      {
        label: "Zoho Cliq Getting Started Guide",
        url: "https://www.zoho.com/cliq/help/getting-started.html",
      },
      {
        label: "Zoho Cliq Mobile App (iOS)",
        url: "https://apps.apple.com/app/zoho-cliq/id1055102498",
      },
      {
        label: "Zoho Cliq Mobile App (Android)",
        url: "https://play.google.com/store/apps/details?id=com.zoho.chat",
      },
    ],
    tips: [],
    video: {
      title: "Watch Zoho Cliq Overview & Feature Tour",
      description:
        "Learn how to use Zoho Cliq — channels, direct messages, threads, and more:",
      url: "https://www.youtube.com/watch?v=0RA7KqxhyR8",
      embedId: "0RA7KqxhyR8",
    },
  },
  Console: {
    description:
      "Use the Viiibits console to access internal tools and environments. Create your login using your company credentials.",
    free: [
      "Open console.apps.viiibits.com and log in using the credentials provided by HR or your manager.",
      "Bookmark the console for daily use",
    ],
    links: [],
    tips: [],
  },
  Git: {
    description:
      "Create your Git account, set your username, and share it in the #Git-Hub channel in Zoho Cliq so we can grant repo access.",
    free: [
      "Open git.apps.viiibits.com and sign up using your company email address",
      "The username should be your first and last name. Example: john.smith",
      "Share your Git username in #Git-Hub channel on Zoho Cliq",
    ],
    links: [],
    tips: [],
  },
  Wiki: {
    description:
      "Access the internal wiki to read company processes, engineering practices, and project documentation.",
    free: [
      "Open wiki.apps.viiibits.com and create an account using your company email",
      "Start important pages like onboarding, engineering handbook",
    ],
    links: [],
    tips: [],
  },
  HRM: {
    description:
      "Set up your HRM profile so your basic information, leave, and payroll details are correct.",
    free: [
      "Log into the HRM portal using the credentials provided by HR",
      "Complete your personal and emergency contact details",
    ],
    links: [],
    tips: [],
  },
  Jira: {
    description:
      "Use Jira to track tasks, manage projects, report issues, and collaborate with your team.",
    free: [
      "Log into Jira using the credentials that will be provided by Asif Sir or Altamash",
      "Use Jira to update assign tasks",
    ],
    links: [],
    tips: [],
  },
};

const ALL_NODES = Object.keys(RESOURCES);
const TOTAL_STEPS = ALL_NODES.reduce(
  (sum, key) => sum + (RESOURCES[key].free?.length || 0),
  0,
);

export default function OnboardingRoadmap() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { token } = useAuth();
  const [checkedSteps, setCheckedSteps] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Load progress from server
  useEffect(() => {
    if (!token) return;
    fetch("/api/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setCheckedSteps(data["onboarding"] || {});
        setProgressLoaded(true);
      })
      .catch(() => setProgressLoaded(true));
  }, [token]);

  // Save progress to server (debounced)
  useEffect(() => {
    if (!progressLoaded || !token) return;
    const timer = setTimeout(() => {
      fetch("/api/progress", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ roadmap: "onboarding", checkedSteps }),
      }).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [checkedSteps, progressLoaded, token]);

  const toggleStep = (nodeKey, stepIndex) => {
    const id = `${nodeKey}-${stepIndex}`;
    setCheckedSteps((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  };

  const completedCount = Object.keys(checkedSteps).length;
  const progressPercent =
    TOTAL_STEPS > 0 ? Math.round((completedCount / TOTAL_STEPS) * 100) : 0;

  const getNodeProgress = (nodeKey) => {
    const steps = RESOURCES[nodeKey]?.free || [];
    const done = steps.filter((_, i) => checkedSteps[`${nodeKey}-${i}`]).length;
    return { done, total: steps.length };
  };

  const handleSelectNode = (concept) => {
    setSelectedNode(concept);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const currentResource = selectedNode ? RESOURCES[selectedNode] : null;

  return (
    <div className="min-h-screen bg-zinc-100">
      <Navbar />

      {/* Progress summary bar */}
      <div className="max-w-6xl mx-auto mt-6 bg-white border border-zinc-200 rounded-xl px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                progressPercent === 100
                  ? "bg-emerald-200 text-emerald-900"
                  : "bg-yellow-200 text-yellow-900"
              }`}
            >
              {progressPercent}% DONE
            </span>
            <span className="text-sm text-gray-600">
              {completedCount} of {TOTAL_STEPS} Done
            </span>
          </div>
          <button
            onClick={() => {
              if (
                window.confirm("Reset all progress? This cannot be undone.")
              ) {
                setCheckedSteps({});
              }
            }}
            className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Reset Progress
          </button>
        </div>

        <div className="w-full bg-zinc-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              progressPercent === 100 ? "bg-emerald-500" : "bg-blue-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto mt-6 mb-10 flex flex-col lg:flex-row gap-6">
        {/* Left sidebar */}
        <div className="space-y-4 lg:w-80 shrink-0">
          <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm text-xs text-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Onboarding Checklist
            </h2>
            <p>
              Make sure every new team member can communicate, access tools, and
              collaborate from day one. Use this roadmap to guide the initial
              setup.
            </p>
          </div>

          {/* Per-node progress summary */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm text-xs">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Section Progress
            </h3>
            <div className="space-y-2">
              {ALL_NODES.map((key) => {
                const { done, total } = getNodeProgress(key);
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-gray-700 mb-1">
                      <span className="font-medium">{key}</span>
                      <span>
                        {done}/{total}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          pct === 100 ? "bg-emerald-500" : "bg-blue-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: roadmap */}
        <div className="flex-1 space-y-6">
          <div className="bg-zinc-50 rounded-xl border border-zinc-200 py-8 px-6 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <RoadmapConnector
                orientation="vertical"
                variant="dashed"
                length="sm"
              />
              <div className="text-lg font-semibold text-gray-900">
                Onboarding
              </div>
              <RoadmapConnector
                orientation="vertical"
                variant="solid"
                length="sm"
              />

              {ALL_NODES.map((key, idx) => {
                const { done, total } = getNodeProgress(key);
                const isComplete = total > 0 && done === total;
                return (
                  <div key={key} className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <RoadmapNode
                        title={key}
                        variant="secondary"
                        selected={selectedNode === key && isDrawerOpen}
                        onClick={() => handleSelectNode(key)}
                      />
                      {isComplete && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      )}
                      {!isComplete && total > 0 && done > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                          {done}
                        </span>
                      )}
                    </div>
                    {idx < ALL_NODES.length - 1 && (
                      <RoadmapConnector
                        orientation="vertical"
                        variant="solid"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in drawer */}
      {isDrawerOpen && selectedNode && currentResource && (
        <>
          <button
            type="button"
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          />

          <aside className="fixed right-0 top-0 bottom-0 z-40 w-full sm:w-[420px] lg:w-[480px] bg-white border-l border-zinc-200 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
              <div className="flex gap-2 items-center">
                <span className="px-2 py-1 rounded-full bg-gray-900 text-white text-[11px] sm:text-xs font-semibold">
                  Onboarding Resources
                </span>
                {(() => {
                  const { done, total } = getNodeProgress(selectedNode);
                  return (
                    <span className="text-[11px] text-gray-500">
                      {done}/{total} done
                    </span>
                  );
                })()}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 text-xs sm:text-sm text-gray-800">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                {selectedNode}
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 mb-4">
                {currentResource.description}
              </p>

              {/* Alert banner */}
              {currentResource.alert && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <p className="text-xs sm:text-sm font-medium text-red-800">
                      {currentResource.alert}
                    </p>
                  </div>
                </div>
              )}

              {/* Steps with checkboxes */}
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-emerald-700 mb-2 uppercase tracking-wide">
                  Steps to Complete
                </div>
                <ol className="space-y-2 list-none">
                  {(currentResource.free || []).map((item, index) => {
                    const stepId = `${selectedNode}-${index}`;
                    const isChecked = !!checkedSteps[stepId];
                    return (
                      <li
                        key={stepId}
                        className={`flex items-start gap-3 rounded-lg px-3 py-2.5 border cursor-pointer transition-all duration-200 ${
                          isChecked
                            ? "bg-emerald-50 border-emerald-300"
                            : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                        }`}
                        onClick={() => toggleStep(selectedNode, index)}
                      >
                        <div className="shrink-0 mt-0.5">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                              isChecked
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-zinc-300 bg-white"
                            }`}
                          >
                            {isChecked && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={3}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 flex-1">
                          <span
                            className={`shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mt-0.5 ${
                              isChecked
                                ? "bg-emerald-600 text-white"
                                : "bg-zinc-200 text-zinc-600"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span
                            className={`text-xs sm:text-sm ${
                              isChecked
                                ? "line-through text-gray-400"
                                : "text-gray-800"
                            }`}
                          >
                            {item}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Quick links */}
              {currentResource.links?.length > 0 && (
                <div className="mt-6">
                  <div className="text-[11px] font-semibold text-blue-700 mb-2 uppercase tracking-wide">
                    Quick Links
                  </div>
                  <div className="grid gap-2">
                    {currentResource.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs sm:text-sm font-medium text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        {link.label}
                        <svg
                          className="w-3 h-3 ml-auto shrink-0 opacity-40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {currentResource.tips?.length > 0 && (
                <div className="mt-6">
                  <div className="text-[11px] font-semibold text-amber-700 mb-2 uppercase tracking-wide">
                    💡 Pro Tips
                  </div>
                  <ul className="space-y-2">
                    {currentResource.tips.map((tip) => (
                      <li
                        key={tip}
                        className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs sm:text-sm text-amber-900"
                      >
                        <span className="shrink-0 mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Video walkthrough — generic for any node that has one */}
              {currentResource.video && (
                <div className="mt-6">
                  <div className="text-[11px] font-semibold text-purple-700 mb-2 uppercase tracking-wide">
                    🎥 Video Walkthrough
                  </div>
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 space-y-3">
                    <p className="text-xs sm:text-sm text-purple-800">
                      {currentResource.video.description}
                    </p>

                    {/* Embedded YouTube player */}
                    {currentResource.video.embedId && (
                      <div className="relative w-full rounded-lg overflow-hidden aspect-video">
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${currentResource.video.embedId}`}
                          title={currentResource.video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Email video (kept separate since it has no embedId) */}
              {selectedNode === "Email" && !currentResource.video && (
                <div className="mt-6">
                  <div className="text-[11px] font-semibold text-purple-700 mb-2 uppercase tracking-wide">
                    🎥 Video Walkthrough
                  </div>
                 
                </div>
              )}

              {/* Console */}
              {selectedNode === "Console" && (
                <div className="mt-6">
                  <a
                    href="http://console.apps.viiibits.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    Open console.apps.viiibits.com
                  </a>
                </div>
              )}

              {/* Git */}
              {selectedNode === "Git" && (
                <div className="mt-6 space-y-2">
                  <a
                    href="https://git.apps.viiibits.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    Open git.apps.viiibits.com
                  </a>
                  
                </div>
              )}

              {/* WIKI */}
              {selectedNode === "Wiki" && (
                <div className="mt-6">
                  <a
                    href="https://wiki.apps.viiibits.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    Open wiki.apps.viiibits.com
                  </a>
                </div>
              )}

              {/* HRM */}
              {selectedNode === "HRM" && (
                <div className="mt-6">
                  <a
                    href="https://hrm.apps.viiibits.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    Open hrm.apps.viiibits.com
                  </a>
                </div>
              )}

              {/* JIRA */}
              {selectedNode === "Jira" && (
                <div className="mt-6">
                  <a
                    href="https://viiibits.atlassian.net/jira/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    Open viiibits.atlassian.net/jira
                  </a>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
