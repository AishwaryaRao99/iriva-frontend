import { useState } from "react";

/**
 * Navbar Component
 * Props:
 * - onHome (function)
 * - categories (array)
 * - onCategorySelect (function)
 */
export default function Navbar({ onHome, categories = [], onCategorySelect }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="relative flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 border-b bg-white">
      
      <button
        type="button"
        onClick={onHome}
        className="text-green-600 font-bold text-lg focus:outline-none"
      >
        🌿 TruthLabel
      </button>

      <div className="flex gap-6 text-gray-700 items-center">
        <button
          type="button"
          onClick={onHome}
          className="text-sm font-medium hover:text-green-600 focus:outline-none"
        >
          Home
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((open) => !open)}
            className="text-sm font-medium hover:text-green-600 focus:outline-none"
            aria-expanded={isDropdownOpen}
          >
            Categories
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg z-20">
              <div className="flex flex-col">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onCategorySelect?.(category.name);
                    }}
                    className="text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </nav>
  );
}