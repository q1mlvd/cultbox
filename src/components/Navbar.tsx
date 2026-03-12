"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Главная",   href: "#hero"     },
  { label: "Культики",  href: "#currency" },
  { label: "Кейсы",     href: "#cases"    },
  { label: "Донат",     href: "#shop"     },
  { label: "Поддержка", href: "https://t.me/CultBoxSupport_bot" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(5, 8, 15, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(74,222,128,0.1)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="relative">
            <img src="/logo.png" alt="CultBox" className="h-9 w-9 rounded-xl object-cover" />
            <div className="absolute inset-0 rounded-xl bg-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-black text-xl text-white tracking-tight">
            Cult<span className="text-green-400">Box</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActive(i)}
              target={link.href.startsWith("https") ? "_blank" : undefined}
              rel={link.href.startsWith("https") ? "noopener noreferrer" : undefined}
              className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ color: active === i ? "#4ade80" : "rgba(255,255,255,0.6)" }}
            >
              {active === i && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </a>
          ))}
        </div>

        {/* CTA button */}
        <div className="hidden md:block">
          <motion.a
            href="#shop"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shimmer-btn px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg"
            style={{ boxShadow: "0 0 20px rgba(74,222,128,0.3)" }}
          >
            Магазин
          </motion.a>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
        >
          <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block w-6 h-0.5 bg-white rounded-full origin-center" />
          <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-6 h-0.5 bg-white rounded-full" />
          <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block w-6 h-0.5 bg-white rounded-full origin-center" />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{ background: "rgba(5,8,15,0.95)", borderTop: "1px solid rgba(74,222,128,0.1)" }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => { setActive(i); setMenuOpen(false); }}
                  target={link.href.startsWith("https") ? "_blank" : undefined}
                  rel={link.href.startsWith("https") ? "noopener noreferrer" : undefined}
                  className="px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={{ color: active === i ? "#4ade80" : "rgba(255,255,255,0.7)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
