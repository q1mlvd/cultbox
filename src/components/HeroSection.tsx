"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const BLOCKS = [
  { top: "12%", left: "3%",  size: 50, delay: 0,   rotate: 15,  color: "#4ade80" },
  { top: "65%", left: "6%",  size: 32, delay: 0.6, rotate: -20, color: "#22d3ee" },
  { top: "20%", right: "4%", size: 58, delay: 0.3, rotate: 25,  color: "#a78bfa" },
  { top: "60%", right: "8%", size: 36, delay: 0.9, rotate: -10, color: "#4ade80" },
  { top: "45%", left: "12%", size: 24, delay: 1.3, rotate: 40,  color: "#f472b6" },
  { top: "18%", right: "22%",size: 28, delay: 0.7, rotate: -30, color: "#22d3ee" },
  { top: "78%", right: "15%",size: 20, delay: 1.1, rotate: 55,  color: "#a78bfa" },
  { top: "35%", left: "20%", size: 16, delay: 1.5, rotate: -15, color: "#4ade80" },
];

function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <div className="stars-container">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #05080f 0%, #061a0f 40%, #050d1a 100%)" }}
    >
      {/* Stars */}
      <Stars />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(74,222,128,1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Big glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)" }} />

      {/* Floating blocks */}
      <div className="hidden sm:block">
        {BLOCKS.map((b, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -16, 0], rotate: [b.rotate, b.rotate + 8, b.rotate] }}
            transition={{ duration: 3.5 + i * 0.3, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
            className="absolute rounded-xl"
            style={{
              top: b.top,
              left: (b as any).left,
              right: (b as any).right,
              width: b.size,
              height: b.size,
              background: `linear-gradient(135deg, ${b.color}33, ${b.color}11)`,
              border: `1px solid ${b.color}44`,
              boxShadow: `0 0 20px ${b.color}22`,
            }}
          />
        ))}
      </div>

      {/* Scan line */}
      <div
        className="absolute inset-x-0 h-px opacity-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #4ade80, transparent)", animation: "scan-line 8s linear infinite" }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-20 flex flex-col md:flex-row items-center justify-between gap-10 min-h-screen">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:max-w-2xl text-center md:text-left"
        >
          {/* Online badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 mb-8 text-sm font-semibold"
            style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
            </span>
            Сервер онлайн · 154 игрока
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-black leading-none mb-4"
            style={{ fontSize: "clamp(3.5rem, 10vw, 7rem)" }}
          >
            <span className="text-white">CULT</span>
            <span
              className="text-glow"
              style={{
                color: "#4ade80",
                textShadow: "0 0 40px rgba(74,222,128,0.5)",
              }}
            >
              BOX
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl font-bold mb-3"
            style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}
          >
            МАГАЗИН ДОНАТА
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-base md:text-lg leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Улучши свой игровой опыт — привилегии,<br />
            валюта и уникальные предметы для CultBox.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <motion.a
              href="#shop"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(74,222,128,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="shimmer-btn flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-white text-base"
              style={{ boxShadow: "0 0 25px rgba(74,222,128,0.3)" }}
            >
              Открыть магазин
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigator.clipboard?.writeText("play.cultbox.icu")}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              play.cultbox.icu
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2"/>
              </svg>
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex gap-8 mt-12 justify-center md:justify-start"
          >
            {[
              { val: "500+",   label: "Игроков" },
              { val: "6",      label: "Привилегий" },
              { val: "24/7",   label: "Онлайн" },
            ].map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <p className="text-2xl font-black" style={{ color: "#4ade80" }}>{s.val}</p>
                <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: server card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="w-full md:w-80 flex-shrink-0"
        >
          <div
            className="rounded-3xl p-6 noise"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(74,222,128,0.15)",
              boxShadow: "0 0 60px rgba(74,222,128,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Card header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 glow-green"
                style={{ background: "linear-gradient(135deg, #16a34a, #4ade80)" }}
              >
                <img src="/logo.png" alt="CultBox" className="w-8 h-8 rounded-xl object-cover" />
              </div>
              <div>
                <p className="font-black text-white text-base">НАШ СЕРВЕР</p>
                <p className="text-xs font-medium" style={{ color: "#4ade80" }}>play.cultbox.icu</p>
              </div>
            </div>

            {/* Online bar */}
            <div className="mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: "rgba(255,255,255,0.45)" }}>Онлайн</span>
                <span className="font-bold text-white">154 / 500</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "30.8%" }}
                  transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                  className="h-2 rounded-full"
                  style={{ background: "linear-gradient(90deg, #16a34a, #4ade80)", boxShadow: "0 0 10px rgba(74,222,128,0.5)" }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {[
                { label: "Версия", value: "1.20.6" },
                { label: "Режим",  value: "BoxPvP"  },
                { label: "Карта",  value: "250×250" },
                { label: "PvP",    value: "Вкл."    },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{item.label}</p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Join button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigator.clipboard?.writeText("play.cultbox.icu")}
              className="shimmer-btn w-full py-3.5 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2"
              style={{ boxShadow: "0 0 20px rgba(74,222,128,0.25)" }}
            >
              Скопировать IP сервера
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2"/>
              </svg>
            </motion.button>
          </div>

          {/* Version badge */}
          <div
            className="mt-3 rounded-2xl px-5 py-3 flex items-center justify-between text-sm"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Рекомендуемая версия</span>
            <span className="font-bold" style={{ color: "#4ade80" }}>1.20.6</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #05080f)" }} />

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        <p className="text-xs font-medium tracking-widest uppercase">Прокрути вниз</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
