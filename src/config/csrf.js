const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080/transparency-portal"}`;

export const getCsrfToken = async () => {
  // Ensure the CSRF cookie has been issued
  const response = await fetch(`${API_BASE_URL}/csrf`, {
    method: "GET",
    credentials: "include",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Unable to retrieve CSRF token.");
  }

  const csrfCookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("XSRF-TOKEN="));

  if (!csrfCookie) {
    throw new Error("CSRF cookie not found.");
  }

  return decodeURIComponent(csrfCookie.substring("XSRF-TOKEN=".length));
};