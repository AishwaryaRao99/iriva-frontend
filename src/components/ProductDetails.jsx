import { useState } from "react";

const statusStyles = {
  Safe: "border-green-200 bg-green-50 text-green-900",
  Caution: "border-yellow-200 bg-yellow-50 text-yellow-900",
  Warning: "border-orange-200 bg-orange-50 text-orange-900",
  Harmful: "border-red-200 bg-red-50 text-red-900",
};

const defaultEthicalSummary = [
  {
    title: "No Animal Testing",
    description: "Certified cruelty-free by Leaping Bunny",
    icon: "❤️",
  },
  {
    title: "95% Vegan",
    description: "Contains trace amounts of beeswax",
    icon: "✓",
  },
  {
    title: "Low Risk Level",
    description: "Contains 1 ingredient flagged for caution",
    icon: "🛡️",
  },
  {
    title: "Contains Fragrance",
    description: "May cause irritation in sensitive individuals",
    icon: "⚠️",
  },
];

const defaultIngredients = [
  {
    name: "Aqua (Water)",
    status: "Safe",
    description: "Base ingredient",
  },
  {
    name: "Glycerin",
    status: "Safe",
    description: "Moisturizing agent",
  },
  {
    name: "Niacinamide",
    status: "Safe",
    description: "Vitamin B3, brightening",
  },
  {
    name: "Hyaluronic Acid",
    status: "Safe",
    description: "Hydration booster",
  },
  {
    name: "Parfum (Fragrance)",
    status: "Warning",
    description: "May cause allergic reactions",
  },
  {
    name: "Retinol",
    status: "Caution",
    description: "Powerful but can irritate sensitive skin",
  },
  {
    name: "Parabens",
    status: "Harmful",
    description: "Preservative with hormone-disrupting concerns",
  },
  {
    name: "Phenoxyethanol",
    status: "Caution",
    description: "Preservative, generally safe in low amounts",
  },
];

const formatScore = (score) => {
  const value = typeof score === "number" ? score : Number(score);
  if (Number.isNaN(value)) return "0";
  return value <= 10 ? Math.round(value * 10) : Math.round(value);
};

/**
 * ProductDetails Component
 * Displays detailed product information including ingredients and ethical summary
 * Props:
 * - product (object) - product data
 * - onClose (function) - callback to close the details view
 * - backLabel (string) - label for the back button
 */
export default function ProductDetails({ product, onClose, backLabel }) {
  const [activeTab, setActiveTab] = useState("ingredients");

  const scorePercent = formatScore(product?.transparencyScore ?? product?.transparency ?? 0);
  const title = product?.productName || product?.name || "Product Details";
  const description = product?.description || product?.summary || "A detailed view of the product's transparency and ingredient profile.";
  const category = product?.category || product?.categoryName || "Skincare";
  const ethicalScore = typeof product?.ethicalScore === "number" ? product.ethicalScore : product?.ethicalScore ?? null;

  const ethicalSummary = Array.isArray(product?.ethicalSummary)
    ? product.ethicalSummary
    : defaultEthicalSummary;

  const ingredientList = Array.isArray(product?.ingredients)
    ? product.ingredients
    : defaultIngredients;

  const tabs = [
    { id: "ingredients", label: "Ingredients" },
    { id: "transparency", label: "Transparency Analysis" },
    { id: "reviews", label: "Community Reviews" },
  ];

  return (
    <section className="bg-white min-h-screen">
      {/* Back Button */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 border-b border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-800 focus:outline-none transition"
          aria-label="Go back"
        >
          <span className="text-lg">←</span>
          {backLabel || "Back"}
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 bg-gray-50">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Column - Product Info */}
          <div>
            {/* Product Image */}
            <div className="rounded-2xl overflow-hidden bg-white shadow-sm mb-8">
              <img
                src={product?.imageUrl || "https://images.unsplash.com/photo-1618480066690-8457ab2b766e?w=800"}
                alt={title}
                className="w-full h-auto object-cover max-h-96"
                loading="lazy"
              />
            </div>

            {/* Transparency Score Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-green-500 bg-green-50 px-4 py-2 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-green-700">
                {scorePercent}% <span className="font-normal">Transparency Score</span>
              </span>
            </div>

            {/* Product Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">{category || "Product Category"}</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
              </div>
              <button
                type="button"
                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 focus:outline-none transition"
                aria-label="Add to favorites"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </button>
            </div>

            {/* Product Description */}
            <p className="text-gray-700 leading-relaxed mb-6 max-w-2xl">{description}</p>

            {/* Ethical Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ethical Summary</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {ethicalSummary.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap transition focus:outline-none ${
                      activeTab === tab.id
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 sm:p-8">
                {activeTab === "ingredients" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingredient Breakdown</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Review each ingredient to understand the product makeup and any risk details.
                    </p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {ingredientList.map((ingredient) => (
                        <div
                          key={ingredient.name}
                          className={`rounded-xl border-2 p-4 transition ${
                            statusStyles[ingredient.status] || statusStyles.Safe
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-gray-900">{ingredient.name}</p>
                              <span className="inline-block mt-2 px-2.5 py-1 text-xs font-semibold uppercase rounded-full bg-white/60">
                                {ingredient.status}
                              </span>
                            </div>
                          </div>
                          {ingredient.description && (
                            <p className="mt-3 text-sm text-gray-700">{ingredient.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "transparency" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparency Analysis</h3>
                    <p className="text-gray-600 text-sm">
                      Detailed transparency analysis coming soon. This section will include manufacturer information, certifications, and supply chain details.
                    </p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Reviews</h3>
                    <p className="text-gray-600 text-sm">
                      Community reviews coming soon. Share your experience and read what others think about this product.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Mobile: below, Desktop: sticky */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-green-600">Quick Info</p>
                  <h3 className="text-xl font-semibold text-gray-900 mt-1">Product Info</h3>
                </div>
                <div className="flex-shrink-0 rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
                  {scorePercent}%
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="font-semibold text-gray-900 text-sm">Product Category</p>
                  <p className="text-xs text-gray-600 mt-1">{category}</p>
                </div>

                {ethicalScore !== null && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900 text-sm">Ethical Score</p>
                    <p className="text-xs text-gray-600 mt-1">{ethicalScore}/10</p>
                  </div>
                )}

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="font-semibold text-gray-900 text-sm">Transparency</p>
                  <p className="text-xs text-gray-600 mt-1">{scorePercent}% transparent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
