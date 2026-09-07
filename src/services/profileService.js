const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/transparency-portal"}/api/v1/profile`;

const request = async (endpoint = "", options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const text = await response.text();
  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    const error = new Error(body?.message || body?.error || body || response.statusText);
    error.status = response.status;
    throw error;
  }

  return body;
};

export const getProfile = () => request();
export const getReviews = () => request("/reviews");
export const getSavedProducts = () => request("/saved-products");
export const getSavedProductStatus = (productId) =>
  request(`/saved-products/${encodeURIComponent(productId)}`);

export const saveProduct = (productId) =>
  request(`/saved-products/${encodeURIComponent(productId)}`, { method: "POST" });

export const removeSavedProduct = (productId) =>
  request(`/saved-products/${encodeURIComponent(productId)}`, { method: "DELETE" });

export const addReview = (productId, review) =>
  request(`/reviews/${encodeURIComponent(productId)}`, {
    method: "POST",
    body: JSON.stringify(review),
  });

export const updateReview = (reviewId, review) =>
  request(`/reviews/${encodeURIComponent(reviewId)}`, {
    method: "PUT",
    body: JSON.stringify(review),
  });

export const deleteReview = (reviewId) =>
  request(`/reviews/${encodeURIComponent(reviewId)}`, { method: "DELETE" });

export default {
  getProfile,
  getReviews,
  getSavedProducts,
  getSavedProductStatus,
  saveProduct,
  removeSavedProduct,
  addReview,
  updateReview,
  deleteReview,
};