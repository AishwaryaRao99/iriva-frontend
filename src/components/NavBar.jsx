// src/components/Navbar.jsx

/**
 * Navbar Component
 * Reusable top navigation bar
 * Props:
 * - onSearch: function (optional)
 */
export default function Navbar({ onSearch }) {
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

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => onSearch && onSearch(e.target.value)}
        className="border rounded-lg px-3 py-1 w-64"
      />
    </nav>
  );
}