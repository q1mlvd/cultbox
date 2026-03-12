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

  const minPrice = Math.min(...product.tiers.map((t) => t.price));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="card-hover relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Top color strip */}
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${product.gradient}`}
        style={{ opacity: 0.9 }}
      />

      {/* Popular badge */}
      {product.popular && (
        <div
          className="absolute top-5 right-4 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest"
          style={{
            background: "linear-gradient(135deg, #eab308, #f59e0b)",
            color: "#1c1917",
            boxShadow: "0 0 15px rgba(234,179,8,0.4)",
          }}
        >
          ⚡ ТОП
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${product.nameColor}22, ${product.nameColor}08)`,
              border: `1px solid ${product.nameColor}33`,
              boxShadow: `0 0 20px ${product.nameColor}15`,
            }}
          >
            {product.iconUrl
              ? <img src={product.iconUrl} alt={product.name} className="w-full h-full object-contain p-1 drop-shadow-lg" />
              : product.iconEmoji
            }
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Привилегия
            </p>
            <h3
              className="text-2xl font-black tracking-wide"
              style={{ color: product.nameColor, textShadow: `0 0 20px ${product.nameColor}55` }}
            >
              {product.name}
            </h3>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Commands */}
        <div className="mb-5 flex-1">
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
            ⌨ Команды
          </p>
          <ul className="space-y-2">
            {product.commands.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: `${product.nameColor}88` }}>›</span>
                <span>
                  <span className="font-bold" style={{ color: product.nameColor }}>{c.cmd}</span>
                  {c.desc && (
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}> — {c.desc}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Pricing tiers */}
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
            ◈ Цены
          </p>
          <div className="grid grid-cols-3 gap-2">
            {product.tiers.map((tier) => (
              <div
                key={tier.duration}
                className="rounded-xl p-2.5 text-center transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{tier.label}</p>
                <p className="font-black text-sm" style={{ color: product.nameColor }}>{tier.price} ₴</p>
              </div>
            ))}
          </div>
        </div>

        {product.note && (
          <p className="text-xs italic mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
            * {product.note}
          </p>
        )}

        {/* Buy button */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${product.nameColor}55` }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBuy}
          className="mt-auto w-full py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${product.nameColor}cc, ${product.nameColor}99)`,
            color: "#05080f",
            boxShadow: `0 4px 20px ${product.nameColor}33`,
          }}
        >
          🛒 Купить от {minPrice} ₴
        </motion.button>
      </div>
    </motion.div>
  );
}
