// src/pages/Home.jsx

import Navbar from "../components/NavBar";
import Hero from "../components/TopSection";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";

// Sample Data (later from backend)
const categories = [
  { name: "Food", icon: "🍎" },
  { name: "Skincare", icon: "✨" },
  { name: "Cleaning", icon: "🧼" },
  { name: "Fashion", icon: "👗" },
];

const products = [
  { name: "Organic Face Serum", score: 95, image: "https://images.unsplash.com/photo-1618480066690-8457ab2b766e?w=400" },
  { name: "Natural Moisturizer", score: 88, image: "https://images.unsplash.com/photo-1616986953793-2e6159b78580?w=400" },
  { name: "Vitamin C Cream", score: 92, image: "https://images.unsplash.com/photo-1616986953793-2e6159b78580?w=400" },
  { name: "Hydrating Toner", score: 78, image: "https://images.unsplash.com/photo-1643379850623-7eb6442cd262?w=400" },
];

export default function Home() {
  return (
    <div>
      <Navbar />

      <Hero
        title="Know what's inside your products"
        subtitle="Discover transparency scores and ingredient breakdowns"
      />

      <CategorySection categories={categories} />

      <ProductSection title="Trending Products" products={products} />

      <ProductSection title="Recently Reviewed" products={products} />

      <Footer />
    </div>
  );
}