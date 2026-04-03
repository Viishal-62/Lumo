import React, { useState, useEffect, useRef } from "react";

// --- Icons ---
const Mic = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
  </svg>
);

const CalendarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const YoutubeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7.5 4 12 4s9.5 2 9.5 3-2 3-2 3"></path>
    <path d="M12 11v1a5 5 0 0 1 0 10c-5 0-10-2-10-2"></path>
    <path d="m10 15 5-3-5-3z"></path>
  </svg>
);

const SheetIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);

const FileTextIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const SparklesIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M7 5H3"/><path d="M21 5h-4"/><path d="M19 3v4"/><path d="M5 21v-4"/><path d="M3 19h4"/>
  </svg>
)

// --- Intersection Observer Hook ---
const useOnScreen = (ref) => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting), { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, [ref]);
  return isIntersecting;
};

// --- Animated Terminal ---
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
      if (text.length > 0) {
        timeout = setTimeout(() => setText(currentCommand.slice(0, text.length - 1)), 30);
      } else {
        setIsDeleting(false);
        setCommandIndex((prevIndex) => (prevIndex + 1) % commands.length);
      }
    } else {
      if (text.length < currentCommand.length) {
        timeout = setTimeout(() => setText(currentCommand.slice(0, text.length + 1)), 50);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2500);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, commandIndex, commands]);

  const isCommandFullyTyped = text.length === commands[commandIndex].length && !isDeleting;

  return (
    <div className="relative group mx-auto w-full max-w-3xl">
      {/* Outer Glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 opacity-30 blur-2xl group-hover:opacity-60 transition duration-1000"></div>
      
      {/* Terminal Window */}
      <div className="relative bg-[#0d0d12]/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 md:p-8 font-mono text-left shadow-2xl overflow-hidden min-h-[160px] flex flex-col justify-center">
        {/* Mac Window Dots */}
        <div className="absolute top-4 left-5 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        
        <div className="mt-6 flex items-start sm:items-center">
          <SparklesIcon className="w-5 h-5 text-fuchsia-400 mr-3 flex-shrink-0 mt-1 sm:mt-0" />
          <span className="text-slate-200 text-sm md:text-base leading-relaxed tracking-wide flex-1">
            {text}
            <span className="inline-block w-2 h-4 sm:h-5 bg-fuchsia-400 animate-pulse ml-1 align-middle"></span>
          </span>
        </div>
        
        <div className={`mt-4 pl-8 transition-all duration-700 ${isCommandFullyTyped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 cursor-default"}`}>
          <p className="text-emerald-400/90 text-sm font-medium tracking-wide">✓ Agentic context confirmed.</p>
          <p className="text-indigo-300/80 text-sm tracking-wide mt-1">↳ Executing autonomous workflows...</p>
        </div>
      </div>
    </div>
  );
};

