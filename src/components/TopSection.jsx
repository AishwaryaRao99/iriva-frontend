// src/components/TopSection.jsx

import { useCallback, useState } from 'react';
import { searchProducts } from '../services/searchService';

/**
 * Top Section Component
 * Props:
 * - title
 * - subtitle
 * - onSearch (optional) - Called with search results from backend
 */
export default function TopSection({ title, subtitle, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResultCount, setSearchResultCount] = useState(null);

  const handleSearchClick = useCallback(async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    setIsLoading(true);

    try {
      const results = await searchProducts(searchQuery);
      setSearchResultCount(results?.length ?? 0);

      if (onSearch) {
        onSearch(results);
      }

      alert(`Found ${results?.length || 0} results for "${searchQuery}"`);
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred during search';
      alert(`Search failed: ${errorMessage}`);
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onSearch, searchQuery]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchClick();
      }
    },
    [handleSearchClick]
  );

  const handleInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <section className="bg-blue-50 text-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>

      <p className="text-gray-600 mb-6 max-w-xl mx-auto">{subtitle}</p>

      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search for any product..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="border px-4 py-2 rounded-l-lg w-96 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={handleSearchClick}
          disabled={isLoading}
          className="bg-green-600 text-white px-6 rounded-r-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {searchResultCount !== null && (
        <p className="text-sm text-gray-600 mt-4">
          {searchResultCount > 0
            ? `${searchResultCount} result${searchResultCount === 1 ? '' : 's'} found`
            : 'No results found.'}
        </p>
      )}
    </section>
  );
}
