import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { amount, description, order_id } = await req.json();

  const public_key = process.env.LIQPAY_PUBLIC_KEY;
  const private_key = process.env.LIQPAY_PRIVATE_KEY;

  if (!public_key || !private_key) {
    return NextResponse.json({ error: "LiqPay keys not configured" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

  const params = {
    public_key,
    version: "3",
    action: "pay",
    amount: String(amount),
    currency: "UAH",
    description,
    order_id,
    result_url: `${baseUrl}/success`,
    server_url: `${baseUrl}/api/liqpay/callback`,
  };

  const data = Buffer.from(JSON.stringify(params)).toString("base64");
  const signature = Buffer.from(
    createHash("sha1").update(private_key + data + private_key).digest("binary")
  ).toString("base64");

  return NextResponse.json({ data, signature });
}
