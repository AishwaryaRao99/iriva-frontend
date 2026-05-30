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
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10">
      <h2 className="text-lg sm:text-xl font-semibold mb-6">
        Browse by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const displayName = cat?.name || cat?.category_value || cat?.category || cat?.value;
          const displayIcon = cat?.icon || cat?.symbol || cat?.emoji || "📦";

          return (
            <CategoryCard
              key={displayName}
              name={displayName}
              icon={displayIcon}
              selected={selectedCategory === displayName}
              onSelect={onCategorySelect}
            />
          );
        })}
      </div>
    </section>
  );
}