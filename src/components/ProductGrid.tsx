"use client";

import { PRODUCTS } from "@/store/useStore";
import ProductCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";
import { motion } from "framer-motion";

export default function ProductGrid() {
  return (
    <section id="shop" className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end gap-3 mb-6">
          <h2 className="text-2xl font-black text-slate-900">Привилегии</h2>
          <p className="text-slate-400 text-sm pb-0.5">Расширьте свои возможности на сервере</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mb-16">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Social links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Discord",  color: "from-indigo-500 to-indigo-700", emoji: "💬", href: "https://discord.gg/rxKA9JRS" },
            { label: "YouTube",  color: "from-red-500 to-red-700",       emoji: "▶️", href: "#" },
            { label: "Telegram", color: "from-blue-400 to-blue-600",     emoji: "✈️", href: "#" },
            { label: "TikTok",   color: "from-slate-700 to-slate-900",   emoji: "🎵", href: "#" },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`bg-gradient-to-r ${social.color} rounded-2xl p-5 flex items-center gap-3 text-white font-bold shadow-md hover:shadow-lg transition-shadow`}
            >
              <span className="text-2xl">{social.emoji}</span>
              <span>{social.label}</span>
            </motion.a>
          ))}
        </div>
      </div>

      <CheckoutModal />
    </section>
  );
}
