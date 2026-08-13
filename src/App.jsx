import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import {
  getCurrentUser,
  logout as logoutRequest,
} from "./services/authService.js";

const HOME_STATE_STORAGE_KEY = "iriva-frontend-state";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname;
    return path === "/login" ? "/login" : "/";
  });

  // Check authentication using the JWT cookie
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await getCurrentUser();

        // Backend confirmed that the JWT cookie is valid
        setIsAuthenticated(true);
      } catch (error) {
        // No valid JWT cookie / authentication failed
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuthentication();
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path === "/login" ? "/login" : "/");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Keep URL and authentication state synchronized
  useEffect(() => {
    if (authChecking) {
      return;
    }

    if (!isAuthenticated && currentPath !== "/login") {
      window.history.replaceState({}, "", "/login");
      setCurrentPath("/login");
    }

    if (isAuthenticated && currentPath === "/login") {
      window.history.replaceState({}, "", "/");
      setCurrentPath("/");
    }
  }, [isAuthenticated, currentPath, authChecking]);

  // Called after successful manual login
  const handleLoginSuccess = () => {
    sessionStorage.removeItem(HOME_STATE_STORAGE_KEY);

    setIsAuthenticated(true);

    // Move from /login to /
    window.history.replaceState({}, "", "/");
    setCurrentPath("/");
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.warn("Logout request failed:", error);
    }

    sessionStorage.removeItem(HOME_STATE_STORAGE_KEY);

    setIsAuthenticated(false);

    window.history.replaceState({}, "", "/login");
    setCurrentPath("/login");
  };

  // Don't render Login/Home until authentication check is complete
  if (authChecking) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Home onLogout={handleLogout} />;
}

export default App;