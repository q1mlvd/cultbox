"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import { useStore } from "@/store/useStore";

interface Case {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  rarity: string;
  rarityColor: string;
  priceUah: number;
  priceKultiki: number;
  contents: { text: string; highlight?: string }[];
  howTo: string[];
}

const CASES: Case[] = [
  {
    id: "allornoting",
    name: "Всё или ничего",
    icon: "☠️",
    color: "#ef4444",
    gradient: "from-red-600 via-rose-700 to-red-900",
    rarity: "Легендарный",
    rarityColor: "#ef4444",
    priceUah: 119,
    priceKultiki: 60,
    contents: [
      { text: "Лучшая привилегия", highlight: "#ef4444" },
      { text: " или ничего" },
      { text: "Редкий шанс получить ", highlight: undefined },
      { text: "уникальный донат", highlight: "#f97316" },
      { text: "Или уйти с пустыми руками..." },
    ],
    howTo: [
      "Купите кейс в магазине",
      "Подойдите к кейсу и нажмите ПКМ",
      "Откройте кейс в меню",
      "Получите случайную награду",
    ],
  },
  {
    id: "privileges",
    name: "Кейс с Привилегиями",
    icon: "🏆",
    color: "#22d3ee",
    gradient: "from-cyan-500 via-teal-600 to-cyan-900",
    rarity: "Эпический",
    rarityColor: "#22d3ee",
    priceUah: 129,
    priceKultiki: 65,
    contents: [
      { text: "Разные ", highlight: undefined },
      { text: "донат-привилегии", highlight: "#22d3ee" },
    ],
    howTo: [
      "Купите кейс в магазине",
      "Подойдите к кейсу и нажмите ПКМ",
      "Откройте кейс в меню",
      "Получите случайную награду",
    ],
  },
  {
    id: "titles",
    name: "Кейс с Титулами",
    icon: "👑",
    color: "#a78bfa",
    gradient: "from-violet-500 via-purple-700 to-violet-900",
    rarity: "Редкий",
    rarityColor: "#a78bfa",
    priceUah: 49,
    priceKultiki: 5,
    contents: [
      { text: "Анимированные", highlight: "#a78bfa" },
      { text: " и ", highlight: undefined },
      { text: "цветные титулы", highlight: "#e879f9" },
      { text: "Эксклюзивные ", highlight: undefined },
      { text: "ивентовые варианты", highlight: "#a78bfa" },
      { text: "Укрась свой никнейм ", highlight: undefined },
      { text: "по-королевски!", highlight: "#e879f9" },
    ],
    howTo: [
      "Купите кейс в магазине",
      "Подойдите к кейсу и нажмите ПКМ",
      "Откройте кейс в меню",
      "Получите случайную награду",
    ],
  },
  {
    id: "items",
    name: "Кейс с Предметами",
    icon: "⚔️",
    color: "#f97316",
    gradient: "from-orange-500 via-amber-600 to-orange-900",
    rarity: "Необычный",
    rarityColor: "#f97316",
    priceUah: 39,
    priceKultiki: 20,
    contents: [
      { text: "Редкие ", highlight: undefined },
      { text: "инструменты", highlight: "#f97316" },
      { text: " и ", highlight: undefined },
      { text: "броня", highlight: "#fbbf24" },
      { text: "Уникальные ", highlight: undefined },
      { text: "ресурсы", highlight: "#f97316" },
      { text: " и материалы" },
      { text: "Необычные предметы с ", highlight: undefined },
      { text: "эффектами", highlight: "#fbbf24" },
    ],
    howTo: [
      "Купите кейс в магазине",
      "Подойдите к кейсу и нажмите ПКМ",
      "Откройте кейс в меню",
      "Получите случайную награду",
    ],
  },
  {
    id: "kits",
    name: "Кейс с Китами",
    icon: "🎒",
    color: "#60a5fa",
    gradient: "from-blue-500 via-blue-700 to-blue-900",
    rarity: "Редкий",
    rarityColor: "#60a5fa",
    priceUah: 119,
    priceKultiki: 60,
    contents: [
      { text: "Разные ", highlight: undefined },
      { text: "наборы предметов", highlight: "#60a5fa" },
      { text: "Киты с ", highlight: undefined },
      { text: "оружием", highlight: "#60a5fa" },
      { text: ", бронёй, ресурсами" },
      { text: "Стартовое", highlight: "#60a5fa" },
      { text: " или ", highlight: undefined },
      { text: "элитное снаряжение", highlight: "#93c5fd" },
    ],
    howTo: [
      "Купите кейс в магазине",
      "Подойдите к кейсу и нажмите ПКМ",
      "Откройте кейс в меню",
      "Получите случайную награду",
    ],
  },
];

