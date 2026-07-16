const AUTH_BASE_URL = "http://localhost:8080/transparency-portal/auth";

const DEFAULT_FETCH_OPTIONS = {
  credentials: "include",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
};

const handleResponse = async (response) => {
  const text = await response.text().catch(() => "");
  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    const message = body?.message || body?.error || text || response.statusText;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return body;
};

export const login = async (identifier, password) => {
  if (!identifier || !password) {
    throw new Error("Email/Username and password are required.");
  }

  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    ...DEFAULT_FETCH_OPTIONS,
    method: "POST",
    body: JSON.stringify({
      username: identifier,
      email: identifier,
      password,
    }),
  });

  return handleResponse(response);
};

export const logout = async () => {
  const response = await fetch(`${AUTH_BASE_URL}/logout`, {
    ...DEFAULT_FETCH_OPTIONS,
    method: "POST",
  });

  return handleResponse(response);
};
