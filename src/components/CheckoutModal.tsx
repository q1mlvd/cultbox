"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore, PriceTier } from "@/store/useStore";

export default function CheckoutModal() {
  const router = useRouter();
  const {
    isModalOpen, setIsModalOpen,
    selectedProduct, selectedTier, setSelectedTier,
    nick, setNick,
    paymentMethod, setPaymentMethod,
  } = useStore();

  const [email, setEmail] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [step, setStep] = useState<"form" | "payment">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [nickError, setNickError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleClose = () => {
    if (!isLoading) {
      setIsModalOpen(false);
      setPaymentMethod(null);
      setStep("form");
      setAgreeTerms(false);
      setAgreePrivacy(false);
      setEmail("");
      setCoupon("");
      setCouponOpen(false);
      setNickError("");
      setEmailError("");
    }
  };

  const handleNickChange = (v: string) => {
    if (/^[a-zA-Z0-9_]*$/.test(v) && v.length <= 16) {
      setNick(v);
      if (v.length > 0 && v.length < 3) setNickError("Минимум 3 символа");
      else setNickError("");
    }
  };

  const handleProceed = () => {
    let valid = true;
    if (nick.length < 3) { setNickError("Введите ник (минимум 3 символа)"); valid = false; }
    if (!email.includes("@")) { setEmailError("Введите корректный e-mail"); valid = false; }
    if (!agreeTerms || !agreePrivacy) return;
    if (!valid) return;
    setStep("payment");
  };

  const handlePayment = async () => {
    if (!paymentMethod) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    setIsModalOpen(false);
    setIsLoading(false);
    setStep("form");
    router.push("/success");
  };

  const canProceed = nick.length >= 3 && email.includes("@") && agreeTerms && agreePrivacy;

  return (
    <AnimatePresence>
      {isModalOpen && selectedProduct && selectedTier && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden max-h-[92dvh] overflow-y-auto">

              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 relative">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
                >
                  ✕
                </button>
                <h2 className="text-xl font-black text-slate-900 text-center">
                  Покупка привилегии
                </h2>
                <p
                  className="text-center text-sm font-bold mt-0.5"
                  style={{ color: selectedProduct.nameColor }}
                >
                  {selectedProduct.name} — {selectedTier.label}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {step === "form" ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="px-6 py-5 space-y-4"
                  >
                    {/* Tier selector */}
                    {selectedProduct && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Выберите срок</label>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProduct.tiers.map((tier: PriceTier) => (
                            <button
                              key={tier.duration}
                              onClick={() => setSelectedTier(tier)}
                              className={`py-2.5 px-2 rounded-xl border-2 text-center transition-all ${
                                selectedTier?.duration === tier.duration
                                  ? "border-green-500 bg-green-50"
                                  : "border-slate-200 hover:border-green-300"
                              }`}
                            >
                              <p className="text-xs text-slate-500">{tier.label}</p>
                              <p className="font-black text-sm text-slate-800">{tier.price} ₴</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warning banner */}
                    <div className="bg-green-500 text-white rounded-xl p-3.5 flex gap-3">
                      <span className="text-lg flex-shrink-0">ℹ</span>
                      <div>
                        <p className="font-bold text-sm">Внимание</p>
                        <p className="text-sm text-green-50">
                          После оплаты донат выдаётся автоматически в течение 1–2 минут
                        </p>
                      </div>
                    </div>

                    {/* Nick */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Ваш ник
                      </label>
                      <input
                        type="text"
                        value={nick}
                        onChange={(e) => handleNickChange(e.target.value)}
                        placeholder="Ваш ник"
                        className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${
                          nickError
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-200 focus:border-green-400"
                        } focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]`}
                      />
                      {nickError && <p className="text-red-500 text-xs mt-1">{nickError}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Адрес электронной почты
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                        placeholder="Адрес электронной почты"
                        className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${
                          emailError
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-200 focus:border-green-400"
                        } focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]`}
                      />
                      {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>

                    {/* Coupon */}
                    <div>
                      <button
                        onClick={() => setCouponOpen(!couponOpen)}
                        className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
                      >
                        У меня есть купон
                      </button>
                      <AnimatePresence>
                        {couponOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <input
                              type="text"
                              value={coupon}
                              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                              placeholder="Введите купон..."
                              className="w-full mt-2 px-4 py-3 border border-slate-200 focus:border-green-400 rounded-xl text-sm outline-none transition-all focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Price + button */}
                    <div className="flex items-end justify-between pt-1">
                      <div>
                        <p className="text-xs text-slate-400">Цена ({selectedTier?.label})</p>
                        <p className="text-2xl font-black text-slate-900">{selectedTier?.price ?? "—"} ₴</p>
                      </div>
                      <motion.button
                        whileHover={canProceed ? { scale: 1.03 } : {}}
                        whileTap={canProceed ? { scale: 0.97 } : {}}
                        onClick={handleProceed}
                        disabled={!canProceed}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                          canProceed
                            ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        ПЕРЕЙТИ К ОПЛАТЕ
                        <span className="text-base">🧮</span>
                      </motion.button>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2 pt-1">
                      {[
                        {
                          checked: agreeTerms,
                          set: setAgreeTerms,
                          text: "Я соглашаюсь со всеми условиями ",
                          link: "пользовательского соглашения",
                        },
                        {
                          checked: agreePrivacy,
                          set: setAgreePrivacy,
                          text: "Я соглашаюсь с ",
                          link: "Политикой обработки персональных данных",
                        },
                      ].map((item, i) => (
                        <label key={i} className="flex items-start gap-2.5 cursor-pointer group">
                          <div
                            onClick={() => item.set(!item.checked)}
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all ${
                              item.checked
                                ? "bg-green-500 border-green-500"
                                : "border-slate-300 group-hover:border-green-400"
                            }`}
                          >
                            {item.checked && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 leading-relaxed">
                            {item.text}
                            <span className="text-green-600 font-medium hover:underline cursor-pointer">
                              {item.link}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="px-6 py-5"
                  >
                    {/* Back + summary */}
                    <button
                      onClick={() => setStep("form")}
                      className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 mb-4 transition-colors"
                    >
                      ← Назад
                    </button>

                    <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Игрок</span>
                        <span className="font-bold text-green-600">{nick}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email</span>
                        <span className="font-medium text-slate-700 truncate max-w-[200px]">{email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Привилегия</span>
                        <span className="font-bold" style={{ color: selectedProduct.nameColor }}>
                          {selectedProduct.name}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2">
                        <span className="text-slate-500">К оплате</span>
                        <span className="font-black text-lg text-green-600">{selectedTier.price} ₴</span>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Способ оплаты</p>
                    <div className="space-y-2 mb-5">
                      {[
                        { id: "monobank" as const, icon: "🏦", bg: "from-slate-800 to-slate-900", name: "Monobank", desc: "Карта / Apple Pay / Google Pay" },
                        { id: "cryptobot" as const, icon: "₿", bg: "from-blue-500 to-blue-700", name: "CryptoBot", desc: "USDT, TON, BTC и другое" },
                      ].map((method) => (
                        <motion.button
                          key={method.id}
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.985 }}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                            paymentMethod === method.id
                              ? "border-green-500 bg-green-50"
                              : "border-slate-200 hover:border-green-300"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${method.bg} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-slate-800 text-sm">{method.name}</p>
                            <p className="text-slate-500 text-xs">{method.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            paymentMethod === method.id ? "border-green-500 bg-green-500" : "border-slate-300"
                          }`}>
                            {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={paymentMethod && !isLoading ? { scale: 1.02 } : {}}
                      whileTap={paymentMethod && !isLoading ? { scale: 0.98 } : {}}
                      onClick={handlePayment}
                      disabled={!paymentMethod || isLoading}
                      className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                        paymentMethod && !isLoading
                          ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                      style={paymentMethod && !isLoading ? { boxShadow: "0 0 20px rgba(34,197,94,0.35)" } : {}}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Обработка...
                        </>
                      ) : (
                        "💳 Оплатить →"
                      )}
                    </motion.button>
                    <p className="text-center text-xs text-slate-400 mt-2">🔒 Защищённая транзакция</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
