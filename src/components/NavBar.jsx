// src/components/Navbar.jsx

import { useState, useCallback } from 'react';
import { searchProducts } from '../services/searchService';

/**
 * Navbar Component
 * Reusable top navigation bar with search functionality
 * Props:
 * - onSearch: function (optional) - Called with search results
 */
export default function Navbar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle search button click
   * Calls backend API and provides user feedback
   */
  const handleSearchClick = useCallback(async () => {
    // Validate query
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    setIsLoading(true);

    try {
      const results = await searchProducts(searchQuery);
      
      // Call parent callback with results
      if (onSearch) {
        onSearch(results);
      }
      
      alert(`Found ${results?.length || 0} results for "${searchQuery}"`);
    } catch (error) {
      // Display error message to user
      const errorMessage = error.message || 'An unexpected error occurred during search';
      alert(`Search failed: ${errorMessage}`);
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, onSearch]);

  /**
   * Handle Enter key press in search input
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchClick();
    }
  }, [handleSearchClick]);

  /**
   * Handle search input change
   */
  const handleInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b bg-white">
      
      {/* Logo / Brand */}
      <div className="text-green-600 font-bold text-lg cursor-pointer">
        🌿 TruthLabel
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6 text-gray-700">
        <a href="#">Home</a>
        <a href="#">Categories</a>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <input id="search-input"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="border rounded-lg px-3 py-1 w-64 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        <button
          type="button"
          onClick={handleSearchClick}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-1 rounded-lg font-medium transition-colors duration-200"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </nav>
  );
}