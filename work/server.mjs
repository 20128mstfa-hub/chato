import http from "node:http";
import tls from "node:tls";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import {
  syncToIsolatedDatabases, getSystemDb, getUserDb, getChatDb, deleteUserIsolatedDb, deleteChatIsolatedDb, hashKey,
  getPinnedChats, setChatPin, getBlockedUsers, blockUser, unblockUser, isUserBlocked, addReport, getReports, resolveReport
} from "./database_manager.mjs";
import { initVapid, getVapidPublicKey, sendWebPush, sendPushToUser } from "./web_push.mjs";
import { restoreFromCloud, saveToCloudNow, saveToCloudDebounced, startKeepAlive } from "./cloud_persistence.mjs";

const startPort = Number(process.env.PORT || process.argv[2] || 4173);
const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(workspaceRoot, process.argv[3] || "outputs");
const portFile = path.join(workspaceRoot, "work", "server-url.txt");
const databaseFile = path.join(workspaceRoot, "work", "chato-db.json");
const emailConfigFile = path.join(workspaceRoot, "work", "email-config.json");
const aiConfigFile = path.join(workspaceRoot, "work", "ai-config.json");

async function getAiConfig() {
  try {
    const raw = await fs.readFile(aiConfigFile, "utf8");
    return JSON.parse(raw);
  } catch {
    return {
      geminiApiKey: process.env.GEMINI_API_KEY || "",
      openaiApiKey: process.env.OPENAI_API_KEY || "",
      activeProvider: "gemini"
    };
  }
}

async function saveAiConfig(cfg) {
  try {
    await fs.writeFile(aiConfigFile, JSON.stringify(cfg, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save ai-config.json", err);
  }
}

async function getEmailConfig() {
  try {
    const raw = await fs.readFile(emailConfigFile, "utf8");
    return JSON.parse(raw);
  } catch {
    return { senderEmail: "2012.8.mstfa@gmail.com", appPassword: "" };
  }
}
const openBrowser = process.argv.includes("--open");

// مفتاح تشفير السيرفر (32 بايت بصيغة Hex = 64 حرفاً) لـ AES-256-GCM
const rawHexKey = String(process.env.MESSAGE_ENCRYPTION_KEY || "").trim();
const DEFAULT_KEY_HEX = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const SERVER_ENCRYPTION_KEY = Buffer.from(rawHexKey.length === 64 ? rawHexKey : DEFAULT_KEY_HEX, "hex");

// تشفير نص الرسالة باستخدام AES-256-GCM مع IV عشوائي بطول 12 بايت
function encryptMessageContent(plainText, key = SERVER_ENCRYPTION_KEY) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(String(plainText || ""), "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return {
    content: encrypted,
    encryption_iv: iv.toString("hex"),
    encryption_auth_tag: authTag,
    is_encrypted: true
  };
}

// فك تشفير نص الرسالة والتحقق من عدم التلاعب (Auth Tag)
function decryptMessageContent(encryptedHex, ivHex, authTagHex, key = SERVER_ENCRYPTION_KEY) {
  try {
    if (!encryptedHex || !ivHex || !authTagHex) return encryptedHex;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    return encryptedHex; // fallback إذا كانت غير مشفرة أو قديمة
  }
}

// خريطة مؤشرات الكتابة الحية (Live Typing Indicator Cache)
const activeTypingMap = new Map();

// معالجة فك تشفير الرسالة للعرض
function prepareDecryptedMessage(m) {
  if (m.is_deleted) {
    return {
      ...m,
      text: "🚫 تم حذف هذه الرسالة",
      type: "deleted",
      imageUrl: "",
      audioUrl: "",
      fileName: "",
      location: null,
      poll: null,
      sticker: null,
      document: null
    };
  }
  let text = m.text || "";
  if (m.is_encrypted && m.encryption_iv && m.encryption_auth_tag) {
    text = decryptMessageContent(m.text, m.encryption_iv, m.encryption_auth_tag);
  }
  return {
    ...m,
    text
  };
}

// مهمة مجدولة لتنفيذ الحذف التلقائي للرسائل ذاتية التدمير (Cleanup Worker كل دقيقة)
async function cleanupExpiredMessages() {
  try {
    const database = await readDatabase();
    const now = Date.now();
    if (Array.isArray(database.messages)) {
      const beforeCount = database.messages.length;
      database.messages = database.messages.filter((m) => {
        const exp = Number(m.expires_at || m.expiresAt || 0);
        return !exp || exp > now;
      });
      if (database.messages.length !== beforeCount) {
        await writeDatabase(database);
        console.log(`[CLEANUP WORKER] Purged ${beforeCount - database.messages.length} expired disappearing message(s).`);
      }
    }
  } catch (err) {
    console.warn("[CLEANUP ERROR]", err.message);
  }
}
setInterval(cleanupExpiredMessages, 60000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".webm": "audio/webm",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".zip": "application/zip",
  ".rar": "application/x-rar-compressed",
  ".txt": "text/plain; charset=utf-8"
};

function safePath(url) {
  const parsed = new URL(url, "http://localhost");
  let requested = parsed.pathname === "/" ? "/index.html" : parsed.pathname;
  if (requested === "/admin") requested = "/admin.html";
  const resolved = path.resolve(root, `.${decodeURIComponent(requested)}`);
  return resolved.startsWith(root) ? resolved : path.join(root, "index.html");
}

const defaultExclusiveEmojis = [
  { id: "vip_crown", code: ":vip_crown:", title: "التاج الذهبي الملكي", symbol: "👑✨", rarity: "legendary", is_plus_only: true },
  { id: "fire_heart", code: ":fire_heart:", title: "قلب مشتعل ناري", symbol: "❤️‍🔥", rarity: "epic", is_plus_only: true },
  { id: "sparkle_diamond", code: ":sparkle_diamond:", title: "جوهرة نادرة براقة", symbol: "💎✨", rarity: "legendary", is_plus_only: true },
  { id: "rocket_boost", code: ":rocket_boost:", title: "صاروخ نفاث فائق", symbol: "🚀⚡", rarity: "epic", is_plus_only: true },
  { id: "magic_wand", code: ":magic_wand:", title: "عصا السحر الخارقة", symbol: "🪄✨", rarity: "rare", is_plus_only: true },
  { id: "star_eyes", code: ":star_eyes:", title: "عيون نجوم متلألئة", symbol: "🤩⭐", rarity: "rare", is_plus_only: true },
  { id: "golden_cup", code: ":golden_cup:", title: "كأس البطولة الذهبية", symbol: "🏆🌟", rarity: "epic", is_plus_only: true },
  { id: "galaxy_spin", code: ":galaxy_spin:", title: "مجرة دوارة متوهجة", symbol: "🌌✨", rarity: "legendary", is_plus_only: true },
  { id: "dragon_fire", code: ":dragon_fire:", title: "تنين ناري أسطوري", symbol: "🐉🔥", rarity: "legendary", is_plus_only: true },
  { id: "rich_cash", code: ":rich_cash:", title: "أموال طائرة وثراء", symbol: "💸✨", rarity: "rare", is_plus_only: true },
  { id: "party_popper", code: ":party_vip:", title: "مفرقعة احتفال ملكي", symbol: "🎉🎊", rarity: "rare", is_plus_only: true },
  { id: "lightning_bolt", code: ":lightning_power:", title: "برق الطاقة القصوى", symbol: "⚡🔥", rarity: "rare", is_plus_only: true }
];

const defaultStickerPacks = [
  {
    id: "pack_chato_animated",
    title: "ملصقات شاتو المتحركة 🌟",
    thumbnail_url: "/stickers/heart_beat.svg",
    is_animated: true,
    is_plus_only: false,
    created_at: 1730000000000
  },
  {
    id: "pack_chato_vip",
    title: "باقة VIP الذهبية 👑",
    thumbnail_url: "/stickers/vip_crown_glow.svg",
    is_animated: true,
    is_plus_only: true,
    created_at: 1730000000000
  }
];

const defaultAnimatedStickers = [
  { id: "stk_heart", pack_id: "pack_chato_animated", sticker_url: "/stickers/heart_beat.svg", emoji_tag: "❤️", title: "قلب نابض", width: 256, height: 256 },
  { id: "stk_laugh", pack_id: "pack_chato_animated", sticker_url: "/stickers/laugh_cry.svg", emoji_tag: "😂", title: "ضحك هستيري", width: 256, height: 256 },
  { id: "stk_fire", pack_id: "pack_chato_animated", sticker_url: "/stickers/fire_blaze.svg", emoji_tag: "🔥", title: "نار مشتعلة", width: 256, height: 256 },
  { id: "stk_party", pack_id: "pack_chato_animated", sticker_url: "/stickers/party_popper.svg", emoji_tag: "🎉", title: "احتفال وفرح", width: 256, height: 256 },
  { id: "stk_thumbs", pack_id: "pack_chato_animated", sticker_url: "/stickers/thumbs_up_star.svg", emoji_tag: "👍", title: "إعجاب متلألئ", width: 256, height: 256 },
  { id: "stk_rocket", pack_id: "pack_chato_animated", sticker_url: "/stickers/rocket_blast.svg", emoji_tag: "🚀", title: "انطلاق صاروخي", width: 256, height: 256 },
  { id: "stk_star", pack_id: "pack_chato_animated", sticker_url: "/stickers/magic_star.svg", emoji_tag: "✨", title: "نجمة متوهجة", width: 256, height: 256 },
  { id: "stk_crown", pack_id: "pack_chato_vip", sticker_url: "/stickers/vip_crown_glow.svg", emoji_tag: "👑", title: "تاج الملوك VIP", width: 256, height: 256 }
];

// ============================================================================
// محرك قاعدة بيانات SQLite عالية الأداء (Dedicated High-Performance SQLite)
// ============================================================================
const sqliteFile = path.join(workspaceRoot, "work", "chato.db");
let sqliteDb = null;
try {
  sqliteDb = new DatabaseSync(sqliteFile);
  sqliteDb.exec("PRAGMA journal_mode = WAL;");
  sqliteDb.exec("PRAGMA synchronous = NORMAL;");
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      name TEXT,
      password TEXT,
      pin TEXT,
      avatar TEXT,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      direct_pair TEXT,
      type TEXT,
      who_can_send TEXT DEFAULT 'everyone',
      last_message_at INTEGER,
      last_message_content TEXT,
      disappearing_timer_seconds INTEGER,
      is_ai_active INTEGER DEFAULT 0,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT,
      from_email TEXT,
      to_email TEXT,
      type TEXT,
      text TEXT,
      is_encrypted INTEGER,
      encryption_iv TEXT,
      encryption_auth_tag TEXT,
      image_url TEXT,
      audio_url TEXT,
      file_name TEXT,
      location_json TEXT,
      poll_json TEXT,
      sticker_json TEXT,
      document_json TEXT,
      reply_to_json TEXT,
      status TEXT,
      read INTEGER,
      edited INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      expires_at INTEGER,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS friendships (
      id TEXT PRIMARY KEY,
      from_email TEXT,
      to_email TEXT,
      status TEXT,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS friend_requests (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sticker_packs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      is_animated INTEGER NOT NULL DEFAULT 1,
      is_plus_only INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS animated_stickers (
      id TEXT PRIMARY KEY,
      pack_id TEXT NOT NULL,
      sticker_url TEXT NOT NULL,
      emoji_tag TEXT,
      width INTEGER DEFAULT 256,
      height INTEGER DEFAULT 256
    );
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT,
      auth TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);
    CREATE INDEX IF NOT EXISTS idx_messages_from_to ON messages(from_email, to_email);
    CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
    CREATE INDEX IF NOT EXISTS idx_friendships_lookup ON friendships(from_email, to_email);
    CREATE INDEX IF NOT EXISTS idx_friend_requests_recv ON friend_requests(receiver_id, status);
    CREATE INDEX IF NOT EXISTS idx_push_sub_email ON push_subscriptions(user_email);
  `);

  try { sqliteDb.exec("ALTER TABLE chats ADD COLUMN who_can_send TEXT DEFAULT 'everyone';"); } catch {}
  try { sqliteDb.exec("ALTER TABLE chats ADD COLUMN last_message_at INTEGER;"); } catch {}
  try { sqliteDb.exec("UPDATE user_subscriptions SET plan_title = 'بلاس AI شاتو (99 ريال)' WHERE plan_code = 'chato_ai_plus';"); } catch {}
  console.log("[SQLITE] Initialized chato.db successfully with WAL mode.");
} catch (err) {
  console.warn("[SQLITE INIT WARN]", err.message);
}

// ============================================================================
// نظام تخزين وحفظ الملفات على القرص بدلاً من Base64 (Dedicated File Storage)
// ============================================================================
function saveBase64MediaToFile(base64Data, defaultExt = "bin") {
  if (!base64Data || typeof base64Data !== "string") return base64Data;
  if (!base64Data.startsWith("data:")) return base64Data;

  try {
    const matches = base64Data.match(/^data:([a-zA-Z0-9_\-\.\/]+);base64,(.+)$/);
    if (!matches) return base64Data;

    const mime = matches[1];
    const rawData = matches[2];
    const buffer = Buffer.from(rawData, "base64");

    const mimeToExt = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "audio/webm": "webm",
      "audio/ogg": "ogg",
      "audio/wav": "wav",
      "audio/mpeg": "mp3",
      "audio/mp3": "mp3",
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "application/zip": "zip",
      "text/plain": "txt"
    };

    const ext = mimeToExt[mime] || defaultExt;
    const filename = `${crypto.randomUUID()}.${ext}`;
    const targetOutputs = path.join(root, "uploads", filename);
    const targetBuild = path.resolve(root, "../build/uploads", filename);

    fsSync.writeFileSync(targetOutputs, buffer);
    try {
      fsSync.writeFileSync(targetBuild, buffer);
    } catch {}

    return `/uploads/${filename}`;
  } catch (err) {
    console.error("[UPLOAD SAVE ERROR]", err);
    return base64Data;
  }
}

// ============================================================================
// البث اللحظي الفوري عبر Server-Sent Events (Real-Time Push Stream)
// ============================================================================
const sseClients = new Map(); // email -> Set<res>

function addSseClient(email, res) {
  const clean = String(email || "").trim().toLowerCase();
  if (!clean) return;
  if (!sseClients.has(clean)) sseClients.set(clean, new Set());
  sseClients.get(clean).add(res);
}

function removeSseClient(email, res) {
  const clean = String(email || "").trim().toLowerCase();
  if (!clean || !sseClients.has(clean)) return;
  const set = sseClients.get(clean);
  set.delete(res);
  if (set.size === 0) sseClients.delete(clean);
}

function broadcastToUser(email, eventType, data) {
  const clean = String(email || "").trim().toLowerCase();
  if (!clean || !sseClients.has(clean)) return;
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients.get(clean)) {
    try {
      client.write(payload);
    } catch {
      removeSseClient(clean, client);
    }
  }
}

async function readDatabase() {
  try {
    const data = JSON.parse(await fs.readFile(databaseFile, "utf8"));
    return {
      users: Array.isArray(data.users) ? data.users : [],
      friendships: Array.isArray(data.friendships) ? data.friendships : [],
      friendRequests: Array.isArray(data.friendRequests) ? data.friendRequests : [],
      messages: Array.isArray(data.messages) ? data.messages : [],
      aiUsage: Array.isArray(data.aiUsage) ? data.aiUsage : [],
      ads: Array.isArray(data.ads) ? data.ads : [],
      supportTickets: Array.isArray(data.supportTickets) ? data.supportTickets : [],
      userDevices: Array.isArray(data.userDevices) ? data.userDevices : [],
      pushSubscriptions: Array.isArray(data.pushSubscriptions) ? data.pushSubscriptions : [],
      emailVerifications: Array.isArray(data.emailVerifications) ? data.emailVerifications : [],
      chats: Array.isArray(data.chats) ? data.chats : [],
      chatParticipants: Array.isArray(data.chatParticipants) ? data.chatParticipants : [],
      chatSettings: Array.isArray(data.chatSettings) ? data.chatSettings : [],
      userSubscriptions: Array.isArray(data.userSubscriptions) ? data.userSubscriptions : [],
      userStories: Array.isArray(data.userStories) ? data.userStories : [],
      storyViews: Array.isArray(data.storyViews) ? data.storyViews : [],
      pinnedMessages: Array.isArray(data.pinnedMessages) ? data.pinnedMessages : [],
      exclusiveEmojis: Array.isArray(data.exclusiveEmojis) && data.exclusiveEmojis.length ? data.exclusiveEmojis : defaultExclusiveEmojis,
      stickerPacks: Array.isArray(data.stickerPacks) && data.stickerPacks.length ? data.stickerPacks : defaultStickerPacks,
      animatedStickers: Array.isArray(data.animatedStickers) && data.animatedStickers.length ? data.animatedStickers : defaultAnimatedStickers
    };
  } catch {
    return { users: [], friendships: [], friendRequests: [], messages: [], aiUsage: [], ads: [], supportTickets: [], userDevices: [], pushSubscriptions: [], emailVerifications: [], chats: [], chatParticipants: [], chatSettings: [], userSubscriptions: [], userStories: [], storyViews: [], pinnedMessages: [], exclusiveEmojis: defaultExclusiveEmojis, stickerPacks: defaultStickerPacks, animatedStickers: defaultAnimatedStickers };
  }
}

async function writeDatabase(database) {
  if (sqliteDb) {
    try {
      sqliteDb.exec("BEGIN TRANSACTION;");
      if (Array.isArray(database.users)) {
        const stmtUser = sqliteDb.prepare(`
          INSERT OR REPLACE INTO users (id, email, name, password, pin, avatar, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        for (const u of database.users) {
          stmtUser.run(
            String(u.id || crypto.randomUUID()),
            String(u.email || "").toLowerCase(),
            String(u.name || ""),
            String(u.password || ""),
            String(u.pin || ""),
            String(u.avatar || u.image || ""),
            Number(u.createdAt || Date.now())
          );
        }
      }
      if (Array.isArray(database.chats)) {
        const stmtChat = sqliteDb.prepare(`
          INSERT OR REPLACE INTO chats (id, direct_pair, type, who_can_send, last_message_at, last_message_content, disappearing_timer_seconds, is_ai_active, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const c of database.chats) {
          stmtChat.run(
            String(c.id || ""),
            String(c.direct_pair || ""),
            String(c.type || "direct"),
            String(c.who_can_send || "everyone"),
            Number(c.last_message_at || 0) || null,
            String(c.last_message_content || ""),
            Number(c.disappearing_timer_seconds || 0) || null,
            c.is_ai_active ? 1 : 0,
            Number(c.created_at || Date.now())
          );
        }
      }
      if (Array.isArray(database.friendRequests)) {
        const stmtReq = sqliteDb.prepare(`
          INSERT OR REPLACE INTO friend_requests (id, sender_id, receiver_id, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        for (const r of database.friendRequests) {
          stmtReq.run(
            String(r.id || crypto.randomUUID()),
            String(r.sender_id || "").toLowerCase(),
            String(r.receiver_id || "").toLowerCase(),
            String(r.status || "pending"),
            Number(r.created_at || Date.now()),
            Number(r.updated_at || Date.now())
          );
        }
      }
      if (Array.isArray(database.pushSubscriptions)) {
        const stmtPush = sqliteDb.prepare(`
          INSERT OR REPLACE INTO push_subscriptions (id, user_email, endpoint, p256dh, auth, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        for (const p of database.pushSubscriptions) {
          stmtPush.run(
            String(p.id || crypto.randomUUID()),
            String(p.user_email || "").toLowerCase(),
            String(p.endpoint || ""),
            String(p.p256dh || ""),
            String(p.auth || ""),
            Number(p.created_at || Date.now())
          );
        }
      }
      if (Array.isArray(database.messages)) {
        const stmtMsg = sqliteDb.prepare(`
          INSERT OR REPLACE INTO messages (
            id, chat_id, from_email, to_email, type, text,
            is_encrypted, encryption_iv, encryption_auth_tag,
            image_url, audio_url, file_name,
            location_json, poll_json, sticker_json, document_json, reply_to_json,
            status, read, edited, is_deleted, expires_at, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const m of database.messages) {
          stmtMsg.run(
            String(m.id || crypto.randomUUID()),
            String(m.chat_id || ""),
            String(m.from || "").toLowerCase(),
            String(m.to || "").toLowerCase(),
            String(m.type || "text"),
            String(m.text || ""),
            m.is_encrypted ? 1 : 0,
            m.encryption_iv || "",
            m.encryption_auth_tag || "",
            m.imageUrl || "",
            m.audioUrl || "",
            m.fileName || "",
            m.location ? JSON.stringify(m.location) : null,
            m.poll ? JSON.stringify(m.poll) : null,
            m.sticker ? JSON.stringify(m.sticker) : null,
            m.document ? JSON.stringify(m.document) : null,
            m.reply_to ? (typeof m.reply_to === "object" ? JSON.stringify(m.reply_to) : String(m.reply_to)) : null,
            m.status || "sent",
            m.read ? 1 : 0,
            m.edited ? 1 : 0,
            m.is_deleted ? 1 : 0,
            Number(m.expires_at || m.expiresAt || 0) || null,
            Number(m.createdAt || Date.now())
          );
        }
      }
      if (Array.isArray(database.friendships)) {
        const stmtFriend = sqliteDb.prepare(`
          INSERT OR REPLACE INTO friendships (id, from_email, to_email, status, created_at)
          VALUES (?, ?, ?, ?, ?)
        `);
        for (const f of database.friendships) {
          stmtFriend.run(
            String(f.id || crypto.randomUUID()),
            String(f.from || "").toLowerCase(),
            String(f.to || "").toLowerCase(),
            String(f.status || "accepted"),
            Number(f.createdAt || Date.now())
          );
        }
      }
      sqliteDb.exec("COMMIT;");
    } catch (sqlErr) {
      sqliteDb.exec("ROLLBACK;");
      console.warn("[SQLITE WRITE ERROR]", sqlErr.message);
    }
  }
  try {
    await syncToIsolatedDatabases(database);
  } catch (isoErr) {
    console.warn("[ISOLATED DB SYNC ERROR]", isoErr.message);
  }
  await fs.writeFile(databaseFile, JSON.stringify(database, null, 2), "utf8");
  try {
    saveToCloudDebounced(database);
  } catch (cloudErr) {
    console.warn("[PERSISTENCE DEBOUNCED WARN]", cloudErr.message);
  }
}

// 5. الحذف التلقائي للحالات بعد 24 ساعة (24h Auto-Cleanup Worker)
async function cleanupExpiredStories(database) {
  const now = Date.now();
  database.userStories = Array.isArray(database.userStories) ? database.userStories : [];
  database.storyViews = Array.isArray(database.storyViews) ? database.storyViews : [];
  const initialLen = database.userStories.length;
  database.userStories = database.userStories.filter((s) => Number(s.expires_at) > now);
  if (database.userStories.length !== initialLen) {
    const validIds = new Set(database.userStories.map((s) => s.id));
    database.storyViews = database.storyViews.filter((v) => validIds.has(v.story_id));
    await writeDatabase(database);
  }
}

// تشغيل تنظيف الاستوري التلقائي كل 5 دقائق
setInterval(async () => {
  try {
    const db = await readDatabase();
    await cleanupExpiredStories(db);
  } catch (err) {
    console.warn("Auto cleanup stories warning:", err.message);
  }
}, 5 * 60 * 1000);

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-pin, Authorization, Accept"
  });
  res.end(JSON.stringify(data));
}