function CaseCard({ c, index }: { c: Case; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const { setSelectedProduct, setSelectedTier, setIsModalOpen } = useStore();

  const handleBuy = () => {
    setSelectedProduct({
      id: c.id,
      name: c.name,
      nameColor: c.color,
      gradient: c.gradient,
      iconEmoji: c.icon,
      commands: [],
      tiers: [{ duration: "forever", label: "Разово", price: c.priceUah }],
    });
    setSelectedTier({ duration: "forever", label: "Разово", price: c.priceUah });
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="relative"
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", position: "relative", minHeight: 380 }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            border: `1px solid ${c.color}22`,
          }}
        >
          {/* Top color strip */}
          <div className={`h-1.5 bg-gradient-to-r ${c.gradient}`} />

          {/* Header */}
          <div
            className="px-5 pt-5 pb-4 flex items-center gap-3"
            style={{ borderBottom: `1px solid rgba(255,255,255,0.06)` }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${c.color}22, ${c.color}08)`,
                border: `1px solid ${c.color}33`,
                boxShadow: `0 0 20px ${c.color}20`,
              }}
            >
              {c.icon}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div
                className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-1"
                style={{ background: `${c.rarityColor}18`, color: c.rarityColor, border: `1px solid ${c.rarityColor}30` }}
              >
                {c.rarity}
              </div>
              <h3 className="font-black text-lg text-white leading-tight">{c.name}</h3>
            </div>
          </div>

          {/* Contents */}
          <div className="px-5 py-4 flex-1">
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              🎁 Содержимое
            </p>
            <ul className="space-y-1.5">
              {groupContentLines(c.contents).map((line, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span style={{ color: `${c.color}88` }} className="flex-shrink-0 font-bold mt-0.5">›</span>
                  <span>
                    {line.map((seg, j) =>
                      seg.highlight
                        ? <span key={j} style={{ color: seg.highlight, fontWeight: 700 }}>{seg.text}</span>
                        : <span key={j} style={{ color: "rgba(255,255,255,0.55)" }}>{seg.text}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5">
            <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Цена</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white">{c.priceUah} ₴</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFlipped(true)}
                className="text-xs px-3 py-1.5 rounded-xl font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
              >
                Как открыть?
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${c.color}55` }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuy}
              className="w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${c.color}cc, ${c.color}88)`,
                color: "#05080f",
                boxShadow: `0 4px 20px ${c.color}33`,
              }}
            >
              📦 Купить кейс
            </motion.button>
          </div>
        </div>

        {/* BACK — "Как открыть" */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col p-5"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            border: `1px solid ${c.color}22`,
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-white text-lg">Как открыть?</h3>
            <button
              onClick={() => setFlipped(false)}
              className="text-xs px-3 py-1.5 rounded-xl font-semibold"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
            >
              ← Назад
            </button>
          </div>

          <ol className="space-y-3 flex-1">
            {c.howTo.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                  style={{ background: `${c.color}22`, color: c.color, border: `1px solid ${c.color}33` }}
                >
                  {i + 1}
                </div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{step}</p>
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              💡 Нажмите <span style={{ color: c.color, fontWeight: 700 }}>ПКМ</span>, чтобы получить ссылку на покупку
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Group flat content segments into lines (split by items without highlight that end with newline implied)
function groupContentLines(contents: { text: string; highlight?: string }[]) {
  const lines: { text: string; highlight?: string }[][] = [];
  let current: { text: string; highlight?: string }[] = [];

  for (const seg of contents) {
    if (!seg.highlight && (seg.text.startsWith(" или ") || seg.text === " и " || seg.text === ", бронёй, ресурсами" || seg.text === " або ")) {
      current.push(seg);
    } else if (
      !seg.highlight &&
      current.length > 0 &&
      !current[current.length - 1].text.endsWith(",") &&
      !seg.text.startsWith(" ")
    ) {
      lines.push(current);
      current = [seg];
    } else {
      current.push(seg);
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

export default function CasesSection() {
  return (
    <section id="cases" className="py-20 px-4" style={{ background: "#06080e" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}
          >
            📦 Кейсы
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Открой кейс
          </h2>
          <p className="text-lg max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
            Испытай удачу — внутри уникальные призы, привилегии и предметы
          </p>
        </motion.div>

        {/* Cases grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {CASES.map((c, i) => (
            <CaseCard key={c.id} c={c} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs mt-12"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Содержимое кейсов случайное. Шансы выпадения зависят от типа кейса.
        </motion.p>
      </div>
    </section>
  );
}
