import { getCsrfToken, clearCsrfToken } from "../config/csrf";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/transparency-portal";

const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

const GOOGLE_OAUTH_URL = `${API_BASE_URL}/oauth2/authorization/google`;

const DEFAULT_FETCH_OPTIONS = {
  credentials: "include",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
};

const toJson = async (response) => {
  const text = await response.text().catch(() => "");

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
};

const handleResponse = async (response) => {
  const body = await toJson(response);

  if (!response.ok) {
    const message = body?.message || body?.error || body || response.statusText;

    const err = new Error(
      message || `Request failed with status ${response.status}`,
    );

    err.status = response.status;
    err.body = body;

    throw err;
  }

  return body;
};

const sendRequest = async (endpoint, init = {}) => {
  const method = (init.method || "GET").toUpperCase();

  const headers = {
    ...DEFAULT_FETCH_OPTIONS.headers,
    ...init.headers,
  };

  // Attach CSRF token to state-changing requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = await getCsrfToken();
    headers["X-XSRF-TOKEN"] = csrfToken;
  }

  const response = await fetch(`${AUTH_BASE_URL}/${endpoint}`, {
    ...DEFAULT_FETCH_OPTIONS,
    ...init,
    headers,
  });

  return handleResponse(response);
};

const validateAuthInputs = (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }
};

// LOGIN
export const login = async (email, password) => {
  validateAuthInputs(email, password);

  const result = await sendRequest("login", {
    method: "POST",
    body: JSON.stringify({
      username: email,
      email,
      password,
    }),
  });

  // Login may clear the previous CSRF token
  clearCsrfToken();

  return result;
};

// REGISTER
export const register = async ({
  username,
  displayName,
  email,
  password,
  confirmPassword,
}) => {
  validateAuthInputs(email, password);

  return sendRequest("register", {
    method: "POST",
    body: JSON.stringify({
      username,
      displayName,
      email,
      password,
      confirmPassword,
    }),
  });
};

// GOOGLE OAUTH
export const getGoogleAuthorizationUrl = () => {
  return GOOGLE_OAUTH_URL;
};

// LOGOUT
export const logout = async () => {
  const result = await sendRequest("logout", {
    method: "POST",
  });

  // Clear cached CSRF token after successful logout
  clearCsrfToken();

  return result;
};

// CURRENT USER
export const getCurrentUser = async () => {
  return sendRequest("me", {
    method: "GET",
  });
};
