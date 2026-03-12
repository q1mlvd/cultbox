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

  const handleLiqPay = async () => {
    if (!selectedProduct || !selectedTier) return;
    setIsLoading(true);
    try {
      const orderId = `${selectedProduct.id}_${Date.now()}`;
      const res = await fetch("/api/liqpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedTier.price,
          description: `${selectedProduct.name} ${selectedTier.label} для ${nick}`,
          order_id: orderId,
        }),
      });
      const { data, signature, error } = await res.json();
      if (error) throw new Error(error);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://www.liqpay.ua/api/3/checkout";

      const dataInput = document.createElement("input");
      dataInput.type = "hidden";
      dataInput.name = "data";
      dataInput.value = data;

      const sigInput = document.createElement("input");
      sigInput.type = "hidden";
      sigInput.name = "signature";
      sigInput.value = signature;

      form.appendChild(dataInput);
      form.appendChild(sigInput);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      setIsModalOpen(false);
      setStep("form");
    } catch {
      alert("Ошибка при создании платежа. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
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
                    {selectedProduct.tiers.length > 1 && (
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
                    <div className="bg-green-500 text-white rounded-xl p-3.5 flex gap-3 items-start">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <div>
                        <p className="font-bold text-sm">Внимание</p>
                        <p className="text-sm text-green-50">
                          После оплаты донат выдаётся автоматически в течение 1–2 минут
                        </p>
                      </div>
                    </div>

                    {/* Nick */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ваш ник</label>
                      <input
                        type="text"
                        value={nick}
                        onChange={(e) => handleNickChange(e.target.value)}
                        placeholder="Ваш ник"
                        className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all text-slate-900 bg-white ${
                          nickError
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-200 focus:border-green-400"
                        } focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]`}
                      />
                      {nickError && <p className="text-red-500 text-xs mt-1">{nickError}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                        placeholder="Адрес электронной почты"
                        className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all text-slate-900 bg-white ${
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
                              className="w-full mt-2 px-4 py-3 border border-slate-200 focus:border-green-400 rounded-xl text-sm outline-none transition-all text-slate-900 bg-white focus:shadow-[0_0_0_3px_rgba(34,197,94,0.15)]"
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
                        Перейти к оплате
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2 pt-1">
                      {[
                        { checked: agreeTerms, set: setAgreeTerms, text: "Я соглашаюсь со всеми условиями ", link: "пользовательского соглашения" },
                        { checked: agreePrivacy, set: setAgreePrivacy, text: "Я соглашаюсь с ", link: "Политикой обработки персональных данных" },
                      ].map((item, i) => (
                        <label key={i} className="flex items-start gap-2.5 cursor-pointer group">
                          <div
                            onClick={() => item.set(!item.checked)}
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all ${
                              item.checked ? "bg-green-500 border-green-500" : "border-slate-300 group-hover:border-green-400"
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
                            <span className="text-green-600 font-medium hover:underline cursor-pointer">{item.link}</span>
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
                    <button
                      onClick={() => setStep("form")}
                      className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 mb-4 transition-colors"
                    >
                      ← Назад
                    </button>

                    {/* Summary */}
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
                        <span className="text-slate-500">Товар</span>
                        <span className="font-bold" style={{ color: selectedProduct.nameColor }}>
                          {selectedProduct.name}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2">
                        <span className="text-slate-500">К оплате</span>
                        <span className="font-black text-lg text-green-600">{selectedTier.price} ₴</span>
                      </div>
                    </div>

                    {/* LiqPay button */}
                    <motion.button
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                      onClick={handleLiqPay}
                      disabled={isLoading}
                      className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all"
                      style={{
                        background: isLoading ? "#e2e8f0" : "linear-gradient(135deg, #009f2e, #00cc3a)",
                        color: isLoading ? "#94a3b8" : "#fff",
                        boxShadow: isLoading ? "none" : "0 0 25px rgba(0,180,50,0.35)",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Перенаправление...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="1" y="4" width="22" height="16" rx="2" strokeWidth="2"/>
                            <path d="M1 10h22" strokeWidth="2"/>
                          </svg>
                          Оплатить через LiqPay
                        </>
                      )}
                    </motion.button>

                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2"/>
                      </svg>
                      <p className="text-center text-xs text-slate-400">Защищённая транзакция · LiqPay</p>
                    </div>
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
