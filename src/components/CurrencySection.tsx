"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MIN = 10;
const MAX = 2000;
const RATE = 4; // 1 UAH = 4 kultiki

const BONUSES = [
  { threshold: 1000, percent: 25, label: "🔥 Бонус +25%" },
  { threshold: 500,  percent: 15, label: "⚡ Бонус +15%" },
  { threshold: 250,  percent: 10, label: "✨ Бонус +10%" },
  { threshold: 100,  percent: 5,  label: "🎁 Бонус +5%"  },
];

function getBonus(uah: number) {
  return BONUSES.find((b) => uah >= b.threshold) ?? null;
}

export default function CurrencySection() {
  const [amount, setAmount] = useState(100);

  const bonus = useMemo(() => getBonus(amount), [amount]);
  const baseKultiki = amount * RATE;
  const bonusKultiki = bonus ? Math.floor(baseKultiki * (bonus.percent / 100)) : 0;
  const totalKultiki = baseKultiki + bonusKultiki;

  const sliderPercent = ((amount - MIN) / (MAX - MIN)) * 100;

  return (
    <section className="py-20 px-4" style={{ background: "#07090f" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}
          >
            💰 Игровая валюта
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Покупка Культиков
          </h2>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.35)" }}>
            Тяни ползунок — выбери нужную сумму и получи валюту
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl p-6 sm:p-8"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(74,222,128,0.12)",
            boxShadow: "0 0 60px rgba(74,222,128,0.05)",
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center">

            {/* Coin icon */}
            <div className="flex-shrink-0">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
                style={{
                  background: "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.05))",
                  border: "1px solid rgba(74,222,128,0.2)",
                  boxShadow: "0 0 40px rgba(74,222,128,0.15)",
                }}
              >
                🪙
              </motion.div>
            </div>

            {/* Slider block */}
            <div className="flex-1 w-full">
              {/* Label row */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Количество гривен
                </p>
                <div className="flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    {bonus && (
                      <motion.span
                        key={bonus.label}
                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-xs font-black px-2.5 py-1 rounded-full"
                        style={{
                          background: "linear-gradient(135deg, rgba(74,222,128,0.2), rgba(74,222,128,0.1))",
                          border: "1px solid rgba(74,222,128,0.3)",
                          color: "#4ade80",
                        }}
                      >
                        {bonus.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="text-xl font-black text-white">{amount} ₴</span>
                </div>
              </div>

              {/* Slider */}
              <div className="relative mb-6">
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full pointer-events-none"
                  style={{
                    left: 0,
                    width: `${sliderPercent}%`,
                    background: "linear-gradient(90deg, #16a34a, #4ade80)",
                    boxShadow: "0 0 10px rgba(74,222,128,0.5)",
                  }}
                />
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={10}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="relative w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    WebkitAppearance: "none",
                  }}
                />
              </div>

              {/* Quick buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[50, 100, 250, 500, 1000, 2000].map((v) => (
                  <motion.button
                    key={v}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAmount(v)}
                    className="px-3 py-1.5 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: amount === v ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)",
                      border: amount === v ? "1px solid rgba(74,222,128,0.4)" : "1px solid rgba(255,255,255,0.07)",
                      color: amount === v ? "#4ade80" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {v} ₴
                  </motion.button>
                ))}
              </div>

              {/* Result row */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <p className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Отдаёте</p>
                  <p className="text-2xl font-black text-white">{amount} <span className="text-lg">₴</span></p>
                </div>
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(74,222,128,0.06)",
                    border: "1px solid rgba(74,222,128,0.15)",
                  }}
                >
                  <p className="text-xs font-medium mb-1" style={{ color: "rgba(74,222,128,0.6)" }}>Получаете</p>
                  <motion.p
                    key={totalKultiki}
                    initial={{ scale: 1.1, color: "#86efac" }}
                    animate={{ scale: 1, color: "#4ade80" }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl font-black"
                    style={{ color: "#4ade80" }}
                  >
                    {totalKultiki.toLocaleString("ru")}
                    <span className="text-sm font-bold ml-1" style={{ color: "rgba(74,222,128,0.6)" }}>к</span>
                  </motion.p>
                </div>
              </div>

              {bonus && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs mt-2 text-center"
                  style={{ color: "rgba(74,222,128,0.5)" }}
                >
                  Базово {baseKultiki.toLocaleString("ru")}к + бонус {bonusKultiki.toLocaleString("ru")}к
                </motion.p>
              )}
            </div>

            {/* Right: buy block */}
            <div className="flex-shrink-0 w-full lg:w-52 flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(74,222,128,0.45)" }}
                whileTap={{ scale: 0.96 }}
                className="shimmer-btn w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 text-base"
                style={{ boxShadow: "0 0 25px rgba(74,222,128,0.3)" }}
              >
                КУПИТЬ →
              </motion.button>

              <p className="text-xs text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
                Совершая оплату, вы соглашаетесь с{" "}
                <span className="underline cursor-pointer" style={{ color: "rgba(74,222,128,0.5)" }}>
                  условиями использования
                </span>
              </p>

              {/* Bonus ladder */}
              <div
                className="rounded-2xl p-3 mt-1"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-xs font-bold mb-2 text-center uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Бонусы
                </p>
                {[...BONUSES].reverse().map((b) => (
                  <div
                    key={b.threshold}
                    className="flex justify-between text-xs py-1"
                    style={{
                      color: amount >= b.threshold ? "#4ade80" : "rgba(255,255,255,0.25)",
                      fontWeight: amount >= b.threshold ? 700 : 400,
                    }}
                  >
                    <span>от {b.threshold} ₴</span>
                    <span>+{b.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Slider thumb CSS */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          border: 2px solid #fff;
          box-shadow: 0 0 12px rgba(74,222,128,0.6);
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          border: 2px solid #fff;
          box-shadow: 0 0 12px rgba(74,222,128,0.6);
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
