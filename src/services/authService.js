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
    throw new Error(message || `Request failed with status ${response.status}`);
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

export const register = async ({ fullName, email, password }) => {
  validateAuthInputs(email, password);

  return sendRequest("register", {
    ...DEFAULT_FETCH_OPTIONS,
    method: "POST",
    body: JSON.stringify({
      fullName,
      email,
      password,
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
