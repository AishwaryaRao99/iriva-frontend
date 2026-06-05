// src/components/Footer.jsx

/**
 * Footer Component
 */
export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 mt-10">
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Brand */}
        <div>
          <h3 className="font-bold mb-2 text-sm sm:text-base">TruthLabel</h3>
          <p className="text-xs sm:text-sm text-gray-400">
            Making product transparency accessible to everyone.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="font-semibold text-sm sm:text-base">Product</h4>
          <p className="text-xs sm:text-sm text-gray-400">Features</p>
          <p className="text-xs sm:text-sm text-gray-400">Pricing</p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold text-sm sm:text-base">Company</h4>
          <p className="text-xs sm:text-sm text-gray-400">About</p>
          <p className="text-xs sm:text-sm text-gray-400">Blog</p>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-semibold text-sm sm:text-base">Support</h4>
          <p className="text-xs sm:text-sm text-gray-400">Contact</p>
          <p className="text-xs sm:text-sm text-gray-400">Privacy</p>
        </div>

      </div>

      <p className="text-center text-gray-500 mt-6 text-xs sm:text-sm">
        © 2026 TruthLabel
      </p>
    </footer>
  );
}