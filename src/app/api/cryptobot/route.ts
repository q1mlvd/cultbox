import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { amount, description } = await req.json();

  const token = process.env.CRYPTOBOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "CryptoBot token not configured" }, { status: 500 });
  }

  const usdtAmount = (amount / Number(process.env.UAH_TO_USDT_RATE ?? "40")).toFixed(2);

  const res = await fetch("https://pay.crypt.bot/api/createInvoice", {
    method: "POST",
    headers: {
      "Crypto-Pay-API-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      asset: "USDT",
      amount: usdtAmount,
      description,
      expires_in: 3600,
    }),
  });

  const data = await res.json();

  if (!data.ok) {
    return NextResponse.json({ error: data.error?.name ?? "CryptoBot error" }, { status: 500 });
  }

  return NextResponse.json({ pay_url: data.result.pay_url });
}
