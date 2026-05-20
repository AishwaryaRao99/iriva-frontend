// src/components/CategoryCard.jsx

/**
 * Category Card
 * Props:
 * - name
 * - icon
 */
export default function CategoryCard({ name, icon, selected = false, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(name)}
      className={`w-full rounded-xl border p-6 text-left transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 ${
        selected
          ? "border-green-500 bg-white shadow-lg"
          : "border-transparent bg-gray-100 hover:shadow"
      }`}
    >
      <div className="text-3xl">{icon}</div>
      <p className="mt-2 font-medium">{name}</p>
    </button>
  );
}