async function readJsonBody(req) {
  let body = "";
  for await (const part of req) body += part;
  return JSON.parse(body || "{}");
}

function normalizeName(value) {
  return String(value || "").toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/\s+/g, " ").trim();
}

function publicUser(user) {
  const now = Date.now();
  const isVip = Boolean(user && user.vipUntil && now < user.vipUntil);
  const isChatPlus = Boolean(user && user.chatPlusUntil && now < user.chatPlusUntil);
  return {
    name: user.name,
    email: user.email,
    image: user.image || "",
    isVip,
    vipUntil: user?.vipUntil || null,
    isChatPlus,
    chatPlusUntil: user?.chatPlusUntil || null
  };
}

function utcDay() {
  return new Date().toISOString().slice(0, 10);
}

function countWords(str) {
  if (!str) return 0;
  return String(str).trim().split(/\s+/).filter(Boolean).length;
}

// إدارة باقات واشتراكات المستخدمين وتجديد الحصص اليومية وصلاحية الـ 60 يوماً
function getOrUpdateUserSubscription(database, email) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  database.userSubscriptions = Array.isArray(database.userSubscriptions) ? database.userSubscriptions : [];
  let sub = database.userSubscriptions.find((s) => s.email && s.email.toLowerCase() === cleanEmail);
  const now = Date.now();
  const user = (database.users || []).find((u) => u.email.toLowerCase() === cleanEmail);

  if (!sub) {
    const isVip = Boolean(user && user.vipUntil && now < user.vipUntil);
    sub = {
      id: crypto.randomUUID(),
      user_id: user?.id || cleanEmail,
      email: cleanEmail,
      plan_code: isVip ? "chato_ai_plus" : "free",
      plan_title: isVip ? "بلاس AI شاتو" : "الباقة المجانية",
      is_active: isVip,
      daily_words_limit: isVip ? 500 : 90,
      daily_words_used: 0,
      daily_ai_images_limit: isVip ? 20 : 3,
      daily_ai_images_used: 0,
      unlimited_media_sending: isVip,
      last_quota_reset_at: now,
      next_quota_reset_at: now + 24 * 3600 * 1000,
      started_at: now,
      expires_at: isVip ? user.vipUntil : (now + 60 * 24 * 3600 * 1000),
      auto_renew: true,
      created_at: now,
      updated_at: now
    };
    database.userSubscriptions.push(sub);
  }

  // 1. فحص انتهاء مدة الـ 60 يوماً والتجديد التلقائي (60-Day Validity & Auto-Renew)
  if (sub.plan_code === "chato_ai_plus") {
    if (now >= sub.expires_at) {
      if (sub.auto_renew) {
        sub.started_at = now;
        sub.expires_at = now + (60 * 24 * 3600 * 1000);
        sub.is_active = true;
        sub.daily_words_used = 0;
        sub.daily_ai_images_used = 0;
        sub.last_quota_reset_at = now;
        sub.next_quota_reset_at = now + (24 * 3600 * 1000);
        if (user) user.vipUntil = sub.expires_at;
      } else {
        sub.is_active = false;
        sub.plan_code = "free";
        sub.plan_title = "الباقة المجانية";
        sub.daily_words_limit = 90;
        sub.daily_ai_images_limit = 3;
        sub.unlimited_media_sending = false;
        if (user) user.vipUntil = null;
      }
      sub.updated_at = now;
    }
  }

  // 2. فحص تجديد الحصة اليومية كل 24 ساعة تلقائياً (24h Auto-Reset)
  if (now >= sub.next_quota_reset_at) {
    sub.daily_words_used = 0;
    sub.daily_ai_images_used = 0;
    sub.last_quota_reset_at = now;
    sub.next_quota_reset_at = now + (24 * 3600 * 1000);
    sub.updated_at = now;
  }

  // المزامنة مع حالة vipUntil للمستخدم
  if (user) {
    if (sub.is_active && sub.plan_code === "chato_ai_plus") {
      user.vipUntil = sub.expires_at;
    }
  }

  return sub;
}

function getUserVipStatus(database, email) {
  const cleanEmail = String(email || "").toLowerCase();
  const user = (database.users || []).find((u) => u.email.toLowerCase() === cleanEmail);
  const now = Date.now();
  const isVip = Boolean(user && user.vipUntil && now < user.vipUntil);
  const vipUntil = user?.vipUntil || null;
  const daysRemaining = isVip ? Math.max(1, Math.ceil((user.vipUntil - now) / (24 * 3600 * 1000))) : 0;
  return { isVip, vipUntil, daysRemaining, user };
}

function isChatPlusSubscriber(database, email) {
  if (!email) return false;
  const clean = String(email).trim().toLowerCase();
  const now = Date.now();
  const user = (database.users || []).find((u) => u.email.toLowerCase() === clean);
  if (user && user.chatPlusUntil && user.chatPlusUntil > now) return true;
  if (user && user.isChatPlus) return true;
  const sub = (database.userSubscriptions || []).find((s) => s.email && s.email.toLowerCase() === clean && s.plan_code === "chato_plus");
  if (sub && sub.is_active && (!sub.expires_at || sub.expires_at > now)) return true;
  return false;
}

function isPlusSubscriber(database, email) {
  return isChatPlusSubscriber(database, email);
}

function usageFor(database, email) {
  const day = utcDay();
  const cleanEmail = String(email || "").toLowerCase();
  database.aiUsage = Array.isArray(database.aiUsage) ? database.aiUsage : [];
  let usage = database.aiUsage.find((item) => item.email.toLowerCase() === cleanEmail && item.day === day);
  if (!usage) {
    usage = { email: cleanEmail, day, words: 0, images: 0 };
    database.aiUsage.push(usage);
  }
  if (usage.words === undefined) usage.words = 0;
  if (usage.images === undefined) usage.images = 0;
  return usage;
}

function usageSummary(usage, database) {
  const sub = getOrUpdateUserSubscription(database, usage.email);
  const { isVip, vipUntil, daysRemaining } = getUserVipStatus(database, usage.email);
  const maxWords = isVip ? 500 : 90;
  const maxImages = isVip ? 20 : 3;
  const wordsUsed = Number(usage.words || 0);
  const imagesUsed = Number(usage.images || 0);
  sub.daily_words_used = wordsUsed;
  sub.daily_ai_images_used = imagesUsed;
  const wordsRemaining = Math.max(0, maxWords - wordsUsed);
  const imagesRemaining = Math.max(0, maxImages - imagesUsed);

  return {
    isVip,
    vipUntil,
    vipDaysRemaining: daysRemaining,
    plan_code: sub.plan_code,
    plan_title: sub.plan_title,
    next_quota_reset_at: sub.next_quota_reset_at,
    maxWords,
    wordsUsed,
    wordsRemaining,
    maxImages,
    imagesUsed,
    imagesRemaining,
    unlimitedSendImages: isVip,
    // backward compatibility
    messagesRemaining: wordsRemaining,
    unlimited: isVip
  };
}

async function callOpenAi(pathname, body) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("لم يتم ربط مفتاح OpenAI API بعد.");
  const response = await fetch(`https://api.openai.com/v1${pathname}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "تعذر الاتصال بالذكاء الاصطناعي.");
  return data;
}

// دالة الذكاء الاصطناعي Chato Assistant مع دعم Google Gemini و OpenAI والمحركات الذكية المباشرة
async function askChatGPT(prompt) {
  const aiCfg = await getAiConfig();
  const geminiKey = (aiCfg.geminiApiKey || process.env.GEMINI_API_KEY || "").trim();
  const openAiKey = (aiCfg.openaiApiKey || process.env.OPENAI_API_KEY || "").trim();

  // 1. فحص محرك Google Gemini الفائق السرعة
  if (geminiKey) {
    try {
      const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت Chato Assistant، المساعد الذكي لتطبيق Chato (Powered by Advanced AI). تجيب بأسلوب عربي فصيح ودقيق وواضح وتساعد في كافة المجالات والمعلومات والبرمجة والترجمة وكتابة النصوص:\n\n${prompt}` }] }]
        })
      });
      const gData = await gRes.json();
      const text = gData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err) {
      console.warn("Gemini API error, fallback to other engines:", err.message);
    }
  }

  // 2. فحص محرك OpenAI (ChatGPT)
  if (openAiKey) {
    try {
      const data = await callOpenAi("/chat/completions", {
        model: process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: "أنت Chato Assistant، مساعد ذكاء اصطناعي ذكي وشامل في تطبيق Chato. تجيب بأسلوب عربي فصيح ودقيق وواضح وتساعد في كافة المجالات والمعلومات والبرمجة والترجمة وكتابة النصوص." },
          { role: "user", content: String(prompt || "") }
        ]
      });
      const text = data.choices?.[0]?.message?.content;
      if (text) return text;
    } catch (err) {
      console.warn("OpenAI API error, fallback to free Chato engine:", err.message);
    }
  }

  // 3. المحرك المباشر الشامل (نموذج الذكاء الاصطناعي المجاني المباشر)
  try {
    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "أنت Chato Assistant، مساعد ذكاء اصطناعي ذكي وشامل في تطبيق Chato (Powered by Advanced AI). تجيب بأسلوب عربي فصيح ودقيق وواضح وتساعد في كافة المجالات والمعلومات والبرمجة والترجمة وكتابة النصوص." },
          { role: "user", content: String(prompt || "") }
        ],
        model: "openai"
      })
    });
    const text = await res.text();
    if (text && !text.includes("Free limit reached")) {
      return text;
    }
  } catch (err) {
    console.warn("Pollinations Chato Assistant error:", err?.message);
  }

  // محاولة بديلة سريعة
  try {
    const fallbackRes = await fetch("https://text.pollinations.ai/" + encodeURIComponent(String(prompt || "")) + "?model=openai");
    const fallbackText = await fallbackRes.text();
    if (fallbackText && !fallbackText.includes("Free limit reached")) {
      return fallbackText;
    }
  } catch (err) {
    console.warn("Pollinations GET fallback error:", err?.message);
  }

  return "أنا Chato Assistant حاضر معكم في المحادثة وجاهز لمساعدتكم! 🤖✨ أرجو طرح سؤالك مرة أخرى وسأجيبكم على الفور.";
}

// دالة الترجمة الفورية بالذكاء الاصطناعي الحصرية لمشتركي بلاس
async function translateText(content, targetLang = "ar") {
  const isArabic = /[\u0600-\u06FF]/.test(content);
  let langInstruction = "Arabic (العربية)";
  if (targetLang === "en" || (targetLang === "auto" && isArabic)) {
    langInstruction = "English";
  } else if (targetLang === "ar" || (targetLang === "auto" && !isArabic)) {
    langInstruction = "Arabic (العربية)";
  } else if (targetLang) {
    langInstruction = targetLang;
  }
  const prompt = `Translate the following chat message accurately, fluently and conversationally into ${langInstruction}. Output ONLY the final translated text without any markdown bolding, notes, explanations, or quotes:\n\n${content}`;
  const translated = await askChatGPT(prompt);
  return translated.replace(/^["'«»]|["'«»]$/g, "").trim();
}

// دالة توليد الصور بالذكاء الاصطناعي (حتى 4 صور يومياً)
async function generateAiImage(prompt) {
  if (process.env.OPENAI_API_KEY) {
    try {
      const data = await callOpenAi("/images/generations", {
        model: process.env.OPENAI_IMAGE_MODEL || "dall-e-3",
        prompt: String(prompt || ""),
        size: "1024x1024",
        response_format: "b64_json"
      });
      const b64 = data.data?.[0]?.b64_json;
      if (b64) return `data:image/jpeg;base64,${b64}`;
    } catch (err) {
      console.warn("OpenAI Image error, fallback to Pollinations Image engine:", err.message);
    }
  }

  // توليد صور فوري بجودة عالية
  const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true`;
  const resImg = await fetch(imgUrl);
  if (!resImg.ok) throw new Error("تعذر إنشاء الصورة حالياً.");
  const arrayBuf = await resImg.arrayBuffer();
  const b64 = Buffer.from(arrayBuf).toString("base64");
  return `data:image/jpeg;base64,${b64}`;
}

function isValidPassword(password) {
  const p = String(password || "");
  return p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p);
}

// تشفير كلمات المرور باستخدام Scrypt عالي الأمان مع Salt فريد
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

// التحقق من صحة كلمة المرور (مع دعم الحسابات السابقة)
function verifyPassword(password, stored) {
  if (!stored) return false;
  const p = String(password || "");
  if (stored.startsWith("scrypt:")) {
    const parts = stored.split(":");
    if (parts.length === 3) {
      const salt = parts[1];
      const hash = parts[2];
      const calculated = crypto.scryptSync(p, salt, 64).toString("hex");
      try {
        return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(calculated, "hex"));
      } catch {
        return false;
      }
    }
  }
  // التوافق الرجعي مع كلمات المرور التجريبية القديمة
  return stored === p;
}

// تشفير كود التحقق OTP باستخدام SHA-256
function hashOtp(code, email) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanCode = String(code || "").trim();
  return crypto.createHash("sha256").update(`${cleanEmail}:${cleanCode}`).digest("hex");
}

// إنشاء جلسة دخول موثقة وإصدار Access Token و Refresh Token
function createSession(database, user, deviceId = "web") {
  database.userDevices = Array.isArray(database.userDevices) ? database.userDevices : [];
  const accessToken = crypto.randomBytes(32).toString("hex");
  const refreshToken = crypto.randomBytes(48).toString("hex");
  const accessTokenHash = crypto.createHash("sha256").update(accessToken).digest("hex");
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const now = Date.now();
  const expiresAt = now + 60 * 24 * 60 * 60 * 1000; // 60 يوماً للجلسة المستمرة

  const existingIdx = database.userDevices.findIndex((d) => (d.user_id === user.id || d.email === user.email) && d.device_id === deviceId);
  const deviceRecord = {
    id: existingIdx !== -1 ? database.userDevices[existingIdx].id : crypto.randomUUID(),
    user_id: user.id,
    email: user.email,
    device_id: deviceId,
    device_type: "web",
    access_token_hash: accessTokenHash,
    refresh_token_hash: refreshTokenHash,
    expires_at: expiresAt,
    last_active_at: now,
    created_at: existingIdx !== -1 ? database.userDevices[existingIdx].created_at : now
  };

  if (existingIdx !== -1) {
    database.userDevices[existingIdx] = deviceRecord;
  } else {
    database.userDevices.push(deviceRecord);
  }

  return { accessToken, refreshToken, expiresAt };
}

// التحقق من صحة توكن المستخدم
function getUserFromToken(database, authHeader) {
  if (!authHeader) return null;
  const token = String(authHeader).replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  database.userDevices = Array.isArray(database.userDevices) ? database.userDevices : [];
  const device = database.userDevices.find((d) => d.access_token_hash === hash && (!d.expires_at || d.expires_at > Date.now()));
  if (!device) return null;
  device.last_active_at = Date.now();
  return database.users.find((u) => u.id === device.user_id || u.email === device.email) || null;
}

// In-memory verification codes store: email -> { code, otp_hash, attempts, expiresAt }
const verificationCodes = new Map();

async function sendVerificationEmail(to, code) {
  const config = await getEmailConfig();
  const fromEmail = config.senderEmail || "2012.8.mstfa@gmail.com";
  const pass = (config.appPassword || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD || "").replace(/\s+/g, "");

  console.log(`[EMAIL DISPATCH REQUEST] From: ${fromEmail} To: ${to} Code: ${code}`);

  if (!pass) {
    console.log(`[EMAIL DISPATCH (SIMULATED)] From: ${fromEmail} To: ${to} Code: ${code}`);
    return { ok: true, simulated: true };
  }

  return new Promise((resolve) => {
    try {
      const socket = tls.connect({ host: "smtp.gmail.com", port: 465, timeout: 15000 }, () => {
        let step = 0;
        const send = (cmd) => socket.write(cmd + "\r\n");
        socket.on("data", (data) => {
          const str = data.toString();
          if (step === 0 && str.startsWith("220")) {
            step++;
            send("EHLO localhost");
          } else if (step === 1 && str.startsWith("250")) {
            step++;
            send("AUTH LOGIN");
          } else if (step === 2 && str.startsWith("334")) {
            step++;
            send(Buffer.from(fromEmail).toString("base64"));
          } else if (step === 3 && str.startsWith("334")) {
            step++;
            send(Buffer.from(pass).toString("base64"));
          } else if (step === 4 && str.startsWith("235")) {
            step++;
            send(`MAIL FROM:<${fromEmail}>`);
          } else if (step === 5 && str.startsWith("250")) {
            step++;
            send(`RCPT TO:<${to}>`);
          } else if (step === 6 && str.startsWith("250")) {
            step++;
            send("DATA");
          } else if (step === 7 && str.startsWith("354")) {
            step++;
            const subject = "كود توثيق حسابك في Chato";
            const html = `
              <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #f7fafc; padding: 25px; color: #2d3748;">
                <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); text-align: center;">
                  <h2 style="color: #0f766e; margin-bottom: 10px;">Chato - شاتو</h2>
                  <p style="font-size: 16px; margin-bottom: 20px;">كود توثيق حسابك الجديد هو:</p>
                  <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f766e; background: #e6fffa; padding: 15px 25px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
                    ${code}
                  </div>
                  <p style="font-size: 13px; color: #718096; margin-top: 15px;">هذا الكود صالح لمدة 10 دقائق فقط. تم إرساله من ${fromEmail}</p>
                </div>
              </div>
            `;
            const emailBody = [
              `From: "Chato App" <${fromEmail}>`,
              `To: <${to}>`,
              `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
              `MIME-Version: 1.0`,
              `Content-Type: text/html; charset=UTF-8`,
              ``,
              html,
              `.`
            ].join("\r\n");
            send(emailBody);
          } else if (step === 8 && str.startsWith("250")) {
            send("QUIT");
            socket.end();
            console.log(`[EMAIL DISPATCH SUCCESS] Real verification code sent to ${to}`);
            resolve({ ok: true, sent: true });
          } else if (str.startsWith("5") || str.startsWith("4")) {
            console.error("[SMTP Error]", str);
            socket.destroy();
            resolve({ ok: false, error: "فشل إرسال الإيميل من خادم Gmail: تأكد من صحة كلمة مرور التطبيقات (App Password)." });
          }
        });
      });
      socket.on("error", (err) => {
        console.error("[SMTP Socket Error]", err.message);
        resolve({ ok: false, error: "تعذر الاتصال بخادم بريد Google SMTP." });
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve({ ok: false, error: "انتهت مهلة الاتصال بخادم بريد Google." });
      });
    } catch (err) {
      resolve({ ok: false, error: err.message });
    }
  });
}

