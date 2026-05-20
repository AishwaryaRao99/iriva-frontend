// src/components/CategorySection.jsx

import CategoryCard from "./CategoryCard";

/**
 * Category Section
 * Props:
 * - categories (array)
 * - selectedCategory (string)
 * - onCategorySelect (function)
 */
export default function CategorySection({ categories = [], selectedCategory, onCategorySelect }) {
  return (
    <section className="px-10 py-10">
      <h2 className="text-xl font-semibold mb-6">
        Browse by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.name}
            name={cat.name}
            icon={cat.icon}
            selected={selectedCategory === cat.name}
            onSelect={onCategorySelect}
          />
        ))}
      </div>
    </section>
  );
}