require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

if (!TOKEN || !ADMIN_ID) {
  console.error("❌ Укажи BOT_TOKEN и ADMIN_ID в файле .env");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// Map: message_id пересланного сообщения → chat_id пользователя
const sessions = new Map();

// ─────────────────────────────────────────
// Утилиты
// ─────────────────────────────────────────

function userName(msg) {
  const u = msg.from;
  if (u.username) return `@${u.username}`;
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ");
  return name || `ID ${u.id}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ─────────────────────────────────────────
// /start
// ─────────────────────────────────────────

bot.onText(/\/start/, (msg) => {
  if (msg.chat.id === ADMIN_ID) {
    return bot.sendMessage(ADMIN_ID,
      `🛡 <b>Панель администратора CultBox</b>\n\n` +
      `Здесь будут приходить вопросы от игроков.\n` +
      `Чтобы ответить — просто сделай <b>Reply</b> на нужное сообщение.\n\n` +
      `<i>Бот запущен и ждёт обращений...</i>`,
      { parse_mode: "HTML" }
    );
  }

  bot.sendMessage(msg.chat.id,
    `👋 Добро пожаловать в поддержку <b>CultBox</b>!\n\n` +
    `📝 Задайте ваш вопрос — администратор скоро с вами свяжется.\n\n` +
    `<i>Опишите проблему подробно: ваш ник, что произошло и когда.</i>`,
    { parse_mode: "HTML" }
  );
});

// ─────────────────────────────────────────
// /help
// ─────────────────────────────────────────

bot.onText(/\/help/, (msg) => {
  if (msg.chat.id === ADMIN_ID) {
    return bot.sendMessage(ADMIN_ID,
      `📖 <b>Команды администратора</b>\n\n` +
      `• Ответить на вопрос — <b>Reply</b> на сообщение пользователя\n` +
      `• /stats — статистика обращений\n` +
      `• /broadcast — рассылка всем пользователям`,
      { parse_mode: "HTML" }
    );
  }

  bot.sendMessage(msg.chat.id,
    `ℹ️ <b>Помощь</b>\n\n` +
    `Просто напишите ваш вопрос в этот чат — я передам его администратору.\n\n` +
    `⏱ Обычное время ответа: <b>до 24 часов</b>`,
    { parse_mode: "HTML" }
  );
});

// ─────────────────────────────────────────
// Основной обработчик сообщений
// ─────────────────────────────────────────

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // Игнорируем команды (уже обработаны выше)
  if (msg.text?.startsWith("/")) return;

  // ── ADMIN отвечает пользователю ──────────
  if (chatId === ADMIN_ID) {
    if (!msg.reply_to_message) {
      return bot.sendMessage(ADMIN_ID,
        `ℹ️ Чтобы ответить пользователю — сделай <b>Reply</b> на его вопрос.`,
        { parse_mode: "HTML" }
      );
    }

    const targetUserId = sessions.get(msg.reply_to_message.message_id);
    if (!targetUserId) {
      return bot.sendMessage(ADMIN_ID,
        `⚠️ Не удалось найти пользователя для этого сообщения.\n` +
        `Возможно, бот был перезапущен.`,
        { parse_mode: "HTML" }
      );
    }

    try {
      await bot.sendMessage(targetUserId,
        `💬 <b>Ответ от администратора CultBox:</b>\n\n` +
        `${escapeHtml(msg.text)}`,
        { parse_mode: "HTML" }
      );
      bot.sendMessage(ADMIN_ID, `✅ Ответ успешно отправлен пользователю.`);
    } catch {
      bot.sendMessage(ADMIN_ID, `❌ Не удалось отправить ответ. Возможно, пользователь заблокировал бота.`);
    }
    return;
  }

  // ── ПОЛЬЗОВАТЕЛЬ пишет вопрос ────────────
  const name = userName(msg);
  const profileLink = msg.from.username
    ? `<a href="https://t.me/${msg.from.username}">${escapeHtml(name)}</a>`
    : `<b>${escapeHtml(name)}</b>`;

  let content = "";

  if (msg.text) {
    content = escapeHtml(msg.text);
  } else if (msg.photo) {
    content = `📷 <i>[Фото]</i>` + (msg.caption ? `\n${escapeHtml(msg.caption)}` : "");
  } else if (msg.document) {
    content = `📎 <i>[Файл: ${escapeHtml(msg.document.file_name ?? "—")}]</i>`;
  } else if (msg.sticker) {
    content = `😄 <i>[Стикер]</i>`;
  } else if (msg.voice) {
    content = `🎤 <i>[Голосовое сообщение]</i>`;
  } else {
    content = `<i>[Неизвестный тип сообщения]</i>`;
  }

  const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Kiev" });

  const adminText =
    `📩 <b>Новый вопрос</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 Игрок: ${profileLink}\n` +
    `🆔 ID: <code>${chatId}</code>\n` +
    `🕐 Время: ${now}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `${content}\n\n` +
    `<i>💡 Нажми Reply, чтобы ответить</i>`;

  try {
    const sent = await bot.sendMessage(ADMIN_ID, adminText, { parse_mode: "HTML" });
    sessions.set(sent.message_id, chatId);

    // Подтверждение пользователю
    await bot.sendMessage(chatId,
      `✅ <b>Ваш вопрос получен!</b>\n\n` +
      `Администратор ответит вам в ближайшее время.\n` +
      `<i>Обычно это занимает до 24 часов.</i>`,
      { parse_mode: "HTML" }
    );
  } catch (err) {
    console.error("Ошибка при пересылке:", err.message);
    bot.sendMessage(chatId,
      `⚠️ Произошла ошибка. Попробуйте позже или напишите напрямую.`,
      { parse_mode: "HTML" }
    );
  }
});

// ─────────────────────────────────────────
// Обработка ошибок polling
// ─────────────────────────────────────────

bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});

console.log("🟢 CultBox Support Bot запущен...");
