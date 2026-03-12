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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Green header */}
        <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 15 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
          >
            <motion.svg
              width="40" height="40" viewBox="0 0 24 24"
              fill="none" stroke="#22C55E" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <motion.polyline
                points="20 6 9 17 4 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </motion.svg>
          </motion.div>
          <h1 className="text-3xl font-black text-white">Оплата успешна!</h1>
          <p className="text-green-100 mt-1">Спасибо за покупку</p>
        </div>

        <div className="p-6">
          {selectedProduct && selectedTier && nick && (
            <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedProduct.gradient} flex items-center justify-center text-3xl flex-shrink-0`}>
                  {selectedProduct.iconEmoji}
                </div>
                <div>
                  <p className="font-black text-slate-800" style={{ color: selectedProduct.nameColor }}>
                    {selectedProduct.name}
                  </p>
                  <p className="text-sm text-slate-500">для игрока <span className="text-green-600 font-bold">{nick}</span></p>
                </div>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
                <span className="text-slate-500">Срок: <span className="font-bold text-slate-700">{selectedTier.label}</span></span>
                <span className="font-black text-green-600">{selectedTier.price} ₴</span>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex gap-3">
            <span className="text-xl flex-shrink-0">⏰</span>
            <div>
              <p className="font-bold text-amber-800 text-sm">Время выдачи</p>
              <p className="text-amber-700 text-sm">Донат будет выдан в течение <strong>1–2 минут</strong> после подтверждения платежа.</p>
            </div>
          </div>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-base transition-colors shadow-md"
            >
              ← Вернуться в магазин
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
