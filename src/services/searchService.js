/**
 * Search Service
 * Handles all API calls related to product search
 */

const API_BASE_URL = 'http://localhost:8080/transparency-portal/api/v1';
const SEARCH_ENDPOINT = `${API_BASE_URL}/productsapi/search`;

const TIMEOUT_DURATION = 10000; // 10 seconds timeout

/**
 * Create an AbortController with timeout
 * @param {number} timeoutMs - Timeout duration in milliseconds
 * @returns {AbortController} - Abort controller instance
 */
const createTimeoutController = (timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return { controller, timeoutId };
};

/**
 * Search for products from the backend
 * @param {string} query - Search query string
 * @returns {Promise<Object>} - Search results from backend
 * @throws {Error} - Throws error with descriptive message for various failure scenarios
 */
export const searchProducts = async (query) => {
  // Validate input
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }

  const { controller, timeoutId } = createTimeoutController(TIMEOUT_DURATION);

  try {
    const response = await fetch(`${SEARCH_ENDPOINT}?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    // Clear timeout after response is received
    clearTimeout(timeoutId);

    // Handle HTTP errors
    if (!response.ok) {
      const errorMessage = `Server error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Parse and return response data
    const data = await response.json();
    return data;
  } catch (error) {
    // Clear timeout in case of error
    clearTimeout(timeoutId);

    // Handle specific error scenarios
    if (error.name === 'AbortError') {
      throw new Error(
        `Request timeout after ${TIMEOUT_DURATION / 1000}s. The server is not responding. Please try again later.`
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        'Failed to connect to the server. Please check if the backend service is running on http://localhost:8080'
      );
    }

    // Re-throw or provide generic error message
    throw error;
  }
};

export default { searchProducts };
