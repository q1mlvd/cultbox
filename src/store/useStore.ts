import { create } from "zustand";

export type PaymentMethod = "monobank" | "cryptobot" | null;
export type TierDuration = "14d" | "30d" | "forever";

export interface PriceTier {
  duration: TierDuration;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  nameColor: string;
  gradient: string;
  iconEmoji: string;
  iconUrl?: string;
  commands: { cmd: string; desc: string }[];
  tiers: PriceTier[];
  note?: string;
  popular?: boolean;
}

interface StoreState {
  nick: string;
  setNick: (nick: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedTier: PriceTier | null;
  setSelectedTier: (tier: PriceTier | null) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  nick: "",
  setNick: (nick) => set({ nick }),
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  selectedTier: null,
  setSelectedTier: (tier) => set({ selectedTier: tier }),
  paymentMethod: null,
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  isModalOpen: false,
  setIsModalOpen: (open) => set({ isModalOpen: open }),
}));

export const PRODUCTS: Product[] = [
  {
    id: "vip",
    name: "VIP",
    nameColor: "#4ade80",
    gradient: "from-green-600 via-emerald-700 to-green-900",
    iconEmoji: "⭐",
    iconUrl: "/vip.png",
    commands: [
      { cmd: "/craft", desc: "Открыть виртуальный верстак" },
      { cmd: "/hat", desc: "Одеть предмет на голову" },
      { cmd: "/kit vip", desc: "Собственный набор" },
    ],
    tiers: [
      { duration: "14d", label: "14 дней", price: 21 },
      { duration: "30d", label: "30 дней", price: 37 },
      { duration: "forever", label: "Навсегда", price: 70 },
    ],
  },
  {
    id: "dragon",
    name: "DRAGON",
    nameColor: "#22d3ee",
    gradient: "from-cyan-600 via-teal-700 to-cyan-900",
    iconEmoji: "🐉",
    iconUrl: "/dragon.png",
    commands: [
      { cmd: "/ec", desc: "Виртуальный Эндер-сундук" },
      { cmd: "/kit dragon", desc: "Собственный набор" },
      { cmd: "Все права", desc: "предыдущей привилегии!" },
    ],
    tiers: [
      { duration: "14d", label: "14 дней", price: 35 },
      { duration: "30d", label: "30 дней", price: 55 },
      { duration: "forever", label: "Навсегда", price: 85 },
    ],
  },
  {
    id: "diamond",
    name: "DIAMOND",
    nameColor: "#60a5fa",
    gradient: "from-blue-500 via-blue-700 to-indigo-900",
    iconEmoji: "💎",
    iconUrl: "/Diamond.webp",
    commands: [
      { cmd: "/checkonline [ник]", desc: "Последний заход на сервер" },
      { cmd: "/checkmute [ник]", desc: "Замучен ли игрок" },
      { cmd: "/kit diamond", desc: "Собственный набор" },
      { cmd: "Все права", desc: "предыдущей привилегии!" },
    ],
    tiers: [
      { duration: "14d", label: "14 дней", price: 75 },
      { duration: "30d", label: "30 дней", price: 115 },
      { duration: "forever", label: "Навсегда", price: 160 },
    ],
    popular: true,
  },
  {
    id: "emerald",
    name: "EMERALD",
    iconUrl: "/EMERALD.png",
    nameColor: "#34d399",
    gradient: "from-emerald-500 via-green-700 to-emerald-900",
    iconEmoji: "🟢",
    commands: [
      { cmd: "/invsee [ник]", desc: "Посмотреть инвентарь игрока" },
      { cmd: "/kit emerald", desc: "Собственный набор" },
      { cmd: "Все права", desc: "предыдущей привилегии!" },
    ],
    tiers: [
      { duration: "14d", label: "14 дней", price: 120 },
      { duration: "30d", label: "30 дней", price: 170 },
      { duration: "forever", label: "Навсегда", price: 245 },
    ],
  },
  {
    id: "netherite",
    name: "NETHERITE",
    iconUrl: "/NETHERITE.png",
    nameColor: "#a78bfa",
    gradient: "from-slate-600 via-purple-900 to-slate-900",
    iconEmoji: "🔱",
    commands: [
      { cmd: "/tprevent [эвент]", desc: "Телепорт в 5 блоков от ивента" },
      { cmd: "/kit netherite", desc: "Собственный набор" },
      { cmd: "Все права", desc: "предыдущей привилегии!" },
    ],
    tiers: [
      { duration: "14d", label: "14 дней", price: 205 },
      { duration: "30d", label: "30 дней", price: 270 },
      { duration: "forever", label: "Навсегда", price: 350 },
    ],
  },
  {
    id: "custom",
    name: "CUSTOM",
    nameColor: "#e879f9",
    gradient: "from-fuchsia-600 via-purple-800 to-violet-900",
    iconEmoji: "👑",
    iconUrl: "/Custom.png",
    commands: [
      { cmd: "/mute [ник] [время] [причина]", desc: "Замутить игрока" },
      { cmd: "/kit custom", desc: "Собственный набор" },
      { cmd: "Все права", desc: "предыдущей привилегии!" },
    ],
    tiers: [
      { duration: "30d", label: "30 дней", price: 375 },
      { duration: "forever", label: "Навсегда", price: 485 },
    ],
    note: "После покупки напишите админам если хотите поставить свой префикс!",
  },
];

export const CATEGORIES = [
  {
    key: "privileges" as const,
    label: "Привилегии",
    description: "Расширьте свои возможности на сервере",
  },
];
