import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import RoadmapNode from "../../components/RoadmapNode";
import RoadmapConnector from "../../components/RoadmapConnector";
import { useAuth } from "../../context/AuthContext";

const INTERNET_CONCEPTS = [
  "How does the internet work?",
  "What is HTTP?",
  "What is Domain Name?",
  "What is hosting?",
  "DNS and how it works?",
  "Browsers and how they work?",
];

const RESOURCES = {
  "How does the internet work?": {
    description:
      "High-level overview of how clients, servers, and infrastructure work together to deliver web pages.",
    free: [
      "Introduction to Internet",
      "How does the Internet Work?",
      "How Does the Internet Work? MDN Docs",
      "How the Internet Works in 5 Minutes",
    ],
  },
  "What is HTTP?": {
    description:
      "HTTP is the protocol used for transferring web pages on the internet.",
    free: [
      "Everything you need to know about HTTP",
      "What is HTTP? MDN Docs",
      "HTTP Crash Course",
    ],
  },
  "What is Domain Name?": {
    description:
      "A domain name is a human-readable address used to access websites.",
    free: [
      "What is a Domain Name?",
      "How Domains Work",
    ],
  },
  "What is hosting?": {
    description:
      "Web hosting is a service that allows you to publish your website on the internet.",
    free: [
      "What Is Web Hosting?",
      "Different Types of Web Hosting",
    ],
  },
  "DNS and how it works?": {
    description:
      "DNS translates domain names to IP addresses so browsers can load resources.",
    free: [
      "What is DNS?",
      "DNS and How does it Work?",
      "DNS in One Picture",
    ],
  },
  "Browsers and how they work?": {
    description:
      "Web browsers request, retrieve, and display content from web servers.",
    free: [
      "How Browsers Work",
      "Role of Rendering Engine",
    ],
  },
};

