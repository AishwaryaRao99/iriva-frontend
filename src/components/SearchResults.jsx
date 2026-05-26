import { useState, useMemo, useEffect } from "react";
import ProductCard from "./ProductCard";
import AlertMessage from "./AlertMessage";
import DismissibleAlert from "./DismissibleAlert";

const filterGroups = [
  {
    title: "Filters",
    items: [
      { label: "Vegan", id: "vegan" },
      { label: "Cruelty-Free", id: "cruelty_free" },
      { label: "No Harmful Ingredients", id: "no_harmful" },
    ],
  },
  {
    title: "Risk Level",
    items: [
      { label: "All Products", id: "all" },
      { label: "Low Risk", id: "low_risk" },
      { label: "Medium Risk", id: "medium_risk" },
      { label: "High Risk", id: "high_risk" },
    ],
  },
];

/**
 * Search Results Section
 * Props:
 * - title
 * - results
 * - loading
 * - error
 */
export default function SearchResults({ title, results = [], loading = false, error = "", onProductInteraction }) {
  const [activeFilters, setActiveFilters] = useState(["all"]);
  const [dismissedError, setDismissedError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Reset dismissedError when error changes (e.g., when navigating to a different category)
  useEffect(() => {
    setDismissedError(false);
  }, [error]);

  const errorType = useMemo(() => {
    if (!error) return null;
    
    // Check for connectivity/timeout errors
    if (error.includes('timeout') || error.includes('Cannot connect') || error.includes('TypeError')) {
      return 'connectivity';
    }
    
    return 'not_found';
  }, [error]);

  const isSearchPage = title.toLowerCase().startsWith('search results for');

  const toggleFilter = (id) => {
    setActiveFilters((current) =>
      current.includes(id) ? current.filter((filterId) => filterId !== id) : [...current, id]
    );
  };

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 bg-gray-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {loading
              ? "Loading products..."
              : `${results.length} product${results.length === 1 ? "" : "s"} found`}
          </p>
        </div>

        {/* Filter icon: show when there are products (mobile/tablet toggles the filter panel). On desktop the filter panel remains visible. */}
        {results.length > 0 && (
          <div className="flex items-center xl:hidden">
            <button
              type="button"
              aria-label="Toggle filters"
              onClick={() => setShowFilters((s) => !s)}
              className="ml-0 sm:ml-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 01.8 1.6L12 11.586V16a1 1 0 01-1.447.894L7 15.118V11.586L3.2 5.6A1 1 0 013 5z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,25%)_minmax(0,75%)] gap-8">
        {/* Only render filters when there are products. On small screens the panel is toggled via `showFilters`. On xl and up the panel is always visible. */}
        {results.length > 0 && (
          <aside className={`${showFilters ? 'block' : 'hidden'} xl:block rounded-3xl border border-gray-200 bg-white p-6 shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">Filters</p>
              <h2 className="text-xl font-semibold mt-2">Refine results</h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveFilters(["all"])}
              className="text-sm text-green-600 hover:text-green-800"
            >
              Clear all
            </button>
          </div>

          {filterGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{group.title}</h3>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 cursor-pointer text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(item.id)}
                      onChange={() => toggleFilter(item.id)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-gray-200 bg-green-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-green-700">Tip</p>
            <p className="mt-2 text-sm text-green-900">
              Use filters to narrow the product list by transparency and risk level.
            </p>
          </div>
          </aside>
        )}

        <main>
          {error && !dismissedError && errorType === 'connectivity' ? (
            <DismissibleAlert type="error" title="Connection Error" message={error} onDismiss={() => setDismissedError(true)} />
          ) : loading ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              Loading results...
            </div>
          ) : (
            <>
              {results.length === 0 ? (
                <AlertMessage
                  type="info"
                  title={isSearchPage ? "Product Not Found" : "No products found"}
                  message="Try another search term or category to see available products."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.map((product) => (
                    <ProductCard key={product.id ?? product.name} {...product} onInteraction={onProductInteraction} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </section>
  );
}
