// src/components/ProductCard.jsx

import { useState } from "react";
import { getProductById } from "../services/searchService";

/**
 * Product Card Component
 * Props:
 * - id
 * - name
 * - score
 * - image
 */
export default function ProductCard({ id, name, score, image }) {
  const [loading, setLoading] = useState(false);

  const getScoreColor = () => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const handleCardClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const product = await getProductById(id);
      console.log("Fetched product by id:", product);
    } catch (error) {
      console.error("Failed to fetch product by id:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCardClick}
      disabled={loading}
      aria-label={`View details for ${name}`}
      className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition text-left w-full disabled:cursor-not-allowed"
    >
      {/* Product Image */}
      <img src={image} className="rounded-lg mb-3" alt={name} />

      {/* Product Name */}
      <h3 className="font-medium">{name}</h3>

      {/* Transparency Score */}
      <div className={`mt-2 text-sm inline-block px-2 py-1 rounded ${getScoreColor()}`}>
        {score}% Transparent
      </div>
    </button>
  );
}