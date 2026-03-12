require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const TOKEN    = process.env.BOT_TOKEN;
const GROUP_ID = process.env.GROUP_ID; // строка, не число — избегаем потери точности

if (!TOKEN || !GROUP_ID) {
  console.error("❌ Укажи BOT_TOKEN и GROUP_ID в файле .env");
  process.exit(1);
}

console.log("GROUP_ID:", GROUP_ID);

const bot = new TelegramBot(TOKEN, { polling: true });

// ─────────────────────────────────────────
// Хранилище сессий (файл)
// ─────────────────────────────────────────

const SESSIONS_FILE = path.join(__dirname, "sessions.json");

function loadSessions() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"));
      return {
        userToTopic: new Map(Object.entries(data.userToTopic || {}).map(([k, v]) => [Number(k), v])),
        topicToUser: new Map(Object.entries(data.topicToUser || {}).map(([k, v]) => [Number(k), Number(v)])),
      };
    }
  } catch (e) {
    console.error("Ошибка загрузки сессий:", e.message);
  }
  return { userToTopic: new Map(), topicToUser: new Map() };
}

function saveSessions() {
  const data = {
    userToTopic: Object.fromEntries(sessions.userToTopic),
    topicToUser: Object.fromEntries(sessions.topicToUser),
  };
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(data, null, 2));
}

const sessions = loadSessions();

// ─────────────────────────────────────────
// Утилиты
// ─────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getDisplayName(from) {
  if (from.username) return `@${from.username}`;
  return [from.first_name, from.last_name].filter(Boolean).join(" ") || `ID ${from.id}`;
}

// Создать тему в группе для нового пользователя
async function getOrCreateTopic(userId, from) {
  if (sessions.userToTopic.has(userId)) {
    return sessions.userToTopic.get(userId);
  }

  const name = getDisplayName(from);
  const topicColors = [0x6FB9F0, 0xFFD67E, 0xCB86DB, 0x8EEE98, 0xFF93B2, 0xFB6F5F];
  const color = topicColors[userId % topicColors.length];

  try {
    const res = await axios.post(`https://api.telegram.org/bot${TOKEN}/createForumTopic`, {
      chat_id: GROUP_ID,
      name: name.slice(0, 128),
      icon_color: color,
    });
    const topic = res.data.result;

    const threadId = topic.message_thread_id;
    sessions.userToTopic.set(userId, threadId);
    sessions.topicToUser.set(threadId, userId);
    saveSessions();

    // Шапка темы
    await bot.sendMessage(GROUP_ID,
      `👤 <b>${escapeHtml(name)}</b>\n` +
      `🆔 ID: <code>${userId}</code>\n` +
      `📅 Первое обращение: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Kiev" })}\n\n` +
      `<i>Напишите ответ в этой теме — пользователь получит его в личке.</i>`,
      { parse_mode: "HTML", message_thread_id: threadId }
    );

    return threadId;
  } catch (err) {
    console.error("Ошибка создания темы:", err.message, err.response?.body);
    return null;
  }
}

// Получить тип контента сообщения
function getContent(msg) {
  if (msg.text)          return { type: "text",  value: msg.text };
  if (msg.photo)         return { type: "photo", value: msg.photo, caption: msg.caption };
  if (msg.document)      return { type: "doc",   value: msg.document, caption: msg.caption };
  if (msg.voice)         return { type: "voice", value: msg.voice };
  if (msg.video)         return { type: "video", value: msg.video, caption: msg.caption };
  if (msg.sticker)       return { type: "sticker", value: msg.sticker };
  if (msg.audio)         return { type: "audio", value: msg.audio, caption: msg.caption };
  return { type: "unknown", value: null };
}

// Переслать сообщение пользователю
async function forwardToUser(userId, msg) {
  const c = getContent(msg);
  const opts = { parse_mode: "HTML" };

  switch (c.type) {
    case "text":
      return bot.sendMessage(userId,
        `💬 <b>Ответ поддержки CultBox:</b>\n\n${escapeHtml(c.value)}`, opts);
    case "photo":
      return bot.sendPhoto(userId, c.value[c.value.length - 1].file_id,
        { caption: c.caption ? `💬 ${escapeHtml(c.caption)}` : "💬 Поддержка CultBox", ...opts });
    case "doc":
      return bot.sendDocument(userId, c.value.file_id,
        { caption: c.caption ? `💬 ${escapeHtml(c.caption)}` : undefined, ...opts });
    case "voice":
      return bot.sendVoice(userId, c.value.file_id);
    case "video":
      return bot.sendVideo(userId, c.value.file_id,
        { caption: c.caption ? `💬 ${escapeHtml(c.caption)}` : undefined, ...opts });
    case "sticker":
      return bot.sendSticker(userId, c.value.file_id);
    case "audio":
      return bot.sendAudio(userId, c.value.file_id,
        { caption: c.caption ? `💬 ${escapeHtml(c.caption)}` : undefined, ...opts });
    default:
      return bot.sendMessage(userId, "💬 Администратор прислал сообщение (тип не поддерживается).");
  }
}

