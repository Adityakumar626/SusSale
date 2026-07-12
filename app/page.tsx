import { Button } from "@/components/ui/button";
import { black, geist, sour } from "../font/font";
import { Rabbit, Shield, Bell, TrendingDown } from "lucide-react";
import AddProductForm from "@/components/AddProductForm";
import ThemeToggle from "@/components/themeBtn";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "./actions";
import ProductCard from "../components/ProductCard";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const products = user ? await getProducts() : [];

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-tl from-blue-200 via-blue-50 to-blue-100 dark:from-blue-950 dark:via-indigo-950 dark:to-blue-900 transition-colors duration-500">
      <header className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/10 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/70 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <span
              className={`text-2xl ${sour.className} dark:text-white transition-transform group-hover:scale-105 duration-200`}
            >
              <span className={`text-blue-500 font-bold ${geist.className}`}>
                Sus
              </span>
              Sale
            </span>
          </div>
          {/* Auth Button */}
          <AuthButton user={user} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs mb-6 hover:scale-105 transition-transform duration-100">
            <span>Sales Never Wait</span>
          </div>

          <h2
            className={`text-4xl md:text-6xl ${black.className} tracking-tight mb-4 text-gray-900 dark:text-blue-100`}
          >
            Never miss a price drop
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
            Track prices from any e-commerce site. Get instant alerts when
            prices drop. Save money effortlessly.
          </p>

          {/* Add product form wrapper */}
          <div className="transition-transform duration-300 hover:scale-[1.01]">
            <AddProductForm user={user} />
          </div>

          {/* Features Grid */}
          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group p-6 rounded-2xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto dark:bg-blue-900/60 bg-blue-100/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:rotate-6 transition-transform duration-300" />
                  </div>
                  <h3 className="font-semibold text-center text-lg text-gray-900 dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-300 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tracked Products Section */}
      {user && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Your Tracked Products
            </h3>
            <span className="text-sm px-3 py-1 rounded-full bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 items-start">
            {products.map((product) => (
              <div
                key={product.id}
                className="transition-transform duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State Section */}
      {user && products.length === 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
          <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl border-2 border-dashed border-gray-300/80 dark:border-gray-700 p-12 transition-all hover:border-blue-400 dark:hover:border-blue-500">
            <TrendingDown className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add your first product above to start tracking prices!
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
