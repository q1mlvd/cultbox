"use client";

import { motion } from "framer-motion";
import { Product, useStore } from "@/store/useStore";

interface Props {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: Props) {
  const { setSelectedProduct, setSelectedTier, setIsModalOpen } = useStore();

  const handleBuy = () => {
    setSelectedProduct(product);
    setSelectedTier(product.tiers[0]);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-2xl overflow-hidden shadow-lg flex flex-col"
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient}`} />
      <div className="absolute inset-0 bg-black/40" />

      {/* Popular badge */}
      {product.popular && (
        <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
          ⚡ ТОП
        </div>
      )}

      <div className="relative p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl drop-shadow-lg">{product.iconEmoji}</div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest font-medium">Привилегия</p>
            <h3 className="text-2xl font-black tracking-wide drop-shadow" style={{ color: product.nameColor }}>
              {product.name}
            </h3>
          </div>
        </div>

        {/* Commands */}
        <div className="mb-4">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">⌨ Команды</p>
          <ul className="space-y-1">
            {product.commands.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-white/40 flex-shrink-0">›</span>
                <span>
                  <span className="font-bold" style={{ color: product.nameColor }}>{c.cmd}</span>
                  {c.desc && <span className="text-white/60"> — {c.desc}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 mb-4" />

        {/* Price tiers */}
        <div className="mb-5">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">◈ Цены</p>
          <div className="space-y-1.5">
            {product.tiers.map((tier) => (
              <div key={tier.duration} className="flex items-center justify-between text-sm">
                <span className="text-white/70">{tier.label}</span>
                <span className="font-black" style={{ color: product.nameColor }}>{tier.price} ₴</span>
              </div>
            ))}
          </div>
        </div>

        {product.note && (
          <p className="text-xs text-white/40 italic mb-4 leading-relaxed">* {product.note}</p>
        )}

        {/* Buy button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBuy}
          className="w-full py-3 rounded-xl font-black text-sm text-slate-900 transition-all shadow-lg mt-auto"
          style={{
            background: "rgba(74,222,128,0.9)",
            boxShadow: "0 0 20px rgba(74,222,128,0.35)",
          }}
        >
          🛒 Купить
        </motion.button>
      </div>
    </motion.div>
  );
}
