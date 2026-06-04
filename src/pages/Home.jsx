// src/pages/Home.jsx

import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import Hero from "../components/TopSection";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";
import SearchResults from "../components/SearchResults";
import Footer from "../components/Footer";
import {
  getProductsByCategory,
  getProductById,
  searchProducts,
  getAllProducts,
  getCategories,
} from "../services/searchService";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchClearSignal, setSearchClearSignal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [hasLoadedAllProducts, setHasLoadedAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [homeError, setHomeError] = useState("");
  const [homeLoading, setHomeLoading] = useState(true);

  const clearSearchInput = () => {
    setSearchError("");
    setSearchClearSignal((prev) => prev + 1);
  };

  const isBackendUnavailable = (message) =>
    typeof message === "string" &&
    /(Cannot connect to backend|Request timed out|Failed to fetch|NetworkError)/i.test(message);

  const backendAvailable = !isBackendUnavailable(homeError);
  const showHomeHero = !searchTitle && backendAvailable && !homeLoading && !detailsLoading;

  const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

  const withMinimumLoading = async (task, minimumMs = 1000) => {
    const start = Date.now();
    try {
      return await task();
    } finally {
      const elapsed = Date.now() - start;
      if (elapsed < minimumMs) {
        await delay(minimumMs - elapsed);
      }
    }
  };

  useEffect(() => {
    const loadHomeData = async () => {
      setHomeError("");
      setHomeLoading(true);

      try {
        const [categoryData, productData] = await Promise.all([
          getCategories(),
          getAllProducts(),
        ]);

        const rawCategories = Array.isArray(categoryData)
          ? categoryData
          : Array.isArray(categoryData?.categories)
          ? categoryData.categories
          : [];

        const formattedCategories = rawCategories
          .map((item) => ({
            name:
              item?.category_value ||
              item?.category ||
              item?.name ||
              item?.value ||
              "",
            icon: item?.icon || item?.symbol || item?.emoji || "",
          }))
          .filter((item) => item.name);

        setCategories(formattedCategories);

        const loadedProducts = Array.isArray(productData) ? productData : [];
        setTrendingProducts(loadedProducts);
        setRecentProducts(loadedProducts);
      } catch (error) {
        setHomeError(error?.message || "Unable to load categories and products.");
      } finally {
        setHomeLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleProductSelect = async (product) => {
    setDetailsError("");
    setDetailsLoading(true);
    setSelectedProduct(null);

    try {
      const details = await withMinimumLoading(() => getProductById(product.id));
      setSelectedProduct({ ...product, ...details });
    } catch (error) {
      setDetailsError(error?.message || "Unable to load product details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseProductDetails = () => {
    setSelectedProduct(null);
    setDetailsError("");
    setDetailsLoading(false);
  };

  const handleCategorySelect = async (category) => {
    clearSearchInput();
    setSelectedCategory(category);
    setSearchTitle(`${category} Products`);
    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const productsFromBackend = await withMinimumLoading(() => getProductsByCategory(category));
      setSearchResults(Array.isArray(productsFromBackend) ? productsFromBackend : []);
    } catch (error) {
      setSearchError(error?.message || "Unable to fetch category products.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchResults = async (query, products) => {
    if (!query || !query.trim()) return;

    clearSearchInput();
    setSelectedCategory("");
    setSearchTitle(`Search results for “${query}”`);
    setSearchError("");
    setSelectedProduct(null);

    if (Array.isArray(products)) {
      setSearchResults(products);
      return;
    }

    setSearchLoading(true);
    setSearchResults([]);

    try {
      const fetchedResults = await searchProducts(query);
      setSearchResults(Array.isArray(fetchedResults) ? fetchedResults : []);
    } catch (error) {
      setSearchError(error?.message || "Unable to search for products.");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAllProductsLoaded = (products) => {
    setHasLoadedAllProducts(true);
    setAllProducts(Array.isArray(products) ? products : []);
  };

  const handleResetHome = () => {
    clearSearchInput();
    setSelectedCategory("");
    setSearchTitle("");
    setSearchResults([]);
    setSearchError("");
    setSearchLoading(false);
    setSelectedProduct(null);
    setDetailsError("");
    setDetailsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onHome={handleResetHome}
        categories={categories}
        onCategorySelect={handleCategorySelect}
        isProductDetails={!!selectedProduct}
        onSearch={backendAvailable ? handleSearchResults : undefined}
      />
      <main className="flex-grow p-2">
      {!selectedProduct ? (
        <div className="product-page-padding">
          {showHomeHero && (
            <Hero
              title="Know what's inside your products"
              subtitle="Discover transparency scores and ingredient breakdowns"
              onSearch={handleSearchResults}
              clearSearchSignal={searchClearSignal}
            />
          )}

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

      {homeError && !searchTitle && backendAvailable && (
        <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-10">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            <p className="text-lg font-semibold">Unable to load home content</p>
            <p className="mt-3">{homeError}</p>
          </div>
        </section>
      )}

      {homeLoading ? (
        <section className="min-h-[70vh] flex items-center justify-center bg-slate-100">
          <div className="flex flex-col items-center rounded-3xl bg-white/80 p-10 shadow-sm backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          </div>
        </section>
      ) : detailsLoading ? (
        <section className="min-h-[70vh] flex items-center justify-center bg-slate-100">
          <div className="flex flex-col items-center rounded-3xl bg-white/80 p-10 shadow-sm backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          </div>
        </section>
      ) : detailsError ? (
        <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-10">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            <p className="text-lg font-semibold">Unable to load product details</p>
            <p className="mt-3">{detailsError}</p>
          </div>
        </section>
      ) : !searchTitle && !backendAvailable ? (
        <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-16">
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">TruthLabel is temporarily offline</h2>
            <p className="text-base text-gray-600">
              The backend is not available right now, so product browsing and search are hidden. Please try again later.
            </p>
          </div>
        </section>
      ) : !searchTitle ? (
        <>
          <CategorySection
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          <ProductSection
            title="Trending Products"
            products={trendingProducts}
            onViewAll={handleAllProductsLoaded}
            onProductInteraction={clearSearchInput}
            onViewDetails={handleProductSelect}
          />

          <ProductSection
            title="Recently Reviewed"
            products={recentProducts}
            onViewAll={handleAllProductsLoaded}
            onProductInteraction={clearSearchInput}
            onViewDetails={handleProductSelect}
          />

          {hasLoadedAllProducts ? (
            <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">All Products</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {allProducts.length > 0 ? (
                  allProducts.map((product) => (
                    <ProductCard key={product.id ?? product.name} {...product} onInteraction={clearSearchInput} onViewDetails={handleProductSelect} />
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
          onProductInteraction={clearSearchInput}
          onViewDetails={handleProductSelect}
        />
      )}
        </div>
      ) : (
        <ProductDetails
          product={selectedProduct}
          onClose={handleCloseProductDetails}
          backLabel={searchTitle ? "Back to results" : "Back to Home"}
        />
      )}
      </main>

      <Footer />
    </div>
  );
}