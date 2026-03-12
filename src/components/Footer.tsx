"use client";

import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Главная", href: "#hero" },
  { label: "Культики", href: "#currency" },
  { label: "Кейсы", href: "#cases" },
  { label: "Донат", href: "#shop" },
  { label: "Поддержка", href: "https://t.me/CultBoxSupport_bot", external: true },
];

const SOCIAL_LINKS = [
  { label: "Discord", icon: "/Discord.png", href: "https://discord.gg/rxKA9JRS", bg: "rgba(88,101,242,0.15)", border: "rgba(88,101,242,0.3)" },
  { label: "YouTube", icon: "/youtube.png", href: "#", bg: "rgba(255,0,0,0.12)", border: "rgba(255,0,0,0.25)" },
  { label: "Telegram", icon: "/Telegram.webp", href: "#", bg: "rgba(38,169,224,0.12)", border: "rgba(38,169,224,0.25)" },
  { label: "TikTok", icon: "/tiktok.png", href: "#", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#03050b", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-4 py-14">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Column 1 — Logo + copyright */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #4ade80)",
                  color: "#05080f",
                  boxShadow: "0 0 20px rgba(74,222,128,0.3)",
                }}
              >
                CB
              </div>
              <span className="font-black text-white text-lg tracking-wide">CULTBOX</span>
            </div>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
              © {new Date().getFullYear()} CultBox. Все права защищены.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  title={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <img src={s.icon} alt={s.label} className="w-5 h-5 object-contain" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2 — Disclaimer */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
              Правовая информация
            </p>
            <p className="text-xs leading-loose mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
              CultBox не связан с Mojang AB.<br />
              Все средства идут на развитие проекта.<br />
              Коммерческая деятельность проекта<br />
              соответствует{" "}
              <a
                href="https://www.minecraft.net/en-us/eula"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "rgba(74,222,128,0.6)" }}
              >
                политике Mojang AB
              </a>
              .
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="/oferta"
                className="text-xs underline"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Договор Оферты
              </a>
              <a
                href="/privacy"
                className="text-xs underline"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Политика обработки персональных данных
              </a>
            </div>
          </div>

          {/* Column 3 — Nav */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
              Навигация
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-sm transition-colors"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#4ade80")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            После оплаты донат выдаётся автоматически в течение 1–2 минут.
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
            Minecraft™ является торговой маркой Mojang AB
          </p>
        </div>

      </div>
    </footer>
  );
}
