import ProductCard from "../components/ProductCard";

export default function Saved({ products = [], loading = false, error = "", onViewDetails }) {
  return (
    <section className="px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Saved Products</h1>
        {loading ? (
          <p className="text-sm text-gray-600 mb-6">Loading saved products...</p>
        ) : error ? (
          <p className="text-sm text-red-600 mb-6">{error.message || error}</p>
        ) : (
          <p className="text-sm text-gray-600 mb-6">{(products?.length ?? 0)} products saved</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id || p.name} className="relative">
              <div className="absolute right-3 top-3 z-10">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.828a4 4 0 010-5.657z" />
                  </svg>
                </div>
              </div>

              <ProductCard
                id={p.id}
                productName={p.productName || p.name}
                description={p.description}
                descriptionMaxLength={120}
                imageUrl={p.imageUrl || p.image}
                transparencyScore={p.transparencyScore ?? p.transparency}
                onViewDetails={onViewDetails}
                onInteraction={() => {}}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
