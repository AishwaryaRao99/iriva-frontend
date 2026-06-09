// src/components/ProductSection.jsx

import { useState } from "react";
import ProductCard from "./ProductCard";
import AlertMessage from "./AlertMessage";
import DismissibleAlert from "./DismissibleAlert";
import { getAllProducts } from "../services/searchService";
import { formatError } from "../utils/errorUtils";

/**
 * Product Section
 * Props:
 * - title
 * - products (array)
 * - onViewAll (function) optional callback invoked after fetching all products
 * - onProductInteraction (function) callback for product card interaction events
 * - onViewDetails (function) callback invoked when a product card is clicked
 */

export default function ProductSection({ title, products = [], onViewAll, onProductInteraction, onViewDetails }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState(""); // "connectivity" or "product_not_found"
  const [expandedProducts, setExpandedProducts] = useState(null);

  const handleViewAll = async () => {
    setLoading(true);
    setErrorMessage("");
    setErrorType("");

    try {
      const allProducts = await getAllProducts();

      // Expand this section inline with the full product list
      setExpandedProducts(Array.isArray(allProducts) ? allProducts : []);

      // Keep parent informed (existing behavior)
      if (typeof onViewAll === "function") {
        onViewAll(allProducts);
      }
    } catch (error) {
      const formatted = formatError(error);
      setErrorMessage(formatted.message);
      setErrorType(formatted.connectivity ? "connectivity" : "product_not_found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        {onViewAll ? (
          <button
            className="text-green-600 text-xs sm:text-sm disabled:text-gray-400"
            onClick={handleViewAll}
            disabled={loading}
            type="button"
          >
            {loading ? "Loading..." : "View all →"}
          </button>
        ) : null}
      </div>

      {errorMessage && errorType === "connectivity" ? (
        <div className="mb-6">
          <DismissibleAlert type="error" title="Connection Error" message={errorMessage} onDismiss={() => setErrorMessage("")} />
        </div>
      ) : errorMessage ? (
        <div className="mb-6">
          <AlertMessage type="error" title="Error" message={errorMessage} />
        </div>
      ) : null}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {(expandedProducts ?? products).map((product) => (
          <ProductCard key={product.name ?? product.id} {...product} onInteraction={onProductInteraction} onViewDetails={onViewDetails} />
        ))}
      </div>
    </section>
  );
}