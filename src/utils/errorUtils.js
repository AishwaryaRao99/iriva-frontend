// src/utils/errorUtils.js
export function formatError(err) {
  const raw = typeof err === "string" ? err : err?.message || "";

  const connectivityPatterns = /timeout|cannot connect|failed to fetch|networkerror|typeerror/i;
  const isConnectivity = connectivityPatterns.test(raw);

  const userMessage = isConnectivity
    ? "We're having trouble connecting to our servers. Please check your connection or try again later."
    : raw || "An unexpected error occurred. Please try again.";

  return {
    raw,
    message: userMessage,
    connectivity: isConnectivity,
  };
}
