// src/pages/Home.jsx

import { useState } from "react";
import Navbar from "../components/NavBar";
import Hero from "../components/TopSection";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import ProductCard from "../components/ProductCard";
import AlertMessage from "../components/AlertMessage";
import Footer from "../components/Footer";
import { getProductsByCategory } from "../services/searchService";

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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [hasLoadedAllProducts, setHasLoadedAllProducts] = useState(false);

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setCategoryLoading(true);
    setCategoryError("");
    setCategoryProducts([]);

    try {
      const productsFromBackend = await getProductsByCategory(category);
      setCategoryProducts(Array.isArray(productsFromBackend) ? productsFromBackend : []);
    } catch (error) {
      setCategoryError(error?.message || "Unable to fetch category products.");
      console.error("Category fetch failed:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

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

      <CategorySection
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {selectedCategory ? (
        <section className="px-10 py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Products for “{selectedCategory}”</h2>
              <p className="text-sm text-gray-600">
                Click any category card to load the matching backend results.
              </p>
            </div>
            {categoryLoading ? (
              <span className="text-sm text-gray-500">Loading products…</span>
            ) : null}
          </div>

          {categoryError ? (
            <AlertMessage
              type="error"
              title="Category request failed"
              message={categoryError}
            />
          ) : (
            <AlertMessage
              type="success"
              title={`Showing ${categoryProducts.length} product${categoryProducts.length === 1 ? "" : "s"}`}
              message={categoryProducts.length > 0 ? `Products loaded from the selected ${selectedCategory} category.` : "No products were returned for this category yet."}
            />
          )}

          {!categoryLoading && categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id ?? product.name} {...product} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

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