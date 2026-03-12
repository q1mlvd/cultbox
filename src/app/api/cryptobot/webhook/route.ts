import { createHash, createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";

function verifySignature(rawBody: string, signature: string, token: string): boolean {
  const key = createHash("sha256").update(token).digest();
  const computed = createHmac("sha256", key).update(rawBody).digest("hex");
  return computed === signature;
}

async function sendTelegramMessage(text: string) {
  const botToken = process.env.BOT_TOKEN;
  const adminIds = (process.env.ADMIN_IDS ?? "").split(",").filter(Boolean);
  if (!botToken || !adminIds.length) return;

  for (const chatId of adminIds) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text,
        parse_mode: "HTML",
      }),
    }).catch(() => {});
  }
}

export async function POST(req: NextRequest) {
  const token = process.env.CRYPTOBOT_TOKEN;
  if (!token) return NextResponse.json({ error: "No token" }, { status: 500 });

  const rawBody = await req.text();
  const signature = req.headers.get("crypto-pay-api-signature") ?? "";

  if (!verifySignature(rawBody, signature, token)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const update = JSON.parse(rawBody);

  if (update.update_type !== "invoice_paid") {
    return NextResponse.json({ ok: true });
  }

  const invoice = update.payload;

  let order: Record<string, string> = {};
  try {
    order = JSON.parse(invoice.payload ?? "{}");
  } catch {
    order = {};
  }

  const currencyStr = invoice.paid_fiat_amount
    ? `${invoice.paid_fiat_amount} ${invoice.fiat}`
    : `${invoice.paid_amount} ${invoice.asset}`;

  const msg = [
    `<b>✅ Новый оплаченный заказ — CryptoBot</b>`,
    ``,
    `<b>Игрок:</b> <code>${order.nick ?? "—"}</code>`,
    `<b>Товар:</b> ${order.product ?? "—"}`,
    `<b>Срок:</b> ${order.tier ?? "—"}`,
    `<b>Email:</b> ${order.email ?? "—"}`,
    `<b>Сумма:</b> ${currencyStr} (${order.uah ?? "?"}₴)`,
    `<b>ID инвойса:</b> <code>${invoice.invoice_id}</code>`,
    ``,
    `<i>Выдайте привилегию игроку вручную или настройте RCON.</i>`,
  ].join("\n");

  await sendTelegramMessage(msg);

  return NextResponse.json({ ok: true });
}