export default function FrontendRoadmap() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { token } = useAuth();
  const [checkedSteps, setCheckedSteps] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("/api/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setCheckedSteps(data["frontend"] || {}); setProgressLoaded(true); })
      .catch(() => setProgressLoaded(true));
  }, [token]);

  useEffect(() => {
    if (!progressLoaded || !token) return;
    const timer = setTimeout(() => {
      fetch("/api/progress", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ roadmap: "frontend", checkedSteps }),
      }).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [checkedSteps, progressLoaded, token]);

  const handleSelectNode = (concept) => {
    setSelectedNode(concept);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <Navbar />

      {/* Progress summary bar */}
      <div className="max-w-6xl mx-3 sm:mx-auto mt-4 sm:mt-6 bg-white border border-zinc-200 rounded-xl px-3 sm:px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="bg-yellow-200 px-2 py-1 rounded text-xs font-semibold text-yellow-900">
            0% DONE
          </span>
          <span className="text-xs sm:text-sm text-gray-600">0 of 0 Done</span>
        </div>
        <button className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 font-medium">
          Track Progress
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto mt-4 sm:mt-6 mb-10 flex flex-col lg:flex-row gap-4 sm:gap-6 px-3 sm:px-4 lg:px-0">

        {/* Left sidebar */}
        <div className="space-y-3 sm:space-y-4 lg:w-80 shrink-0">

          {/* Legend */}
          <div className="bg-white rounded-xl border border-zinc-200 p-3 sm:p-4 shadow-sm text-xs text-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
              Legend
            </h2>
            <ul className="flex flex-row flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:space-y-2">
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-purple-500 shrink-0" />
                <span>Personal Recommendation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-emerald-500 shrink-0" />
                <span>Alternative Option</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full border border-gray-500 shrink-0" />
                <span>Order not strict on roadmap</span>
              </li>
            </ul>
          </div>

          {/* Buttons row on mobile */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <button className="w-full bg-black text-white rounded-xl py-2.5 sm:py-3 text-sm font-semibold shadow-sm">
              Visit Beginner Friendly Version
            </button>

            <div className="bg-white rounded-xl border border-zinc-200 p-3 sm:p-4 shadow-sm text-xs text-gray-700 flex flex-col justify-between sm:flex-1 lg:flex-none">
              <p className="mb-2 sm:mb-3 leading-relaxed">
                HTML, CSS and JavaScript are the backbone of web development.
                Make sure to practice by building lots of projects.
              </p>
              <button className="w-full bg-gray-200 text-gray-900 rounded-lg py-2 text-xs font-semibold">
                Beginner Project Ideas
              </button>
            </div>
          </div>

          {/* Related roadmaps */}
          <div className="bg-white rounded-xl border border-zinc-200 p-3 sm:p-4 shadow-sm text-xs text-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
              Related Roadmaps
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1.5 sm:gap-2">
              {["JavaScript Roadmap", "React Roadmap", "TypeScript Roadmap", "Node.js Roadmap"].map(
                (item) => (
                  <li
                    key={item}
                    className="px-2 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 cursor-pointer transition-colors"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* roadmap diagram */}
        <div className="flex-1">
          <div className="bg-zinc-50 rounded-xl border border-zinc-200 py-6 sm:py-8 px-3 sm:px-6 shadow-sm overflow-x-auto">
            <div className="min-w-[320px]">

              {/* ========== MOBILE LAYOUT ========== */}
              <div className="flex flex-col items-center sm:hidden">
                <div className="text-base font-semibold text-gray-900 mb-3">
                  Front-end
                </div>

                <RoadmapNode title="Internet" />
                <div className="w-px h-4 bg-gray-400" />

                {/* Internet concepts - mobile indented */}
                <div className="w-full max-w-xs mb-2">
                  <div className="border-l-2 border-dashed border-gray-400 ml-6 pl-4 space-y-2 py-2">
                    {INTERNET_CONCEPTS.map((concept) => (
                      <div key={concept}>
                        <RoadmapNode
                          title={concept}
                          variant="secondary"
                          selected={selectedNode === concept && isDrawerOpen}
                          onClick={() => handleSelectNode(concept)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-px h-4 bg-gray-400" />
                <RoadmapNode title="HTML" />
                <div className="w-px h-4 bg-gray-400" />
                <RoadmapNode title="CSS" />
                <div className="w-px h-4 bg-gray-400" />
                <RoadmapNode title="JavaScript" />
              </div>

              {/* ========== DESKTOP LAYOUT ========== */}
              <div className="hidden sm:flex items-start justify-center gap-8 lg:gap-16">

                {/* Center column */}
                <div className="flex flex-col items-center gap-3">
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    Front-end
                  </div>
                  <RoadmapNode title="Internet" />
                  <RoadmapConnector orientation="vertical" variant="solid" />
                  <RoadmapNode title="HTML" />
                  <RoadmapConnector orientation="vertical" variant="solid" />
                  <RoadmapNode title="CSS" />
                  <RoadmapConnector orientation="vertical" variant="solid" />
                  <RoadmapNode title="JavaScript" />
                </div>

                {/* Right column: Internet concepts */}
                <div className="flex flex-col gap-3">
                  {INTERNET_CONCEPTS.map((concept) => (
                    <div key={concept} className="flex items-center gap-3">
                      <RoadmapConnector
                        orientation="horizontal"
                        variant="dashed"
                        length="lg"
                      />
                      <RoadmapNode
                        title={concept}
                        variant="secondary"
                        selected={selectedNode === concept && isDrawerOpen}
                        onClick={() => handleSelectNode(concept)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== SLIDE-IN DRAWER ========== */}
      {isDrawerOpen && selectedNode && (
        <>
          {/* Backdrop - click to close */}
          <button
            type="button"
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity"
          />

          {/* Drawer panel */}
          <aside className="fixed right-0 top-0 bottom-0 z-40 w-full sm:w-[420px] lg:w-[480px] bg-white border-l border-zinc-200 shadow-2xl flex flex-col animate-slideIn">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50">
              <div className="flex gap-2 text-[11px] sm:text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-gray-900 text-white">
                  Resources
                </span>
                <span className="px-2.5 py-1 rounded-full border border-gray-300 text-gray-700">
                  AI Tutor
                </span>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="text-gray-500 hover:text-gray-800 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Drawer content - scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-5 text-xs sm:text-sm text-gray-800">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {selectedNode}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-5 leading-relaxed">
                {RESOURCES[selectedNode]?.description ||
                  "Explore curated resources to understand this topic deeply and see how it fits into the frontend roadmap."}
              </p>

              {/* Free Resources */}
              <div>
                <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-3">
                  Free Resources
                </div>
                <ul className="space-y-2">
                  {(RESOURCES[selectedNode]?.free || []).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">→</span>
                      <button className="text-blue-700 hover:underline text-left">
                        {item}
                      </button>
                    </li>
                  ))}
                  {!RESOURCES[selectedNode]?.free?.length && (
                    <li className="text-gray-500 italic">
                      Links for this topic will appear here.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}