require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_IDS = (process.env.ADMIN_IDS || "").split(",").map(Number).filter(Boolean);

if (!TOKEN || ADMIN_IDS.length === 0) {
  console.error("❌ Укажи BOT_TOKEN и ADMIN_IDS в файле .env");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// Map: message_id пересланного сообщения → chat_id пользователя
const sessions = new Map();

const isAdmin = (id) => ADMIN_IDS.includes(id);

// ─────────────────────────────────────────
// Утилиты
// ─────────────────────────────────────────

function userName(from) {
  if (from.username) return `@${from.username}`;
  return [from.first_name, from.last_name].filter(Boolean).join(" ") || `ID ${from.id}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function notifyAllAdmins(text, options = {}) {
  return Promise.all(
    ADMIN_IDS.map((id) => bot.sendMessage(id, text, options))
  );
}

// ─────────────────────────────────────────
// /start
// ─────────────────────────────────────────

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (isAdmin(chatId)) {
    return bot.sendMessage(chatId,
      `🛡 <b>Панель администратора CultBox</b>\n\n` +
      `Сюда будут приходить вопросы от игроков.\n\n` +
      `<b>Как ответить:</b> сделай <b>Reply</b> на нужное сообщение — бот автоматически перешлёт ответ игроку.\n\n` +
      `<i>Бот запущен и ожидает обращений ✅</i>`,
      { parse_mode: "HTML" }
    );
  }

  bot.sendMessage(chatId,
    `👋 Привет! Это поддержка сервера <b>CultBox</b>.\n\n` +
    `📝 Напиши свой вопрос — администратор свяжется с тобой в ближайшее время.\n\n` +
    `<i>Постарайся описать проблему подробно: укажи свой ник, что случилось и когда.</i>`,
    { parse_mode: "HTML" }
  );
});

// ─────────────────────────────────────────
// /help
// ─────────────────────────────────────────

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  if (isAdmin(chatId)) {
    return bot.sendMessage(chatId,
      `📖 <b>Инструкция для администратора</b>\n\n` +
      `• <b>Ответить игроку</b> — нажми Reply на его вопрос и напиши ответ\n` +
      `• <b>/start</b> — приветственное сообщение\n` +
      `• <b>/admins</b> — список администраторов\n\n` +
      `<i>Все ответы отправляются напрямую игроку через бота.</i>`,
      { parse_mode: "HTML" }
    );
  }

  bot.sendMessage(chatId,
    `ℹ️ <b>Помощь</b>\n\n` +
    `Просто напиши свой вопрос в этот чат — я передам его администратору.\n\n` +
    `⏱ Обычное время ответа: <b>до 24 часов</b>\n\n` +
    `Если вопрос срочный, укажи это в сообщении.`,
    { parse_mode: "HTML" }
  );
});

// ─────────────────────────────────────────
// /admins (только для админов)
// ─────────────────────────────────────────

bot.onText(/\/admins/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  bot.sendMessage(msg.chat.id,
    `👥 <b>Администраторы бота</b>\n\n` +
    ADMIN_IDS.map((id, i) => `${i + 1}. <code>${id}</code>`).join("\n"),
    { parse_mode: "HTML" }
  );
});

// ─────────────────────────────────────────
// Основной обработчик сообщений
// ─────────────────────────────────────────

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (msg.text?.startsWith("/")) return;

  // ── АДМИН отвечает игроку ──────────────
  if (isAdmin(chatId)) {
    if (!msg.reply_to_message) {
      return bot.sendMessage(chatId,
        `ℹ️ Чтобы ответить игроку — сделай <b>Reply</b> на его вопрос.`,
        { parse_mode: "HTML" }
      );
    }

    const targetUserId = sessions.get(msg.reply_to_message.message_id);

    if (!targetUserId) {
      return bot.sendMessage(chatId,
        `⚠️ Не удалось найти игрока для этого сообщения.\n` +
        `Возможно, бот был перезапущен и сессия устарела.`,
        { parse_mode: "HTML" }
      );
    }

    try {
      await bot.sendMessage(targetUserId,
        `💬 <b>Ответ администратора CultBox:</b>\n\n` +
        `${escapeHtml(msg.text || "[медиа]")}`,
        { parse_mode: "HTML" }
      );

      // Уведомляем обоих админов об отправке
      const responderName = userName(msg.from);
      await notifyAllAdmins(
        `✅ Администратор ${escapeHtml(responderName)} ответил игроку (<code>${targetUserId}</code>)`,
        { parse_mode: "HTML" }
      );
    } catch {
      bot.sendMessage(chatId,
        `❌ Не удалось доставить ответ — игрок мог заблокировать бота.`
      );
    }
    return;
  }

  // ── ИГРОК пишет вопрос ──────────────────
  const name = userName(msg.from);
  const profileLink = msg.from.username
    ? `<a href="https://t.me/${msg.from.username}">${escapeHtml(name)}</a>`
    : `<b>${escapeHtml(name)}</b>`;

  let content = "";
  if (msg.text)          content = escapeHtml(msg.text);
  else if (msg.photo)    content = `📷 <i>[Фото]</i>${msg.caption ? "\n" + escapeHtml(msg.caption) : ""}`;
  else if (msg.document) content = `📎 <i>[Файл: ${escapeHtml(msg.document.file_name ?? "—")}]</i>`;
  else if (msg.voice)    content = `🎤 <i>[Голосовое сообщение]</i>`;
  else if (msg.sticker)  content = `😄 <i>[Стикер]</i>`;
  else                   content = `<i>[Неизвестный тип]</i>`;

  const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Kiev" });

  const adminText =
    `📩 <b>Новый вопрос от игрока</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 Игрок: ${profileLink}\n` +
    `🆔 ID: <code>${chatId}</code>\n` +
    `🕐 Время: ${now}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `${content}\n\n` +
    `<i>💡 Reply на это сообщение, чтобы ответить</i>`;

  try {
    // Отправляем каждому админу и сохраняем session для каждого
    const results = await Promise.all(
      ADMIN_IDS.map((id) => bot.sendMessage(id, adminText, { parse_mode: "HTML" }))
    );
    results.forEach((sent) => sessions.set(sent.message_id, chatId));

    await bot.sendMessage(chatId,
      `✅ <b>Вопрос получен!</b>\n\n` +
      `Администратор ответит тебе в ближайшее время.\n` +
      `<i>Обычно это занимает до 24 часов.</i>`,
      { parse_mode: "HTML" }
    );
  } catch (err) {
    console.error("Ошибка пересылки:", err.message);
    bot.sendMessage(chatId,
      `⚠️ Произошла ошибка при отправке. Попробуй ещё раз позже.`
    );
  }
});

// ─────────────────────────────────────────
// Polling errors
// ─────────────────────────────────────────

bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});

console.log(`🟢 CultBox Support Bot запущен`);
console.log(`👥 Администраторы: ${ADMIN_IDS.join(", ")}`);
