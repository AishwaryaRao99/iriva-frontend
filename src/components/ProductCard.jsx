// src/components/ProductCard.jsx

/**
 * Product Card Component
 * Props:
 * - name
 * - score
 * - image
 */
export default function ProductCard({ name, score, image }) {

  // Dynamic color based on score
  const getScoreColor = () => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition">
      
      {/* Product Image */}
      <img src={image} className="rounded-lg mb-3" alt={name} />

      {/* Product Name */}
      <h3 className="font-medium">{name}</h3>

      {/* Transparency Score */}
      <div className={`mt-2 text-sm inline-block px-2 py-1 rounded ${getScoreColor()}`}>
        {score}% Transparent
      </div>
    </div>
  );
}