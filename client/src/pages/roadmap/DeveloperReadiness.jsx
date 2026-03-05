import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import RoadmapNode from "../../components/RoadmapNode";
import RoadmapConnector from "../../components/RoadmapConnector";
import { useAuth } from "../../context/AuthContext";

const RESOURCES = {
  "Git Workflow": {
    description:
      "Master Git fundamentals — branching, committing, merging, and pull requests. Every project at VIIIbits uses Git for version control and collaboration.",
    free: [
      "Install Git on your machine (git-scm.com)",
      "Configure your Git username and email globally",
      "Learn the basic commands: git init, add, commit, push, pull",
      "Understand branching: create, switch, and delete branches",
      "Practice creating a feature branch from main/develop",
      "Write clear, descriptive commit messages (e.g., 'fix: resolve login redirect bug')",
      "Learn how to create a Pull Request (PR) on GitHub/Gitea",
      "Understand merge vs rebase and when to use each",
      "Learn to resolve merge conflicts",
      "Practice the team Git workflow: branch → commit → push → PR → review → merge",
    ],
    links: [
      {
        label: "Git Official Documentation",
        url: "https://git-scm.com/doc",
      },
      {
        label: "Git Cheat Sheet (GitHub)",
        url: "https://education.github.com/git-cheat-sheet-education.pdf",
      },
      {
        label: "Learn Git Branching (Interactive)",
        url: "https://learngitbranching.js.org/",
      },
      {
        label: "Conventional Commits Guide",
        url: "https://www.conventionalcommits.org/",
      },
      {
        label: "VIIIbits Git Server",
        url: "https://git.apps.viiibits.com",
      },
    ],
    tips: [
      "Never commit directly to main — always use feature branches.",
      "Pull latest changes before starting new work to avoid conflicts.",
      "Keep commits small and focused — one logical change per commit.",
      "Use .gitignore to exclude node_modules, .env, and build files.",
    ],
    video: {
      title: "Watch Git & GitHub Crash Course",
      description: "Learn Git fundamentals in one video:",
      url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
      embedId: "RGOj5yH7evk",
    },
  },

  "VS Code Setup": {
    description:
      "Set up Visual Studio Code as your primary editor with the right extensions, settings, and shortcuts to maximize productivity.",
    free: [
      "Download and install VS Code from code.visualstudio.com",
      "Install essential extensions: ESLint, Prettier, Auto Rename Tag",
      "Install framework extensions: ES7+ React Snippets, Tailwind CSS IntelliSense",
      "Configure Prettier as default formatter (Format on Save)",
      "Learn core shortcuts: Ctrl+P (file search), Ctrl+Shift+P (command palette), Ctrl+` (terminal)",
      "Configure the integrated terminal to use your preferred shell",
    ],
    links: [
      {
        label: "Download VS Code",
        url: "https://code.visualstudio.com/",
      },
      {
        label: "VS Code Keyboard Shortcuts (PDF)",
        url: "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf",
      },
      {
        label: "Prettier Extension",
        url: "https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode",
      },
      {
        label: "ESLint Extension",
        url: "https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint",
      },
      {
        label: "ES7+ React Snippets Extension",
        url: "https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets",
      },
      {
        label: "Tailwind CSS IntelliSense",
        url: "https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss",
      },
    ],
    tips: [
      "Enable 'Format on Save' in settings — it saves hours of manual formatting.",
      "Use Ctrl+Shift+P → 'Reload Window' when extensions act up.",
      "Pin your most-used files in tabs so they don't close accidentally.",
      "Use the built-in terminal instead of switching between apps.",
    ],
    video: {
      title: "Watch VS Code Setup for Web Development",
      description: "Complete VS Code setup guide for developers:",
      url: "https://www.youtube.com/watch?v=fJEbVCrEMSE",
      embedId: "fJEbVCrEMSE",
    },
  },

  "Terminal Basics": {
    description:
      "Get comfortable with the command line. Most development tools, Git, Docker, and deployment workflows run through the terminal.",
    free: [
      "Open your terminal: Command Prompt, PowerShell (Windows), Terminal (Mac/Linux)",
      "Learn navigation: cd, ls/dir, pwd, mkdir, rm, cp, mv",
      "Understand file paths: absolute vs relative paths",
      "Learn to read and use command flags (e.g., ls -la, rm -rf)",
      "Practice running Node.js/npm commands: npm install, npm run dev",
      "Learn to use pipes and redirection: |, >, >>",
      "Understand environment variables: echo $PATH, set, export",
      "Learn to search files and text: find, grep",
      "Practice using keyboard shortcuts: Tab (autocomplete), Ctrl+C (cancel), Ctrl+R (search history)",
      "Install and configure a modern terminal (Windows Terminal, iTerm2, or Warp)",
    ],
    links: [
      {
        label: "Command Line Crash Course",
        url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line",
      },
      {
        label: "Linux Command Cheat Sheet",
        url: "https://www.guru99.com/linux-commands-cheat-sheet.html",
      },
      {
        label: "Windows Terminal (Download)",
        url: "https://aka.ms/terminal",
      },
      {
        label: "iTerm2 for Mac",
        url: "https://iterm2.com/",
      },
    ],
    tips: [
      "Use Tab to autocomplete file names — saves time and avoids typos.",
      "Use 'history' or Ctrl+R to find previously run commands.",
      "Never run rm -rf without double-checking the path first.",
      "Alias frequently used commands in your shell profile (.bashrc or .zshrc).",
    ],
    video: {
      title: "Watch Terminal / Command Line Basics",
      description: "Learn terminal commands every developer should know:",
      url: "https://www.youtube.com/watch?v=uwAqEzhyjtw",
      embedId: "uwAqEzhyjtw",
    },
  },

  "API Testing": {
    description:
      "Learn to test APIs using tools like Postman, Thunder Client, or curl. Understanding API requests and responses is essential for frontend and backend work.",
    free: [
      "Install Postman or Thunder Client (VS Code extension)",
      "Understand HTTP methods: GET, POST, PUT, PATCH, DELETE",
      "Learn HTTP status codes: 200, 201, 400, 401, 403, 404, 500",
      "Make your first GET request to a public API (e.g., jsonplaceholder.typicode.com)",
      "Make a POST request with a JSON body",
      "Learn to set headers: Content-Type, Authorization (Bearer token)",
      "Practice sending query parameters and path parameters",
      "Organize requests into collections/folders in Postman",
      "Learn to use environment variables in Postman for base URLs and tokens",
      "Test error scenarios: invalid data, missing auth, wrong endpoints",
    ],
    links: [
      {
        label: "Download Postman",
        url: "https://www.postman.com/downloads/",
      },
      {
        label: "Thunder Client (VS Code)",
        url: "https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client",
      },
      {
        label: "JSONPlaceholder (Free Test API)",
        url: "https://jsonplaceholder.typicode.com/",
      },
      {
        label: "HTTP Status Codes Reference",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
      },
      {
        label: "Postman - Configure Headers for API requests",
        url: "https://learning.postman.com/docs/sending-requests/create-requests/headers/",
      },
      {
        label: "Postman - Add API Authorization details to requests",
        url: "https://learning.postman.com/docs/sending-requests/authorization/specifying-authorization-details",
      },
      {
        label: "Postman - Authorization types supported (includes Bearer Token)",
        url: "https://learning.postman.com/docs/sending-requests/authorization/authorization-types/",
      },
      {
        label: "REST API Tutorial",
        url: "https://restfulapi.net/",
      },
    ],
    tips: [
      "Always test your API endpoints before writing frontend code.",
      "Save your API collections — they serve as living documentation.",
      "Use environment variables for URLs so you can switch between dev/staging/prod easily.",
      "Check the response time — if an API is slow, flag it early.",
    ],
    video: {
      title: "Watch Postman API Testing Tutorial",
      description: "Learn API testing with Postman step by step:",
      url: "https://www.youtube.com/watch?v=VywxIQ2ZXw4",
      embedId: "VywxIQ2ZXw4",
    },
  },

  Debugging: {
    description:
      "Learn systematic debugging techniques. Knowing how to find and fix bugs efficiently is one of the most valuable developer skills.",
    free: [
      "Learn to use browser DevTools: Elements, Console, Network, Sources tabs",
      "Practice using console.log, console.error, console.table, and console.group",
      "Learn to set breakpoints in browser DevTools and VS Code",
      "Understand the Network tab: inspect requests, responses, headers, and timing",
      "Learn to read error stack traces and identify the root cause",
      "Practice using the React DevTools extension for component debugging",
      "Learn the rubber duck debugging technique — explain the problem out loud",
      "Understand common error types: TypeError, ReferenceError, SyntaxError, NetworkError",
      "Learn to use try-catch blocks and proper error handling",
      "Practice reproducing bugs with minimal test cases before fixing",
    ],
    links: [
      {
        label: "Chrome DevTools Documentation",
        url: "https://developer.chrome.com/docs/devtools/",
      },
      {
        label: "React DevTools Extension",
        url: "https://react.dev/learn/react-developer-tools",
      },
      {
        label: "VS Code Debugging Guide",
        url: "https://code.visualstudio.com/docs/editor/debugging",
      },
      {
        label: "JavaScript Error Reference (MDN)",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors",
      },
    ],
    tips: [
      "Read the error message fully before Googling — most errors tell you exactly what's wrong.",
      "Use the Network tab to check if APIs are returning expected data.",
      "Narrow down the problem: comment out code until the error disappears.",
      "Take a break if you're stuck for 30+ minutes — fresh eyes find bugs faster.",
    ],
    video: {
      title: "Watch Chrome DevTools Debugging Tutorial",
      description: "Master browser debugging tools:",
      url: "https://www.youtube.com/watch?v=H0XScE08hy8",
      embedId: "H0XScE08hy8",
    },
  },

  Documentation: {
    description:
      "Write clear documentation for your code, APIs, and processes. Good documentation saves the team hours of guessing and asking questions.",
    free: [
      "Write a clear README.md for every project you work on",
      "Document setup instructions: how to install, configure, and run the project",
      "Learn Markdown syntax for formatting docs (.md files)",
      "Add inline code comments for complex logic — explain WHY, not WHAT",
      "Document API endpoints: method, URL, request body, response, and examples",
      "Write commit messages that serve as micro-documentation",
      "Document environment variables: name, purpose, example value",
    ],
    links: [
      {
        label: "Markdown Guide",
        url: "https://www.markdownguide.org/",
      },
      {
        label: "How to Write a Good README",
        url: "https://www.makeareadme.com/",
      },
    ],
    tips: [
      "Write docs as if the reader has zero context about the project.",
      "Update docs when you change code — stale docs are worse than no docs.",
      "If you had to ask someone how something works, document the answer.",
    ],
  },

  "Docker Basics": {
    description:
      "Understand Docker fundamentals — containers, images, and docker-compose. Many VIIIbits projects use Docker for consistent development and deployment environments.",
    free: [
     "Install Docker Desktop on your machine (Windows/Mac/Linux) and verify the installation using docker --version",
"Understand the difference between Docker Images and Containers and how containers run applications in isolated environments",
"Learn basic Docker commands: docker run, docker ps, docker stop, docker rm",
"Pull and run a test image using: docker run hello-world",
"Understand Dockerfiles and commonly used instructions: FROM, COPY, RUN, EXPOSE, CMD",
"Read and understand an existing Dockerfile in a team project",
"Learn docker-compose basics: docker-compose.yml structure, services, port mapping, volumes, environment variables",
"Run a multi-service project using docker-compose up",
"Learn to view container logs using: docker logs <container_name>",
"Understand Docker volumes and how to persist data between container restarts",
    ],
    links: [
      {
        label: "Install Docker Desktop",
        url: "https://www.docker.com/products/docker-desktop/",
      },
      {
        label: "Docker Getting Started Guide",
        url: "https://docs.docker.com/get-started/",
      },
      {
        label: "Docker Cheat Sheet",
        url: "https://docs.docker.com/get-started/docker_cheatsheet.pdf",
      },
      {
        label: "Docker Compose Documentation",
        url: "https://docs.docker.com/compose/",
      },
    ],
    tips: [
      "You don't need to master Docker — just understand how to run and debug containers.",
      "Use docker-compose down -v to fully clean up when things break.",
      "Check docker logs when a container isn't working as expected.",
      "Don't store sensitive data in Dockerfiles — use environment variables.",
    ],
    video: {
      title: "Watch Docker Crash Course for Beginners",
      description: "Learn Docker fundamentals in one video:",
      url: "https://www.youtube.com/watch?v=pg19Z8LL06w",
      embedId: "pg19Z8LL06w",
    },
  },

  "Environment Variables": {
    description:
      "Learn how to use environment variables to manage configuration, secrets, and API keys securely across different environments (dev, staging, production).",
    free: [
      "Understand what environment variables are and why they're used",
      "Learn the difference between .env, .env.local, .env.development, .env.production",
      "Create a .env file in a project and add variables (e.g., VITE_API_URL=http://localhost:3000)",
      "Access env variables in code: process.env (Node) or import.meta.env (Vite)",
      "Add .env to .gitignore — NEVER commit secrets to Git",
      "Create a .env.example file with placeholder values for the team",
      "Understand how env variables work in Docker (docker-compose environment section)",
      "Learn to set env variables in deployment platforms (Vercel, Railway, etc.)",
      "Practice switching between local and production API URLs using env variables",
      "Audit your project: ensure no API keys or passwords are hardcoded",
    ],
    links: [
      {
        label: "Vite Environment Variables Guide",
        url: "https://vitejs.dev/guide/env-and-mode.html",
      },
      {
        label: "dotenv Package (Node.js)",
        url: "https://www.npmjs.com/package/dotenv",
      },
      {
        label: "12-Factor App — Config",
        url: "https://12factor.net/config",
      },
    ],
    tips: [
      "Always create a .env.example so new developers know what variables are needed.",
      "Prefix client-side variables with VITE_ (Vite) or REACT_APP_ (CRA) — otherwise they won't be exposed.",
      "Rotate API keys immediately if they're accidentally committed to Git.",
      "Use different .env files for development and production — never use prod keys locally.",
    ],
    alert:
      "⚠️ NEVER commit .env files with real secrets to Git. Always add .env to .gitignore and use .env.example for documentation.",
  },

  "CI/CD Awareness": {
    description:
      "Understand Continuous Integration and Continuous Deployment (CI/CD) pipelines. Know what happens when you push code — automated tests, builds, and deployments.",
    free: [
      "Understand what CI/CD means: automate testing, building, and deploying code",
      "Learn the typical pipeline: Push → Lint → Test → Build → Deploy",
      "Know what happens when you create a Pull Request (automated checks run)",
      "Understand why CI fails: linting errors, test failures, build errors",
      "Learn to read CI/CD logs to find what went wrong",
      "Understand the difference between staging and production deployments",
      "Know the team's branching strategy: which branch triggers which deployment",
      "Learn basics of GitHub Actions or the CI tool your team uses",
      "Understand rollback: how to revert a bad deployment",
      "Practice fixing a failing CI pipeline (linting error or test failure)",
    ],
    links: [
      {
        label: "GitHub Actions Documentation",
        url: "https://docs.github.com/en/actions",
      },
      {
        label: "CI/CD Explained (Atlassian)",
        url: "https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment",
      },
      {
        label: "GitHub Actions Quickstart",
        url: "https://docs.github.com/en/actions/quickstart",
      },
    ],
    tips: [
      "Run linting and tests locally BEFORE pushing — don't rely on CI to catch basic errors.",
      "If CI fails, read the logs carefully — the error message is usually clear.",
      "Never force-merge a PR with failing CI checks unless you know exactly why.",
      "Understand that CI/CD saves the team from 'it works on my machine' problems.",
    ],
    video: {
      title: "Watch CI/CD Explained in 100 Seconds",
      description: "Quick overview of CI/CD concepts:",
      url: "https://www.youtube.com/watch?v=scEDHsr3APg",
      embedId: "scEDHsr3APg",
    },
  },

  "Coding Standards": {
    description:
      "Follow consistent coding standards across the team. Clean, readable, and consistent code reduces bugs, speeds up reviews, and makes collaboration smoother.",
    free: [
      "Read and understand the team's coding style guide",
      "Configure ESLint and Prettier in your project with the team's rules",
      "Use consistent naming conventions: camelCase for variables, PascalCase for components",
      "Keep functions small and focused — one function, one responsibility",
      "Use meaningful variable and function names (avoid x, temp, data)",
      "Write clean imports: group by external, internal, and relative paths",
      "Avoid magic numbers — use named constants instead",
      "Handle errors properly: don't use empty catch blocks",
      "Remove console.logs, commented-out code, and dead code before PRs",
      "Write code that is easy to read — code is read 10x more than it's written",
    ],
    links: [
      {
        label: "Airbnb JavaScript Style Guide",
        url: "https://github.com/airbnb/javascript",
      },
      {
        label: "Clean Code JavaScript",
        url: "https://github.com/ryanmcdermott/clean-code-javascript",
      },
      {
        label: "ESLint Getting Started",
        url: "https://eslint.org/docs/latest/use/getting-started",
      },
      {
        label: "Prettier Documentation",
        url: "https://prettier.io/docs/en/index.html",
      },
    ],
    tips: [
      "Don't fight the linter — if ESLint flags something, fix it or discuss the rule with the team.",
      "Consistency matters more than personal preference — follow the team standard.",
      "Review your own PR before requesting a review — catch obvious issues yourself.",
      "Read other people's code regularly — you'll learn patterns and improve faster.",
    ],
  },
};

