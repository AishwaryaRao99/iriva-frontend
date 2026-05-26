// src/components/ProductCard.jsx

import { useState } from "react";
import { getProductById } from "../services/searchService";
import AlertMessage from "./AlertMessage";
import DismissibleAlert from "./DismissibleAlert";

/**
 * Product Card Component
 * Props:
 * - id
 * - productName
 * - description
 * - imageUrl
 * - transparencyScore
 * - ethicalScore
 */
export default function ProductCard({ id, productName, description, imageUrl, transparencyScore = 0, ethicalScore, onInteraction }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState(""); // "product_not_found" or "connectivity"

  const getScoreColor = () => {
    if (transparencyScore >= 8) return "bg-green-100 text-green-700";
    if (transparencyScore >= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const handleCardClick = async () => {
    onInteraction?.();
    if (loading) return;
    setLoading(true);
    setError("");
    setErrorType("");

    try {
      await getProductById(id);
    } catch (error) {
      // Check if it's a specific error type
      const errorMsg = error?.message || "";
      
      // Handle PRD_001 (product not found)
      if (error?.errorCode === "PRD_001") {
        setError("Product not found");
        setErrorType("product_not_found");
      }
      // Check for connectivity/timeout errors
      else if (errorMsg.includes("timeout") || errorMsg.includes("Cannot connect") || errorMsg.includes("TypeError")) {
        setError(errorMsg);
        setErrorType("connectivity");
      } else {
        setError(errorMsg);
        setErrorType("product_not_found"); // Default to product not found for other errors
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && errorType === "product_not_found" ? (
        <AlertMessage type="error" title="Product Not Found" message={error} />
      ) : error && errorType === "connectivity" ? (
        <DismissibleAlert type="error" title="Connection Error" message={error} onDismiss={() => setError("")} />
      ) : (
        <button
          type="button"
          onClick={handleCardClick}
          disabled={loading}
          aria-label={`View details for ${productName}`}
          className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition text-left w-full disabled:cursor-not-allowed"
        >
          {/* Product Image */}
          {imageUrl ? (
            <img src={imageUrl} className="rounded-lg mb-3 w-full object-cover h-48" alt={productName} />
          ) : (
            <div className="rounded-lg mb-3 h-48 bg-gray-100" />
          )}

          <h3 className="font-semibold text-gray-900">{productName}</h3>
          {description ? <p className="text-sm text-gray-500 mt-2">{description}</p> : null}

          <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${getScoreColor()}`}>
            {transparencyScore}% Transparent
          </div>

          {typeof ethicalScore === "number" ? (
            <p className="mt-2 text-xs text-gray-500">Ethical score: {ethicalScore}</p>
          ) : null}
        </button>
      )}
    </div>
  );
}