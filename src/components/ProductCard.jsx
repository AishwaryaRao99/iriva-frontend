// src/components/ProductCard.jsx

/**
 * Product Card Component
 * Props:
 * - id
 * - productName
 * - description
 * - imageUrl
 * - transparencyScore
 * - ethicalScore
 * - onInteraction
 * - onViewDetails
 */
export default function ProductCard({ id, productName, description, imageUrl, transparencyScore = 0, ethicalScore, onInteraction, onViewDetails }) {
  const getScoreColor = () => {
    if (transparencyScore >= 8) return "bg-green-100 text-green-700";
    if (transparencyScore >= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const handleCardClick = () => {
    onInteraction?.();
    onViewDetails?.({ id, productName, description, imageUrl, transparencyScore, ethicalScore });
  };

  return (
    <button
      type="button"
      onClick={handleCardClick}
      aria-label={`View details for ${productName}`}
      className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition text-left w-full"
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
  );
}
