/**
 * Search Service
 * Handles API calls for searching and fetching product data.
 */
const API_BASE_URL = "http://localhost:8080/transparency-portal/api/v1/productsapi";
const SEARCH_ENDPOINT = `${API_BASE_URL}/search`;
const ALL_PRODUCTS_ENDPOINT = `${API_BASE_URL}/get-all-products`;
const CATEGORY_PRODUCTS_ENDPOINT = `${API_BASE_URL}/by-category`;
const CATEGORIES_ENDPOINT = `${API_BASE_URL}/categories`;
const TIMEOUT_DURATION_MS = 10000;

/**
 * Perform a JSON fetch request with timeout handling.
 * @param {string} endpoint - URL to request.
 * @param {RequestInit} [options] - Fetch configuration.
 * @returns {Promise<any>} - Parsed JSON response.
 */
const fetchJson = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION_MS);

  try {
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
      mode: "cors",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const fallbackText = await response.text().catch(() => "");
      
      // Handle PRD_001 error code (product not found)
      if (response.status === 404 && fallbackText.includes("PRD_001")) {
        const error = new Error("Product not found");
        error.errorCode = "PRD_001";
        throw error;
      }
      
      const message = `Server error ${response.status}: ${response.statusText}`;
      throw new Error(fallbackText ? `${message} - ${fallbackText}` : message);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${TIMEOUT_DURATION_MS / 1000} seconds.`);
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to backend. Ensure the server is running on http://localhost:8080."
      );
    }

    throw error;
  }
};

export const searchProducts = async (query) => {
  if (!query || query.trim() === "") {
    throw new Error("Search query cannot be empty.");
  }

  return await fetchJson(`${SEARCH_ENDPOINT}?name=${encodeURIComponent(query)}`, {
    method: "GET",
  });
};

export const getAllProducts = async () => {
  return await fetchJson(ALL_PRODUCTS_ENDPOINT, {
    method: "GET",
  });
};

export const getProductsByCategory = async (category) => {
  if (!category || `${category}`.trim() === "") {
    throw new Error("Category is required to fetch products.");
  }

  return await fetchJson(
    `${CATEGORY_PRODUCTS_ENDPOINT}?category=${encodeURIComponent(category)}`,
    {
      method: "GET",
    }
  );
};

export const getCategories = async () => {
  const response = await fetchJson(CATEGORIES_ENDPOINT, {
    method: "GET",
  });

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.categories)) {
    return response.categories;
  }

  return [];
};

export const getProductById = async (productId) => {
  if (!productId || `${productId}`.trim() === "") {
    throw new Error("Product id is required to fetch the product details.");
  }

  return await fetchJson(`${API_BASE_URL}/${encodeURIComponent(productId)}`, {
    method: "GET",
  });
};

export default {
  searchProducts,
  getAllProducts,
  getProductsByCategory,
  getCategories,
  getProductById,
};
