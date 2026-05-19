// src/components/ProductSection.jsx

import { useState } from "react";
import ProductCard from "./ProductCard";
import { getAllProducts } from "../services/searchService";

/**
 * Product Section
 * Props:
 * - title
 * - products (array)
 * - onViewAll (function) optional callback invoked after fetching all products
 */

export default function ProductSection({ title, products = [], onViewAll }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleViewAll = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const allProducts = await getAllProducts();

      if (typeof onViewAll === "function") {
        onViewAll(allProducts);
      }
    } catch (error) {
      setErrorMessage(error?.message || "Unable to fetch products. Please try again.");
      console.error("Failed to load all products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-10 py-10">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          className="text-green-600 text-sm disabled:text-gray-400"
          onClick={handleViewAll}
          disabled={loading}
          type="button"
        >
          {loading ? "Loading..." : "View all →"}
        </button>
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  );
}