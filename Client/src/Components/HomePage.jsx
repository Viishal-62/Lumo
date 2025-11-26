import React, { useState, useEffect, useRef } from "react";

const Mic = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
  </svg>
);
// --- New Agent Icons ---
const CalendarIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const YoutubeIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7.5 4 12 4s9.5 2 9.5 3-2 3-2 3"></path>
    <path d="M12 11v1a5 5 0 0 1 0 10c-5 0-10-2-10-2"></path>
    <path d="m10 15 5-3-5-3z"></path>
  </svg>
);
const SheetIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);
const FileTextIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

// --- Intersection Observer Hook ---
const useOnScreen = (ref) => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);
  return isIntersecting;
};

const AnimatedTerminal = () => {
  const [text, setText] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const commands = [
    "Find top DSA resources, create a YouTube playlist, and export links to a Google Sheet.",
    "Schedule a team meeting for tomorrow at 10am and invite the dev team.",
    "What does my afternoon look like today?",
    "Summarize the latest AI news and create a PDF report.",
  ];

  useEffect(() => {
    const currentCommand = commands[commandIndex];
    let timeout;

    if (isDeleting) {
      // Deleting phase
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentCommand.slice(0, text.length - 1));
        }, 40); // Faster deleting speed
      } else {
        setIsDeleting(false);
        setCommandIndex((prevIndex) => (prevIndex + 1) % commands.length);
      }
    } else {
      // Typing phase
      if (text.length < currentCommand.length) {
        timeout = setTimeout(() => {
          setText(currentCommand.slice(0, text.length + 1));
        }, 60); // Typing speed
      } else {
        // Pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, commandIndex, commands]);

  const isCommandFullyTyped =
    text.length === commands[commandIndex].length && !isDeleting;

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 font-mono text-left text-sm text-slate-300 min-h-[110px] shadow-2xl shadow-black/30 backdrop-blur-sm">
      <div className="flex items-center mb-2">
        <span className="text-violet-400 mr-2">$</span>
        <span className="flex-1">{text}</span>
        <span className="w-2 h-4 bg-violet-400 animate-pulse ml-1"></span>
      </div>
      <div
        className={`transition-opacity duration-1000 ${
          isCommandFullyTyped ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-green-400">&gt; Agentic confirmed.</p>
        <p className="text-green-400">&gt; Executing tasks...</p>
      </div>
    </div>
  );
};

const WorkflowCard = ({
  title,
  category,
  workflows,
  gradient,
  icon: Icon,
  isVisible,
}) => (
  <div
    className={`bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-black/30 backdrop-blur-md transition-all duration-700 transform ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}
  >
    <div
      className={`h-32 ${gradient} flex items-center justify-center relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <Icon className="w-16 h-16 text-white/50 transform group-hover:scale-110 transition-transform duration-300" />
    </div>
    <div className="p-6">
      <p className="text-xs text-violet-400 font-bold uppercase tracking-wider">
        {category}
      </p>
      <h3 className="text-xl font-bold text-white mt-1 mb-4">{title}</h3>
      <div className="space-y-2">
        {workflows.map((flow, index) => (
          <div
            key={index}
            className="bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-sm text-slate-300"
          >
            {flow}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [bgOffset, setBgOffset] = useState(0);

  const workflowsRef = useRef(null);
  const workflowsVisible = useOnScreen(workflowsRef);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setBgOffset(window.scrollY * 0.1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const workflows = [
    {
      title: "Calendar AI Agent",
      category: "Productivity",
      workflows: [
        "Create & Schedule Events",
        "Update & Move Meetings",
        "Delete Appointments",
        "Fetch Daily Schedule",
      ],
      gradient: "bg-gradient-to-br from-purple-600 to-indigo-800",
      icon: CalendarIcon,
    },
    {
      title: "Curation AI Agent",
      category: "Research & Learning",
      workflows: [
        "Find Topic Resources",
        "Create YouTube Playlists",
        "Add to Existing Playlist",
        "Summarize Video Content",
      ],
      gradient: "bg-gradient-to-br from-red-500 to-orange-500",
      icon: YoutubeIcon,
    },
    {
      title: "Data AI Agent",
      category: "Data Management",
      workflows: [
        "Export Links to Google Sheets",
        "Create New Spreadsheets",
        "Append Data to Sheet",
        "Format & Organize Data",
      ],
      gradient: "bg-gradient-to-br from-green-500 to-cyan-600",
      icon: SheetIcon,
    },
    {
      title: "Document AI Agent",
      category: "Content Creation",
      workflows: [
        "Generate PDF from Notes",
        "Summarize Web Articles",
        "Format Meeting Minutes",
        "Export Text as Document",
      ],
      gradient: "bg-gradient-to-br from-sky-500 to-blue-700",
      icon: FileTextIcon,
    },
  ];

  const integrations = [
    { name: "Google Calendar", icon: CalendarIcon },
    { name: "YouTube", icon: YoutubeIcon },
    { name: "Google Sheets", icon: SheetIcon },
  ];

  return (
    <div className="bg-black text-slate-300 font-sans antialiased">
      <div
        className="absolute inset-0 bg-grid-slate-900/[0.04] [mask-image:linear-gradient(to_bottom,white_10%,transparent_100%)]"
        style={{ backgroundPosition: `0 ${bgOffset}px` }}
      ></div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-lg border-b border-slate-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white">Lumo</h1>
          </div>
          <button
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-5 rounded-lg transition-colors shadow-lg shadow-violet-500/10 text-sm transform hover:scale-105"
            
            onClick={() =>
              (window.location.href =
                "https://lumo-1-pw6m.onrender.com/api/auth")
            }
          >
            Request Access
          </button>
        </div>

        <hr className="mt-2" />
      </header>

      <main className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-24 pb-32 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 leading-tight">
            Your Personal AI Operator
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            Delegate your digital tasks in plain English. Agentic connects to
            your apps and executes complex workflows, so you can focus on what
            matters.
          </p>
          <div className="mt-10 max-w-2xl mx-auto">
            <AnimatedTerminal />
          </div>
        </div>
      </main>

      <section className="py-24 text-center">
        <div className="container mx-auto px-6">
          <div className="inline-flex items-center justify-center bg-slate-900/80 border border-slate-700 rounded-full p-4 mb-6 shadow-lg shadow-violet-500/10 animate-pulse">
            <Mic className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            A Voice-First Interface
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Why type when you can talk? Agentic is built for a natural,
            conversational experience. Just speak your command and watch it
            happen.
          </p>
        </div>
      </section>

      <section ref={workflowsRef} className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Automate Anything with AI Agents
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Select an agent and see the powerful workflows it can execute for
            you instantly.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {workflows.map((wf, index) => (
            <WorkflowCard key={index} {...wf} isVisible={workflowsVisible} />
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Seamless Integrations
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10">
            Connects to the tools you already use every day.
          </p>
          <div className="flex justify-center items-center space-x-8 md:space-x-12">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div
                  key={integration.name}
                  className="flex flex-col items-center group"
                >
                  <div className="bg-slate-900/80 border border-slate-800 rounded-full p-4 transition-all duration-300 group-hover:bg-violet-500/10 group-hover:border-violet-400/30">
                    <Icon className="w-10 h-10 text-slate-400 transition-colors duration-300 group-hover:text-violet-400" />
                  </div>
                  <p className="mt-3 text-sm text-slate-400 transition-colors duration-300 group-hover:text-white">
                    {integration.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 relative">
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-violet-900/30 to-transparent filter blur-3xl"></div>
          <div className="relative text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Turn Intent into Action. Instantly.
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Stop juggling tabs and start delegating. Let your personal AI
              agent handle the busywork.
            </p>
            <div className="mt-8">
              <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-violet-500/20 transform hover:scale-105">
                Get Started for Free
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t  py-12">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <h1 className="text-xl font-bold">Lumo</h1>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Lumo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
