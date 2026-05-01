// src/components/ProductSection.jsx

import ProductCard from "./ProductCard";

/**
 * Product Section
 * Props:
 * - title
 * - products (array)
 */

export default function ProductSection({ title, products = [] }) {
  return (
    <section className="px-10 py-10">
      
      {/* Section Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button className="text-green-600 text-sm">View all →</button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  );
}