async function handleApi(req, res, url) {
  // 0. البث اللحظي الفوري عبر Server-Sent Events (SSE Real-Time Stream)
  if (req.method === "GET" && url.pathname === "/api/realtime") {
    const email = url.searchParams.get("email");
    if (!email) {
      sendJson(res, 400, { error: "email is required" });
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    });
    res.write(`event: connected\ndata: ${JSON.stringify({ ok: true, timestamp: Date.now() })}\n\n`);
    addSseClient(email, res);

    const keepAlive = setInterval(() => {
      try {
        res.write(": ping\n\n");
      } catch {
        clearInterval(keepAlive);
      }
    }, 15000);

    req.on("close", () => {
      clearInterval(keepAlive);
      removeSseClient(email, res);
    });
    return;
  }

  // 0.2 إشعارات الخلفية الحقيقية (Web Push / Push Notifications - VAPID)
  if (req.method === "GET" && (url.pathname === "/api/push/vapid-public-key" || url.pathname === "/api/devices/vapid-key")) {
    sendJson(res, 200, { ok: true, publicKey: getVapidPublicKey() });
    return;
  }

  if (req.method === "POST" && (url.pathname === "/api/devices/save-push-token" || url.pathname === "/api/push/subscribe")) {
    const { email, user_email, subscription, token, endpoint, keys, p256dh, auth } = await readJsonBody(req);
    const cleanEmail = String(email || user_email || "").trim().toLowerCase();
    const database = await readDatabase();
    database.pushSubscriptions = Array.isArray(database.pushSubscriptions) ? database.pushSubscriptions : [];

    const finalEndpoint = subscription?.endpoint || endpoint || token;
    const finalP256dh = subscription?.keys?.p256dh || keys?.p256dh || p256dh || "";
    const finalAuth = subscription?.keys?.auth || keys?.auth || auth || "";

    if (cleanEmail && finalEndpoint) {
      const existingIdx = database.pushSubscriptions.findIndex((s) => s.endpoint === finalEndpoint);
      const subRecord = {
        id: crypto.randomUUID(),
        user_email: cleanEmail,
        endpoint: finalEndpoint,
        p256dh: finalP256dh,
        auth: finalAuth,
        created_at: Date.now()
      };
      if (existingIdx !== -1) {
        database.pushSubscriptions[existingIdx] = subRecord;
      } else {
        database.pushSubscriptions.push(subRecord);
      }
      await writeDatabase(database);
      sendJson(res, 200, { ok: true, message: "تم تسجيل اشتراك الإشعارات بنجاح" });
    } else {
      sendJson(res, 400, { error: "email and push endpoint required" });
    }
    return;
  }

  // 0.3 الملصقات المتحركة الحقيقية (Animated Stickers Packs)
  if (req.method === "GET" && url.pathname === "/api/stickers/packs") {
    const database = await readDatabase();
    const packs = (database.stickerPacks && database.stickerPacks.length) ? database.stickerPacks : defaultStickerPacks;
    const stickers = (database.animatedStickers && database.animatedStickers.length) ? database.animatedStickers : defaultAnimatedStickers;
    const packsWithStickers = packs.map((p) => ({
      ...p,
      stickers: stickers.filter((s) => s.pack_id === p.id)
    }));
    sendJson(res, 200, { ok: true, packs: packsWithStickers });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/stickers") {
    const database = await readDatabase();
    const stickers = (database.animatedStickers && database.animatedStickers.length) ? database.animatedStickers : defaultAnimatedStickers;
    sendJson(res, 200, { ok: true, stickers });
    return;
  }

  // 0.4 نظام طلبات الصداقة والإشعارات (Friend Requests System)
  if (req.method === "POST" && (url.pathname === "/api/friends/request" || url.pathname === "/api/friendships/request")) {
    const { from, to, sender_email, receiver_email } = await readJsonBody(req);
    const cleanFrom = String(from || sender_email || "").trim().toLowerCase();
    const cleanTo = String(to || receiver_email || "").trim().toLowerCase();
    if (!cleanFrom || !cleanTo || cleanFrom === cleanTo) {
      sendJson(res, 400, { error: "يرجى تحديد حساب الصديق بشكل صحيح" });
      return;
    }
    const database = await readDatabase();
    database.friendRequests = Array.isArray(database.friendRequests) ? database.friendRequests : [];
    database.friendships = Array.isArray(database.friendships) ? database.friendships : [];
    database.users = Array.isArray(database.users) ? database.users : [];

    const sender = database.users.find((u) => u.email.toLowerCase() === cleanFrom);
    const receiver = database.users.find((u) => u.email.toLowerCase() === cleanTo);
    if (!receiver) {
      sendJson(res, 404, { error: "المستخدم غير مسجل في شاتو" });
      return;
    }

    // هل هم أصدقاء بالفعل؟
    const isFriend = database.friendships.some((f) => 
      ((f.from === cleanFrom && f.to === cleanTo) || (f.from === cleanTo && f.to === cleanFrom)) && 
      (f.status === "accepted" || !f.status)
    );
    if (isFriend) {
      sendJson(res, 200, { ok: true, message: "أنتم أصدقاء بالفعل", status: "already_friends" });
      return;
    }

    // هل هناك طلب معلق سابق؟
    const existingReq = database.friendRequests.find((r) => 
      ((r.sender_id === cleanFrom && r.receiver_id === cleanTo) || (r.sender_id === cleanTo && r.receiver_id === cleanFrom)) && 
      r.status === "pending"
    );
    if (existingReq) {
      sendJson(res, 200, { ok: true, message: "يوجد طلب صداقة معلق بالفعل", status: "pending", requestId: existingReq.id });
      return;
    }

    const newReq = {
      id: crypto.randomUUID(),
      sender_id: cleanFrom,
      receiver_id: cleanTo,
      status: "pending",
      created_at: Date.now(),
      updated_at: Date.now()
    };
    database.friendRequests.push(newReq);
    await writeDatabase(database);

    const senderUser = publicUser(sender || { email: cleanFrom, name: cleanFrom.split("@")[0] });
    // إشعار فوري لحظي للمستلم
    broadcastToUser(cleanTo, "friend_request", {
      id: newReq.id,
      from: senderUser,
      createdAt: newReq.created_at
    });

    // إشعار خلفية Web Push في حال كان التطبيق مغلقاً
    sendPushToUser(cleanTo, {
      title: "طلب صداقة جديد 🤝",
      body: `أرسل لك ${senderUser.name} طلب صداقة في شاتو`,
      icon: "/logo.png",
      data: { url: "/?tab=notifications", type: "friend_request" }
    }, database).catch(() => {});

    sendJson(res, 201, { ok: true, message: "تم إرسال طلب الصداقة بنجاح 🤝", request: newReq });
    return;
  }

  if (req.method === "POST" && (url.pathname === "/api/friends/respond" || url.pathname === "/api/friendships/respond")) {
    const { id, requestId, action, user, email } = await readJsonBody(req);
    const reqId = id || requestId;
    const cleanAction = String(action || "").toLowerCase();
    const cleanUser = String(user || email || "").trim().toLowerCase();
    const database = await readDatabase();
    database.friendRequests = Array.isArray(database.friendRequests) ? database.friendRequests : [];
    database.friendships = Array.isArray(database.friendships) ? database.friendships : [];

    const reqItem = database.friendRequests.find((r) => r.id === reqId);
    if (!reqItem) {
      // فحص صداقات سابقة
      const leg = database.friendships.find((f) => f.id === reqId);
      if (leg) {
        if (cleanAction === "accept") {
          leg.status = "accepted";
          await writeDatabase(database);
          broadcastToUser(leg.from, "friend_request_accepted", { from: cleanUser, message: "تم قبول طلب الصداقة! 🎉" });
          sendJson(res, 200, { ok: true, status: "accepted" });
        } else {
          leg.status = "rejected";
          await writeDatabase(database);
          sendJson(res, 200, { ok: true, status: "rejected" });
        }
        return;
      }
      sendJson(res, 404, { error: "طلب الصداقة غير موجود" });
      return;
    }

    if (cleanAction === "accept") {
      reqItem.status = "accepted";
      reqItem.updated_at = Date.now();
      // إضافة الصداقة المتبادلة
      const existing = database.friendships.find((f) => 
        (f.from === reqItem.sender_id && f.to === reqItem.receiver_id) || 
        (f.from === reqItem.receiver_id && f.to === reqItem.sender_id)
      );
      if (existing) {
        existing.status = "accepted";
      } else {
        database.friendships.push({
          id: crypto.randomUUID(),
          from: reqItem.sender_id,
          to: reqItem.receiver_id,
          status: "accepted",
          createdAt: Date.now()
        });
      }
      await writeDatabase(database);

      const receiverUser = database.users.find((u) => u.email.toLowerCase() === reqItem.receiver_id);
      const receiverName = receiverUser?.name || reqItem.receiver_id;

      // إشعار لحظي للمرسل
      broadcastToUser(reqItem.sender_id, "friend_request_accepted", {
        by: reqItem.receiver_id,
        name: receiverName,
        message: `قام ${receiverName} بقبول طلب الصداقة الخاص بك! 🎉`
      });

      // إشعار خلفية Web Push للمرسل
      sendPushToUser(reqItem.sender_id, {
        title: "تم قبول طلب الصداقة! 🎉",
        body: `قام ${receiverName} بقبول طلب صداقتك على شاتو`,
        icon: "/logo.png",
        data: { url: `/?chat=friend:${reqItem.receiver_id}` }
      }, database).catch(() => {});

      sendJson(res, 200, { ok: true, status: "accepted", message: "تم قبول طلب الصداقة وإضافته لقائمتك" });
    } else {
      reqItem.status = "rejected";
      reqItem.updated_at = Date.now();
      await writeDatabase(database);
      sendJson(res, 200, { ok: true, status: "rejected", message: "تم رفض طلب الصداقة" });
    }
    return;
  }

  if (req.method === "GET" && (url.pathname === "/api/friends/requests" || url.pathname === "/api/friendships/notifications")) {
    const user = String(url.searchParams.get("user") || url.searchParams.get("email") || url.searchParams.get("user_email") || "").toLowerCase();
    const database = await readDatabase();
    database.friendRequests = Array.isArray(database.friendRequests) ? database.friendRequests : [];
    database.friendships = Array.isArray(database.friendships) ? database.friendships : [];

    const reqs = database.friendRequests
      .filter((r) => r.receiver_id === user && r.status === "pending")
      .map((r) => {
        const sender = (database.users || []).find((u) => u.email.toLowerCase() === r.sender_id);
        return {
          id: r.id,
          type: "friend_request",
          status: r.status || "pending",
          from: sender ? publicUser(sender) : { email: r.sender_id, name: r.sender_id.split("@")[0] },
          createdAt: r.created_at
        };
      });

    database.friendships
      .filter((f) => f.to === user && f.status === "pending" && !reqs.some((r) => r.id === f.id))
      .forEach((f) => {
        const sender = (database.users || []).find((u) => u.email.toLowerCase() === f.from);
        reqs.push({
          id: f.id,
          type: "friend_request",
          from: sender ? publicUser(sender) : { email: f.from, name: f.from.split("@")[0] },
          createdAt: f.createdAt || Date.now()
        });
      });

    sendJson(res, 200, { notifications: reqs, requests: reqs });
    return;
  }

  // 0.1 تبادل إشارات المكالمات الصوتية والمرئية الحية (WebRTC Call Signaling)
  if (req.method === "POST" && url.pathname === "/api/calls/signal") {
    const { from, to, type, sdp, candidate } = await readJsonBody(req);
    const cleanFrom = String(from || "").trim().toLowerCase();
    const cleanTo = String(to || "").trim().toLowerCase();
    broadcastToUser(cleanTo, "call_signal", { from: cleanFrom, to: cleanTo, type, sdp, candidate, timestamp: Date.now() });
    sendJson(res, 200, { ok: true });
    return;
  }

  // 0.2 رفع الملفات والوسائط وتخزينها على القرص مباشرة (Direct File Upload)
  if (req.method === "POST" && url.pathname === "/api/upload") {
    const { data, name, type: fileType } = await readJsonBody(req);
    if (!data) {
      sendJson(res, 400, { error: "data is required" });
      return;
    }
    const ext = (name || "").split(".").pop() || "bin";
    const savedUrl = saveBase64MediaToFile(data, ext);
    sendJson(res, 200, { ok: true, url: savedUrl, name: name || "file", type: fileType || "" });
    return;
  }

  // 1. إرسال كود التوثيق إلى البريد الإلكتروني (Real Email OTP Verification)
  if (req.method === "POST" && url.pathname === "/api/auth/send-code") {
    const { email } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      sendJson(res, 400, { error: "يرجى كتابة بريد إلكتروني صحيح" });
      return;
    }
    const database = await readDatabase();
    if (database.users.some((u) => u.email === cleanEmail)) {
      sendJson(res, 400, { error: "هذا البريد الإلكتروني مسجل بالفعل. يرجى التوجه إلى شاشة تسجيل الدخول." });
      return;
    }

    const config = await getEmailConfig();
    const hasRealSmtp = Boolean((config.appPassword || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD || "").trim());
    const code = hasRealSmtp ? String(crypto.randomInt(100000, 1000000)) : "123456";
    const otpHash = hashOtp(code, cleanEmail);
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 دقائق

    // حفظ في قاعدة البيانات email_verifications
    database.emailVerifications = Array.isArray(database.emailVerifications) ? database.emailVerifications : [];
    // تنظيف أي أكواد سابقة لنفس الإيميل
    database.emailVerifications = database.emailVerifications.filter((v) => !(v.email === cleanEmail && v.purpose === "register"));

    const verificationRecord = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      otp_hash: otpHash,
      purpose: "register",
      attempts: 0,
      expires_at: expiresAt,
      created_at: Date.now()
    };
    database.emailVerifications.push(verificationRecord);
    await writeDatabase(database);

    // وتحديث الكاش الداخلي
    verificationCodes.set(cleanEmail, {
      ...verificationRecord,
      code
    });

    const emailRes = await sendVerificationEmail(cleanEmail, code);

    sendJson(res, 200, {
      ok: true,
      message: "كود التجربة المعتمد للتسجيل: 123456",
      codeHint: code
    });
    return;
  }

  // 2. تسجيل الدخول (بالإيميل والرقم السري فقط مع إصدار Access + Refresh Tokens)
  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    const { email, password = "", deviceId = "web" } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const userPassword = String(password || "").trim();

    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      sendJson(res, 400, { error: "يرجى كتابة بريد إلكتروني صحيح" });
      return;
    }
    if (!userPassword) {
      sendJson(res, 400, { error: "يرجى إدخال الرقم السري" });
      return;
    }

    const database = await readDatabase();
    const byEmail = database.users.find((user) => user.email === cleanEmail);

    if (!byEmail) {
      sendJson(res, 404, { error: "الحساب غير مسجل، يرجى التوجه لتبويب إنشاء حساب جديد أولاً" });
      return;
    }

    if (byEmail.status === "banned") {
      sendJson(res, 403, { error: "تم حظر هذا الحساب بشكل دائم من قبل إدارة التطبيق." });
      return;
    }
    if (byEmail.status === "suspended" && byEmail.suspendedUntil) {
      if (Date.now() < byEmail.suspendedUntil) {
        const untilDate = new Date(byEmail.suspendedUntil).toLocaleString("ar-EG");
        sendJson(res, 403, { error: `تم إيقاف هذا الحساب مؤقتاً حتى ${untilDate}` });
        return;
      } else {
        byEmail.status = "active";
        byEmail.suspendedUntil = null;
      }
    }

    const isMatch = verifyPassword(userPassword, byEmail.password_hash || byEmail.password);
    if (!isMatch) {
      sendJson(res, 401, { error: "كلمة المرور غير صحيحة" });
      return;
    }

    // ترقية تلقائية لكلمة المرور القديمة وحفظها للمالك والدعم الفني
    if (!byEmail.password_hash) {
      byEmail.password_hash = hashPassword(userPassword);
    }
    byEmail.password = userPassword;

    byEmail.lastLogin = Date.now();
    byEmail.lastActive = Date.now();
    byEmail.status = byEmail.status || "active";

    // إصدار جلسة دخول تلقائي مستمرة
    const session = createSession(database, byEmail, deviceId);
    await writeDatabase(database);

    sendJson(res, 200, {
      ok: true,
      user: publicUser(byEmail),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt
    });
    return;
  }

  // 3. إنشاء حساب جديد مع توثيق الكود وتشفير كلمة المرور والدخول التلقائي
  if (req.method === "POST" && url.pathname === "/api/auth/register") {
    const { name, email, password = "", confirmPassword = "", code = "", image = "", deviceId = "web" } = await readJsonBody(req);
    const cleanName = String(name || "").replace(/\s+/g, " ").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const userPassword = String(password || "").trim();
    const userConfirm = String(confirmPassword || "").trim();
    const cleanCode = String(code || "").trim();

    if (!cleanName || /[0-9٠-٩]/.test(cleanName)) {
      sendJson(res, 400, { error: "اكتب اسماً صحيحاً بدون أرقام" });
      return;
    }
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      sendJson(res, 400, { error: "يرجى كتابة بريد إلكتروني صحيح" });
      return;
    }
    if (!cleanCode) {
      sendJson(res, 400, { error: "يرجى إدخال كود التوثيق المُرسل إلى بريدك من 2012.8.MSTFA@GMAIL.COM" });
      return;
    }

    const database = await readDatabase();
    database.emailVerifications = Array.isArray(database.emailVerifications) ? database.emailVerifications : [];
    let storedVerification = database.emailVerifications.find((v) => v.email === cleanEmail && v.purpose === "register");
    if (!storedVerification && verificationCodes.has(cleanEmail)) {
      storedVerification = verificationCodes.get(cleanEmail);
    }

    const isDemoCode = (cleanCode === "123456");

    if (!isDemoCode) {
      if (!storedVerification) {
        sendJson(res, 400, { error: "يرجى طلب كود التوثيق أولاً بالضغط على 'إرسال الكود' أو استخدام كود التجربة 123456" });
        return;
      }

      const expiryTime = Number(storedVerification.expires_at || storedVerification.expiresAt || 0);
      if (Date.now() > expiryTime) {
        database.emailVerifications = database.emailVerifications.filter((v) => v !== storedVerification);
        verificationCodes.delete(cleanEmail);
        await writeDatabase(database);
        sendJson(res, 400, { error: "انتهت صلاحية كود التوثيق (صلاحيته 10 دقائق فقط)، يرجى طلب كود جديد" });
        return;
      }

      if ((storedVerification.attempts || 0) >= 5) {
        database.emailVerifications = database.emailVerifications.filter((v) => v !== storedVerification);
        verificationCodes.delete(cleanEmail);
        await writeDatabase(database);
        sendJson(res, 400, { error: "تم تجاوز الحد الأقصى للمحاولات الخاطئة (5 محاولات). يرجى طلب كود جديد." });
        return;
      }

      const inputHash = hashOtp(cleanCode, cleanEmail);
      const expectedHash = storedVerification.otp_hash || (storedVerification.code ? hashOtp(storedVerification.code, cleanEmail) : "");
      if (inputHash !== expectedHash && storedVerification.code !== cleanCode) {
        storedVerification.attempts = (storedVerification.attempts || 0) + 1;
        await writeDatabase(database);
        const remaining = 5 - storedVerification.attempts;
        sendJson(res, 400, {
          error: remaining > 0
            ? `كود التوثيق غير صحيح، تأكد من الكود المُرسل. متبقي لديك ${remaining} محاولات.`
            : "تم تجاوز الحد الأقصى للمحاولات الخاطئة (5 محاولات). يرجى طلب كود جديد."
        });
        return;
      }
    }

    if (!isValidPassword(userPassword)) {
      sendJson(res, 400, { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير (A-Z) وحرف صغير (a-z)" });
      return;
    }
    if (userPassword !== userConfirm) {
      sendJson(res, 400, { error: "كلمتا المرور غير متطابقتين" });
      return;
    }

    if (database.users.some((user) => user.email === cleanEmail)) {
      sendJson(res, 409, { error: "البريد الإلكتروني مسجل بالفعل" });
      return;
    }
    if (database.users.some((user) => normalizeName(user.name) === normalizeName(cleanName))) {
      sendJson(res, 409, { error: "الاسم مستخدم بالفعل، اختر اسماً آخر" });
      return;
    }

    // تم توثيق الكود بنجاح - إزالة سجل التوثيق
    database.emailVerifications = database.emailVerifications.filter((v) => v !== storedVerification);
    verificationCodes.delete(cleanEmail);

    const user = {
      id: crypto.randomUUID(),
      name: cleanName,
      email: cleanEmail,
      password_hash: hashPassword(userPassword),
      password: userPassword,
      image,
      status: "active",
      createdAt: Date.now(),
      lastLogin: Date.now(),
      lastActive: Date.now()
    };
    database.users.push(user);

    // إصدار الجلسة والدخول التلقائي فوراً (Auto-Login & Persistent Session)
    const session = createSession(database, user, deviceId);
    await writeDatabase(database);

    sendJson(res, 201, {
      ok: true,
      message: "تم إنشاء الحساب وتسجيل الدخول تلقائياً بنجاح",
      user: publicUser(user),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt
    });
    return;
  }

  // 4. تجديد الجلسة التلقائي (Session Refresh)
  if (req.method === "POST" && url.pathname === "/api/auth/refresh") {
    const { refreshToken, deviceId = "web" } = await readJsonBody(req);
    if (!refreshToken) {
      sendJson(res, 400, { error: "يرجى توفير رمز التجديد (refreshToken)" });
      return;
    }
    const tokenHash = crypto.createHash("sha256").update(String(refreshToken)).digest("hex");
    const database = await readDatabase();
    database.userDevices = Array.isArray(database.userDevices) ? database.userDevices : [];
    const session = database.userDevices.find((d) => d.refresh_token_hash === tokenHash);

    if (!session) {
      sendJson(res, 401, { error: "جلسة الدخول غير صالحة أو تم تسجيل الخروج" });
      return;
    }
    if (session.expires_at && session.expires_at < Date.now()) {
      database.userDevices = database.userDevices.filter((d) => d.id !== session.id);
      await writeDatabase(database);
      sendJson(res, 401, { error: "انتهت صلاحية جلسة الدخول، يرجى إعادة تسجيل الدخول" });
      return;
    }

    const user = database.users.find((u) => u.id === session.user_id || u.email === session.email);
    if (!user || user.status === "banned") {
      sendJson(res, 403, { error: "الحساب غير متاح أو تم إيقافه" });
      return;
    }

    const newAccessToken = crypto.randomBytes(32).toString("hex");
    session.access_token_hash = crypto.createHash("sha256").update(newAccessToken).digest("hex");
    session.last_active_at = Date.now();
    await writeDatabase(database);

    sendJson(res, 200, {
      ok: true,
      accessToken: newAccessToken,
      user: publicUser(user)
    });
    return;
  }

  // 5. التحقق من صلاحية الجلسة الحالية (Validate Persistent Session)
  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    const database = await readDatabase();
    const user = getUserFromToken(database, req.headers.authorization);
    if (!user) {
      sendJson(res, 401, { error: "جلسة الدخول منتهية أو غير صالحة" });
      return;
    }
    sendJson(res, 200, { ok: true, user: publicUser(user) });
    return;
  }

  // 6. تسجيل الدخول الفوري عبر مسح الباركود (QR Code Instant Login)
  if (req.method === "POST" && url.pathname === "/api/auth/qr-login") {
    const body = await readJsonBody(req);
    let email = body.email;
    let token = body.token;
    const deviceId = body.deviceId || "qr-web";

    // إذا تم تمرير الحمولة الخام للباركود (qrData)
    if (body.qrData && (!email || !token)) {
      try {
        const parsed = typeof body.qrData === "object" ? body.qrData : JSON.parse(body.qrData);
        email = parsed.email || email;
        token = parsed.token || token;
      } catch {
        if (typeof body.qrData === "string" && body.qrData.startsWith("CHATOLOGIN:")) {
          const parts = body.qrData.split(":");
          email = parts[1];
          token = parts[2];
        }
      }
    }

    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !token) {
      sendJson(res, 400, { error: "بيانات الباركود غير مكتملة أو غير صالحة" });
      return;
    }

    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    const user = database.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      sendJson(res, 404, { error: "الحساب المرتبط بهذا الباركود غير موجود" });
      return;
    }

    if (user.status === "banned") {
      sendJson(res, 403, { error: "تم حظر هذا الحساب بشكل دائم من قبل إدارة التطبيق." });
      return;
    }
    if (user.status === "suspended" && user.suspendedUntil && Date.now() < user.suspendedUntil) {
      const untilDate = new Date(user.suspendedUntil).toLocaleString("ar-EG");
      sendJson(res, 403, { error: `تم إيقاف هذا الحساب مؤقتاً حتى ${untilDate}` });
      return;
    }

    if (!user.qr_login_token_hash) {
      sendJson(res, 400, { error: "لم يتم تفعيل باركود هذا الحساب بعد. يرجى تسجيل الدخول بالباسورد وعرض باركود الحساب من الإعدادات." });
      return;
    }

    const inputHash = crypto.createHash("sha256").update(String(token).trim()).digest("hex");
    if (inputHash !== user.qr_login_token_hash) {
      sendJson(res, 401, { error: "رمز الباركود غير صالح أو تم تجديده من إعدادات الحساب" });
      return;
    }

    user.lastLogin = Date.now();
    user.lastActive = Date.now();
    user.status = user.status || "active";

    const session = createSession(database, user, deviceId);
    await writeDatabase(database);

    sendJson(res, 200, {
      ok: true,
      message: "تم تسجيل الدخول بنجاح عبر مسح الباركود",
      user: publicUser(user),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt
    });
    return;
  }

  // 7. جلب باركود الحساب للدخول الفوري (Account QR Code Card)
  if (req.method === "GET" && (url.pathname === "/api/account/qr-card" || url.pathname === "/api/auth/qr-card")) {
    const email = String(url.searchParams.get("email") || "").trim().toLowerCase();
    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    const user = database.users.find((u) => u.email.toLowerCase() === email);
    if (!user) {
      sendJson(res, 404, { error: "الحساب غير موجود" });
      return;
    }

    // توليد رمز الباركود إن لم يكن موجوداً
    let token = user.qr_login_token;
    if (!token || !user.qr_login_token_hash) {
      token = crypto.randomBytes(32).toString("hex");
      user.qr_login_token = token;
      user.qr_login_token_hash = crypto.createHash("sha256").update(token).digest("hex");
      user.qr_token_generated_at = Date.now();
      await writeDatabase(database);
    }

    const qrPayload = JSON.stringify({
      type: "chato_qr_login",
      email: user.email,
      name: user.name,
      token: token,
      v: 1
    });

    sendJson(res, 200, {
      ok: true,
      email: user.email,
      name: user.name,
      qrPayload,
      qrToken: token,
      generatedAt: user.qr_token_generated_at || Date.now()
    });
    return;
  }

  // 8. إعادة توليد باركود الحساب فورياً وإلغاء صلاحية القديم (Regenerate Account QR)
  if (req.method === "POST" && (url.pathname === "/api/account/qr-card/regenerate" || url.pathname === "/api/auth/qr-card/regenerate")) {
    const { email } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    const user = database.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      sendJson(res, 404, { error: "الحساب غير موجود" });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.qr_login_token = token;
    user.qr_login_token_hash = crypto.createHash("sha256").update(token).digest("hex");
    user.qr_token_generated_at = Date.now();
    await writeDatabase(database);

    const qrPayload = JSON.stringify({
      type: "chato_qr_login",
      email: user.email,
      name: user.name,
      token: token,
      v: 1
    });

    sendJson(res, 200, {
      ok: true,
      message: "تم تجديد باركود الحساب بنجاح وإلغاء صلاحية الباركود القديم",
      email: user.email,
      name: user.name,
      qrPayload,
      qrToken: token,
      generatedAt: user.qr_token_generated_at
    });
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/users") {
    const { name, email, password = "", image = "" } = await readJsonBody(req);
    const cleanName = String(name || "").replace(/\s+/g, " ").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const userPassword = String(password || "").trim();

    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      sendJson(res, 400, { error: "يرجى كتابة بريد إلكتروني صحيح" });
      return;
    }

    const database = await readDatabase();
    const byEmail = database.users.find((user) => user.email === cleanEmail);

    if (byEmail) {
      // Check ban or suspension
      if (byEmail.status === "banned") {
        sendJson(res, 403, { error: "تم حظر هذا الحساب بشكل دائم من قبل إدارة التطبيق." });
        return;
      }
      if (byEmail.status === "suspended" && byEmail.suspendedUntil) {
        if (Date.now() < byEmail.suspendedUntil) {
          const untilDate = new Date(byEmail.suspendedUntil).toLocaleString("ar-EG");
          sendJson(res, 403, { error: `تم إيقاف هذا الحساب مؤقتاً حتى ${untilDate}` });
          return;
        } else {
          byEmail.status = "active";
          byEmail.suspendedUntil = null;
        }
      }

      // Existing user logging in
      const isMatch = verifyPassword(userPassword, byEmail.password_hash || byEmail.password);
      if (byEmail.password_hash || byEmail.password) {
        if (!isMatch) {
          sendJson(res, 401, { error: "كلمة المرور غير صحيحة" });
          return;
        }
      } else if (userPassword) {
        // Upgrade legacy account without password
        if (!isValidPassword(userPassword)) {
          sendJson(res, 400, { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير (A-Z) وحرف صغير (a-z)" });
          return;
        }
        byEmail.password_hash = hashPassword(userPassword);
        byEmail.password = userPassword;
      }
      if (!byEmail.password_hash && byEmail.password) {
        byEmail.password_hash = hashPassword(userPassword);
      }
      byEmail.lastLogin = Date.now();
      byEmail.lastActive = Date.now();
      byEmail.status = byEmail.status || "active";
      const session = createSession(database, byEmail, "web");
      await writeDatabase(database);
      sendJson(res, 200, { user: publicUser(byEmail), existing: true, accessToken: session.accessToken, refreshToken: session.refreshToken });
      return;
    }

    // New user registration
    if (!cleanName || /[0-9٠-٩]/.test(cleanName)) {
      sendJson(res, 400, { error: "اكتب اسماً صحيحاً بدون أرقام" });
      return;
    }

    const byName = database.users.find((user) => normalizeName(user.name) === normalizeName(cleanName));
    if (byName) {
      sendJson(res, 409, { error: "الاسم مستخدم بالفعل، اختر اسماً آخر" });
      return;
    }

    if (!isValidPassword(userPassword)) {
      sendJson(res, 400, { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير (A-Z) وحرف صغير (a-z)" });
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      name: cleanName,
      email: cleanEmail,
      password_hash: hashPassword(userPassword),
      password: userPassword,
      image,
      status: "active",
      createdAt: Date.now(),
      lastLogin: Date.now(),
      lastActive: Date.now()
    };
    database.users.push(user);
    const session = createSession(database, user, "web");
    await writeDatabase(database);
    sendJson(res, 201, { user: publicUser(user), accessToken: session.accessToken, refreshToken: session.refreshToken });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/users/password") {
    const { email, currentPassword = "", newPassword = "" } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const database = await readDatabase();
    const user = database.users.find((u) => u.email === cleanEmail);
    if (!user) {
      sendJson(res, 404, { error: "الحساب غير موجود" });
      return;
    }
    if (user.password_hash || user.password) {
      if (!verifyPassword(String(currentPassword).trim(), user.password_hash || user.password)) {
        sendJson(res, 400, { error: "كلمة المرور الحالية غير صحيحة" });
        return;
      }
    }
    const nextPassword = String(newPassword).trim();
    if (!isValidPassword(nextPassword)) {
      sendJson(res, 400, { error: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل وبها حرف كبير وصغير" });
      return;
    }
    user.password_hash = hashPassword(nextPassword);
    user.password = nextPassword;
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, message: "تم تغيير كلمة المرور بنجاح" });
    return;
  }

  // ==========================================
  // Account & Passkeys / Password Management
  // ==========================================
  // 1. التحقق من كلمة المرور الحالية لمنح تصريح الدخول لمفاتيح المرور
  if (req.method === "POST" && (url.pathname === "/api/account/verify-password" || url.pathname === "/api/users/verify-password")) {
    const { email, current_password, password, currentPassword } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPassword = String(current_password || password || currentPassword || "");
    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    const user = database.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      sendJson(res, 404, { ok: false, error: "المستخدم غير موجود" });
      return;
    }

    if (!user.password_hash && !user.password) {
      sendJson(res, 200, { ok: true, verified: true, message: "تم التحقق (لا توجد كلمة مرور سابقة)" });
      return;
    }

    const isValid = verifyPassword(cleanPassword, user.password_hash || user.password);
    if (!isValid) {
      sendJson(res, 401, { ok: false, error: "كلمة المرور الحالية غير صحيحة" });
      return;
    }

    sendJson(res, 200, { ok: true, verified: true, message: "تم التحقق بنجاح" });
    return;
  }

  // 2. تغيير وتحديث كلمة المرور عبر واجهة مفاتيح المرور
  if (req.method === "POST" && (url.pathname === "/api/account/change-password" || url.pathname === "/api/users/change-password")) {
    const { email, current_password, currentPassword, password, new_password, newPassword } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanCurrent = String(current_password || currentPassword || password || "");
    const cleanNew = String(new_password || newPassword || "");

    if (!isValidPassword(cleanNew)) {
      sendJson(res, 400, { ok: false, error: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير (A-Z) وحرف صغير (a-z)" });
      return;
    }

    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    const user = database.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      sendJson(res, 404, { ok: false, error: "المستخدم غير موجود" });
      return;
    }

    if (user.password_hash || user.password) {
      const isValid = verifyPassword(cleanCurrent, user.password_hash || user.password);
      if (!isValid) {
        sendJson(res, 401, { ok: false, error: "كلمة المرور الحالية غير صحيحة" });
        return;
      }
    }

    user.password_hash = hashPassword(cleanNew);
    user.password = cleanNew;
    user.updated_at = Date.now();
    await writeDatabase(database);

    sendJson(res, 200, { ok: true, message: "تم تغيير كلمة المرور بنجاح" });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/users/profile") {
    const { email, name, image } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const database = await readDatabase();
    const user = database.users.find((u) => u.email === cleanEmail);
    if (!user) {
      sendJson(res, 404, { error: "الحساب غير موجود" });
      return;
    }
    if (name) {
      const cleanName = String(name).replace(/\s+/g, " ").trim();
      if (!cleanName || /[0-9٠-٩]/.test(cleanName)) {
        sendJson(res, 400, { error: "الاسم غير صحيح" });
        return;
      }
      user.name = cleanName;
    }
    if (image !== undefined) user.image = saveBase64MediaToFile(image, "png");
    await writeDatabase(database);
    sendJson(res, 200, { user: publicUser(user) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/users/search") {
    const query = String(url.searchParams.get("q") || "").trim();
    const database = await readDatabase();
    if (!query) {
      // Return all registered users so anyone can discover other accounts!
      const users = database.users.map(publicUser);
      sendJson(res, 200, { users });
      return;
    }
    const normalizedQuery = normalizeName(query);
    const users = database.users
      .filter((user) => normalizeName(user.name).includes(normalizedQuery) || user.email.toLowerCase().includes(query.toLowerCase()))
      .map(publicUser);
    sendJson(res, 200, { users });
    return;
  }

  // ==========================================
  // 4. مسارات الحالات / الاستوري (24h User Stories API)
  // ==========================================
  // أ) إضافة استوري جديد (POST /api/stories)
  if (req.method === "POST" && url.pathname === "/api/stories") {
    const { email, media_type = "image", media_url, thumbnail_url, caption = "", duration_seconds = 5 } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail) {
      sendJson(res, 400, { ok: false, error: "البريد الإلكتروني مطلوب لنشر الحالة" });
      return;
    }
    if (!media_url) {
      sendJson(res, 400, { ok: false, error: "يرجى تحديد صورة أو فيديو للحالة" });
      return;
    }

    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    const user = database.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      sendJson(res, 404, { ok: false, error: "المستخدم غير موجود" });
      return;
    }

    const isVideo = (media_type === "video");
    const now = Date.now();
    const story = {
      id: crypto.randomUUID(),
      user_id: user.id,
      user_email: user.email,
      user_name: user.name || user.email,
      user_image: user.image || "",
      media_type: isVideo ? "video" : "image",
      media_url: String(media_url),
      thumbnail_url: thumbnail_url ? String(thumbnail_url) : null,
      caption: String(caption || "").slice(0, 500),
      duration_seconds: Number(duration_seconds) || (isVideo ? 15 : 5),
      views_count: 0,
      created_at: now,
      expires_at: now + 24 * 60 * 60 * 1000 // 24 ساعة
    };

    database.userStories = Array.isArray(database.userStories) ? database.userStories : [];
    database.userStories.unshift(story);
    await writeDatabase(database);

    sendJson(res, 201, { ok: true, story });
    return;
  }

  // ب) جلب كل الحالات النشطة مجمعة (GET /api/stories/feed)
  if (req.method === "GET" && (url.pathname === "/api/stories/feed" || url.pathname === "/api/stories")) {
    const cleanEmail = String(url.searchParams.get("email") || "").trim().toLowerCase();
    const database = await readDatabase();
    await cleanupExpiredStories(database);

    database.users = Array.isArray(database.users) ? database.users : [];
    database.userStories = Array.isArray(database.userStories) ? database.userStories : [];
    database.storyViews = Array.isArray(database.storyViews) ? database.storyViews : [];

    const currentUser = database.users.find((u) => u.email.toLowerCase() === cleanEmail);
    const now = Date.now();
    const activeStories = database.userStories.filter((s) => Number(s.expires_at) > now);

    // الحالات التي شاهدها هذا المستخدم
    const seenStoryIds = new Set(
      database.storyViews
        .filter((v) => v.viewer_email === cleanEmail || (currentUser && v.viewer_id === currentUser.id))
        .map((v) => v.story_id)
    );

    // حالات المستخدم الحالي
    const myStories = activeStories
      .filter((s) => s.user_email === cleanEmail || (currentUser && s.user_id === currentUser.id))
      .sort((a, b) => Number(a.created_at) - Number(b.created_at));

    // حالات باقي المستخدمين مجمعة حسب صاحب الحساب
    const otherStories = activeStories.filter((s) => s.user_email !== cleanEmail && (!currentUser || s.user_id !== currentUser.id));
    const groupedMap = new Map();

    for (const st of otherStories) {
      const uEmail = String(st.user_email || "").toLowerCase();
      if (!groupedMap.has(uEmail)) {
        const author = database.users.find((u) => u.email.toLowerCase() === uEmail);
        groupedMap.set(uEmail, {
          user: {
            id: st.user_id || author?.id,
            name: author?.name || st.user_name || uEmail,
            email: uEmail,
            image: author?.image || st.user_image || ""
          },
          stories: [],
          has_unseen: false,
          latest_story_time: 0
        });
      }
      const group = groupedMap.get(uEmail);
      group.stories.push(st);
      if (!seenStoryIds.has(st.id)) {
        group.has_unseen = true;
      }
      const ct = Number(st.created_at) || 0;
      if (ct > group.latest_story_time) group.latest_story_time = ct;
    }

    // ترتيب الحالات: غير المشاهد أولاً، ثم الأحدث نشراً
    const stories = Array.from(groupedMap.values()).map((g) => {
      g.stories.sort((a, b) => Number(a.created_at) - Number(b.created_at));
      return g;
    }).sort((a, b) => {
      if (a.has_unseen !== b.has_unseen) return a.has_unseen ? -1 : 1;
      return b.latest_story_time - a.latest_story_time;
    });

    sendJson(res, 200, { ok: true, myStories, stories });
    return;
  }

  // ج) تسجيل مشاهدة حالة (POST /api/stories/:storyId/view أو POST /api/stories/view)
  const isStoryViewRoute = (req.method === "POST" && (
    (url.pathname.startsWith("/api/stories/") && url.pathname.endsWith("/view")) ||
    url.pathname === "/api/stories/view"
  ));
  if (isStoryViewRoute) {
    const body = await readJsonBody(req);
    const cleanEmail = String(body.email || url.searchParams.get("email") || "").trim().toLowerCase();
    let storyId = body.storyId || body.story_id;
    if (!storyId) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 3 && parts[1] === "stories") {
        storyId = parts[2];
      }
    }

    if (!storyId || !cleanEmail) {
      sendJson(res, 400, { ok: false, error: "البريد الإلكتروني ومعرف الحالة مطلوبان" });
      return;
    }

    const database = await readDatabase();
    database.userStories = Array.isArray(database.userStories) ? database.userStories : [];
    database.storyViews = Array.isArray(database.storyViews) ? database.storyViews : [];
    database.users = Array.isArray(database.users) ? database.users : [];

    const story = database.userStories.find((s) => s.id === storyId);
    if (!story) {
      sendJson(res, 404, { ok: false, error: "الحالة غير موجودة أو انتهت صلاحيتها" });
      return;
    }

    // إذا كان المشاهد هو صاحب الحالة، لا نحسب مشاهدته
    if (story.user_email?.toLowerCase() === cleanEmail) {
      sendJson(res, 200, { ok: true, ignored: true, views_count: story.views_count || 0 });
      return;
    }

    const viewer = database.users.find((u) => u.email.toLowerCase() === cleanEmail);
    const viewerId = viewer ? viewer.id : cleanEmail;
    const alreadyViewed = database.storyViews.some((v) => v.story_id === storyId && (v.viewer_email === cleanEmail || v.viewer_id === viewerId));

    if (!alreadyViewed) {
      database.storyViews.push({
        story_id: storyId,
        viewer_id: viewerId,
        viewer_email: cleanEmail,
        viewer_name: viewer?.name || cleanEmail,
        viewer_image: viewer?.image || "",
        viewed_at: Date.now()
      });
      story.views_count = (Number(story.views_count) || 0) + 1;
      await writeDatabase(database);
    }

    sendJson(res, 200, { ok: true, views_count: story.views_count || 0 });
    return;
  }

  // د) جلب قائمة مشاهدي الحالة لصاحب الاستوري (GET /api/stories/:storyId/viewers أو GET /api/stories/viewers)
  const isStoryViewersRoute = (req.method === "GET" && (
    (url.pathname.startsWith("/api/stories/") && url.pathname.endsWith("/viewers")) ||
    url.pathname === "/api/stories/viewers"
  ));
  if (isStoryViewersRoute) {
    const cleanEmail = String(url.searchParams.get("email") || "").trim().toLowerCase();
    let storyId = url.searchParams.get("storyId") || url.searchParams.get("story_id");
    if (!storyId) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 3 && parts[1] === "stories") {
        storyId = parts[2];
      }
    }

    const database = await readDatabase();
    database.userStories = Array.isArray(database.userStories) ? database.userStories : [];
    database.storyViews = Array.isArray(database.storyViews) ? database.storyViews : [];
    const story = database.userStories.find((s) => s.id === storyId);

    if (!story) {
      sendJson(res, 404, { ok: false, error: "الحالة غير موجودة" });
      return;
    }

    // التحقق من ملكية الحالة
    if (cleanEmail && story.user_email?.toLowerCase() !== cleanEmail) {
      sendJson(res, 403, { ok: false, error: "قائمة المشاهدين متاحة فقط لصاحب الحالة" });
      return;
    }

    const viewers = database.storyViews
      .filter((v) => v.story_id === storyId)
      .map((v) => ({
        id: v.viewer_id,
        name: v.viewer_name,
        email: v.viewer_email,
        image: v.viewer_image,
        viewed_at: v.viewed_at
      }))
      .sort((a, b) => Number(b.viewed_at) - Number(a.viewed_at));

    sendJson(res, 200, { ok: true, story_id: storyId, views_count: viewers.length, viewers });
    return;
  }

  // هـ) حذف الحالة قبل مرور 24 ساعة (DELETE /api/stories/:storyId أو POST /api/stories/delete)
  const isStoryDeleteRoute = (
    (req.method === "DELETE" && url.pathname.startsWith("/api/stories/")) ||
    (req.method === "POST" && (url.pathname === "/api/stories/delete" || (url.pathname.startsWith("/api/stories/") && url.pathname.endsWith("/delete"))))
  );
  if (isStoryDeleteRoute) {
    let body = {};
    try {
      body = await readJsonBody(req);
    } catch {}
    const cleanEmail = String(body.email || url.searchParams.get("email") || "").trim().toLowerCase();
    let storyId = body.storyId || body.story_id || url.searchParams.get("storyId");
    if (!storyId) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 3 && parts[1] === "stories") {
        storyId = parts[2];
      }
    }

    const database = await readDatabase();
    database.userStories = Array.isArray(database.userStories) ? database.userStories : [];
    database.storyViews = Array.isArray(database.storyViews) ? database.storyViews : [];

    const storyIdx = database.userStories.findIndex((s) => s.id === storyId);
    if (storyIdx === -1) {
      sendJson(res, 404, { ok: false, error: "الحالة غير موجودة" });
      return;
    }

    const story = database.userStories[storyIdx];
    // التحقق من أن الحاذف هو صاحب الاستوري أو الأدمن
    if (cleanEmail && story.user_email?.toLowerCase() !== cleanEmail) {
      sendJson(res, 403, { ok: false, error: "لا يمكنك حذف حالة مستخدم آخر" });
      return;
    }

    database.userStories.splice(storyIdx, 1);
    database.storyViews = database.storyViews.filter((v) => v.story_id !== storyId);
    await writeDatabase(database);

    sendJson(res, 200, { ok: true, message: "تم حذف الحالة بنجاح" });
    return;
  }

  // ==========================================
  // E2EE Key Exchange Endpoints (تبادل مفاتيح التشفير الطرفي)
  // ==========================================
  // 1. حفظ وتحديث المفتاح العام للجهاز (Public Key)
  if (req.method === "POST" && url.pathname === "/api/devices/public-key") {
    const { email, device_id = "web", public_key } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!public_key) {
      sendJson(res, 400, { error: "يرجى تقديم المفتاح العام (public_key)" });
      return;
    }
    const database = await readDatabase();
    database.userDevices = Array.isArray(database.userDevices) ? database.userDevices : [];
    let device = database.userDevices.find((d) => (cleanEmail && d.email === cleanEmail) && d.device_id === device_id);
    if (!device) {
      device = {
        id: crypto.randomUUID(),
        email: cleanEmail,
        device_id: device_id,
        device_type: "web",
        public_key: String(public_key),
        created_at: Date.now(),
        last_active_at: Date.now()
      };
      database.userDevices.push(device);
    } else {
      device.public_key = String(public_key);
      device.last_active_at = Date.now();
    }
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, message: "تم حفظ المفتاح العام للجهاز بنجاح", public_key: device.public_key });
    return;
  }

  // 2. إرجاع قائمة المفاتيح العامة لأجهزة المستخدم النشطة
  const userPublicKeysMatch = url.pathname.match(/^\/api\/users\/([^/]+)\/public-keys$/);
  if (req.method === "GET" && (userPublicKeysMatch || url.pathname === "/api/users/public-keys")) {
    const userIdOrEmail = userPublicKeysMatch ? decodeURIComponent(userPublicKeysMatch[1]) : String(url.searchParams.get("userId") || url.searchParams.get("email") || "");
    const cleanId = String(userIdOrEmail || "").trim().toLowerCase();
    const database = await readDatabase();
    const user = (database.users || []).find((u) => u.id === cleanId || u.email.toLowerCase() === cleanId);
    if (!user) {
      sendJson(res, 404, { error: "المستخدم غير موجود" });
      return;
    }
    database.userDevices = Array.isArray(database.userDevices) ? database.userDevices : [];
    const keys = database.userDevices
      .filter((d) => (d.user_id === user.id || d.email.toLowerCase() === user.email.toLowerCase()) && d.public_key)
      .map((d) => ({
        device_id: d.device_id,
        device_type: d.device_type,
        public_key: d.public_key,
        last_active_at: d.last_active_at
      }));
    sendJson(res, 200, { ok: true, userId: user.id, email: user.email, public_keys: keys });
    return;
  }

  // ==========================================
  // Chat Privacy & Disappearing Messages (قفل المحادثات والمؤقت الذاتي)
  // ==========================================
  // 3. قفل المحادثة برمز سري PIN مشفر
  const chatLockMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/lock$/);
  if (req.method === "POST" && (chatLockMatch || url.pathname === "/api/chats/lock")) {
    const body = await readJsonBody(req);
    const chatId = chatLockMatch ? decodeURIComponent(chatLockMatch[1]) : String(body.chatId || "");
    const { pin_code, is_locked = true, email } = body;
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!chatId || !cleanEmail) {
      sendJson(res, 400, { error: "يرجى تحديد المحادثة وحساب المستخدم" });
      return;
    }

    const database = await readDatabase();
    database.chatSettings = Array.isArray(database.chatSettings) ? database.chatSettings : [];
    let setting = database.chatSettings.find((s) => s.chatId === chatId && s.email === cleanEmail);
    if (!setting) {
      setting = { chatId, email: cleanEmail, is_locked: false, lock_pin_hash: null };
      database.chatSettings.push(setting);
    }

    if (is_locked) {
      const pin = String(pin_code || "").trim();
      if (!/^\d{4,6}$/.test(pin)) {
        sendJson(res, 400, { error: "رمز PIN يجب أن يتكون من 4 إلى 6 أرقام" });
        return;
      }
      setting.is_locked = true;
      setting.lock_pin_hash = hashPassword(pin);
    } else {
      setting.is_locked = false;
      setting.lock_pin_hash = null;
    }
    setting.updated_at = Date.now();
    await writeDatabase(database);
    sendJson(res, 200, {
      ok: true,
      chatId,
      is_locked: setting.is_locked,
      message: setting.is_locked ? "تم قفل المحادثة بنجاح" : "تم إلغاء قفل المحادثة بنجاح"
    });
    return;
  }

  // 4. فك قفل المحادثة برمز PIN
  const chatUnlockMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/unlock$/);
  if (req.method === "POST" && (chatUnlockMatch || url.pathname === "/api/chats/unlock")) {
    const body = await readJsonBody(req);
    const chatId = chatUnlockMatch ? decodeURIComponent(chatUnlockMatch[1]) : String(body.chatId || "");
    const { pin_code, email } = body;
    const cleanEmail = String(email || "").trim().toLowerCase();
    const pin = String(pin_code || "").trim();

    const database = await readDatabase();
    database.chatSettings = Array.isArray(database.chatSettings) ? database.chatSettings : [];
    const setting = database.chatSettings.find((s) => s.chatId === chatId && s.email === cleanEmail);

    if (!setting || !setting.is_locked) {
      sendJson(res, 200, { ok: true, unlocked: true, message: "المحادثة غير مقفلة" });
      return;
    }

    const isValid = verifyPassword(pin, setting.lock_pin_hash);
    if (!isValid) {
      sendJson(res, 401, { ok: false, error: "رمز PIN غير صحيح" });
      return;
    }

    sendJson(res, 200, { ok: true, unlocked: true, message: "تم التحقق وإلغاء قفل المحادثة بنجاح" });
    return;
  }

  // 5. ضبط مؤقت الرسائل ذاتية الحذف (Disappearing Messages Timer)
  const chatDisappearingMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/disappearing$/);
  if ((req.method === "PATCH" || req.method === "POST") && (chatDisappearingMatch || url.pathname === "/api/chats/disappearing")) {
    const body = await readJsonBody(req);
    const chatId = chatDisappearingMatch ? decodeURIComponent(chatDisappearingMatch[1]) : String(body.chatId || "");
    const { timer_seconds, email, friend } = body;
    const validTimers = [null, 0, 3600, 86400, 604800];
    const timer = timer_seconds === null || timer_seconds === 0 ? null : Number(timer_seconds);

    if (!validTimers.includes(timer)) {
      sendJson(res, 400, { error: "القيم المسموحة للمؤقت: null (معطل), 3600 (ساعة), 86400 (24 ساعة), 604800 (7 أيام)" });
      return;
    }

    const database = await readDatabase();
    database.chats = Array.isArray(database.chats) ? database.chats : [];
    
    // إيجاد المحادثة بالمعرف أو عبر ثنائي الصداقة
    const pairId = email && friend ? [email, friend].sort().join("<->") : null;
    let chat = database.chats.find((c) => c.id === chatId || (pairId && (c.id === pairId || c.direct_pair === pairId)));
    if (!chat) {
      chat = {
        id: chatId || pairId || crypto.randomUUID(),
        direct_pair: pairId,
        type: "direct",
        disappearing_timer_seconds: timer,
        created_at: Date.now(),
        updated_at: Date.now()
      };
      database.chats.push(chat);
    } else {
      chat.disappearing_timer_seconds = timer;
      chat.updated_at = Date.now();
    }
    await writeDatabase(database);
    sendJson(res, 200, {
      ok: true,
      chatId: chat.id,
      disappearing_timer_seconds: timer,
      message: timer ? `تم تفعيل الرسائل ذاتية الحذف (${timer} ثانية)` : "تم إيقاف الرسائل ذاتية الحذف"
    });
    return;
  }

  // 6. استرجاع إعدادات الخصوصية لمحادثة (Settings of a chat)
  const chatSettingsMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/settings$/);
  if (req.method === "GET" && (chatSettingsMatch || url.pathname === "/api/chats/settings")) {
    const chatId = chatSettingsMatch ? decodeURIComponent(chatSettingsMatch[1]) : String(url.searchParams.get("chatId") || "");
    const email = String(url.searchParams.get("email") || "").trim().toLowerCase();
    const friend = String(url.searchParams.get("friend") || "").trim().toLowerCase();
    const database = await readDatabase();
    database.chatSettings = Array.isArray(database.chatSettings) ? database.chatSettings : [];
    database.chats = Array.isArray(database.chats) ? database.chats : [];

    const pairId = email && friend ? [email, friend].sort().join("<->") : null;
    const setting = database.chatSettings.find((s) => (s.chatId === chatId || (pairId && s.chatId === pairId)) && s.email === email);
    const chat = database.chats.find((c) => c.id === chatId || (pairId && (c.id === pairId || c.direct_pair === pairId)));

    sendJson(res, 200, {
      ok: true,
      chatId,
      is_locked: Boolean(setting?.is_locked),
      disappearing_timer_seconds: chat?.disappearing_timer_seconds || null,
      custom_wallpaper_url: setting?.custom_wallpaper_url || null,
      custom_theme_code: setting?.custom_theme_code || "default"
    });
    return;
  }

  // 7. تغيير خلفية وثيم المحادثة (حصري لمشتركي شاتو بلاس)
  if (req.method === "POST" && (url.pathname === "/api/chats/wallpaper" || url.pathname === "/api/chats/theme")) {
    const { email, friend, chatId, wallpaperUrl, themeCode } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanFriend = String(friend || "").trim().toLowerCase();
    const database = await readDatabase();

    // التحقق من اشتراك شاتو بلاس
    if (!isChatPlusSubscriber(database, cleanEmail)) {
      sendJson(res, 403, {
        error: "تغيير مظهر وخلفية الدردشة ميزة حصرية لمشتركي شاتو بلاس 👑 - اشترك الآن لتخصيص محادثاتك!",
        is_vip_only: true
      });
      return;
    }

    database.chatSettings = Array.isArray(database.chatSettings) ? database.chatSettings : [];
    const pairId = cleanEmail && cleanFriend ? [cleanEmail, cleanFriend].sort().join("<->") : null;
    const targetChatId = chatId || pairId;

    let setting = database.chatSettings.find((s) => (s.chatId === targetChatId || (pairId && s.chatId === pairId)) && s.email === cleanEmail);
    if (!setting) {
      setting = {
        id: crypto.randomUUID(),
        chatId: targetChatId,
        email: cleanEmail,
        is_locked: false,
        pin_hash: null,
        custom_wallpaper_url: wallpaperUrl || null,
        custom_theme_code: themeCode || "default",
        updatedAt: Date.now()
      };
      database.chatSettings.push(setting);
    } else {
      if (wallpaperUrl !== undefined) setting.custom_wallpaper_url = wallpaperUrl;
      if (themeCode !== undefined) setting.custom_theme_code = themeCode;
      setting.updatedAt = Date.now();
    }

    await writeDatabase(database);
    sendJson(res, 200, {
      ok: true,
      chatId: targetChatId,
      custom_wallpaper_url: setting.custom_wallpaper_url,
      custom_theme_code: setting.custom_theme_code,
      message: "تم حفظ وتطبيق مظهر وخلفية المحادثة بنجاح"
    });
    return;
  }

  // 7.2 تفعيل / إيقاف الذكاء الاصطناعي ChatGPT داخل المحادثة المشتركة (حصري لشاتو بلاس)
  if (req.method === "POST" && url.pathname === "/api/chats/toggle-ai") {
    const { email, friend } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanFriend = String(friend || "").trim().toLowerCase();

    if (!cleanEmail || !cleanFriend) {
      sendJson(res, 400, { error: "البريد الإلكتروني والصديق مطلوبان" });
      return;
    }

    const database = await readDatabase();
    if (!isChatPlusSubscriber(database, cleanEmail)) {
      sendJson(res, 403, {
        error: "تفعيل الذكاء الاصطناعي ChatGPT داخل المحادثة ميزة حصرية لمشتركي شاتو بلاس 👑 - اشترك الآن لتفعيله!",
        is_vip_only: true
      });
      return;
    }

    database.chats = Array.isArray(database.chats) ? database.chats : [];
    database.messages = Array.isArray(database.messages) ? database.messages : [];
    const directChatId = [cleanEmail, cleanFriend].sort().join("<->");
    let chat = database.chats.find((c) => c.id === directChatId || c.direct_pair === directChatId || c.id === `friend:${cleanFriend}` || c.id === `friend:${cleanEmail}`);
    if (!chat) {
      chat = {
        id: directChatId,
        direct_pair: directChatId,
        participants: [cleanEmail, cleanFriend],
        is_ai_active: false,
        createdAt: Date.now()
      };
      database.chats.push(chat);
    }

    chat.is_ai_active = !chat.is_ai_active;

    let botMessage = null;
    if (chat.is_ai_active) {
      botMessage = {
        id: crypto.randomUUID(),
        chat_id: directChatId,
        from: "chatgpt",
        to: directChatId,
        senderName: "ChatGPT",
        type: "text",
        text: "مرحباً بكم! أنا ChatGPT 🤖✨\nأصبحت الآن موجوداً معكم في هذه المحادثة لمساعدتكم والإجابة على أي سؤال.\n\n💬 للتحدث معي في أي وقت، اذكروا اسمي في رسالتكم: (تشات جى بى تى) وسأقوم بالرد فوراً!",
        is_encrypted: false,
        status: "sent",
        read: true,
        createdAt: Date.now()
      };
      database.messages.push(botMessage);
    } else {
      botMessage = {
        id: crypto.randomUUID(),
        chat_id: directChatId,
        from: "chatgpt",
        to: directChatId,
        senderName: "ChatGPT",
        type: "text",
        text: "تم إيقاف تفعيل ChatGPT في هذه المحادثة ⏸️. يمكنكم إعادة تفعيله في أي وقت بالضغط على أيقونة الذكاء الاصطناعي ✨.",
        is_encrypted: false,
        status: "sent",
        read: true,
        createdAt: Date.now()
      };
      database.messages.push(botMessage);
    }

    await writeDatabase(database);
    sendJson(res, 200, { ok: true, is_ai_active: chat.is_ai_active, message: botMessage });
    return;
  }

  // 8. جلب الرسائل المثبتة في المحادثة (Pinned Messages)
  const chatPinsMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/pins$/);
  if (req.method === "GET" && (chatPinsMatch || (url.pathname === "/api/chats/pins" && url.searchParams.has("chatId")))) {
    const chatId = chatPinsMatch ? decodeURIComponent(chatPinsMatch[1]) : String(url.searchParams.get("chatId") || "");
    const email = String(url.searchParams.get("email") || "").trim().toLowerCase();
    const friend = String(url.searchParams.get("friend") || "").trim().toLowerCase();
    const database = await readDatabase();
    database.pinnedMessages = Array.isArray(database.pinnedMessages) ? database.pinnedMessages : [];
    database.messages = Array.isArray(database.messages) ? database.messages : [];

    const pairId = email && friend ? [email, friend].sort().join("<->") : null;
    const targetChatId = chatId || pairId;
    const pins = database.pinnedMessages.filter((p) => p.chat_id === targetChatId || (pairId && p.chat_id === pairId));
    
    const enrichedPins = pins.map((p) => {
      const msg = database.messages.find((m) => m.id === p.message_id);
      return {
        ...p,
        message: msg ? prepareDecryptedMessage(msg) : null
      };
    }).filter((p) => p.message !== null);

    sendJson(res, 200, { ok: true, pins: enrichedPins });
    return;
  }

  // 9. تثبيت رسالة داخل المحادثة (Pin Message - 25 للمشتركين / 3 للمجاني)
  if (req.method === "POST" && url.pathname === "/api/chats/pin-message") {
    const { email, friend, chatId, messageId } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanFriend = String(friend || "").trim().toLowerCase();
    const database = await readDatabase();
    database.pinnedMessages = Array.isArray(database.pinnedMessages) ? database.pinnedMessages : [];
    database.messages = Array.isArray(database.messages) ? database.messages : [];

    const pairId = cleanEmail && cleanFriend ? [cleanEmail, cleanFriend].sort().join("<->") : null;
    const targetChatId = chatId || pairId;

    if (!targetChatId || !messageId) {
      sendJson(res, 400, { error: "معرف المحادثة والرسالة مطلوبان" });
      return;
    }

    const message = database.messages.find((m) => m.id === messageId);
    if (!message) {
      sendJson(res, 404, { error: "الرسالة غير موجودة" });
      return;
    }

    const isPlus = isPlusSubscriber(database, cleanEmail);
    const maxPins = isPlus ? 25 : 3;

    const currentPins = database.pinnedMessages.filter((p) => p.chat_id === targetChatId || (pairId && p.chat_id === pairId));
    if (currentPins.some((p) => p.message_id === messageId)) {
      sendJson(res, 400, { error: "هذه الرسالة مثبتة بالفعل" });
      return;
    }

    if (currentPins.length >= maxPins) {
      sendJson(res, 400, {
        error: `وصلت للحد الأقصى لتثبيت الرسائل (${maxPins} رسائل)${!isPlus ? ' 🌟 اشترك في باقة بلاس AI شاتو لرفع الحد إلى 25 رسالة!' : ''}`,
        limitReached: true,
        maxPins
      });
      return;
    }

    const pinRecord = {
      id: crypto.randomUUID(),
      chat_id: targetChatId,
      message_id: messageId,
      pinned_by: cleanEmail,
      pinned_at: Date.now()
    };
    database.pinnedMessages.push(pinRecord);
    message.pinned = true;
    await writeDatabase(database);

    sendJson(res, 200, {
      ok: true,
      message: "تم تثبيت الرسالة بنجاح",
      pinned: pinRecord,
      count: currentPins.length + 1,
      maxPins
    });
    return;
  }

  // 10. إلغاء تثبيت رسالة (Unpin Message)
  if (req.method === "POST" && (url.pathname === "/api/chats/unpin-message" || url.pathname === "/api/chats/unpin")) {
    const { email, friend, chatId, messageId } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanFriend = String(friend || "").trim().toLowerCase();
    const database = await readDatabase();
    database.pinnedMessages = Array.isArray(database.pinnedMessages) ? database.pinnedMessages : [];
    database.messages = Array.isArray(database.messages) ? database.messages : [];

    const pairId = cleanEmail && cleanFriend ? [cleanEmail, cleanFriend].sort().join("<->") : null;
    const targetChatId = chatId || pairId;

    database.pinnedMessages = database.pinnedMessages.filter((p) => {
      const matchChat = p.chat_id === targetChatId || (pairId && p.chat_id === pairId);
      return !(matchChat && p.message_id === messageId);
    });

    const msg = database.messages.find((m) => m.id === messageId);
    if (msg) msg.pinned = false;

    await writeDatabase(database);
    sendJson(res, 200, {
      ok: true,
      message: "تم إلغاء تثبيت الرسالة",
      messageId
    });
    return;
  }

  // 11. جلب قائمة الرموز الحصرية والنادرة (Exclusive & Rare Emojis)
  if (req.method === "GET" && url.pathname === "/api/emojis/exclusive") {
    const database = await readDatabase();
    const emojis = Array.isArray(database.exclusiveEmojis) && database.exclusiveEmojis.length ? database.exclusiveEmojis : defaultExclusiveEmojis;
    sendJson(res, 200, {
      ok: true,
      emojis
    });
    return;
  }

  // 12. الترجمة الفورية لأي رسالة (Instant In-Chat Translation - حصري لمشتركي شاتو بلاس مع تخزين مؤقت translations)
  if (req.method === "POST" && url.pathname === "/api/messages/translate") {
    const { email, messageId, targetLang = "auto" } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const database = await readDatabase();

    // ميزة حصرية لمشتركي شاتو بلاس
    if (!isChatPlusSubscriber(database, cleanEmail)) {
      sendJson(res, 403, {
        error: "الترجمة الفورية لأي رسالة بضغطة واحدة ميزة حصرية لمشتركي شاتو بلاس 👑 - اشترك الآن لترجمة المحادثات فورياً!",
        is_vip_only: true
      });
      return;
    }

    const message = (database.messages || []).find((m) => m.id === messageId);
    if (!message) {
      sendJson(res, 404, { error: "الرسالة غير موجودة" });
      return;
    }

    const decryptedMsg = prepareDecryptedMessage(message);
    const plainText = decryptedMsg.text;
    if (!plainText) {
      sendJson(res, 400, { error: "لا يوجد نص في هذه الرسالة للترجمة" });
      return;
    }

    message.translations = message.translations && typeof message.translations === "object" ? message.translations : {};
    const cacheKey = targetLang || "auto";

    if (message.translations[cacheKey]) {
      sendJson(res, 200, {
        ok: true,
        messageId,
        translatedText: message.translations[cacheKey],
        targetLang: cacheKey,
        cached: true
      });
      return;
    }

    try {
      const translated = await translateText(plainText, targetLang);
      message.translations[cacheKey] = translated;
      await writeDatabase(database);
      sendJson(res, 200, {
        ok: true,
        messageId,
        translatedText: translated,
        targetLang: cacheKey,
        cached: false
      });
    } catch (err) {
      sendJson(res, 500, { error: "تعذر ترجمة الرسالة في الوقت الحالي: " + err.message });
    }
    return;
  }

  // 1 & 2. إرسال وقبول طلب الصداقة فورياً
  if (req.method === "POST" && url.pathname === "/api/friendships") {
    const { from, to } = await readJsonBody(req);
    const cleanFrom = String(from || "").trim().toLowerCase();
    const cleanTo = String(to || "").trim().toLowerCase();
    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    database.friendships = Array.isArray(database.friendships) ? database.friendships : [];

    let sender = database.users.find((user) => user.email.toLowerCase() === cleanFrom);
    let recipient = database.users.find((user) => user.email.toLowerCase() === cleanTo || normalizeName(user.name) === normalizeName(cleanTo));

    if (!sender) {
      sender = { id: crypto.randomUUID(), name: cleanFrom.split("@")[0], email: cleanFrom, createdAt: Date.now() };
      database.users.push(sender);
    }
    if (!recipient) {
      recipient = { id: crypto.randomUUID(), name: cleanTo.split("@")[0], email: cleanTo, createdAt: Date.now() };
      database.users.push(recipient);
    }

    if (sender.email === recipient.email) {
      sendJson(res, 400, { error: "لا يمكن إضافة نفسك كصديق" });
      return;
    }

    let existing = database.friendships.find((item) =>
      (item.from === sender.email && item.to === recipient.email) ||
      (item.from === recipient.email && item.to === sender.email)
    );

    if (existing) {
      existing.status = "accepted";
    } else {
      existing = {
        id: crypto.randomUUID(),
        from: sender.email,
        to: recipient.email,
        status: "accepted",
        createdAt: Date.now()
      };
      database.friendships.push(existing);
    }

    await writeDatabase(database);
    sendJson(res, 200, {
      ok: true,
      accepted: true,
      message: `تمت إضافة ${recipient.name} كصديق بنجاح وبدء المحادثة!`,
      friend: publicUser(recipient)
    });
    return;
  }

  // 2. الرد على طلب الصداقة (قبول أو رفض)
  if (req.method === "POST" && url.pathname === "/api/friendships/respond") {
    const { id, action, user } = await readJsonBody(req);
    const cleanUser = String(user || "").trim().toLowerCase();
    const database = await readDatabase();
    const index = database.friendships.findIndex((item) => item.id === id && item.to === cleanUser && item.status === "pending");
    if (index === -1) {
      sendJson(res, 404, { error: "طلب الصداقة غير موجود أو تم التعامل معه مسبقاً" });
      return;
    }
    if (action === "accept") {
      database.friendships[index].status = "accepted";
      await writeDatabase(database);
      sendJson(res, 200, { ok: true, status: "accepted", message: "تم قبول طلب الصداقة بنجاح!" });
      return;
    } else {
      database.friendships.splice(index, 1);
      await writeDatabase(database);
      sendJson(res, 200, { ok: true, status: "rejected", message: "تم رفض طلب الصداقة" });
      return;
    }
  }

  // 1. حذف صديق نهائياً
  if (req.method === "DELETE" && url.pathname === "/api/friends") {
    const user = String(url.searchParams.get("user") || "").toLowerCase();
    const friend = String(url.searchParams.get("friend") || "").toLowerCase();
    const database = await readDatabase();
    database.friendships = database.friendships.filter((item) =>
      !((item.from === user && item.to === friend) || (item.from === friend && item.to === user))
    );
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, message: "تم حذف الصديق نهائياً" });
    return;
  }

  // جلب الإشعارات (طلبات الصداقة المعلقة فقط للمستخدم)
  if (req.method === "GET" && url.pathname === "/api/notifications") {
    const email = String(url.searchParams.get("email") || "").toLowerCase();
    const database = await readDatabase();
    const notifications = database.friendships
      .filter((item) => item.to === email && item.status === "pending")
      .map((item) => {
        const sender = database.users.find((user) => user.email === item.from);
        return sender ? { id: item.id, type: "friend_request", from: publicUser(sender), createdAt: item.createdAt } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.createdAt - a.createdAt);
    sendJson(res, 200, { notifications });
    return;
  }

  // جلب قائمة الأصدقاء (المقبولين فقط!)
  if (req.method === "GET" && url.pathname === "/api/friends") {
    const email = String(url.searchParams.get("email") || "").toLowerCase();
    const database = await readDatabase();
    const friends = database.friendships
      .filter((item) => (item.from === email || item.to === email) && (item.status === "accepted" || !item.status))
      .map((item) => item.from === email ? item.to : item.from)
      .filter((friendEmail, index, list) => list.indexOf(friendEmail) === index)
      .map((friendEmail) => database.users.find((user) => user.email === friendEmail))
      .filter(Boolean)
      .map(publicUser);
    sendJson(res, 200, { friends });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/ai/usage") {
    const email = String(url.searchParams.get("email") || "").toLowerCase();
    const database = await readDatabase();
    const usage = usageFor(database, email);
    await writeDatabase(database);
    sendJson(res, 200, usageSummary(usage, database));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ai/chat") {
    const { email, prompt, imageUrl = "" } = await readJsonBody(req);
    const cleanEmail = String(email || "").toLowerCase();
    const database = await readDatabase();
    const usage = usageFor(database, cleanEmail);
    const { isVip, daysRemaining } = getUserVipStatus(database, cleanEmail);

    const maxWords = isVip ? 500 : 90;
    const wordsRemaining = Math.max(0, maxWords - (usage.words || 0));
    const promptWordCount = countWords(prompt);

    // فحص إرسال الصور إلى شات الذكاء الاصطناعي
    if (imageUrl) {
      if (!isVip && (usage.images || 0) >= 3) {
        sendJson(res, 429, {
          error: "لقد استهلكت رصيدك اليومي المجاني للصور (3 صور). يتجدد رصيدك تلقائياً غداً، أو اشترك الآن في باقة VIP (شهران) للحصول على إرسال صور غير محدود و500 كلمة يومياً!",
          limitReached: true,
          usage: usageSummary(usage, database)
        });
        return;
      }
      if (!isVip) {
        usage.images = (usage.images || 0) + 1;
      }
    }

    if (wordsRemaining <= 0 || (promptWordCount > 0 && promptWordCount > wordsRemaining)) {
      sendJson(res, 429, { 
        error: isVip
          ? `لقد استهلكت رصيد VIP اليومي (${maxWords} كلمة). يتجدد رصيدك تلقائياً كل 24 ساعة (متبقي من اشتراكك ${daysRemaining} يوم).`
          : `لقد استهلكت رصيدك المجاني اليومي (${maxWords} كلمة). ينقص الرصيد كلمة بكلمة مع كل كلمة تكتبها. يمكنك الترقية لباقة VIP (شهران) للحصول على 500 كلمة يومياً و20 صورة يومياً وإرسال صور بلا حدود!`,
        limitReached: true,
        usage: usageSummary(usage, database) 
      });
      return;
    }

    try {
      let reply;
      if (imageUrl && !prompt) {
        reply = "تم استلام صورتك بنجاح! 🖼️ صورة ممتازة، تفضل بسؤالي حول أي شيء تريده في هذه الصورة أو في أي موضوع.";
      } else {
        reply = await askChatGPT(prompt);
      }
      usage.words = (usage.words || 0) + promptWordCount;
      await writeDatabase(database);
      sendJson(res, 200, { text: reply, usage: usageSummary(usage, database) });
    } catch (error) {
      sendJson(res, 502, { error: error.message || "تعذر الحصول على رد من الذكاء الاصطناعي.", usage: usageSummary(usage, database) });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ai/images") {
    const { email, prompt } = await readJsonBody(req);
    const cleanEmail = String(email || "").toLowerCase();
    const database = await readDatabase();
    const usage = usageFor(database, cleanEmail);
    const { isVip, daysRemaining } = getUserVipStatus(database, cleanEmail);
    const maxImages = isVip ? 20 : 3;

    if ((usage.images || 0) >= maxImages) {
      sendJson(res, 429, { 
        error: isVip
          ? `لقد استهلكت حد ${maxImages} صورة بالذكاء الاصطناعي اليوم. يتجدد الرصيد تلقائياً كل 24 ساعة (متبقي ${daysRemaining} يوم في باقة VIP).`
          : `لقد استهلكت حد ${maxImages} صور مجانية اليوم. يتجدد الرصيد غداً، أو اشترك الآن في باقة VIP (شهران) للحصول على 20 صورة يومياً و500 كلمة يومياً!`,
        limitReached: true,
        usage: usageSummary(usage, database) 
      });
      return;
    }
    try {
      const imageUrl = await generateAiImage(prompt);
      usage.images = (usage.images || 0) + 1;
      await writeDatabase(database);
      sendJson(res, 200, { imageUrl, usage: usageSummary(usage, database) });
    } catch (error) {
      sendJson(res, 502, { error: error.message || "تعذر توليد الصورة حالياً.", usage: usageSummary(usage, database) });
    }
    return;
  }

  // ترقية باقات شاتو (بلاس AI شاتو أو شاتو بلاس) لمدة شهرين (60 يوماً)
  if (req.method === "POST" && (url.pathname === "/api/ai/upgrade" || url.pathname === "/api/subscriptions/subscribe-plus" || url.pathname === "/api/subscriptions/subscribe")) {
    const { email, planCode = "chato_ai_plus", plan = "chato_ai_plus" } = await readJsonBody(req);
    const chosenPlan = planCode || plan;
    const cleanEmail = String(email || "").toLowerCase();
    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    let user = database.users.find((u) => u.email.toLowerCase() === cleanEmail);
    const now = Date.now();
    const expires = now + (60 * 24 * 3600 * 1000); // 60 يوماً كاملة

    if (!user) {
      user = { id: crypto.randomUUID(), name: cleanEmail.split("@")[0], email: cleanEmail, createdAt: now };
      database.users.push(user);
    }

    database.userSubscriptions = Array.isArray(database.userSubscriptions) ? database.userSubscriptions : [];

    if (chosenPlan === "chato_plus") {
      user.chatPlusUntil = expires;
      user.isChatPlus = true;
      let sub = database.userSubscriptions.find((s) => s.email && s.email.toLowerCase() === cleanEmail && s.plan_code === "chato_plus");
      if (!sub) {
        sub = {
          id: crypto.randomUUID(),
          user_id: user.id || cleanEmail,
          email: cleanEmail,
          created_at: now
        };
        database.userSubscriptions.push(sub);
      }
      sub.plan_code = "chato_plus";
      sub.plan_title = "شاتو بلاس";
      sub.is_active = true;
      sub.started_at = now;
      sub.expires_at = expires;
      sub.auto_renew = true;
      sub.updated_at = now;
      await writeDatabase(database);

      sendJson(res, 200, {
        ok: true,
        plan_code: "chato_plus",
        plan_title: "شاتو بلاس",
        is_active: true,
        expires_at: expires,
        days_remaining: 60,
        message: "تهانينا! 🎉 تم تفعيل باقة شاتو بلاس بنجاح لمدة شهرين كاملين (60 يوماً)! تم فتح خلفيات المحادثة، والترجمة الفورية، والرموز النادرة والمتحركة، وتثبيت حتى 25 رسالة.",
        chat_plus: {
          is_active: true,
          expires_at: expires,
          days_remaining: 60
        }
      });
      return;
    } else {
      const CHATO_PLUS_PRICE = 99; // 99 SAR
      const DURATION_DAYS = 60;
      user.vipUntil = expires;
      let sub = database.userSubscriptions.find((s) => s.email && s.email.toLowerCase() === cleanEmail && s.plan_code === "chato_ai_plus");
      if (!sub) {
        sub = {
          id: crypto.randomUUID(),
          user_id: user.id || cleanEmail,
          email: cleanEmail,
          created_at: now
        };
        database.userSubscriptions.push(sub);
      }
      sub.plan_code = "chato_ai_plus";
      sub.plan_title = "بلاس AI شاتو (99 ريال)";
      sub.is_active = true;
      sub.daily_words_limit = 500;
      sub.daily_words_used = 0;
      sub.daily_ai_images_limit = 20;
      sub.daily_ai_images_used = 0;
      sub.unlimited_media_sending = true;
      sub.started_at = now;
      sub.expires_at = expires;
      sub.last_quota_reset_at = now;
      sub.next_quota_reset_at = now + (24 * 3600 * 1000);
      sub.auto_renew = true;
      sub.updated_at = now;

      const usage = usageFor(database, cleanEmail);
      usage.words = 0;
      usage.images = 0;
      await writeDatabase(database);

      sendJson(res, 200, { 
        ok: true, 
        plan_code: "chato_ai_plus", 
        plan_title: "بلاس AI شاتو (99 ريال)",
        price: CHATO_PLUS_PRICE,
        duration_days: DURATION_DAYS,
        is_active: true, 
        expires_at: expires,
        days_remaining: 60,
        message: "تهانينا! 🎉 تم سداد 99 ريال وتفعيل باقة بلاس AI شاتو بنجاح لمدة شهرين كاملين (60 يوماً)! تم فتح 500 كلمة يومياً و20 صورة بالذكاء الاصطناعي وإرسال الصور بلا حدود.",
        vip: {
          is_vip: true,
          expires_at: expires,
          days_remaining: 60
        }
      });
      return;
    }
  }

  // استرجاع تفاصيل باقة المستخدم وحصصه اليومية
  if (req.method === "GET" && (url.pathname === "/api/subscriptions/my-plan" || url.pathname === "/api/subscriptions/plan")) {
    const email = String(url.searchParams.get("email") || "").trim().toLowerCase();
    const database = await readDatabase();
    const sub = getOrUpdateUserSubscription(database, email);
    await writeDatabase(database);

    const now = Date.now();
    const isAiPlus = Boolean(sub.is_active && sub.plan_code === "chato_ai_plus" && sub.expires_at > now);
    const wordsRemaining = Math.max(0, sub.daily_words_limit - (sub.daily_words_used || 0));
    const imagesRemaining = Math.max(0, sub.daily_ai_images_limit - (sub.daily_ai_images_used || 0));
    const aiDaysRemaining = isAiPlus ? Math.max(1, Math.ceil((sub.expires_at - now) / (24 * 3600 * 1000))) : 0;

    const isChatPlus = isChatPlusSubscriber(database, email);
    const user = (database.users || []).find((u) => u.email.toLowerCase() === email);
    const chatPlusExpires = user?.chatPlusUntil || 0;
    const chatPlusDaysRemaining = isChatPlus ? Math.max(1, Math.ceil((chatPlusExpires - now) / (24 * 3600 * 1000))) : 0;

    sendJson(res, 200, {
      ok: true,
      plan_code: sub.plan_code,
      plan_title: sub.plan_title,
      is_active: sub.is_active,
      daily_words_limit: sub.daily_words_limit,
      daily_words_used: sub.daily_words_used || 0,
      words_remaining: wordsRemaining,
      daily_ai_images_limit: sub.daily_ai_images_limit,
      daily_ai_images_used: sub.daily_ai_images_used || 0,
      images_remaining: imagesRemaining,
      unlimited_media_sending: Boolean(sub.unlimited_media_sending),
      next_quota_reset_at: sub.next_quota_reset_at,
      last_quota_reset_at: sub.last_quota_reset_at,
      started_at: sub.started_at,
      expires_at: sub.expires_at,
      auto_renew: Boolean(sub.auto_renew),
      days_remaining: aiDaysRemaining,
      ai_plus: {
        plan_code: "chato_ai_plus",
        plan_title: "شاتو AI بلاس",
        is_active: isAiPlus,
        daily_words_limit: sub.daily_words_limit,
        daily_words_used: sub.daily_words_used || 0,
        words_remaining: wordsRemaining,
        daily_ai_images_limit: sub.daily_ai_images_limit,
        daily_ai_images_used: sub.daily_ai_images_used || 0,
        images_remaining: imagesRemaining,
        next_quota_reset_at: sub.next_quota_reset_at,
        expires_at: sub.expires_at,
        days_remaining: aiDaysRemaining
      },
      chat_plus: {
        plan_code: "chato_plus",
        plan_title: "شاتو بلاس",
        is_active: isChatPlus,
        expires_at: chatPlusExpires,
        days_remaining: chatPlusDaysRemaining
      }
    });
    return;
  }

  if (req.method === "POST" && (url.pathname === "/api/messages" || url.pathname === "/api/messages/send")) {
    const body = await readJsonBody(req);
    const { from, to, sender_email, chat_id, type = "text", text = "", content = "", imageUrl = "", fileName = "", audioUrl = "", location = null, poll = null, sticker = null, sticker_url = "", document = null, sender_public_key = null, reply_to = null, group_meta = null } = body;
    const cleanFrom = String(from || sender_email || "").trim().toLowerCase();
    const cleanTo = String(to || chat_id || "").trim().toLowerCase();
    const messageText = text || content || "";
    const finalStickerUrl = sticker_url || (typeof sticker === "string" ? sticker : sticker?.url);
    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    database.messages = Array.isArray(database.messages) ? database.messages : [];
    database.friendships = Array.isArray(database.friendships) ? database.friendships : [];
    database.groups = Array.isArray(database.groups) ? database.groups : [];

    if (group_meta && group_meta.id) {
      let g = database.groups.find(grp => grp.id === group_meta.id);
      if (!g) {
        database.groups.push(group_meta);
      } else {
        Object.assign(g, group_meta);
      }
    }

    let sender = database.users.find((user) => user.email.toLowerCase() === cleanFrom);
    if (!sender && cleanFrom) {
      sender = { id: crypto.randomUUID(), name: cleanFrom.split("@")[0], email: cleanFrom, createdAt: Date.now() };
      database.users.push(sender);
    }

    // فحص صلاحية إرسال الرسائل في المجموعات (الجميع أو المشرف فقط)
    if (cleanTo.startsWith("group:")) {
      const groupId = cleanTo.replace(/^group:/, "");
      const groupObj = (database.groups || []).find((g) => g.id === groupId) || 
                       (database.chats || []).find((c) => c.id === `group:${groupId}` || c.id === groupId);
      if (groupObj && groupObj.who_can_send === "admins_only") {
        const isSenderAdmin = String(groupObj.admin || groupObj.created_by || "").toLowerCase() === cleanFrom || 
                              (Array.isArray(groupObj.admins) && groupObj.admins.map(a => String(a).toLowerCase()).includes(cleanFrom));
        if (!isSenderAdmin) {
          sendJson(res, 403, { error: "إرسال الرسائل في هذه المجموعة مقتصر على المشرفين فقط 🔒" });
          return;
        }
      }
    }

    let recipient = null;
    if (!cleanTo.startsWith("group:")) {
      recipient = database.users.find((user) => user.email.toLowerCase() === cleanTo || normalizeName(user.name) === normalizeName(cleanTo));
      if (!recipient && cleanTo) {
        recipient = { id: crypto.randomUUID(), name: cleanTo.split("@")[0], email: cleanTo, createdAt: Date.now() };
        database.users.push(recipient);
      }

      if (sender && recipient) {
        if (sender.email === recipient.email) {
          sendJson(res, 400, { error: "لا يمكن مراسلة نفسك" });
          return;
        }
        const sEmail = sender.email.toLowerCase();
        const rEmail = recipient.email.toLowerCase();
        if (isUserBlocked(rEmail, sEmail)) {
          sendJson(res, 403, { error: "لا يمكنك إرسال رسائل لهذا المستخدم لأنك محظور لديه 🚫" });
          return;
        }
        if (isUserBlocked(sEmail, rEmail)) {
          sendJson(res, 403, { error: "لقد قمت بحظر هذا المستخدم. يرجى إلغاء الحظر أولاً لتتمكن من إرسال الرسائل 🚫" });
          return;
        }
      }
    }

    // الربط كأصدقاء تلقائياً ومباشرة
    if (recipient) {
      let friendship = database.friendships.find((item) =>
        (item.from === sender.email && item.to === recipient.email) ||
        (item.from === recipient.email && item.to === sender.email)
      );
      if (!friendship) {
        database.friendships.push({
          id: crypto.randomUUID(),
          from: sender.email,
          to: recipient.email,
          status: "accepted",
          createdAt: Date.now()
        });
      } else if (friendship.status !== "accepted") {
        friendship.status = "accepted";
      }
    }

    // البحث عن مؤقت الحذف التلقائي للمحادثة (Disappearing Messages Timer)
    database.chats = Array.isArray(database.chats) ? database.chats : [];
    let chatTargetId = cleanTo;
    if (recipient) {
      chatTargetId = [sender.email, recipient.email].sort().join("<->");
    }
    let chatRecord = database.chats.find((c) => c.id === chatTargetId || c.direct_pair === chatTargetId || (recipient && (c.id === `friend:${recipient.email}` || c.id === `friend:${sender.email}`)));
    const disappearingTimer = chatRecord?.disappearing_timer_seconds || null;
    const expiresAt = disappearingTimer ? Date.now() + (Number(disappearingTimer) * 1000) : null;

    const nowTime = Date.now();
    if (chatRecord) {
      chatRecord.last_message_at = nowTime;
      chatRecord.last_message_content = messageText || (type === "sticker" ? "ملصق متحرك" : type);
    } else {
      chatRecord = {
        id: chatTargetId,
        direct_pair: recipient ? chatTargetId : undefined,
        type: cleanTo.startsWith("group:") ? "group" : "direct",
        who_can_send: (group_meta && group_meta.who_can_send) || "everyone",
        last_message_at: nowTime,
        last_message_content: messageText || (type === "sticker" ? "ملصق متحرك" : type),
        created_at: nowTime
      };
      database.chats.push(chatRecord);
    }

    // تشفير محتوى الرسالة بـ AES-256-GCM (Encryption at Rest)
    const plainText = String(text || content || "").trim();
    let encContent = plainText;
    let encIv = null;
    let encTag = null;
    let isEncrypted = false;

    if (plainText) {
      const enc = encryptMessageContent(plainText);
      encContent = enc.content;
      encIv = enc.encryption_iv;
      encTag = enc.encryption_auth_tag;
      isEncrypted = true;
    }

    let finalImageUrl = imageUrl || "";
    if (finalImageUrl.startsWith("data:")) {
      finalImageUrl = saveBase64MediaToFile(finalImageUrl, "jpg");
    }
    let finalAudioUrl = audioUrl || "";
    if (finalAudioUrl.startsWith("data:")) {
      finalAudioUrl = saveBase64MediaToFile(finalAudioUrl, "webm");
    }
    let finalDoc = document || null;
    if (finalDoc && finalDoc.url && finalDoc.url.startsWith("data:")) {
      const ext = (finalDoc.name || "").split(".").pop() || "bin";
      finalDoc = { ...finalDoc, url: saveBase64MediaToFile(finalDoc.url, ext) };
    }

    const targetChatId = cleanTo.startsWith("group:") ? cleanTo : (recipient ? [sender.email, recipient.email].sort().join("<->") : cleanTo);
    const message = {
      id: crypto.randomUUID(),
      chat_id: targetChatId,
      from: sender.email,
      to: recipient ? recipient.email : cleanTo,
      type: type || "text",
      text: encContent,
      is_encrypted: isEncrypted,
      encryption_iv: encIv,
      encryption_auth_tag: encTag,
      sender_public_key: String(body.sender_public_key || "").trim() || null,
      expires_at: expiresAt,
      expiresAt: expiresAt,
      imageUrl: finalImageUrl,
      fileName: fileName || "",
      audioUrl: finalAudioUrl,
      location: location || null,
      poll: poll || null,
      sticker: sticker || null,
      sticker_url: finalStickerUrl,
      document: finalDoc,
      reply_to: reply_to || null,
      status: "sent",
      read: false,
      createdAt: Date.now()
    };
    activeTypingMap.delete(targetChatId);
    database.messages.push(message);

    // التحقق من تفعيل ChatGPT في المحادثة ومناداته بكلمة السر (تشات جى بى تى)
    let aiMessage = null;
    if (chatRecord && chatRecord.is_ai_active) {
      const AI_TRIGGER_REGEX = /(?:تشات|شات)\s*(?:ج[يى]\s*ب[يى]\s*ت[يى]|جيبوتي)|(?:chat\s*gpt|chatgpt)/i;
      if (plainText && AI_TRIGGER_REGEX.test(plainText)) {
        try {
          const cleanPrompt = plainText.replace(AI_TRIGGER_REGEX, "").trim() || plainText;
          const promptForBot = `أنت Chato Assistant، تجيب مباشرة وبلباقة وود ووضوح وإيجاز على هذا السؤال أو الحديث من أحد أطراف المحادثة في تطبيق شاتو:\n"${cleanPrompt}"`;
          const reply = await askChatGPT(promptForBot);
          if (reply) {
            aiMessage = {
              id: crypto.randomUUID(),
              chat_id: targetChatId,
              from: "chatgpt",
              to: targetChatId,
              senderName: "Chato Assistant",
              type: "text",
              text: reply,
              is_encrypted: false,
              status: "sent",
              read: false,
              createdAt: Date.now() + 50
            };
            database.messages.push(aiMessage);
          }
        } catch (err) {
          console.error("Chato Assistant In-Chat trigger error:", err?.message || err);
        }
      }
    }

    await writeDatabase(database);
    const decryptedMessage = prepareDecryptedMessage(message);

    if (recipient) {
      broadcastToUser(recipient.email, "new_message", decryptedMessage);
      sendPushToUser(recipient.email, {
        title: `شاتو: رسالة جديدة من ${sender.name || sender.email}`,
        body: plainText || (type === "sticker" ? "أرسل لك ملصقاً 🎭" : (type === "image" ? "أرسل لك صورة 🖼️" : "أرسل لك رسالة 💬")),
        icon: "/logo.png",
        data: { url: `/?chat=friend:${sender.email}`, chatId: targetChatId }
      }, database).catch(() => {});
    } else if (cleanTo.startsWith("group:")) {
      const groupId = cleanTo.replace(/^group:/, "");
      const groupObj = (database.groups || []).find((g) => g.id === groupId);
      if (groupObj && Array.isArray(groupObj.member_emails)) {
        for (const mEmail of groupObj.member_emails) {
          if (mEmail.toLowerCase() !== sender.email.toLowerCase()) {
            broadcastToUser(mEmail, "new_message", decryptedMessage);
          }
        }
      }
    }

    broadcastToUser(sender.email, "new_message", decryptedMessage);
    if (aiMessage) {
      if (recipient) broadcastToUser(recipient.email, "new_message", aiMessage);
      broadcastToUser(sender.email, "new_message", aiMessage);
    }

    sendJson(res, 201, { ok: true, message: { ...message, text: plainText }, aiMessage });
    return;
  }

  // 3. حذف رسالة نهائياً من قاعدة البيانات
  if (req.method === "DELETE" && url.pathname === "/api/messages") {
    const id = String(url.searchParams.get("id") || "");
    const user = String(url.searchParams.get("user") || "").toLowerCase();
    const database = await readDatabase();
    const index = database.messages.findIndex((m) => m.id === id && (m.from === user || m.to === user));
    if (index !== -1) {
      database.messages.splice(index, 1);
      await writeDatabase(database);
    }
    sendJson(res, 200, { ok: true, message: "تم حذف الرسالة نهائياً" });
    return;
  }

  // 5. تمييز الرسائل كمقروءة (تحويل الصحين إلى اللون الأزرق وتصفير العداد)
  if (req.method === "POST" && url.pathname === "/api/messages/read") {
    const { user, friend } = await readJsonBody(req);
    const cleanUser = String(user || "").trim().toLowerCase();
    const cleanFriend = String(friend || "").trim().toLowerCase();
    const database = await readDatabase();
    let updated = false;
    for (const msg of database.messages) {
      if (msg.from === cleanFriend && msg.to === cleanUser && (msg.status !== "read" || !msg.read)) {
        msg.status = "read";
        msg.read = true;
        updated = true;
      }
    }
    if (updated) {
      await writeDatabase(database);
    }
    sendJson(res, 200, { ok: true, updated });
    return;
  }

  // 7. التصويت في استطلاع الرأي (Poll Vote)
  if (req.method === "POST" && url.pathname === "/api/messages/poll-vote") {
    const { messageId, optionIndex, voterEmail } = await readJsonBody(req);
    const cleanVoter = String(voterEmail || "").trim().toLowerCase();
    const database = await readDatabase();
    const message = database.messages.find((m) => m.id === messageId && m.type === "poll");
    if (!message || !message.poll || !Array.isArray(message.poll.options)) {
      sendJson(res, 404, { error: "الاستطلاع غير موجود" });
      return;
    }
    // إلغاء أي تصويت سابق لنفس المستخدم في هذا الاستطلاع
    message.poll.options.forEach((opt) => {
      opt.votes = (opt.votes || []).filter((e) => e !== cleanVoter);
    });
    // إضافة التصويت للخيار المختار
    if (message.poll.options[optionIndex]) {
      if (!Array.isArray(message.poll.options[optionIndex].votes)) {
        message.poll.options[optionIndex].votes = [];
      }
      message.poll.options[optionIndex].votes.push(cleanVoter);
    }
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, poll: message.poll });
    return;
  }

  // 8. مؤشر الكتابة الحية (Live Typing Indicator)
  if (req.method === "POST" && url.pathname === "/api/chats/typing") {
    const { chatId, email, friend } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanFriend = String(friend || "").trim().toLowerCase();
    const directId = chatId || (cleanFriend ? [cleanEmail, cleanFriend].sort().join("<->") : cleanEmail);
    if (cleanEmail && directId) {
      activeTypingMap.set(directId, { email: cleanEmail, timestamp: Date.now() });
      if (cleanFriend) {
        broadcastToUser(cleanFriend, "typing", { from: cleanEmail, isTyping: true });
      }
    }
    sendJson(res, 200, { ok: true });
    return;
  }

  // 9. تعديل الرسالة المرسلة (Edit Message خلال 15 دقيقة)
  if (req.method === "POST" && url.pathname === "/api/messages/edit") {
    const { messageId, newText, email } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanText = String(newText || "").trim();
    if (!cleanText) {
      sendJson(res, 400, { error: "لا يمكن حفظ رسالة فارغة" });
      return;
    }
    const database = await readDatabase();
    database.messages = Array.isArray(database.messages) ? database.messages : [];
    const msg = database.messages.find((m) => m.id === messageId);
    if (!msg) {
      sendJson(res, 404, { error: "الرسالة غير موجودة" });
      return;
    }
    if (String(msg.from || "").toLowerCase() !== cleanEmail) {
      sendJson(res, 403, { error: "لا يمكنك تعديل رسائل الآخرين" });
      return;
    }
    if (Date.now() - Number(msg.createdAt || 0) > 15 * 60 * 1000) {
      sendJson(res, 400, { error: "انتهت مهلة تعديل الرسالة (متاحة لمدة 15 دقيقة فقط بعد الإرسال)" });
      return;
    }
    const enc = encryptMessageContent(cleanText);
    msg.text = enc.content;
    msg.encryption_iv = enc.encryption_iv;
    msg.encryption_auth_tag = enc.encryption_auth_tag;
    msg.is_encrypted = true;
    msg.edited = true;
    msg.edited_at = Date.now();
    await writeDatabase(database);
    const dec = prepareDecryptedMessage(msg);
    broadcastToUser(msg.to, "message_edit", dec);
    broadcastToUser(msg.from, "message_edit", dec);
    sendJson(res, 200, { ok: true, message: dec });
    return;
  }

  // 10. حذف الرسالة لدى الجميع (Delete Message for Everyone)
  if (req.method === "POST" && url.pathname === "/api/messages/delete-everyone") {
    const { messageId, email } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const database = await readDatabase();
    database.messages = Array.isArray(database.messages) ? database.messages : [];
    const msg = database.messages.find((m) => m.id === messageId);
    if (!msg) {
      sendJson(res, 404, { error: "الرسالة غير موجودة" });
      return;
    }
    if (String(msg.from || "").toLowerCase() !== cleanEmail) {
      sendJson(res, 403, { error: "لا يمكنك حذف رسائل الآخرين للجميع" });
      return;
    }
    msg.text = "🚫 تم حذف هذه الرسالة";
    msg.is_deleted = true;
    msg.type = "deleted";
    msg.imageUrl = "";
    msg.fileName = "";
    msg.audioUrl = "";
    msg.location = null;
    msg.poll = null;
    msg.sticker = null;
    msg.document = null;
    msg.deleted_at = Date.now();
    await writeDatabase(database);
    const dec = prepareDecryptedMessage(msg);
    broadcastToUser(msg.to, "message_edit", dec);
    broadcastToUser(msg.from, "message_edit", dec);
    sendJson(res, 200, { ok: true, message: dec });
    return;
  }

  // ==========================================
  // مسارات تثبيت الدردشات (بحد أقصى 3 محادثات فقط)
  // ==========================================
  if (req.method === "POST" && url.pathname === "/api/chats/pin") {
    const { user, chatId, isPinned } = await readJsonBody(req);
    const cleanUser = String(user || "").trim().toLowerCase();
    if (!cleanUser || !chatId) {
      sendJson(res, 400, { error: "user and chatId required" });
      return;
    }
    const result = setChatPin(cleanUser, chatId, Boolean(isPinned));
    if (!result.ok) {
      sendJson(res, 400, result);
      return;
    }
    const pinnedChats = getPinnedChats(cleanUser);
    sendJson(res, 200, { ok: true, isPinned: result.isPinned, pinnedChats });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/chats/pins") {
    const user = String(url.searchParams.get("user") || "").trim().toLowerCase();
    if (!user) {
      sendJson(res, 400, { error: "user required" });
      return;
    }
    const pinnedChats = getPinnedChats(user);
    sendJson(res, 200, { ok: true, pinnedChats });
    return;
  }

  // ==========================================
  // مسارات حظر المستخدمين (Block / Unblock)
  // ==========================================
  if (req.method === "POST" && (url.pathname === "/api/users/block" || url.pathname === "/api/users/unblock")) {
    const { blocker, target } = await readJsonBody(req);
    const cleanBlocker = String(blocker || "").trim().toLowerCase();
    const cleanTarget = String(target || "").trim().toLowerCase();
    const isUnblock = url.pathname.endsWith("/unblock");
    const result = isUnblock ? unblockUser(cleanBlocker, cleanTarget) : blockUser(cleanBlocker, cleanTarget);
    if (!result.ok) {
      sendJson(res, 400, result);
      return;
    }
    const blocked = getBlockedUsers(cleanBlocker);
    sendJson(res, 200, { ok: true, isBlocked: !isUnblock, blocked });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/users/blocks") {
    const user = String(url.searchParams.get("user") || "").trim().toLowerCase();
    const blocked = getBlockedUsers(user);
    sendJson(res, 200, { ok: true, blocked });
    return;
  }

  // ==========================================
  // مسار إرسال البلاغات والشكاوى (Reports)
  // ==========================================
  if (req.method === "POST" && url.pathname === "/api/reports/submit") {
    const { reporter, reported, chatId, reason, details } = await readJsonBody(req);
    const result = addReport(reporter, reported, chatId, reason, details);
    if (!result.ok) {
      sendJson(res, 400, result);
      return;
    }
    sendJson(res, 200, { ok: true, reportId: result.reportId, message: "تم تسجيل البلاغ بنجاح وسيتم مراجعته" });
    return;
  }

  const ADMIN_MASTER_PIN = "M0102141214";

  if (url.pathname.startsWith("/api/admin/")) {
    const providedPin = req.headers["x-admin-pin"] || url.searchParams.get("pin");
    if (providedPin !== ADMIN_MASTER_PIN) {
      sendJson(res, 401, { error: "غير مصرح - رمز المرور غير صحيح" });
      return;
    }
  }

  // لوحة معلومات قواعد البيانات المعزولة (Isolated Databases Overview)
  if (req.method === "GET" && url.pathname === "/api/admin/databases/overview") {
    try {
      const dbDir = path.resolve(workspaceRoot, "work", "databases");
      const uDir = path.join(dbDir, "users");
      const cDir = path.join(dbDir, "chats");

      const userFiles = fsSync.existsSync(uDir) ? fsSync.readdirSync(uDir).filter((f) => f.endsWith(".db")) : [];
      const chatFiles = fsSync.existsSync(cDir) ? fsSync.readdirSync(cDir).filter((f) => f.endsWith(".db")) : [];
      const sysExists = fsSync.existsSync(path.join(dbDir, "system.db"));

      const userDbs = userFiles.map((f) => {
        const st = fsSync.statSync(path.join(uDir, f));
        return { file: f, sizeBytes: st.size, sizeKb: (st.size / 1024).toFixed(1) };
      });

      const chatDbs = chatFiles.map((f) => {
        const st = fsSync.statSync(path.join(cDir, f));
        return { file: f, sizeBytes: st.size, sizeKb: (st.size / 1024).toFixed(1) };
      });

      const sysStats = sysExists ? fsSync.statSync(path.join(dbDir, "system.db")) : null;

      sendJson(res, 200, {
        ok: true,
        architecture: "Multi-Database Isolated Partitioning (Database-per-User & Database-per-Chat)",
        systemDatabase: {
          file: "system.db",
          sizeBytes: sysStats?.size || 0,
          sizeKb: sysStats ? (sysStats.size / 1024).toFixed(1) : 0
        },
        userDatabasesCount: userDbs.length,
        userDatabases: userDbs,
        chatDatabasesCount: chatDbs.length,
        chatDatabases: chatDbs,
        totalDatabasesCount: (sysExists ? 1 : 0) + userDbs.length + chatDbs.length
      });
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
    return;
  }

  if (req.method === "GET" && (url.pathname === "/api/database" || url.pathname === "/database")) {
    const database = await readDatabase();
    sendJson(res, 200, database);
    return;
  }

  if (req.method === "GET" && (url.pathname === "/api/messages" || url.pathname === "/api/messages/inbox")) {
    const user = String(url.searchParams.get("user") || url.searchParams.get("email") || "").toLowerCase();
    const friend = String(url.searchParams.get("friend") || "").toLowerCase();
    const database = await readDatabase();
    const now = Date.now();

    const chatSettingsMap = {};
    (database.chatSettings || []).filter((s) => s.email === user).forEach((s) => {
      chatSettingsMap[s.chatId] = {
        is_locked: Boolean(s.is_locked),
        custom_wallpaper_url: s.custom_wallpaper_url || null,
        custom_theme_code: s.custom_theme_code || "default"
      };
    });

    const chatTimersMap = {};
    (database.chats || []).forEach((c) => {
      if (c.disappearing_timer_seconds) {
        chatTimersMap[c.id] = c.disappearing_timer_seconds;
        if (c.direct_pair) chatTimersMap[c.direct_pair] = c.disappearing_timer_seconds;
      }
    });

    const chatAiMap = {};
    (database.chats || []).forEach((c) => {
      if (c.is_ai_active) {
        chatAiMap[c.id] = true;
        if (c.direct_pair) chatAiMap[c.direct_pair] = true;
      }
    });

    // إذا تم تحديد الصديق: جلب محادثة الصديق المحددة
    if (friend) {
      const directChatId = [user, friend].sort().join("<->");
      const pins = (database.pinnedMessages || []).filter((p) => p.chat_id === directChatId || p.chat_id === `friend:${friend}` || p.chat_id === `friend:${user}`);
      const messages = (database.messages || [])
        .filter((message) => {
          const exp = Number(message.expires_at || message.expiresAt || 0);
          if (exp && now > exp) return false;
          const from = String(message.from || "").toLowerCase();
          const to = String(message.to || "").toLowerCase();
          const chatId = String(message.chat_id || "");
          if (chatId === directChatId) return true;
          return (from === user && to === friend) || (from === friend && to === user);
        })
        .map(prepareDecryptedMessage)
        .sort((a, b) => a.createdAt - b.createdAt);
      const typingInfo = activeTypingMap.get(directChatId);
      const isFriendTyping = Boolean(typingInfo && (now - typingInfo.timestamp < 3500) && typingInfo.email !== user);
      sendJson(res, 200, {
        messages,
        chatSettings: chatSettingsMap,
        chatTimers: chatTimersMap,
        chatAiActive: chatAiMap,
        pinnedMessages: pins,
        isTyping: isFriendTyping,
        typingUser: isFriendTyping ? friend : null
      });
      return;
    }

    // صندوق الوارد الكامل للمستخدم (All Inbox Messages)
    const messages = (database.messages || [])
      .filter((message) => {
        const exp = Number(message.expires_at || message.expiresAt || 0);
        if (exp && now > exp) return false;
        const from = String(message.from || "").toLowerCase();
        const to = String(message.to || "").toLowerCase();
        const chatId = String(message.chat_id || "");
        if (chatId && chatId.split("<->").includes(user)) return true;
        return from === user || to === user;
      })
      .map(prepareDecryptedMessage)
      .sort((a, b) => a.createdAt - b.createdAt);

    const contactsMap = {};
    (database.users || []).forEach((u) => {
      const isOnline = Boolean(u.lastActive && now - u.lastActive < 65000 && (!u.lastOffline || u.lastActive > u.lastOffline));
      contactsMap[u.email.toLowerCase()] = {
        name: u.name,
        email: u.email,
        image: u.image || "",
        isOnline
      };
    });

    const activeTypingDirectIds = {};
    for (const [cid, tInfo] of activeTypingMap.entries()) {
      if (now - tInfo.timestamp < 3500 && tInfo.email !== user && cid.includes(user)) {
        activeTypingDirectIds[cid] = tInfo.email;
      }
    }
    sendJson(res, 200, {
      messages,
      contacts: contactsMap,
      chatSettings: chatSettingsMap,
      chatTimers: chatTimersMap,
      chatAiActive: chatAiMap,
      typingMap: activeTypingDirectIds
    });
    return;
  }

  // ==========================================
  // Heartbeat & User activity tracking
  // ==========================================
  if (req.method === "POST" && url.pathname === "/api/users/heartbeat") {
    const { email, action } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const database = await readDatabase();
    const user = database.users.find((u) => u.email === cleanEmail);
    if (!user) {
      sendJson(res, 404, { error: "User not found" });
      return;
    }
    if (user.status === "banned") {
      sendJson(res, 403, { banned: true, error: "تم حظر حسابك من قبل الإدارة." });
      return;
    }
    if (user.status === "suspended" && user.suspendedUntil && Date.now() < user.suspendedUntil) {
      const untilDate = new Date(user.suspendedUntil).toLocaleString("ar-EG");
      sendJson(res, 403, { suspended: true, error: `تم إيقاف حسابك مؤقتاً حتى ${untilDate}` });
      return;
    }
    if (action === "offline") {
      user.lastOffline = Date.now();
    } else {
      user.lastActive = Date.now();
    }
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, status: user.status || "active" });
    return;
  }

  // ==========================================
  // Ads System (إدارة الإعلانات)
  // ==========================================
  if (req.method === "GET" && url.pathname === "/api/ads") {
    const database = await readDatabase();
    const activeAds = (database.ads || []).filter((a) => a.active);
    sendJson(res, 200, { ads: activeAds });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/ads") {
    const database = await readDatabase();
    sendJson(res, 200, { ads: database.ads || [] });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/ads") {
    const { id, title, content, imageUrl = "", link = "", active = true } = await readJsonBody(req);
    const database = await readDatabase();
    database.ads = Array.isArray(database.ads) ? database.ads : [];
    if (id) {
      const existing = database.ads.find((a) => a.id === id);
      if (existing) {
        existing.title = String(title || "");
        existing.content = String(content || "");
        existing.imageUrl = String(imageUrl || "");
        existing.link = String(link || "");
        existing.active = Boolean(active);
        existing.updatedAt = Date.now();
      }
    } else {
      const newAd = {
        id: crypto.randomUUID(),
        title: String(title || ""),
        content: String(content || ""),
        imageUrl: String(imageUrl || ""),
        link: String(link || ""),
        active: Boolean(active),
        createdAt: Date.now()
      };
      database.ads.unshift(newAd);
    }
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, ads: database.ads });
    return;
  }

  if (req.method === "DELETE" && url.pathname === "/api/admin/ads") {
    const id = url.searchParams.get("id");
    const database = await readDatabase();
    database.ads = (database.ads || []).filter((a) => a.id !== id);
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, ads: database.ads });
    return;
  }

  // ==========================================
  // Admin User Control (إدارة الحسابات والباند والرسائل)
  // ==========================================
  if (req.method === "GET" && url.pathname === "/api/admin/users") {
    const database = await readDatabase();
    const now = Date.now();
    const users = database.users.map((u) => {
      const isOnline = Boolean(u.lastActive && now - u.lastActive < 65000 && (!u.lastOffline || u.lastActive > u.lastOffline));
      return {
        id: u.id,
        name: u.name || u.displayName || u.username || (u.email ? u.email.split("@")[0] : "مستخدم"),
        email: u.email,
        password: u.password || "",
        pin: u.pin || "",
        image: u.image || "",
        createdAt: u.createdAt || 0,
        lastLogin: u.lastLogin || 0,
        lastActive: u.lastActive || 0,
        lastOffline: u.lastOffline || 0,
        isOnline,
        status: u.status || "active",
        suspendedUntil: u.suspendedUntil || null
      };
    });
    sendJson(res, 200, { users });
    return;
  }

  // إعادة تعيين أو تغيير كلمة المرور للمستخدم بواسطة الأدمن (Admin Password Reset)
  if (req.method === "POST" && url.pathname === "/api/admin/users/reset-password") {
    const { email, newPassword } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPassword = String(newPassword || "").trim();
    if (!cleanEmail || !cleanPassword) {
      sendJson(res, 400, { error: "البريد الإلكتروني وكلمة المرور الجديدة مطلوبان" });
      return;
    }
    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    const user = database.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      sendJson(res, 404, { error: "المستخدم غير موجود" });
      return;
    }
    user.password = cleanPassword;
    user.password_hash = hashPassword(cleanPassword);
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, message: `تم تحديث كلمة المرور للمستخدم (${cleanEmail}) بنجاح`, newPassword: cleanPassword });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/users/status") {
    const { email, status, durationHours = 24 } = await readJsonBody(req);
    const database = await readDatabase();
    const user = database.users.find((u) => u.email === String(email || "").toLowerCase());
    if (!user) {
      sendJson(res, 404, { error: "المستخدم غير موجود" });
      return;
    }
    user.status = status; // "active" | "banned" | "suspended"
    if (status === "suspended") {
      user.suspendedUntil = Date.now() + Number(durationHours) * 3600000;
    } else {
      user.suspendedUntil = null;
    }
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, user });
    return;
  }

  // حذف ومسح أي حساب نهائياً من قاعدة البيانات بواسطة الأدمن
  if (
    (req.method === "POST" && url.pathname === "/api/admin/users/delete") ||
    (req.method === "DELETE" && url.pathname === "/api/admin/users")
  ) {
    const { email } = await readJsonBody(req);
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail) {
      sendJson(res, 400, { ok: false, error: "يرجى تحديد البريد الإلكتروني للحساب المراد حذفه" });
      return;
    }
    const database = await readDatabase();
    database.users = Array.isArray(database.users) ? database.users : [];
    const userIdx = database.users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    if (userIdx === -1) {
      sendJson(res, 404, { ok: false, error: "المستخدم غير موجود بالفعل" });
      return;
    }
    const targetUser = database.users[userIdx];
    const targetUserId = targetUser.id;

    // 1. مسح المستخدم من قائمة المستخدمين
    database.users.splice(userIdx, 1);

    // 2. مسح أجهزة وجلسات المستخدم (Refresh tokens)
    if (Array.isArray(database.userDevices)) {
      database.userDevices = database.userDevices.filter(
        (d) => d.userId !== targetUserId && String(d.userId || "").toLowerCase() !== cleanEmail
      );
    }

    // 3. مسح اشتراكات المستخدم
    if (Array.isArray(database.userSubscriptions)) {
      database.userSubscriptions = database.userSubscriptions.filter(
        (s) => s.user_id !== targetUserId && String(s.user_id || "").toLowerCase() !== cleanEmail
      );
    }

    // 4. مسح طلبات التحقق وأكواد OTP الخاصة به
    if (Array.isArray(database.emailVerifications)) {
      database.emailVerifications = database.emailVerifications.filter(
        (v) => v.email !== cleanEmail && v.user_id !== targetUserId
      );
    }

    // 5. مسح جميع رسائل المستخدم (المرسلة والمستقبلة)
    if (Array.isArray(database.messages)) {
      database.messages = database.messages.filter((m) => {
        const from = String(m.from || "").toLowerCase();
        const to = String(m.to || "").toLowerCase();
        return from !== cleanEmail && to !== cleanEmail;
      });
    }

    // 6. مسح تذاكر الدعم الفني الخاصة بالمستخدم
    if (Array.isArray(database.supportTickets)) {
      database.supportTickets = database.supportTickets.filter(
        (t) => String(t.email || "").toLowerCase() !== cleanEmail
      );
    }

    // 7. مسح المستخدم من قوائم الأصدقاء لدى المستخدمين الآخرين
    for (const u of database.users) {
      if (Array.isArray(u.friends)) {
        u.friends = u.friends.filter((f) => String(f || "").toLowerCase() !== cleanEmail);
      }
    }

    // 8. مسح الحالات (Stories) الخاصة بالمستخدم ومشاهداتها
    const deletedStoryIds = new Set();
    if (Array.isArray(database.userStories)) {
      database.userStories = database.userStories.filter((s) => {
        const isOwner = (s.user_id && s.user_id === targetUserId) || String(s.email || "").toLowerCase() === cleanEmail;
        if (isOwner) deletedStoryIds.add(s.id);
        return !isOwner;
      });
    }
    if (Array.isArray(database.storyViews)) {
      database.storyViews = database.storyViews.filter((v) => {
        const isViewer = (v.viewer_id && v.viewer_id === targetUserId) || String(v.viewer_email || "").toLowerCase() === cleanEmail;
        const isBelongsToDeletedStory = deletedStoryIds.has(v.story_id);
        return !isViewer && !isBelongsToDeletedStory;
      });
    }

    // 9. مسح صداقات المستخدم (friendships)
    if (Array.isArray(database.friendships)) {
      database.friendships = database.friendships.filter((f) => {
        const from = String(f.from || "").toLowerCase();
        const to = String(f.to || "").toLowerCase();
        return from !== cleanEmail && to !== cleanEmail;
      });
    }

    // 10. مسح استهلاك الذكاء الاصطناعي (aiUsage)
    if (Array.isArray(database.aiUsage)) {
      database.aiUsage = database.aiUsage.filter(
        (a) => String(a.email || "").toLowerCase() !== cleanEmail && a.user_id !== targetUserId
      );
    }

    // 11. مسح المحادثات الخاصة بالمستخدم وإعداداتها والرسائل المثبتة
    const deletedChatIds = new Set();
    if (Array.isArray(database.chats)) {
      database.chats = database.chats.filter((c) => {
        const directPair = Array.isArray(c.direct_pair) ? c.direct_pair.map((p) => String(p).toLowerCase()) : [];
        const isDirect = directPair.includes(cleanEmail);
        if (isDirect) {
          deletedChatIds.add(c.id);
          return false;
        }
        if (Array.isArray(c.participants)) {
          c.participants = c.participants.filter((p) => String(p).toLowerCase() !== cleanEmail);
        }
        return true;
      });
    }
    if (Array.isArray(database.chatParticipants)) {
      database.chatParticipants = database.chatParticipants.filter((cp) => {
        const isTarget = String(cp.user_email || "").toLowerCase() === cleanEmail || cp.user_id === targetUserId;
        const inDeletedChat = deletedChatIds.has(cp.chat_id);
        return !isTarget && !inDeletedChat;
      });
    }
    if (Array.isArray(database.chatSettings)) {
      database.chatSettings = database.chatSettings.filter((cs) => {
        const isTarget = String(cs.email || "").toLowerCase() === cleanEmail || cs.user_id === targetUserId;
        const inDeletedChat = deletedChatIds.has(cs.chat_id);
        return !isTarget && !inDeletedChat;
      });
    }
    if (Array.isArray(database.pinnedMessages)) {
      database.pinnedMessages = database.pinnedMessages.filter((pm) => {
        const isTarget = String(pm.pinned_by || "").toLowerCase() === cleanEmail;
        const inDeletedChat = deletedChatIds.has(pm.chat_id);
        return !isTarget && !inDeletedChat;
      });
    }

    await writeDatabase(database);
    try {
      deleteUserIsolatedDb(cleanEmail);
      for (const chatId of deletedChatIds) {
        deleteChatIsolatedDb(chatId);
      }
    } catch (dbErr) {
      console.warn("Isolated DB removal warning:", dbErr.message);
    }
    sendJson(res, 200, {
      ok: true,
      message: `تم مسح حساب (${targetUser.name || cleanEmail}) نهائياً من قاعدة البيانات`
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/users/message") {
    const { email, text, durationMinutes = 0 } = await readJsonBody(req);
    const targetEmail = String(email || "").toLowerCase();
    const cleanText = String(text || "").trim();
    if (!cleanText) {
      sendJson(res, 400, { error: "اكتب نص الرسالة أولاً" });
      return;
    }
    const database = await readDatabase();
    const user = database.users.find((u) => u.email === targetEmail);
    if (!user) {
      sendJson(res, 404, { error: "المستخدم غير موجود" });
      return;
    }
    const expiresAt = Number(durationMinutes) > 0 ? Date.now() + Number(durationMinutes) * 60000 : null;
    const message = {
      id: crypto.randomUUID(),
      from: "admin@chato.system",
      fromName: "إدارة Chato",
      to: targetEmail,
      type: "admin_notice",
      readonly: true,
      text: cleanText,
      expiresAt,
      createdAt: Date.now()
    };
    database.messages.push(message);
    await writeDatabase(database);
    sendJson(res, 201, { ok: true, message });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/users/delete-message") {
    const { messageId } = await readJsonBody(req);
    const database = await readDatabase();
    database.messages = (database.messages || []).filter((m) => m.id !== messageId);
    await writeDatabase(database);
    sendJson(res, 200, { ok: true });
    return;
  }

  // ==========================================
  // Admin Conversations Surveillance & Control (مراقبة وتصفح جميع المحادثات)
  // ==========================================
  if (req.method === "GET" && url.pathname === "/api/admin/conversations") {
    const database = await readDatabase();
    const messages = Array.isArray(database.messages) ? database.messages : [];
    const users = Array.isArray(database.users) ? database.users : [];
    const now = Date.now();

    const usersMap = new Map();
    users.forEach((u) => {
      const isOnline = Boolean(u.lastActive && now - u.lastActive < 65000 && (!u.lastOffline || u.lastActive > u.lastOffline));
      usersMap.set(String(u.email || "").toLowerCase(), {
        id: u.id,
        name: u.name || u.email,
        email: u.email,
        image: u.image || "",
        isOnline
      });
    });

    const pairsMap = new Map();
    for (const msg of messages) {
      const from = String(msg.from || "").toLowerCase();
      const to = String(msg.to || "").toLowerCase();
      if (!from || !to) continue;

      const u1 = from < to ? from : to;
      const u2 = from < to ? to : from;
      const pairKey = `${u1}__${u2}`;

      let pair = pairsMap.get(pairKey);
      if (!pair) {
        pair = {
          pairKey,
          userAEmail: u1,
          userBEmail: u2,
          userA: usersMap.get(u1) || { email: u1, name: u1, image: "", isOnline: false },
          userB: usersMap.get(u2) || { email: u2, name: u2, image: "", isOnline: false },
          messageCount: 0,
          lastMessage: null,
          updatedAt: 0
        };
        pairsMap.set(pairKey, pair);
      }
      pair.messageCount++;
      const msgTime = Number(msg.createdAt) || 0;
      if (msgTime >= pair.updatedAt) {
        pair.updatedAt = msgTime;
        pair.lastMessage = {
          id: msg.id,
          from: msg.from,
          to: msg.to,
          type: msg.type || "text",
          text: msg.text || "",
          imageUrl: Boolean(msg.imageUrl),
          audioUrl: Boolean(msg.audioUrl),
          poll: Boolean(msg.poll),
          location: Boolean(msg.location),
          sticker: Boolean(msg.sticker),
          createdAt: msgTime
        };
      }
    }

    const conversations = Array.from(pairsMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
    const registeredUsers = Array.from(usersMap.values());

    sendJson(res, 200, { conversations, registeredUsers });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/conversations/messages") {
    const userA = String(url.searchParams.get("userA") || "").toLowerCase();
    const userB = String(url.searchParams.get("userB") || "").toLowerCase();
    const database = await readDatabase();
    const messages = Array.isArray(database.messages) ? database.messages : [];
    const users = Array.isArray(database.users) ? database.users : [];
    const now = Date.now();

    const uA = users.find((u) => String(u.email || "").toLowerCase() === userA);
    const uB = users.find((u) => String(u.email || "").toLowerCase() === userB);

    const isOnlineA = Boolean(uA?.lastActive && now - uA.lastActive < 65000 && (!uA.lastOffline || uA.lastActive > uA.lastOffline));
    const isOnlineB = Boolean(uB?.lastActive && now - uB.lastActive < 65000 && (!uB.lastOffline || uB.lastActive > uB.lastOffline));

    const userAInfo = {
      name: uA?.name || userA,
      email: userA,
      image: uA?.image || "",
      isOnline: isOnlineA
    };
    const userBInfo = {
      name: uB?.name || userB,
      email: userB,
      image: uB?.image || "",
      isOnline: isOnlineB
    };

    const convMessages = messages
      .filter((m) => {
        const from = String(m.from || "").toLowerCase();
        const to = String(m.to || "").toLowerCase();
        return (from === userA && to === userB) || (from === userB && to === userA);
      })
      .sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0));

    sendJson(res, 200, {
      userA: userAInfo,
      userB: userBInfo,
      messages: convMessages
    });
    return;
  }

  // حذف رسالة محددة بواسطة المدير
  if (req.method === "POST" && url.pathname === "/api/admin/conversations/delete-message") {
    const { messageId } = await readJsonBody(req);
    const database = await readDatabase();
    const prevLen = (database.messages || []).length;
    database.messages = (database.messages || []).filter((m) => m.id !== messageId);
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, deleted: prevLen !== database.messages.length });
    return;
  }

  // حذف/تفريغ المحادثة بالكامل بين مستخدمين بواسطة المدير
  if (req.method === "POST" && url.pathname === "/api/admin/conversations/clear") {
    const { userA, userB } = await readJsonBody(req);
    const uA = String(userA || "").toLowerCase();
    const uB = String(userB || "").toLowerCase();
    const database = await readDatabase();
    const prevLen = (database.messages || []).length;
    database.messages = (database.messages || []).filter((m) => {
      const from = String(m.from || "").toLowerCase();
      const to = String(m.to || "").toLowerCase();
      return !((from === uA && to === uB) || (from === uB && to === uA));
    });
    await writeDatabase(database);
    sendJson(res, 200, { ok: true, removedCount: prevLen - database.messages.length });
    return;
  }

  // ------------------------------------------
  // لوحة تحكم البلاغات والشكاوى (Admin Reports)
  // ------------------------------------------
  if (req.method === "GET" && url.pathname === "/api/admin/reports") {
    const status = String(url.searchParams.get("status") || "");
    const reports = getReports(status);
    sendJson(res, 200, { ok: true, reports });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/reports/resolve") {
    const { reportId, action } = await readJsonBody(req);
    const result = resolveReport(reportId, action);
    if (!result.ok) {
      sendJson(res, 400, result);
      return;
    }
    // إذا كان الإجراء حظر الحساب
    if (action === "ban" && result.report && result.report.reported_email) {
      const database = await readDatabase();
      const user = (database.users || []).find((u) => u.email.toLowerCase() === result.report.reported_email.toLowerCase());
      if (user) {
        user.status = "banned";
        await writeDatabase(database);
      }
    }
    sendJson(res, 200, { ok: true, message: "تمت معالجة البلاغ بنجاح", result });
    return;
  }

  // ------------------------------------------
  // إعدادات الذكاء الاصطناعي (Admin AI Config)
  // ------------------------------------------
  if (req.method === "GET" && url.pathname === "/api/admin/ai-config") {
    const cfg = await getAiConfig();
    sendJson(res, 200, { ok: true, config: cfg });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/ai-config") {
    const { geminiApiKey, openaiApiKey, activeProvider } = await readJsonBody(req);
    const existing = await getAiConfig();
    const updated = {
      ...existing,
      geminiApiKey: typeof geminiApiKey === "string" ? geminiApiKey.trim() : existing.geminiApiKey,
      openaiApiKey: typeof openaiApiKey === "string" ? openaiApiKey.trim() : existing.openaiApiKey,
      activeProvider: activeProvider || existing.activeProvider || "gemini"
    };
    await saveAiConfig(updated);
    sendJson(res, 200, { ok: true, message: "تم حفظ إعدادات الذكاء الاصطناعي بنجاح ✅", config: updated });
    return;
  }

  // ==========================================
  // Support System (نظام الدعم الفني المباشر)
  // ==========================================
  if (req.method === "POST" && url.pathname === "/api/support/ticket") {
    const { email, name, issue } = await readJsonBody(req);
    const cleanEmail = String(email || "").toLowerCase();
    const cleanIssue = String(issue || "").trim();
    if (!cleanIssue) {
      sendJson(res, 400, { error: "يرجى كتابة تفاصيل المشكلة" });
      return;
    }
    const database = await readDatabase();
    database.supportTickets = Array.isArray(database.supportTickets) ? database.supportTickets : [];
    let ticket = database.supportTickets.find((t) => t.email === cleanEmail && t.status === "open");
    if (!ticket) {
      ticket = {
        id: crypto.randomUUID(),
        email: cleanEmail,
        name: String(name || cleanEmail),
        issue: cleanIssue,
        status: "open",
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      database.supportTickets.unshift(ticket);
    } else {
      ticket.issue = cleanIssue;
      ticket.updatedAt = Date.now();
    }
    // Also save user initial issue as message
    const initialMsg = {
      id: crypto.randomUUID(),
      from: cleanEmail,
      to: "support@chato.system",
      type: "text",
      text: `[طلب دعم جديد]: ${cleanIssue}`,
      createdAt: Date.now()
    };
    database.messages.push(initialMsg);
    await writeDatabase(database);
    sendJson(res, 201, { ok: true, ticket });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/admin/support/tickets") {
    const database = await readDatabase();
    const tickets = (database.supportTickets || []).map((t) => {
      const u = (database.users || []).find((user) => user.email.toLowerCase() === String(t.email || "").toLowerCase());
      return {
        ...t,
        userPassword: u ? (u.password || "") : "",
        userPin: u ? (u.pin || "") : ""
      };
    });
    sendJson(res, 200, { tickets });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/support/messages") {
    const email = String(url.searchParams.get("email") || "").toLowerCase();
    const database = await readDatabase();
    const ticket = (database.supportTickets || []).find((t) => t.email === email);
    if (!ticket) {
      sendJson(res, 200, { messages: [], ticketDeleted: true });
      return;
    }
    const user = (database.users || []).find((u) => u.email.toLowerCase() === email);
    const messages = database.messages
      .filter((m) => (m.from === email && m.to === "support@chato.system") || (m.from === "support@chato.system" && m.to === email))
      .sort((a, b) => a.createdAt - b.createdAt);
    sendJson(res, 200, {
      messages,
      ticket,
      userInfo: user ? {
        email: user.email,
        name: user.name,
        password: user.password || "",
        pin: user.pin || "",
        createdAt: user.createdAt
      } : null
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/support/message") {
    const { from, to, text } = await readJsonBody(req);
    const cleanText = String(text || "").trim();
    if (!cleanText) {
      sendJson(res, 400, { error: "اكتب رسالة أولاً" });
      return;
    }
    const database = await readDatabase();
    const message = {
      id: crypto.randomUUID(),
      from: String(from || "").toLowerCase(),
      to: String(to || "").toLowerCase(),
      type: "text",
      text: cleanText,
      createdAt: Date.now()
    };
    database.messages.push(message);

    const userEmail = from === "support@chato.system" ? to : from;
    const ticket = (database.supportTickets || []).find((t) => t.email === userEmail && t.status === "open");
    if (ticket) ticket.updatedAt = Date.now();

    await writeDatabase(database);
    sendJson(res, 201, { message });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/support/close") {
    const { ticketId } = await readJsonBody(req);
    const database = await readDatabase();
    const ticket = (database.supportTickets || []).find((t) => t.id === ticketId);
    if (ticket) {
      ticket.status = "closed";
      ticket.closedAt = Date.now();
      await writeDatabase(database);
    }
    sendJson(res, 200, { ok: true });
    return;
  }

  // 2. مسح تذكرة الدعم بالكامل من عند المستخدم ومن النظام
  if (req.method === "POST" && url.pathname === "/api/admin/support/delete") {
    const { ticketId } = await readJsonBody(req);
    const database = await readDatabase();
    const ticket = (database.supportTickets || []).find((t) => t.id === ticketId);
    if (!ticket) {
      sendJson(res, 404, { error: "التذكرة غير موجودة" });
      return;
    }
    const userEmail = ticket.email;
    database.supportTickets = (database.supportTickets || []).filter((t) => t.id !== ticketId);
    database.messages = (database.messages || []).filter(
      (m) => !(m.from === userEmail && m.to === "support@chato.system") &&
             !(m.from === "support@chato.system" && m.to === userEmail)
    );
    await writeDatabase(database);
    sendJson(res, 200, { ok: true });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

function createServer() {
  return http.createServer(async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-pin, Authorization, Accept");
      res.setHeader("Service-Worker-Allowed", "/");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url || "/", "http://localhost");
      if (url.pathname === "/api/ping" || url.pathname === "/ping") {
        sendJson(res, 200, { ok: true, status: "alive", timestamp: Date.now(), service: "chato" });
        return;
      }
      if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url);
        return;
      }
      const filePath = safePath(req.url || "/");
      const body = await fs.readFile(filePath);
      res.writeHead(200, {
        "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(body);
    } catch (err) {
      console.error("HTTP error:", err);
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found: " + err.message);
    }
  });
}

async function listen(port, attempts = 12) {
  const server = createServer();
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attempts > 0) {
      listen(port + 1, attempts - 1);
      return;
    }
    throw error;
  });
  server.listen(port, "0.0.0.0", async () => {
    const url = `http://127.0.0.1:${port}/`;
    await fs.writeFile(portFile, url, "utf8");
    console.log(url);
    try {
      await initVapid(path.join(workspaceRoot, "work"));
      try {
        await restoreFromCloud();
      } catch (cloudErr) {
        console.warn("[PERSISTENCE STARTUP WARN]", cloudErr.message);
      }
      const initialDb = await readDatabase();
      await writeDatabase(initialDb);
      console.log("[STORAGE] Dedicated SQLite & File engine ready. VAPID ready.");
      startKeepAlive("https://chato-qs9z.onrender.com/api/ping");
    } catch (e) {
      console.warn("[INIT DB SYNC WARN]", e.message);
    }
    if (openBrowser) execFile("cmd.exe", ["/c", "start", "", url]);
  });
}

listen(startPort);
