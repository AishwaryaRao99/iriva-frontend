// src/pages/Home.jsx

import { useState } from "react";
import Navbar from "../components/NavBar";
import Hero from "../components/TopSection";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import ProductCard from "../components/ProductCard";
import SearchResults from "../components/SearchResults";
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
  {
    id: 1,
    productName: "Organic Face Serum",
    description: "Naturally derived formula for healthy skin",
    imageUrl: "https://images.unsplash.com/photo-1618480066690-8457ab2b766e?w=400",
    ethicalScore: 8.9,
    transparencyScore: 9.5,
    category: "SKINCARE",
  },
  {
    id: 2,
    productName: "Natural Moisturizer",
    description: "Lightweight hydration for daily use",
    imageUrl: "https://images.unsplash.com/photo-1616986953793-2e6159b78580?w=400",
    ethicalScore: 8.2,
    transparencyScore: 8.8,
    category: "SKINCARE",
  },
  {
    id: 3,
    productName: "Vitamin C Cream",
    description: "Brightening cream with antioxidant support",
    imageUrl: "https://images.unsplash.com/photo-1616986953793-2e6159b78580?w=400",
    ethicalScore: 8.7,
    transparencyScore: 9.2,
    category: "SKINCARE",
  },
  {
    id: 4,
    productName: "Hydrating Toner",
    description: "Refreshing toner for softer skin",
    imageUrl: "https://images.unsplash.com/photo-1643379850623-7eb6442cd262?w=400",
    ethicalScore: 7.4,
    transparencyScore: 7.8,
    category: "SKINCARE",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [hasLoadedAllProducts, setHasLoadedAllProducts] = useState(false);

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setSearchTitle(`${category} Products`);
    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const productsFromBackend = await getProductsByCategory(category);
      setSearchResults(Array.isArray(productsFromBackend) ? productsFromBackend : []);
    } catch (error) {
      setSearchError(error?.message || "Unable to fetch category products.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchResults = (query, products) => {
    setSelectedCategory("");
    setSearchTitle(`Search results for “${query}”`);
    setSearchError("");
    setSearchResults(Array.isArray(products) ? products : []);
  };

  const handleAllProductsLoaded = (products) => {
    setHasLoadedAllProducts(true);
    setAllProducts(Array.isArray(products) ? products : []);
  };

  const handleResetHome = () => {
    setSelectedCategory("");
    setSearchTitle("");
    setSearchResults([]);
    setSearchError("");
    setSearchLoading(false);
  };

  return (
    <div>
      <Navbar
        onHome={handleResetHome}
        categories={categories}
        onCategorySelect={handleCategorySelect}
      />

      <Hero
        title="Know what's inside your products"
        subtitle="Discover transparency scores and ingredient breakdowns"
        onSearch={handleSearchResults}
      />

      {searchTitle && (
        <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 bg-white border-b border-gray-200">
          <button
            type="button"
            onClick={handleResetHome}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm sm:text-base focus:outline-none"
          >
            <span className="text-lg">←</span>
            Back to Home
          </button>
        </div>
      )}

      {!searchTitle ? (
        <>
          <CategorySection
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

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
            <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">All Products</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {allProducts.length > 0 ? (
                  allProducts.map((product) => (
                    <ProductCard key={product.id ?? product.name} {...product} />
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No products were returned from the backend.</p>
                )}
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <SearchResults
          title={searchTitle}
          results={searchResults}
          loading={searchLoading}
          error={searchError}
        />
      )}

      <Footer />
    </div>
  );
}