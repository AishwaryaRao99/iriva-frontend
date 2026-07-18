import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { logout as logoutRequest } from "./services/authService.js";

const HOME_STATE_STORAGE_KEY = "truthlabel-frontend-state";

function App() {
  const initialAuth = sessionStorage.getItem("truthlabel-authenticated") === "true";
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname;
    return path === "/login" ? "/login" : "/";
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path === "/login" ? "/login" : "/");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && currentPath !== "/login") {
      window.history.replaceState({}, "", "/login");
      setCurrentPath("/login");
    }

    if (isAuthenticated && currentPath === "/login") {
      window.history.replaceState({}, "", "/");
      setCurrentPath("/");
    }
  }, [isAuthenticated, currentPath]);

  const handleLoginSuccess = () => {
    sessionStorage.setItem("truthlabel-authenticated", "true");
    sessionStorage.removeItem(HOME_STATE_STORAGE_KEY);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.warn("Logout request failed:", error);
    }

    sessionStorage.removeItem("truthlabel-authenticated");
    sessionStorage.removeItem(HOME_STATE_STORAGE_KEY);
    setIsAuthenticated(false);
    window.history.replaceState({}, "", "/login");
    setCurrentPath("/login");
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Home onLogout={handleLogout} />;
}

export default App