// Переслать сообщение пользователя в тему группы
async function forwardToGroup(threadId, from, msg) {
  const name = getDisplayName(from);
  const c = getContent(msg);
  const threadOpts = { message_thread_id: threadId, parse_mode: "HTML" };

  switch (c.type) {
    case "text":
      return bot.sendMessage(GROUP_ID, escapeHtml(c.value), threadOpts);
    case "photo":
      return bot.sendPhoto(GROUP_ID, c.value[c.value.length - 1].file_id,
        { caption: c.caption ? escapeHtml(c.caption) : undefined, ...threadOpts });
    case "doc":
      return bot.sendDocument(GROUP_ID, c.value.file_id,
        { caption: c.caption ? escapeHtml(c.caption) : undefined, ...threadOpts });
    case "voice":
      return bot.sendVoice(GROUP_ID, c.value.file_id, { message_thread_id: threadId });
    case "video":
      return bot.sendVideo(GROUP_ID, c.value.file_id,
        { caption: c.caption ? escapeHtml(c.caption) : undefined, ...threadOpts });
    case "sticker":
      return bot.sendSticker(GROUP_ID, c.value.file_id, { message_thread_id: threadId });
    case "audio":
      return bot.sendAudio(GROUP_ID, c.value.file_id,
        { caption: c.caption ? escapeHtml(c.caption) : undefined, ...threadOpts });
    default:
      return bot.sendMessage(GROUP_ID, `<i>[Неизвестный тип сообщения]</i>`, threadOpts);
  }
}

// ─────────────────────────────────────────
// /start
// ─────────────────────────────────────────

bot.onText(/\/start/, (msg) => {
  if (msg.chat.id === GROUP_ID) return;

  bot.sendMessage(msg.chat.id,
    `👋 Привет! Это поддержка сервера <b>CultBox</b>.\n\n` +
    `📝 Напиши свой вопрос — администратор ответит тебе в ближайшее время.\n\n` +
    `<i>Укажи свой ник, что произошло и когда — это поможет решить проблему быстрее.</i>`,
    { parse_mode: "HTML" }
  );
});

// ─────────────────────────────────────────
// Основной обработчик
// ─────────────────────────────────────────

bot.on("message", async (msg) => {
  if (msg.text?.startsWith("/")) return;

  const chatId = msg.chat.id;

  // ── Сообщение из группы (ответ админа) ──
  if (String(chatId) === String(GROUP_ID)) {
    const threadId = msg.message_thread_id;
    if (!threadId) return;

    // Игнорируем системные сообщения и сообщения от самого бота
    if (!msg.from || msg.from.is_bot) return;

    const userId = sessions.topicToUser.get(threadId);
    if (!userId) return;

    try {
      await forwardToUser(userId, msg);
    } catch (err) {
      console.error("Ошибка отправки пользователю:", err.message);
      bot.sendMessage(GROUP_ID,
        `❌ Не удалось доставить сообщение пользователю <code>${userId}</code>.\nВозможно, он заблокировал бота.`,
        { parse_mode: "HTML", message_thread_id: threadId }
      );
    }
    return;
  }

  // ── Сообщение от пользователя ────────────
  try {
    const threadId = await getOrCreateTopic(chatId, msg.from);
    if (!threadId) {
      return bot.sendMessage(chatId,
        `⚠️ <b>Ошибка:</b> не удалось создать тему в группе.\n\nПроверь что бот является администратором группы с правом управления темами, и что в группе включён режим <b>Форум</b>.`,
        { parse_mode: "HTML" }
      );
    }

    await forwardToGroup(threadId, msg.from, msg);

    await bot.sendMessage(chatId,
      `✅ <b>Сообщение получено!</b>\n\nАдминистратор ответит тебе в ближайшее время.`,
      { parse_mode: "HTML" }
    );
  } catch (err) {
    console.error("Ошибка обработки сообщения:", err.message, err.response?.body);
    bot.sendMessage(chatId, "⚠️ Произошла ошибка. Попробуй ещё раз.");
  }
});

bot.on("polling_error", (err) => {
  console.error("Polling error:", err.message);
});

console.log(`🟢 CultBox Support Bot запущен`);
console.log(`💬 Forum группа: ${GROUP_ID}`);
console.log(`📁 Сессий загружено: ${sessions.userToTopic.size}`);
