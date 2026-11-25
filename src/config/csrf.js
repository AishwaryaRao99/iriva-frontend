const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080/transparency-portal"
).replace(/\/$/, "");

// Store CSRF token in memory
let cachedCsrfToken = null;
let csrfTokenPromise = null;

export const getCsrfToken = async () => {
  // Reuse the existing token if available
  if (cachedCsrfToken) {
    return cachedCsrfToken;
  }

  // Prevent multiple simultaneous CSRF requests
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  csrfTokenPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/csrf`, {
        method: "GET",
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Unable to retrieve CSRF token.");
      }

      const csrfData = await response.json();

      if (!csrfData?.token) {
        throw new Error("CSRF token missing from server response.");
      }

      cachedCsrfToken = csrfData.token;

      return cachedCsrfToken;
    } catch (error) {
      cachedCsrfToken = null;
      throw error;
    } finally {
      csrfTokenPromise = null;
    }
  })();

  return csrfTokenPromise;
};

// Clear cached token after authentication changes
export const clearCsrfToken = () => {
  cachedCsrfToken = null;
  csrfTokenPromise = null;
};
