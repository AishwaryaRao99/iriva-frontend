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
export default function SearchResults({ title, results = [], loading = false, error = "", onProductInteraction, onViewDetails }) {
  const [activeFilters, setActiveFilters] = useState(["all"]);
  const [dismissedError, setDismissedError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Reset dismissedError when error changes (e.g., when navigating to a different category)
  useEffect(() => {
    setDismissedError(false);
  }, [error]);

  const errorMessage = typeof error === "string" ? error : error?.message || "";
  const errorType = useMemo(() => {
    if (!errorMessage) return null;
    if (error?.connectivity) return "connectivity";

    const raw = typeof error === "string" ? error : error?.raw || errorMessage;
    if (raw && (raw.toLowerCase().includes('timeout') || raw.toLowerCase().includes('cannot connect') || raw.toLowerCase().includes('typeerror'))) {
      return 'connectivity';
    }
    if (raw && /product not found|not found/i.test(raw)) {
      return 'not_found';
    }
    return 'error';
  }, [error, errorMessage]);

  const isSearchPage = title && typeof title === 'string' && title.toLowerCase().startsWith('search results for');

  // Helper: normalize transparency score to percent (0-100)
  const transparencyPercent = (product) => {
    const raw = product?.transparencyScore ?? product?.transparency ?? 0;
    const n = typeof raw === 'number' ? raw : Number(raw) || 0;
    return n <= 10 ? Math.round(n * 10) : Math.round(n);
  };

  const hasEthicalFlag = (product, flag) => {
    const summary = Array.isArray(product?.ethicalSummary) ? product.ethicalSummary : [];
    const descriptionText = typeof product?.description === 'string' ? product.description : '';
    const normalized = [
      summary.map((s) => (typeof s === 'string' ? s : s?.title || s?.description || '')).join(' '),
      descriptionText,
    ]
      .join(' ')
      .toLowerCase();

    if (flag === 'vegan') return normalized.includes('vegan')|| normalized.includes('plant-based')|| normalized.includes('100% natural')|| normalized.includes('Plant-derived');
    if (flag === 'cruelty_free') return normalized.includes('no animal testing') || normalized.includes('cruelty-free');
    if (flag === 'no_harmful') return normalized.includes('harmful') && !normalized.includes('toxic');
    return false;
  };

  const filteredResults = useMemo(() => {
    if (!Array.isArray(results)) return [];
    if (!activeFilters || activeFilters.length === 0) return results;
    if (activeFilters.includes('all')) return results;

    const riskFilters = activeFilters.filter((id) => id === 'low_risk' || id === 'medium_risk' || id === 'high_risk');
    const ethicalFilters = activeFilters.filter((id) => id === 'vegan' || id === 'cruelty_free' || id === 'no_harmful');

    return results.filter((product) => {
      // Ethical filters: all selected ethical filters must be satisfied (AND)
      for (const f of ethicalFilters) {
        if (!hasEthicalFlag(product, f)) return false;
      }

      // Risk filters: if none selected, accept; if any selected, product matches if it satisfies any of them (OR)
      if (riskFilters.length > 0) {
        const pct = transparencyPercent(product);
        const matches = riskFilters.some((rf) => {
          if (rf === 'low_risk') return pct >= 70;
          if (rf === 'medium_risk') return pct >= 40 && pct < 70;
          if (rf === 'high_risk') return pct < 40;
          return false;
        });
        if (!matches) return false;
      }

      return true;
    });
  }, [results, activeFilters]);

  const toggleFilter = (id) => {
    setActiveFilters((current) => {
      // If toggling the 'all' filter, reset to only 'all'
      if (id === 'all') return ['all'];

      // If 'all' is currently selected and user chooses a specific filter, remove 'all'
      const withoutAll = current.filter((c) => c !== 'all');

      if (withoutAll.includes(id)) {
        // Unselecting the filter
        const next = withoutAll.filter((c) => c !== id);
        return next.length > 0 ? next : ['all'];
      }

      // Selecting a new specific filter
      return [...withoutAll, id];
    });
  };

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 bg-gray-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {loading
              ? "Loading products..."
              : `${filteredResults.length} product${filteredResults.length === 1 ? "" : "s"} found`}
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
          {errorMessage && !dismissedError ? (
            errorType === 'connectivity' ? (
              <DismissibleAlert type="error" title="Connection Error" message={errorMessage} onDismiss={() => setDismissedError(true)} />
            ) : (
              <AlertMessage type="error" title="Error" message={errorMessage} />
            )
          ) : loading ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              Loading results...
            </div>
          ) : (
            <>
                {filteredResults.length === 0 ? (
                  <AlertMessage
                    type="info"
                    title={isSearchPage ? "Product Not Found" : "No products found"}
                    message="Try another search term or category to see available products."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredResults.map((product) => (
                      <ProductCard key={product.id ?? product.name} {...product} onInteraction={onProductInteraction} onViewDetails={onViewDetails} />
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
