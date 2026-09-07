/**
 * Search Service
 * Handles API calls for searching and fetching product data.
 */
const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080/transparency-portal"}/api/v1/productsapi`;
const SEARCH_ENDPOINT = `${API_BASE_URL}/paginated/search`;
const SEARCH_BRAND_ENDPOINT = `${API_BASE_URL}/paginated/search-brand`;
const ALL_PRODUCTS_ENDPOINT = `${API_BASE_URL}/paginated/all`;
const CATEGORY_PRODUCTS_ENDPOINT = `${API_BASE_URL}/paginated/by-category`;
const CATEGORIES_ENDPOINT = `${API_BASE_URL}/categories`;
const TIMEOUT_DURATION_MS = 10000;
const DEFAULT_FETCH_OPTIONS = {
  credentials: "include",
  mode: "cors",
};

const DEFAULT_PAGE_REQUEST = {
  page: 0,
  size: 10,
  sortBy: "productName",
  sortDirection: "ASC",
};

const buildPageQuery = ({
  page = DEFAULT_PAGE_REQUEST.page,
  size = DEFAULT_PAGE_REQUEST.size,
  sortBy = DEFAULT_PAGE_REQUEST.sortBy,
  sortDirection = DEFAULT_PAGE_REQUEST.sortDirection,
} = {}) =>
  `page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}&sortBy=${encodeURIComponent(sortBy)}&sortDirection=${encodeURIComponent(sortDirection)}`;

const normalizePageResponse = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && Array.isArray(response.content)) {
    return response.content;
  }

  if (response && Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

const parseErrorResponse = async (response) => {
  const text = await response.text().catch(() => "");
  if (!text) return "";

  try {
    const body = JSON.parse(text);

    if (typeof body === "string") {
      return body;
    }

    if (body?.message) {
      return body.message;
    }

    if (Array.isArray(body?.errors)) {
      return body.errors
        .map((errorItem) => {
          if (typeof errorItem === "string") return errorItem;
          if (errorItem?.defaultMessage) return errorItem.defaultMessage;
          if (errorItem?.message) return errorItem.message;
          if (errorItem?.field) {
            return `${errorItem.field}: ${errorItem.defaultMessage || errorItem.message || JSON.stringify(errorItem)}`;
          }
          return JSON.stringify(errorItem);
        })
        .join("; ");
    }

    if (body?.error) {
      if (typeof body.error === "string") return body.error;
      if (Array.isArray(body.error)) return body.error.join("; ");
    }

    const values = Object.values(body).flatMap((value) =>
      Array.isArray(value) ? value : [value]
    );
    return values.filter(Boolean).join("; ") || text;
  } catch {
    return text;
  }
};

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
      ...DEFAULT_FETCH_OPTIONS,
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const fallbackText = await parseErrorResponse(response);

      // Handle PRD_001 error code (product not found)
      if (response.status === 404 && fallbackText.includes("PRD_001")) {
        const error = new Error("Product not found");
        error.errorCode = "PRD_001";
        throw error;
      }

      const message = fallbackText || `Server error ${response.status}: ${response.statusText}`;
      const error = new Error(message);
      error.status = response.status;
      error.raw = fallbackText;
      throw error;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${TIMEOUT_DURATION_MS / 1000} seconds.`);
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to server. Please check your internet connection or try again later."
      );
    }

    throw error;
  }
};

export const searchProducts = async (query, pageRequest = {}) => {
  if (!query || query.trim() === "") {
    throw new Error("Search query cannot be empty.");
  }

  const response = await fetchJson(
    `${SEARCH_ENDPOINT}?name=${encodeURIComponent(query)}&${buildPageQuery(pageRequest)}`,
    {
      method: "GET",
    }
  );

  return normalizePageResponse(response);
};

export const searchProductsByBrand = async (brand, pageRequest = {}) => {
  if (!brand || `${brand}`.trim() === "") {
    throw new Error("Brand is required to search products by brand.");
  }

  const response = await fetchJson(
    `${SEARCH_BRAND_ENDPOINT}?brand=${encodeURIComponent(brand)}&${buildPageQuery(pageRequest)}`,
    {
      method: "GET",
    }
  );

  return normalizePageResponse(response);
};

export const getAllProducts = async (pageRequest = {}) => {
  const response = await fetchJson(`${ALL_PRODUCTS_ENDPOINT}?${buildPageQuery(pageRequest)}`, {
    method: "GET",
  });

  return normalizePageResponse(response);
};

export const getProductsByCategory = async (category, pageRequest = {}) => {
  if (!category || `${category}`.trim() === "") {
    throw new Error("Category is required to fetch products.");
  }

  const response = await fetchJson(
    `${CATEGORY_PRODUCTS_ENDPOINT}?category=${encodeURIComponent(category)}&${buildPageQuery(pageRequest)}`,
    {
      method: "GET",
    }
  );

  return normalizePageResponse(response);
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

export const getProductReviews = async (productId) => {
  if (!productId || `${productId}`.trim() === "") {
    throw new Error("Product id is required to fetch product reviews.");
  }

  const response = await fetchJson(`${API_BASE_URL}/${encodeURIComponent(productId)}/reviews`, {
    method: "GET",
  });

  return Array.isArray(response) ? response : [];
};

export const getReviewTags = async (productId) => {
  if (!productId || `${productId}`.trim() === "") {
    throw new Error("Product id is required to fetch review tags.");
  }

  const response = await fetchJson(`${API_BASE_URL}/${encodeURIComponent(productId)}/review-tags`, {
    method: "GET",
  });

  const tags = Array.isArray(response) ? response : response?.tags || response?.data || [];
  return tags
    .map((tag) => (typeof tag === "string" ? tag : tag?.name || tag?.label || tag?.tag))
    .filter(Boolean);
};

export default {
  searchProducts,
  searchProductsByBrand,
  getAllProducts,
  getProductsByCategory,
  getCategories,
  getProductById,
  getProductReviews,
  getReviewTags,
};
