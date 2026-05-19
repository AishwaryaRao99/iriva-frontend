// src/pages/Home.jsx

import { useState } from "react";
import Navbar from "../components/NavBar";
import Hero from "../components/TopSection";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

// Sample Data (later from backend)
const categories = [
  { name: "Food", icon: "🍎" },
  { name: "Skincare", icon: "✨" },
  { name: "Cleaning", icon: "🧼" },
  { name: "Fashion", icon: "👗" },
];

const products = [
  { id: "1", name: "Organic Face Serum", score: 95, image: "https://images.unsplash.com/photo-1618480066690-8457ab2b766e?w=400" },
  { id: "2", name: "Natural Moisturizer", score: 88, image: "https://images.unsplash.com/photo-1616986953793-2e6159b78580?w=400" },
  { id: "3", name: "Vitamin C Cream", score: 92, image: "https://images.unsplash.com/photo-1616986953793-2e6159b78580?w=400" },
  { id: "4", name: "Hydrating Toner", score: 78, image: "https://images.unsplash.com/photo-1643379850623-7eb6442cd262?w=400" },
];

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [hasLoadedAllProducts, setHasLoadedAllProducts] = useState(false);

  const handleAllProductsLoaded = (products) => {
    setHasLoadedAllProducts(true);
    setAllProducts(Array.isArray(products) ? products : []);
  };

  return (
    <div>
      <Navbar />

      <Hero
        title="Know what's inside your products"
        subtitle="Discover transparency scores and ingredient breakdowns"
      />

      <CategorySection categories={categories} />

      <ProductSection
        title="Trending Products"
        products={products}
        onViewAll={handleAllProductsLoaded}
      />

      <ProductSection
        title="Recently Reviewed"
        products={products}
        onViewAll={handleAllProductsLoaded}
      />

      {hasLoadedAllProducts ? (
        <section className="px-10 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Products</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
                <ProductCard key={product.name} {...product} />
              ))
            ) : (
              <p className="text-sm text-gray-600">No products were returned from the backend.</p>
            )}
          </div>
        </section>
      ) : null}

      <Footer />
    </div>
  );
}