// --- Workflow Card ---
const WorkflowCard = ({ title, category, workflows, gradient, icon: Icon, isVisible, delay }) => (
  <div 
    className={`group relative rounded-3xl p-1 overflow-hidden transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    {/* Animated Gradient Border */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
    
    {/* Inner Glass Layer */}
    <div className="relative h-full bg-[#0a0a0f] backdrop-blur-2xl rounded-[1.4rem] p-6 sm:p-8 border border-white/5 group-hover:bg-[#11111a]/80 transition-colors duration-500">
      
      {/* Icon Area */}
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 bg-gradient-to-br ${gradient} p-[1px]`}>
        <div className="w-full h-full bg-[#0a0a0f] rounded-[0.9rem] flex items-center justify-center">
          <Icon className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>

      <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-2">
        {category}
      </p>
      <h3 className="text-2xl font-bold text-white mb-6 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
        {title}
      </h3>
      
      <div className="space-y-3">
        {workflows.map((flow, index) => (
          <div key={index} className="flex items-center text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
            <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient} mr-3`}></span>
            {flow}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- FAQ Component ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl bg-[#0a0a0f] backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-violet-500/30">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
      >
        <span className="text-lg font-semibold text-white tracking-tight">{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-400 leading-relaxed text-sm md:text-base border-t border-white/5 pt-4">{answer}</p>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const workflowsRef = useRef(null);
  const workflowsVisible = useOnScreen(workflowsRef);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const handleMouseMove = (e) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 40, 
        y: (e.clientY / window.innerHeight - 0.5) * 40 
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const workflows = [
    {
      title: "Calendar AI",
      category: "Productivity",
      workflows: ["Create & Schedule Events", "Update & Move Meetings", "Delete Appointments", "Fetch Daily Schedule"],
      gradient: "from-violet-500 to-fuchsia-600",
      icon: CalendarIcon,
    },
    {
      title: "Curation AI",
      category: "Research",
      workflows: ["Find Topic Resources", "Create YouTube Playlists", "Add to Existing Playlist", "Summarize Video Content"],
      gradient: "from-rose-500 to-orange-600",
      icon: YoutubeIcon,
    },
    {
      title: "Data AI",
      category: "Management",
      workflows: ["Export Links to Sheets", "Create New Spreadsheets", "Append Data to Sheet", "Format & Organize Data"],
      gradient: "from-emerald-400 to-cyan-500",
      icon: SheetIcon,
    },
    {
      title: "Document AI",
      category: "Content",
      workflows: ["Generate PDF from Notes", "Summarize Web Articles", "Format Meeting Minutes", "Export Text as Document"],
      gradient: "from-blue-500 to-indigo-600",
      icon: FileTextIcon,
    },
  ];

  const integrations = [
    { name: "Calendar", icon: CalendarIcon, color: "text-blue-400" },
    { name: "YouTube", icon: YoutubeIcon, color: "text-red-500" },
    { name: "Sheets", icon: SheetIcon, color: "text-emerald-400" },
  ];

  const faqs = [
    {
      question: "What is Lumo exactly?",
      answer: "Lumo is an advanced personal AI operator that connects to your standard tools like Google Workspace to perform tasks autonomously. Instead of clicking through tabs, you just tell Lumo what you need done in plain English."
    },
    {
      question: "Is my data securely handled?",
      answer: "Absolutely. Lumo operates using strict Google OAuth2 protocols. Your authentication tokens are stored securely, and we never train our AI models on your personal emails or sensitive calendar data."
    },
    {
      question: "Do I need to learn complex prompt engineering?",
      answer: "No. Lumo is built with a natural conversational engine. You speak or type exactly as you would to a human assistant, and Lumo parses the intent and constructs the necessary API workflows."
    },
    {
      question: "Which apps are supported in the current beta?",
      answer: "Lumo currently boasts deep integrations with Google Calendar, Google Sheets, Gmail, and YouTube. We are actively developing plugins for Slack, Notion, and Discord."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-slate-300 font-sans selection:bg-violet-500/30 overflow-hidden relative">
      
      {/* Background Ambient Glows */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      {/* Header */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-4 bg-[#050508]/70 backdrop-blur-xl md:backdrop-blur-2xl border-b border-white/5" : "py-6 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow duration-500">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              Lumo
            </span>
          </div>
          <button
            onClick={() => window.location.href = "https://lumo-1-pw6m.onrender.com/api/auth"}
            className="relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-transform active:scale-95"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#050508] px-6 py-1 text-sm font-semibold text-white backdrop-blur-3xl hover:bg-[#11111a] transition-colors">
              Request Access
            </span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-ping absolute"></span>
            <span className="relative flex h-2 w-2 rounded-full bg-violet-500"></span>
            <span className="text-sm font-medium text-slate-300">Lumo AI Engine 1.0 is Live</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight mb-8">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 pb-2">
              Your Personal
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 pb-2 drop-shadow-sm">
              AI Operator
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-16 px-4">
            Delegate your digital existence in plain language. Lumo connects directly to your workspace apps, autonomously executing complex workflows at the speed of thought.
          </p>

          <div className="px-4">
            <AnimatedTerminal />
          </div>
        </div>
      </main>

      {/* App Integration Dock */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <div className="flex items-center space-x-4 md:space-x-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-5 shadow-2xl shadow-black/50">
            <span className="text-sm font-semibold text-white/50 uppercase tracking-widest mr-4 hidden md:block">Seamlessly Integrates With</span>
            {integrations.map((app, i) => (
              <div key={i} className="group flex flex-col items-center relative">
                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-white/10 ${app.color} shadow-lg`}>
                  <app.icon className="w-6 h-6" />
                </div>
                {/* Tooltip */}
                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-bold text-white bg-black/80 px-3 py-1 rounded-md">
                  {app.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Interface Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative inline-flex justify-center items-center mb-8">
            <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 rounded-full"></div>
            <div className="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
               <Mic className="w-12 h-12 text-violet-300 drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Zero friction workflow.</h2>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            Just hit record and speak naturally. Lumo's powerful agentic architecture interprets intent, connects necessary systems, and reports back instantly.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={workflowsRef} className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Autonomous capabilities.
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl font-medium">
              Discover the out-of-the-box superpowers Lumo brings to your daily routine.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {workflows.map((wf, index) => (
              <WorkflowCard key={index} {...wf} isVisible={workflowsVisible} delay={index * 150} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#050508] to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              How Lumo Works
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
              Three simple steps to put your digital tasks on autopilot.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[45%] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0 z-0"></div>
            
            {[
              { step: "01", title: "Connect Apps", desc: "Securely link your Google Workspace via strict OAuth2 protocols." },
              { step: "02", title: "Provide Intent", desc: "Speak or type your goal in natural language using the Lumo Terminal." },
              { step: "03", title: "Autonomous Execution", desc: "Lumo builds the workflow, executes the API calls, and confirms success." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center p-8 bg-[#0a0a0f]/50 backdrop-blur-xl border border-white/5 rounded-3xl group hover:bg-[#11111a]/80 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-fuchsia-400">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-400 font-medium">
              Everything you need to know about setting up and using your AI operator.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight mb-8">
            Ready to upgrade?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium mb-12">
            Join the beta and experience true agentic automation.
          </p>
          <button className="bg-white text-black font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:bg-slate-200 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Start automating
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-16 pb-8 relative z-10 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3 opacity-50 hover:opacity-100 transition-opacity">
            <SparklesIcon className="w-5 h-5 text-white" />
            <span className="text-xl font-bold text-white tracking-tight">Lumo</span>
          </div>
          <p className="text-sm font-medium text-slate-500">
            &copy; {new Date().getFullYear()} Lumo AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
