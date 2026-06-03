import { useState, useCallback } from "react";

/**
 * Navbar Component
 * Props:
 * - onHome (function)
 * - categories (array)
 * - onCategorySelect (function)
 * - isProductDetails (boolean) - hide Home/Categories when viewing product details
 * - onSearch (function) - callback when search is performed
 */
export default function Navbar({ onHome, categories = [], onCategorySelect, isProductDetails = false, onSearch }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchClick = useCallback(async () => {
    if (!searchQuery.trim() || !onSearch) return;

    setSearchLoading(true);
    try {
      await onSearch(searchQuery);
    } finally {
      setSearchLoading(false);
      setSearchQuery("");
    }
  }, [onSearch, searchQuery]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchClick();
      }
    },
    [handleSearchClick]
  );

  return (
    <nav className="sticky top-0 z-40 flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 border-b bg-white shadow-sm">
      <button
        type="button"
        onClick={onHome}
        className="text-green-600 font-bold text-lg focus:outline-none hover:opacity-80 transition"
        aria-label="TruthLabel Home"
      >
        🌿 TruthLabel
      </button>

      <div className="flex gap-4 sm:gap-6 text-gray-700 items-center flex-1 justify-center lg:justify-start ml-6">
        {/* Always show Home and Categories so they're available on product pages too */}
        <>
          <button
            type="button"
            onClick={onHome}
            className="text-sm font-medium hover:text-green-600 focus:outline-none transition hidden sm:block"
          >
            Home
          </button>

          {categories.length > 0 && (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((open) => !open)}
                className="text-sm font-medium hover:text-green-600 focus:outline-none transition"
                aria-expanded={isDropdownOpen}
              >
                Categories
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg z-50">
                  <div className="flex flex-col">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onCategorySelect?.(category.name);
                        }}
                        className="text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none transition"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      </div>

      {/* Search bar */}
      {onSearch && (
        <div className="flex gap-2 ml-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={searchLoading}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            aria-label="Search products"
          />
          <button
            type="button"
            onClick={handleSearchClick}
            disabled={searchLoading || !searchQuery.trim()}
            className="p-2 text-gray-600 hover:text-green-600 focus:outline-none transition disabled:opacity-50"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Profile icon */}
      <button
        type="button"
        className="ml-4 p-2 text-gray-600 hover:text-green-600 focus:outline-none transition"
        aria-label="Profile"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </button>
    </nav>
  );
}
