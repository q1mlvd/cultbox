"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { useEffect } from "react";

export default function SuccessPage() {
  const { nick, selectedProduct, selectedTier, setSelectedProduct, setSelectedTier, setPaymentMethod } = useStore();

  useEffect(() => {
    const t = setTimeout(() => {
      setSelectedProduct(null);
      setSelectedTier(null);
      setPaymentMethod(null);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #05080f 0%, #061a0f 50%, #050d1a 100%)" }}
    >
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(74,222,128,0.05) 0%, transparent 60%)" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 22 }}
        className="w-full max-w-md relative"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(74,222,128,0.2)",
            boxShadow: "0 0 80px rgba(74,222,128,0.1)",
          }}
        >
          {/* Header */}
          <div
            className="p-8 text-center"
            style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.05))", borderBottom: "1px solid rgba(74,222,128,0.1)" }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 14 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{
                background: "linear-gradient(135deg, #16a34a, #4ade80)",
                boxShadow: "0 0 40px rgba(74,222,128,0.5)",
              }}
            >
              <motion.svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <motion.polyline points="20 6 9 17 4 12" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.6 }} />
              </motion.svg>
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-1">Оплата успешна!</h1>
            <p style={{ color: "rgba(255,255,255,0.45)" }}>Спасибо за покупку в CultBox</p>
          </div>

          <div className="p-6">
            {selectedProduct && selectedTier && nick && (
              <div
                className="rounded-2xl p-4 mb-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${selectedProduct.nameColor}22, ${selectedProduct.nameColor}08)`, border: `1px solid ${selectedProduct.nameColor}33` }}
                  >
                    {selectedProduct.iconEmoji}
                  </div>
                  <div>
                    <p className="font-black text-base" style={{ color: selectedProduct.nameColor }}>{selectedProduct.name}</p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                      для игрока <span style={{ color: "#4ade80", fontWeight: 700 }}>{nick}</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Срок: <span className="text-white font-bold">{selectedTier.label}</span></span>
                  <span className="font-black text-lg" style={{ color: "#4ade80" }}>{selectedTier.price} ₴</span>
                </div>
              </div>
            )}

            <div
              className="rounded-2xl p-4 mb-6 flex gap-3"
              style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              <span className="text-xl flex-shrink-0">⏰</span>
              <div>
                <p className="font-bold text-sm text-yellow-400 mb-0.5">Время выдачи</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Донат будет выдан в течение <strong className="text-white">1–2 минут</strong> после подтверждения платежа.
                </p>
              </div>
            </div>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(74,222,128,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="shimmer-btn w-full py-4 rounded-2xl font-bold text-base text-white"
                style={{ boxShadow: "0 0 20px rgba(74,222,128,0.25)" }}
              >
                ← Вернуться в магазин
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
