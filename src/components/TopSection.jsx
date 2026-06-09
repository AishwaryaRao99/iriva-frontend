// src/components/TopSection.jsx

import { useCallback, useState, useEffect } from 'react';
import { searchProducts } from '../services/searchService';
import AlertMessage from './AlertMessage';
import DismissibleAlert from './DismissibleAlert';
import { formatError } from '../utils/errorUtils';

/**
 * Top Section Component
 * Props:
 * - title
 * - subtitle
 * - onSearch (optional) - Called with search results from backend
 */
export default function TopSection({ title, subtitle, onSearch, clearSearchSignal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResultCount, setSearchResultCount] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searchErrorType, setSearchErrorType] = useState(''); // "connectivity" or "not_found"

  useEffect(() => {
    if (clearSearchSignal === undefined) return;

    setSearchQuery('');
    setSearchError('');
    setSearchErrorType('');
    setSearchResultCount(null);
  }, [clearSearchSignal]);

  const handleSearchClick = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a search query.');
      setSearchErrorType('search');
      return;
    }

    setIsLoading(true);
    setSearchError('');
    setSearchErrorType('');
    setSearchResultCount(null);

    try {
      const results = await searchProducts(searchQuery);
      setSearchResultCount(results?.length ?? 0);

      if (onSearch) {
        onSearch(searchQuery, results);
      }
    } catch (error) {
      const formatted = formatError(error);
      const errorMessage = formatted.message || 'An unexpected error occurred during search.';
      
      // Check for connectivity/timeout errors
      if (formatted.connectivity) {
        setSearchErrorType('connectivity');
        setSearchError(errorMessage);
      } else if (error?.errorCode === 'PRD_001' || (error?.message || '').includes('Product not found')) {
        // For product not found errors, navigate to SearchResults with empty results
        // so SearchResults can display the "Product Not Found" info message
        if (onSearch) {
          onSearch(searchQuery, []);
        }
      } else {
        // For other errors, show error in TopSection
        setSearchErrorType('error');
        setSearchError(errorMessage);
      }
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
    <section className="bg-blue-50 text-center py-12 sm:py-16 px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{title}</h1>

      <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-xl mx-auto">{subtitle}</p>

      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-0">
        <input
          type="text"
          placeholder="Search for any product..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="border px-4 py-2 rounded-l-lg sm:w-96 w-full disabled:opacity-50 disabled:cursor-not-allowed"
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

      {searchError && searchErrorType === 'connectivity' ? (
        <DismissibleAlert type="error" title="Connection Error" message={searchError} onDismiss={() => setSearchError('')} />
      ) : searchError && searchErrorType === 'error' ? (
        <div className="mt-4 max-w-xl mx-auto">
          <AlertMessage type="error" title="Search Error" message={searchError} />
        </div>
      ) : searchResultCount !== null ? (
        <p className="text-xs sm:text-sm text-gray-600 mt-4">
          {searchResultCount > 0
            ? `${searchResultCount} result${searchResultCount === 1 ? '' : 's'} found`
            : 'No results found.'}
        </p>
      ) : null}
    </section>
  );
}
