import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../Zustand/useAuthstore.js";
import { Send, LogOut, Bot, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const ChatPage = () => {
  const { isAuthenticated, user, logout, Agent } = useAuthStore();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${
        user?.name || "there"
      }! I'm Lumo, ready to help you delegate digital tasks. What would you like me to handle today? ✨`,
      sender: "bot",
      timestamp: Date.now(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    };

    scrollToBottom();
  }, [messages, isThinking]);

  // Prevent background flash when scrolling
  useEffect(() => {
    const handleScroll = () => {
      document.body.style.overflow = "hidden";
    };

    handleScroll();
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || isThinking) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = newMessage.trim();
    setNewMessage("");
    setIsThinking(true);

    try {
      const botResponseText = await Agent(currentInput);

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        timestamp: Date.now(),
      };

      if (botResponseText?.success === false && botResponseText?.message) {
        botMessage.text = `⚠️ ${botResponseText.message}`;
      } else if (typeof botResponseText === "string") {
        botMessage.text = botResponseText;
      } else if (botResponseText?.response) {
        botMessage.text = botResponseText.response;
      } else {
        botMessage.text =
          "I'm here to help! Could you please rephrase your request?";
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with AI:", error);

      let errorMsg = "Oops! Something went wrong. Please try again.";

      if (error?.response?.status === 429) {
        const waitTime =
          error?.response?.data?.message?.match(/\d+\.?\d*/)?.[0] || "a few";
        errorMsg = `Rate limit reached. Please try again after ${waitTime} seconds.`;
      } else if (error?.response?.status === 401) {
        errorMsg = "Authentication failed. Please log in again.";
      } else if (error?.response?.status === 400) {
        errorMsg = "Too many request wait do not refresh";
      } else if (error?.response?.status >= 500) {
        errorMsg = "Server error. Please try again later.";
      } else if (error?.message) {
        errorMsg = `Error: ${error.message}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: errorMsg,
          sender: "bot",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!user || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black via-slate-900 to-violet-900/20 text-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-violet-500/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg text-slate-300 animate-pulse">
            Loading Lumo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased bg-gradient-to-br from-black via-slate-900 to-violet-900/20 text-slate-300 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-slate-700/50 p-4 flex justify-between items-center z-20 shadow-lg shadow-black/20">
        <div className="flex items-center space-x-3">
         
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
              Lumo AI
            </h1>
            {user?.name && (
              <p className="text-sm text-slate-400">
                Welcome back, {user.name}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={logout}
          className="bg-slate-800/50 hover:bg-red-500/80 text-slate-300 hover:text-white p-3 rounded-xl transition-all duration-300 border border-slate-700/50 hover:border-red-400/50 backdrop-blur-sm"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Messages Container */}
      <main
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20 mt-1">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <div
              className={`max-w-md lg:max-w-2xl px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-br-none border border-violet-500/30"
                  : "bg-slate-800/50 text-slate-200 rounded-bl-none border border-slate-700/50"
              } transition-all duration-300 hover:shadow-xl hover:shadow-black/20`}
            >
              {msg.sender === "bot" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-3 last:mb-0 text-slate-200 leading-relaxed">
                          {children}
                        </p>
                      ),
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className="bg-slate-700/50 text-violet-300 px-2 py-1 rounded-lg text-sm font-mono border border-slate-600">
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-slate-900/80 p-4 rounded-xl overflow-x-auto shadow-inner border border-slate-700 my-3">
                            <code className="text-sm font-mono text-violet-200">
                              {children}
                            </code>
                          </pre>
                        ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-400 hover:text-violet-300 underline transition-colors duration-200"
                        >
                          {children}
                        </a>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside ml-4 mb-3 space-y-2">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside ml-4 mb-3 space-y-2">
                          {children}
                        </ol>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-violet-500 pl-4 italic text-slate-400 my-3 bg-slate-800/30 py-2 rounded-r-lg">
                          {children}
                        </blockquote>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-slate-300">{children}</em>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </p>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-slate-500/20 mt-1">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-700">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isThinking && (
          <div className="flex items-start gap-4 justify-start">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-md lg:max-w-2xl px-5 py-4 rounded-2xl shadow-lg bg-slate-800/50 text-slate-200 rounded-bl-none border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-pulse" />
                  <span
                    className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-pulse"
                    style={{ animationDelay: "200ms" }}
                  />
                  <span
                    className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-pulse"
                    style={{ animationDelay: "400ms" }}
                  />
                </div>
                <p className="text-sm text-slate-400 font-medium">
                  Lumo is thinking...
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-xl border-t border-slate-700/30 p-4 pt-6">
        <form
          onSubmit={handleSendMessage}
          className="relative container mx-auto max-w-4xl"
        >
          <div className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Delegate your digital tasks in plain English..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-6 pr-16 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-black/20"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isThinking}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 disabled:shadow-none"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
