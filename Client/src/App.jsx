import { useState, useEffect } from "react";
import { useAuthStore } from "./Zustand/useAuthstore.js";
import HomePage from "./Components/HomePage.jsx";
import { Loader } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import ChatPage from "./Pages/ChatPage.jsx";

export const App = () => {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkAuth();  
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader className="animate-spin w-10 h-10 text-violet-500" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={!isAuthenticated ? <HomePage /> : <ChatPage />}
      />
      <Route
        path="/chat"
        element={isAuthenticated ? <ChatPage /> : <HomePage />}
      />
    </Routes>
  );
};
