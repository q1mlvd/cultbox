import { NextRequest, NextResponse } from "next/server";

const RATES: Record<string, number> = {
  UAH: 1,
  USD: 1 / (Number(process.env.UAH_TO_USD_RATE) || 41),
  EUR: 1 / (Number(process.env.UAH_TO_EUR_RATE) || 45),
  RUB: Number(process.env.UAH_TO_RUB_RATE) || 3.3,
};

export async function POST(req: NextRequest) {
  const { amount, description, fiat_currency = "UAH", nick, email, product, tier } = await req.json();

  const token = process.env.CRYPTOBOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "CryptoBot token not configured" }, { status: 500 });
  }

  const rate = RATES[fiat_currency] ?? 1;
  const convertedAmount = (amount * rate).toFixed(fiat_currency === "UAH" || fiat_currency === "RUB" ? 0 : 2);

  // Store order metadata in invoice payload (returned in webhook)
  const payload = JSON.stringify({ nick, email, product, tier, uah: amount });

  const res = await fetch("https://pay.crypt.bot/api/createInvoice", {
    method: "POST",
    headers: {
      "Crypto-Pay-API-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currency_type: "fiat",
      fiat: fiat_currency,
      amount: convertedAmount,
      description,
      payload,
      expires_in: 3600,
    }),
  });

  const data = await res.json();

  if (!data.ok) {
    return NextResponse.json({ error: data.error?.name ?? "CryptoBot error" }, { status: 500 });
  }

  return NextResponse.json({ pay_url: data.result.pay_url });
}
