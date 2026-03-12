"use client";

import { PRODUCTS } from "@/store/useStore";
import ProductCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";
import { motion } from "framer-motion";

const SOCIALS = [
  { label: "Discord",  emoji: "💬", href: "https://discord.gg/rxKA9JRS", color: "#5865F2", bg: "from-indigo-600 to-indigo-800" },
  { label: "YouTube",  emoji: "▶️", href: "#",                            color: "#FF0000", bg: "from-red-600 to-red-800"    },
  { label: "Telegram", emoji: "✈️", href: "#",                            color: "#29B6F6", bg: "from-sky-500 to-sky-700"    },
  { label: "TikTok",   emoji: "🎵", href: "#",                            color: "#ffffff", bg: "from-slate-700 to-slate-900" },
];

export default function ProductGrid() {
  return (
    <section id="shop" className="py-20 px-4" style={{ background: "#05080f" }}>
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}
          >
            ✦ Привилегии
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Магазин доната
          </h2>
          <p className="text-lg max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
            Выбери привилегию и улучши свой игровой опыт на сервере CultBox
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-20">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px mb-14" style={{ background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent)" }} />

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
            Наши сообщества
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SOCIALS.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`bg-gradient-to-br ${s.bg} rounded-2xl p-5 flex items-center gap-3 font-bold`}
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: `0 8px 30px rgba(0,0,0,0.3)`,
              }}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-white">{s.label}</span>
            </motion.a>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.2)" }}>
            CultBox не связан с Mojang AB. Все средства идут на развитие проекта.<br />
            После оплаты донат выдаётся автоматически в течение 1–2 минут.
          </p>
        </motion.div>

      </div>

      <CheckoutModal />
    </section>
  );
}