const ALL_NODES = Object.keys(RESOURCES);
const TOTAL_STEPS = ALL_NODES.reduce(
  (sum, key) => sum + (RESOURCES[key].free?.length || 0),
  0
);

const STORAGE_KEY = "dev-readiness-progress";

export default function DeveloperReadiness() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { token } = useAuth();
  const [checkedSteps, setCheckedSteps] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch("/api/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setCheckedSteps(data["readiness"] || {});
        setProgressLoaded(true);
      })
      .catch(() => setProgressLoaded(true));
  }, [token]);

  useEffect(() => {
    if (!progressLoaded || !token) return;
    const timer = setTimeout(() => {
      fetch("/api/progress", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ roadmap: "readiness", checkedSteps }),
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

      {/* Main layout */}
      <div className="max-w-6xl mx-auto mt-6 mb-10 grid grid-cols-1 lg:grid-cols-[1.4fr_2fr] gap-6">
        {/* Left sidebar */}
        <div className="space-y-4">
          {/* Overview card */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Developer Readiness
            </h2>
            <p className="text-xs text-gray-600">
              Focus on core habits that improve developer productivity: clean
              environments, good tooling, and consistent collaboration
              practices.
            </p>
          </div>

          {/* Per-node progress */}
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
                      <span
                        className="font-medium truncate max-w-[140px] cursor-pointer hover:text-blue-600"
                        onClick={() => handleSelectNode(key)}
                      >
                        {key}
                      </span>
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

          {/* Tips card */}
          <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm text-xs text-gray-700">
            <p className="mb-2">
              Each checkpoint aims to remove friction from your day-to-day work:
              faster setup, fewer context switches, and clearer debugging.
            </p>
            <p>
              Use this roadmap as a reference while working on real tasks to
              build habits, not just complete boxes.
            </p>
          </div>
        </div>

        {/* Central roadmap tree */}
        <div className="bg-zinc-50 rounded-xl border border-zinc-200 py-8 px-4 shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <RoadmapConnector
              orientation="vertical"
              variant="dashed"
              length="sm"
            />
            <div className="text-lg font-semibold text-gray-900">
              Developer Readiness
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
                    {/* Completion badge */}
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
                    {/* Partial progress badge */}
                    {!isComplete && total > 0 && done > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                        {done}
                      </span>
                    )}
                  </div>
                  {idx < ALL_NODES.length - 1 && (
                    <RoadmapConnector orientation="vertical" variant="solid" />
                  )}
                </div>
              );
            })}
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
                  Developer Readiness
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

              {/* Video walkthrough */}
              {currentResource.video && (
                <div className="mt-6">
                  <div className="text-[11px] font-semibold text-purple-700 mb-2 uppercase tracking-wide">
                    🎥 Video Walkthrough
                  </div>
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 space-y-3">
                    <p className="text-xs sm:text-sm text-purple-800">
                      {currentResource.video.description}
                    </p>

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
            </div>
          </aside>
        </>
      )}
    </div>
  );
}