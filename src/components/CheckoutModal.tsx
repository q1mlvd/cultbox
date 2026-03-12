"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStore, PriceTier } from "@/store/useStore";

type PaymentMethod = "liqpay" | "cryptobot" | null;

export default function CheckoutModal() {
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nickError, setNickError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleClose = () => {
    if (isLoading) return;
    setIsModalOpen(false);
    setPaymentMethod(null);
    setAgreeTerms(false);
    setAgreePrivacy(false);
    setEmail("");
    setCoupon("");
    setCouponOpen(false);
    setNickError("");
    setEmailError("");
  };

  const handleNickChange = (v: string) => {
    if (/^[a-zA-Z0-9_]*$/.test(v) && v.length <= 16) {
      setNick(v);
      setNickError(v.length > 0 && v.length < 3 ? "Минимум 3 символа" : "");
    }
  };

  const validate = () => {
    let ok = true;
    if (nick.length < 3) { setNickError("Введите ник (минимум 3 символа)"); ok = false; }
    if (!email.includes("@")) { setEmailError("Введите корректный e-mail"); ok = false; }
    return ok;
  };

  const handlePay = async () => {
    if (!paymentMethod || !selectedProduct || !selectedTier) return;
    if (!agreeTerms || !agreePrivacy) return;
    if (!validate()) return;

    setIsLoading(true);
    try {
      const description = `${selectedProduct.name} ${selectedTier.label} для ${nick}`;

      if (paymentMethod === "liqpay") {
        const res = await fetch("/api/liqpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: selectedTier.price,
            description,
            order_id: `${selectedProduct.id}_${Date.now()}`,
          }),
        });
        const { data, signature, error } = await res.json();
        if (error) throw new Error(error);

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://www.liqpay.ua/api/3/checkout";
        const di = document.createElement("input"); di.type = "hidden"; di.name = "data"; di.value = data;
        const si = document.createElement("input"); si.type = "hidden"; si.name = "signature"; si.value = signature;
        form.appendChild(di); form.appendChild(si);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        setIsModalOpen(false);
      }

      if (paymentMethod === "cryptobot") {
        const res = await fetch("/api/cryptobot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: selectedTier.price, description }),
        });
        const { pay_url, error } = await res.json();
        if (error) throw new Error(error);
        window.open(pay_url, "_blank");
        setIsModalOpen(false);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Ошибка";
      alert(`Ошибка при создании платежа: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formValid = nick.length >= 3 && email.includes("@") && agreeTerms && agreePrivacy;
  const canPay = formValid && !!paymentMethod;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden max-h-[94dvh] overflow-y-auto">

              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 relative">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                <h2 className="text-xl font-black text-slate-900 text-center pr-8">
                  Оформление покупки
                </h2>
                <p className="text-center text-sm font-bold mt-0.5" style={{ color: selectedProduct.nameColor }}>
                  {selectedProduct.name} — {selectedTier.label}
                </p>
              </div>

              <div className="px-6 py-5 space-y-4">

                {/* Tier selector */}
                {selectedProduct.tiers.length > 1 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Срок</label>
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

                {/* Info banner */}
                <div className="bg-green-500 text-white rounded-xl p-3.5 flex gap-3 items-start">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm text-green-50">
                    После оплаты донат выдаётся автоматически в течение 1–2 минут
                  </p>
                </div>

                {/* Nick */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ваш ник</label>
                  <input
                    type="text"
                    value={nick}
                    onChange={(e) => handleNickChange(e.target.value)}
                    placeholder="Никнейм на сервере"
                    className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all text-slate-900 bg-white ${
                      nickError ? "border-red-400" : "border-slate-200 focus:border-green-400"
                    } focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)]`}
                  />
                  {nickError && <p className="text-red-500 text-xs mt-1">{nickError}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    placeholder="Адрес электронной почты"
                    className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all text-slate-900 bg-white ${
                      emailError ? "border-red-400" : "border-slate-200 focus:border-green-400"
                    } focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)]`}
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
                          className="w-full mt-2 px-4 py-3 border border-slate-200 focus:border-green-400 rounded-xl text-sm outline-none transition-all text-slate-900 bg-white focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Payment methods */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Способ оплаты</label>
                  <div className="space-y-2">

                    {/* LiqPay */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setPaymentMethod("liqpay")}
                      className={`w-full p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                        paymentMethod === "liqpay"
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #009f2e, #00cc3a)" }}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="1" y="4" width="22" height="16" rx="2" strokeWidth="2"/>
                          <path d="M1 10h22" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">LiqPay</p>
                        <p className="text-slate-500 text-xs">Карта, Apple Pay, Google Pay</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        paymentMethod === "liqpay" ? "border-green-500 bg-green-500" : "border-slate-300"
                      }`}>
                        {paymentMethod === "liqpay" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </motion.button>

                    {/* CryptoBot */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setPaymentMethod("cryptobot")}
                      className={`w-full p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                        paymentMethod === "cryptobot"
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #2AABEE, #1d8fc7)" }}>
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">CryptoBot</p>
                        <p className="text-slate-500 text-xs">USDT, TON, BTC и другие</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        paymentMethod === "cryptobot" ? "border-blue-500 bg-blue-500" : "border-slate-300"
                      }`}>
                        {paymentMethod === "cryptobot" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-2">
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

                {/* Price + Pay button */}
                <div className="pt-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">К оплате</p>
                    <p className="text-2xl font-black text-slate-900">{selectedTier.price} ₴</p>
                  </div>

                  <motion.button
                    whileHover={canPay && !isLoading ? { scale: 1.02 } : {}}
                    whileTap={canPay && !isLoading ? { scale: 0.98 } : {}}
                    onClick={handlePay}
                    disabled={!canPay || isLoading}
                    className="w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: canPay && !isLoading ? "linear-gradient(135deg, #16a34a, #4ade80)" : undefined,
                      backgroundColor: !canPay || isLoading ? "#e2e8f0" : undefined,
                      color: canPay && !isLoading ? "#fff" : "#94a3b8",
                      boxShadow: canPay && !isLoading ? "0 0 25px rgba(74,222,128,0.35)" : "none",
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
                      "Оплатить"
                    )}
                  </motion.button>

                  <div className="flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2"/>
                    </svg>
                    <p className="text-xs text-slate-400">Защищённая транзакция</p>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
