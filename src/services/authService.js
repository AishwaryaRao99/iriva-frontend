const AUTH_BASE_URL = "http://localhost:8080/transparency-portal/auth";
const GOOGLE_OAUTH_URL = "http://localhost:8080/transparency-portal/oauth2/authorization/google";

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
    const err = new Error(message || `Request failed with status ${response.status}`);
    // Attach parsed body and status for richer client-side handling
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
};

const sendRequest = async (endpoint, init = {}) => {
  const response = await fetch(`${AUTH_BASE_URL}/${endpoint}`, init);
  return handleResponse(response);
};

const validateAuthInputs = (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }
};

export const login = async (email, password) => {
  validateAuthInputs(email, password);

  return sendRequest("login", {
    ...DEFAULT_FETCH_OPTIONS,
    method: "POST",
    body: JSON.stringify({
      username: email,
      email,
      password,
    }),
  });
};

export const register = async ({ username, email, password, confirmPassword }) => {
  validateAuthInputs(email, password);

  return sendRequest("register", {
    ...DEFAULT_FETCH_OPTIONS,
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      confirmPassword,
    }),
  });
};

export const getGoogleAuthorizationUrl = () => GOOGLE_OAUTH_URL;

export const logout = async () => {
  return sendRequest("logout", {
    ...DEFAULT_FETCH_OPTIONS,
    method: "POST",
  });
};


export const getCurrentUser = async () => {
  return sendRequest("me", {
    ...DEFAULT_FETCH_OPTIONS,
    method: "GET",
  });
};