// src/components/CategoryCard.jsx

/**
 * Category Card
 * Props:
 * - name
 * - icon
 */
export default function CategoryCard({ name, icon }) {
  return (
    <div className="bg-gray-100 p-6 rounded-xl text-center cursor-pointer hover:shadow">
      <div className="text-3xl">{icon}</div>
      <p className="mt-2 font-medium">{name}</p>
    </div>
  );
}