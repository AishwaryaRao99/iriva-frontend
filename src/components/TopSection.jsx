// src/components/TopSection.jsx

/**
 * Top Section Component
 * Props:
 * - title
 * - subtitle
 * - onSearch
 */
export default function TopSection({ title, subtitle, onSearch }) {
  return (
    <section className="bg-blue-50 text-center py-16 px-4">
      
      {/* Main Heading */}
      <h1 className="text-4xl font-bold mb-4">
        {title}
      </h1>

      {/* Subtext */}
      <p className="text-gray-600 mb-6 max-w-xl mx-auto">
        {subtitle}
      </p>

      {/* Search Bar */}
      <div className="flex justify-center">
        <input
          placeholder="Search for any product..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="border px-4 py-2 rounded-l-lg w-96"
        />
        <button className="bg-green-600 text-white px-6 rounded-r-lg">
          Search
        </button>
      </div>
    </section>
  );
}
