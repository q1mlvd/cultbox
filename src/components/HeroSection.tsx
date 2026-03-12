"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden" style={{ minHeight: "480px" }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-950 to-slate-900" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(rgba(74,222,128,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating blocks — hidden on mobile */}
      <div className="hidden sm:block">
        {[
          { top: "15%", left: "5%",  size: 48, delay: 0,   rotate: 15  },
          { top: "60%", left: "8%",  size: 32, delay: 0.5, rotate: -20 },
          { top: "25%", right: "6%", size: 56, delay: 0.3, rotate: 25  },
          { top: "65%", right: "10%",size: 36, delay: 0.8, rotate: -10 },
          { top: "40%", left: "15%", size: 24, delay: 1.2, rotate: 40  },
          { top: "20%", right: "20%",size: 28, delay: 0.6, rotate: -30 },
        ].map((block, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -12, 0], rotate: [block.rotate, block.rotate + 5, block.rotate] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: block.delay }}
            className="absolute rounded-lg bg-gradient-to-br from-green-400/30 to-emerald-600/20 border border-green-400/20 backdrop-blur-sm"
            style={{
              top: block.top,
              left: (block as any).left,
              right: (block as any).right,
              width: block.size,
              height: block.size,
            }}
          />
        ))}
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-12 md:pt-32 md:pb-20 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white w-full md:max-w-xl text-center md:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-green-400/20 border border-green-400/30 rounded-full px-4 py-1.5 mb-5 text-sm text-green-300"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Сервер онлайн
          </motion.div>

          <h1 className="text-6xl sm:text-7xl md:text-7xl font-black leading-none mb-3">
            <span className="text-white">CULT</span>
            <span className="text-green-400">BOX</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-300 mb-2">
            МАГАЗИН ДОНАТА
          </p>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Улучши свой игровой опыт.<br />
            Привилегии, валюта и уникальные предметы.
          </p>

          <motion.a
            href="#shop"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 mt-6 bg-green-400 hover:bg-green-300 text-slate-900 font-black px-7 py-3.5 rounded-2xl shadow-lg transition-colors text-sm sm:text-base"
            style={{ boxShadow: "0 0 30px rgba(74,222,128,0.35)" }}
          >
            🛒 Открыть магазин
          </motion.a>
        </motion.div>

        {/* Server status card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full md:max-w-xs flex-shrink-0 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="CultBox" className="w-11 h-11 rounded-xl object-cover shadow-lg flex-shrink-0" />
            <div>
              <p className="font-black text-white text-base">НАШ СЕРВЕР</p>
              <p className="text-green-300 text-xs font-medium">play.cultbox.icu</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Онлайн:</span>
              <span className="text-white font-bold">154 / 500</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "30.8%" }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                className="h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { label: "Версия", value: "1.20.6" },
                { label: "Режим",  value: "BoxPvP"  },
                { label: "Карта",  value: "250x250" },
                { label: "PvP",    value: "Вкл."    },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-xl p-2.5">
                  <p className="text-slate-400 text-xs">{item.label}</p>
                  <p className="text-white text-sm font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
