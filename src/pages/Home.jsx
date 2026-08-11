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
import { formatError } from "../utils/errorUtils";

export default function Home({ onLogout }) {
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

  const STORAGE_KEY = "iriva-frontend-state";

  const clearSearchInput = () => {
    setSearchError("");
    setSearchClearSignal((prev) => prev + 1);
  };

  const isBackendUnavailable = (messageOrObj) => {
    const raw = typeof messageOrObj === "string" ? messageOrObj : messageOrObj?.raw || messageOrObj?.message || "";
    return /(Cannot connect to backend|Request timed out|Failed to fetch|NetworkError)/i.test(raw);
  };

  const backendAvailable = !isBackendUnavailable(homeError);
  const showHomeHero = !searchTitle && backendAvailable && !homeLoading && !detailsLoading;

  useEffect(() => {
    try {
      const persisted = sessionStorage.getItem(STORAGE_KEY);
      if (!persisted) return;
      const parsed = JSON.parse(persisted);

      if (parsed?.selectedProduct) setSelectedProduct(parsed.selectedProduct);
      if (parsed?.searchTitle) setSearchTitle(parsed.searchTitle);
      if (parsed?.selectedCategory) setSelectedCategory(parsed.selectedCategory);
      if (Array.isArray(parsed?.searchResults)) setSearchResults(parsed.searchResults);
      if (typeof parsed?.hasLoadedAllProducts === "boolean") setHasLoadedAllProducts(parsed.hasLoadedAllProducts);
      if (Array.isArray(parsed?.allProducts)) setAllProducts(parsed.allProducts);
    } catch (error) {
      console.warn("Unable to restore persisted state:", error);
    }
  }, []);

  // After restoring persisted state, if there is a selected category but no search results,
  // attempt to fetch the category products so refreshing the page preserves the view.
  useEffect(() => {
    if (!selectedCategory) return;
    if (Array.isArray(searchResults) && searchResults.length > 0) return;

    // Fetch category products if needed
    (async () => {
      try {
        setSearchLoading(true);
        const productsFromBackend = await getProductsByCategory(selectedCategory);
        setSearchResults(Array.isArray(productsFromBackend) ? productsFromBackend : []);
        setSearchTitle(`${selectedCategory} Products`);
      } catch (err) {
        setSearchError(formatError(err));
      } finally {
        setSearchLoading(false);
      }
    })();
  }, [selectedCategory]);

  useEffect(() => {
    try {
      const payload = {
        selectedProduct,
        searchTitle,
        selectedCategory,
        searchResults,
        allProducts,
        hasLoadedAllProducts,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn("Unable to persist state:", error);
    }
  }, [selectedProduct, searchTitle, selectedCategory, searchResults, allProducts, hasLoadedAllProducts]);

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

        // Choose up to 4 random products for trending and recently reviewed views
        const sample = (arr, n) => {
          const copy = Array.isArray(arr) ? [...arr] : [];
          for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
          }
          return copy.slice(0, n);
        };

        setTrendingProducts(sample(loadedProducts, 4));
        setRecentProducts(sample(loadedProducts, 4));
      } catch (error) {
        setHomeError(formatError(error));
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
      setDetailsError(formatError(error));
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
      setSearchError(formatError(error));
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
      setSearchError(formatError(error));
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
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onHome={handleResetHome}
        categories={categories}
        onCategorySelect={handleCategorySelect}
        isProductDetails={!!selectedProduct}
        onSearch={backendAvailable ? handleSearchResults : undefined}
        onLogout={onLogout}
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
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-base sm:text-lg focus:outline-none"
          >
            <span className="text-xl">←</span>
            Back to Home
          </button>
        </div>
      )}

      {homeError && !searchTitle && backendAvailable && (
        <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-10">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            <p className="text-lg font-semibold">Unable to load home content</p>
            <p className="mt-3">{homeError?.message || String(homeError)}</p>
          </div>
        </section>
      )}

      {homeLoading ? (
        <section className="min-h-[70vh] flex items-center justify-center bg-white">
          <div className="flex flex-col items-center rounded-3xl bg-white/80 p-10 shadow-sm backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          </div>
        </section>
      ) : detailsLoading ? (
        <section className="min-h-[70vh] flex items-center justify-center bg-white">
          <div className="flex flex-col items-center rounded-3xl bg-white/80 p-10 shadow-sm backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          </div>
        </section>
      ) : detailsError ? (
        <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-10">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            <p className="text-lg font-semibold">Unable to load product details</p>
              <p className="mt-3">{detailsError?.message || String(detailsError)}</p>
          </div>
        </section>
      ) : !searchTitle && !backendAvailable ? (
        <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-16">
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-gray-700 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Iriva is temporarily offline</h2>
            <p className="text-base text-gray-600">
              Unable to connect to the server. Please check your internet connection or try again later. If the issue persists, contact <a href="mailto:aishwaryarao669@gmail.com" className="text-green-600 hover:underline">here</a>.
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