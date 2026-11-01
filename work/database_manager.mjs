import { DatabaseSync } from "node:sqlite";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const databasesDir = path.resolve(__dirname, "databases");
const usersDir = path.join(databasesDir, "users");
const chatsDir = path.join(databasesDir, "chats");
const systemDbPath = path.join(databasesDir, "system.db");

// التأكد من وجود مجلدات قواعد البيانات المعزولة
fsSync.mkdirSync(usersDir, { recursive: true });
fsSync.mkdirSync(chatsDir, { recursive: true });

// كاش لتسريع الوصول لقواعد البيانات المفتوحة
const userDbCache = new Map();
const chatDbCache = new Map();
let systemDbInstance = null;

// توليد اسم ملف آمن وفريد لكل مستخدم ومحادثة
export function hashKey(str) {
  const clean = String(str || "").trim().toLowerCase();
  const safePrefix = clean.replace(/[^a-z0-9]/g, "_").slice(0, 16);
  const hash = crypto.createHash("sha256").update(clean).digest("hex").slice(0, 10);
  return `${safePrefix || "record"}_${hash}`;
}

// 1. قاعدة البيانات الرئيسية للنظام (System Database)
export function getSystemDb() {
  if (!systemDbInstance) {
    systemDbInstance = new DatabaseSync(systemDbPath);
    systemDbInstance.exec("PRAGMA journal_mode = WAL;");
    systemDbInstance.exec("PRAGMA synchronous = NORMAL;");
    systemDbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users_registry (
        email TEXT PRIMARY KEY,
        id TEXT,
        name TEXT,
        password TEXT,
        pin TEXT,
        avatar TEXT,
        is_banned INTEGER DEFAULT 0,
        chat_plus_until INTEGER DEFAULT 0,
        created_at INTEGER,
        db_file TEXT
      );
      CREATE TABLE IF NOT EXISTS chats_registry (
        id TEXT PRIMARY KEY,
        type TEXT,
        direct_pair TEXT,
        title TEXT,
        is_ai_active INTEGER DEFAULT 0,
        disappearing_timer_seconds INTEGER,
        created_at INTEGER,
        db_file TEXT
      );
      CREATE TABLE IF NOT EXISTS support_tickets (
        id TEXT PRIMARY KEY,
        user_email TEXT,
        name TEXT,
        subject TEXT,
        status TEXT,
        created_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS ads (
        id TEXT PRIMARY KEY,
        title TEXT,
        content TEXT,
        image_url TEXT,
        link_url TEXT,
        created_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS admin_notices (
        id TEXT PRIMARY KEY,
        title TEXT,
        message TEXT,
        created_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS exclusive_emojis (
        id TEXT PRIMARY KEY,
        code TEXT,
        title TEXT,
        symbol TEXT,
        rarity TEXT,
        is_plus_only INTEGER DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
      CREATE TABLE IF NOT EXISTS friend_requests (
        id TEXT PRIMARY KEY,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests (receiver_id, status);

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
      CREATE INDEX IF NOT EXISTS idx_push_sub_user ON push_subscriptions (user_email);

      CREATE TABLE IF NOT EXISTS user_blocks (
        id TEXT PRIMARY KEY,
        blocker_email TEXT NOT NULL,
        blocked_email TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(blocker_email, blocked_email)
      );
      CREATE INDEX IF NOT EXISTS idx_user_blocks_pair ON user_blocks (blocker_email, blocked_email);

      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        reporter_email TEXT NOT NULL,
        reported_email TEXT NOT NULL,
        chat_id TEXT,
        reason TEXT NOT NULL,
        details TEXT,
        status TEXT DEFAULT 'pending',
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);

      CREATE INDEX IF NOT EXISTS idx_users_email ON users_registry(email);
      CREATE INDEX IF NOT EXISTS idx_chats_pair ON chats_registry(direct_pair);
    `);

    try { systemDbInstance.exec("ALTER TABLE chats_registry ADD COLUMN who_can_send TEXT DEFAULT 'everyone';"); } catch {}
    try { systemDbInstance.exec("ALTER TABLE chats_registry ADD COLUMN last_message_at INTEGER;"); } catch {}
  }
  return systemDbInstance;
}

// 2. قاعدة بيانات خاصة ومنفصلة لكل شخص (Dedicated User Database)
export function getUserDb(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail) return null;

  if (userDbCache.has(cleanEmail)) {
    return userDbCache.get(cleanEmail);
  }

  const fileName = `user_${hashKey(cleanEmail)}.db`;
  const filePath = path.join(usersDir, fileName);
  const db = new DatabaseSync(filePath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA synchronous = NORMAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      email TEXT PRIMARY KEY,
      id TEXT,
      name TEXT,
      avatar TEXT,
      bio TEXT,
      phone TEXT,
      theme TEXT,
      lang TEXT,
      created_at INTEGER,
      updated_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS friends (
      email TEXT PRIMARY KEY,
      name TEXT,
      status TEXT,
      avatar TEXT,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      plan_code TEXT,
      plan_title TEXT,
      is_active INTEGER DEFAULT 0,
      started_at INTEGER,
      expires_at INTEGER,
      auto_renew INTEGER DEFAULT 0,
      daily_words_limit INTEGER DEFAULT 90,
      daily_words_used INTEGER DEFAULT 0,
      daily_ai_images_limit INTEGER DEFAULT 3,
      daily_ai_images_used INTEGER DEFAULT 0,
      last_reset_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS locked_chats (
      chat_id TEXT PRIMARY KEY,
      pin_hash TEXT,
      locked_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS user_stories (
      id TEXT PRIMARY KEY,
      media_url TEXT,
      text TEXT,
      expires_at INTEGER,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      title TEXT,
      body TEXT,
      read INTEGER DEFAULT 0,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS passkeys (
      id TEXT PRIMARY KEY,
      public_key TEXT,
      counter INTEGER DEFAULT 0,
      device_name TEXT,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS pinned_chats (
      chat_id TEXT PRIMARY KEY,
      pinned_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS blocked_users (
      target_email TEXT PRIMARY KEY,
      blocked_at INTEGER NOT NULL
    );
  `);

  userDbCache.set(cleanEmail, db);
  return db;
}

// مسح وحذف قاعدة بيانات المستخدم المستقلة وسجله بالنظام
export function deleteUserIsolatedDb(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail) return;

  if (userDbCache.has(cleanEmail)) {
    try {
      userDbCache.get(cleanEmail).close();
    } catch (e) {
      console.warn("Notice closing userDb:", cleanEmail, e.message);
    }
    userDbCache.delete(cleanEmail);
  }

  const fileName = `user_${hashKey(cleanEmail)}.db`;
  const filePath = path.join(usersDir, fileName);
  try {
    if (fsSync.existsSync(filePath)) fsSync.unlinkSync(filePath);
    if (fsSync.existsSync(filePath + "-wal")) fsSync.unlinkSync(filePath + "-wal");
    if (fsSync.existsSync(filePath + "-shm")) fsSync.unlinkSync(filePath + "-shm");
  } catch (err) {
    console.warn("Notice unlinking user db file:", err.message);
  }

  try {
    const sysDb = getSystemDb();
    if (sysDb) {
      sysDb.prepare("DELETE FROM users_registry WHERE email = ?").run(cleanEmail);
    }
  } catch (err) {
    console.warn("Notice cleaning users_registry in system.db:", err.message);
  }
}

// مسح وحذف قاعدة بيانات محادثة مستقلة
export function deleteChatIsolatedDb(chatId) {
  const cleanId = String(chatId || "").trim();
  if (!cleanId) return;

  if (chatDbCache.has(cleanId)) {
    try {
      chatDbCache.get(cleanId).close();
    } catch (e) {
      console.warn("Notice closing chatDb:", cleanId, e.message);
    }
    chatDbCache.delete(cleanId);
  }

  const fileName = `chat_${hashKey(cleanId)}.db`;
  const filePath = path.join(chatsDir, fileName);
  try {
    if (fsSync.existsSync(filePath)) fsSync.unlinkSync(filePath);
    if (fsSync.existsSync(filePath + "-wal")) fsSync.unlinkSync(filePath + "-wal");
    if (fsSync.existsSync(filePath + "-shm")) fsSync.unlinkSync(filePath + "-shm");
  } catch (err) {
    console.warn("Notice unlinking chat db file:", err.message);
  }

  try {
    const sysDb = getSystemDb();
    if (sysDb) {
      sysDb.prepare("DELETE FROM chats_registry WHERE id = ?").run(cleanId);
    }
  } catch (err) {
    console.warn("Notice cleaning chats_registry in system.db:", err.message);
  }
}

// 3. قاعدة بيانات خاصة ومنفصلة لكل محادثة (Dedicated Chat Database)
export function getChatDb(chatId) {
  const cleanId = String(chatId || "").trim();
  if (!cleanId) return null;

  if (chatDbCache.has(cleanId)) {
    return chatDbCache.get(cleanId);
  }

  const fileName = `chat_${hashKey(cleanId)}.db`;
  const filePath = path.join(chatsDir, fileName);
  const db = new DatabaseSync(filePath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA synchronous = NORMAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      chat_id TEXT PRIMARY KEY,
      direct_pair TEXT,
      is_ai_active INTEGER DEFAULT 0,
      disappearing_timer_seconds INTEGER,
      wallpaper TEXT,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT,
      from_email TEXT,
      to_email TEXT,
      type TEXT,
      text TEXT,
      is_encrypted INTEGER DEFAULT 0,
      encryption_iv TEXT,
      encryption_auth_tag TEXT,
      sender_public_key TEXT,
      image_url TEXT,
      audio_url TEXT,
      file_name TEXT,
      location_json TEXT,
      poll_json TEXT,
      sticker_json TEXT,
      document_json TEXT,
      reply_to_json TEXT,
      status TEXT,
      read INTEGER DEFAULT 0,
      edited INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      expires_at INTEGER,
      created_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS pinned_messages (
      message_id TEXT PRIMARY KEY,
      chat_id TEXT,
      pinned_by TEXT,
      created_at INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_msg_from_to ON messages(from_email, to_email);
    CREATE INDEX IF NOT EXISTS idx_msg_time ON messages(created_at);
  `);

  try { db.exec("ALTER TABLE meta ADD COLUMN who_can_send TEXT DEFAULT 'everyone';"); } catch {}
  try { db.exec("ALTER TABLE meta ADD COLUMN last_message_at INTEGER;"); } catch {}

  chatDbCache.set(cleanId, db);
  return db;
}

// 4. مزامنة وتوزيع كامل البيانات على القواعد المستقلة (Sync to Isolated Databases)
export async function syncToIsolatedDatabases(database) {
  if (!database) return;
  const sysDb = getSystemDb();

  // أ. حفظ المستخدمين في سجل النظام وقواعد بياناتهم المنفصلة
  if (Array.isArray(database.users)) {
    const stmtReg = sysDb.prepare(`
      INSERT OR REPLACE INTO users_registry (email, id, name, password, pin, avatar, is_banned, chat_plus_until, created_at, db_file)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const u of database.users) {
      const email = String(u.email || "").toLowerCase();
      if (!email) continue;
      const dbFile = `user_${hashKey(email)}.db`;
      stmtReg.run(
        email,
        String(u.id || crypto.randomUUID()),
        String(u.name || ""),
        String(u.password || ""),
        String(u.pin || ""),
        String(u.avatar || u.image || ""),
        u.is_banned ? 1 : 0,
        Number(u.chatPlusUntil || 0),
        Number(u.createdAt || Date.now()),
        dbFile
      );

      // حفظ داخل قاعدة بيانات هذا المستخدم الشخصية المستقلة
      const uDb = getUserDb(email);
      if (uDb) {
        const stmtProf = uDb.prepare(`
          INSERT OR REPLACE INTO profile (email, id, name, avatar, bio, phone, theme, lang, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmtProf.run(
          email,
          String(u.id || ""),
          String(u.name || ""),
          String(u.avatar || u.image || ""),
          String(u.bio || ""),
          String(u.phone || ""),
          String(u.theme || "dark"),
          String(u.lang || "ar"),
          Number(u.createdAt || Date.now()),
          Date.now()
        );

        // حفظ أصدقاء هذا المستخدم في قاعدة بياناته الشخصية
        if (Array.isArray(database.friendships)) {
          const stmtFriend = uDb.prepare(`
            INSERT OR REPLACE INTO friends (email, name, status, avatar, created_at)
            VALUES (?, ?, ?, ?, ?)
          `);
          for (const f of database.friendships) {
            const fFrom = String(f.from || "").toLowerCase();
            const fTo = String(f.to || "").toLowerCase();
            if (fFrom === email || fTo === email) {
              const partner = fFrom === email ? fTo : fFrom;
              const partnerUser = database.users.find((x) => String(x.email || "").toLowerCase() === partner);
              stmtFriend.run(
                partner,
                partnerUser?.name || partner.split("@")[0],
                f.status || "accepted",
                partnerUser?.avatar || partnerUser?.image || "",
                Number(f.createdAt || Date.now())
              );
            }
          }
        }

        // حفظ اشتراكات هذا المستخدم في قاعدة بياناته الشخصية
        if (Array.isArray(database.userSubscriptions)) {
          const sub = database.userSubscriptions.find((s) => String(s.user_email || s.userEmail || "").toLowerCase() === email);
          if (sub) {
            const stmtSub = uDb.prepare(`
              INSERT OR REPLACE INTO subscriptions (
                id, plan_code, plan_title, is_active, started_at, expires_at, auto_renew,
                daily_words_limit, daily_words_used, daily_ai_images_limit, daily_ai_images_used, last_reset_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            stmtSub.run(
              String(sub.id || crypto.randomUUID()),
              String(sub.plan_code || "free"),
              String(sub.plan_title || "مجاني"),
              sub.is_active ? 1 : 0,
              Number(sub.started_at || Date.now()),
              Number(sub.expires_at || 0),
              sub.auto_renew ? 1 : 0,
              Number(sub.daily_words_limit || 90),
              Number(sub.daily_words_used || 0),
              Number(sub.daily_ai_images_limit || 3),
              Number(sub.daily_ai_images_used || 0),
              Number(sub.last_reset_at || Date.now())
            );
          }
        }
      }
    }
  }

  // ب. تصنيف وحفظ كل محادثة في قاعدة بياناتها المستقلة (Dedicated Chat DBs)
  if (Array.isArray(database.messages)) {
    const messagesByChat = new Map();
    for (const msg of database.messages) {
      let chatId = String(msg.chat_id || "").trim();
      if (!chatId) {
        const from = String(msg.from || "").toLowerCase();
        const to = String(msg.to || "").toLowerCase();
        chatId = [from, to].sort().join("<->");
      }
      if (!messagesByChat.has(chatId)) messagesByChat.set(chatId, []);
      messagesByChat.get(chatId).push(msg);
    }

    const stmtChatReg = sysDb.prepare(`
      INSERT OR REPLACE INTO chats_registry (id, type, direct_pair, title, is_ai_active, disappearing_timer_seconds, created_at, db_file)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const [chatId, msgs] of messagesByChat.entries()) {
      const dbFile = `chat_${hashKey(chatId)}.db`;
      const chatRec = (database.chats || []).find((c) => c.id === chatId || c.direct_pair === chatId);

      stmtChatReg.run(
        chatId,
        chatRec?.type || "direct",
        chatId,
        chatRec?.title || chatId,
        chatRec?.is_ai_active ? 1 : 0,
        Number(chatRec?.disappearing_timer_seconds || 0),
        Number(chatRec?.createdAt || Date.now()),
        dbFile
      );

      // حفظ الرسائل في قاعدة بيانات المحادثة المستقلة
      const cDb = getChatDb(chatId);
      if (cDb) {
        const stmtMeta = cDb.prepare(`
          INSERT OR REPLACE INTO meta (chat_id, direct_pair, is_ai_active, disappearing_timer_seconds, wallpaper, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        stmtMeta.run(
          chatId,
          chatId,
          chatRec?.is_ai_active ? 1 : 0,
          Number(chatRec?.disappearing_timer_seconds || 0),
          chatRec?.wallpaper || "",
          Number(chatRec?.createdAt || Date.now())
        );

        const stmtMsg = cDb.prepare(`
          INSERT OR REPLACE INTO messages (
            id, chat_id, from_email, to_email, type, text,
            is_encrypted, encryption_iv, encryption_auth_tag, sender_public_key,
            image_url, audio_url, file_name,
            location_json, poll_json, sticker_json, document_json, reply_to_json,
            status, read, edited, is_deleted, expires_at, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const m of msgs) {
          stmtMsg.run(
            String(m.id || crypto.randomUUID()),
            chatId,
            String(m.from || "").toLowerCase(),
            String(m.to || "").toLowerCase(),
            String(m.type || "text"),
            String(m.text || ""),
            m.is_encrypted ? 1 : 0,
            m.encryption_iv || "",
            m.encryption_auth_tag || "",
            m.sender_public_key || "",
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
    }
  }

  // ج. حفظ عناصر النظام العامة (تذاكر الدعم، الإعلانات، الإشعارات) في system.db
  if (Array.isArray(database.supportTickets)) {
    const stmtTicket = sysDb.prepare(`
      INSERT OR REPLACE INTO support_tickets (id, user_email, name, subject, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const t of database.supportTickets) {
      stmtTicket.run(
        String(t.id || crypto.randomUUID()),
        String(t.userEmail || t.email || "").toLowerCase(),
        String(t.name || ""),
        String(t.subject || t.issue || ""),
        String(t.status || "open"),
        Number(t.createdAt || Date.now())
      );
    }
  }

  if (Array.isArray(database.ads)) {
    const stmtAd = sysDb.prepare(`
      INSERT OR REPLACE INTO ads (id, title, content, image_url, link_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const a of database.ads) {
      stmtAd.run(
        String(a.id || crypto.randomUUID()),
        String(a.title || ""),
        String(a.content || ""),
        String(a.imageUrl || ""),
        String(a.linkUrl || ""),
        Number(a.createdAt || Date.now())
      );
    }
  }

  if (Array.isArray(database.adminNotices)) {
    const stmtNotice = sysDb.prepare(`
      INSERT OR REPLACE INTO admin_notices (id, title, message, created_at)
      VALUES (?, ?, ?, ?)
    `);
    for (const n of database.adminNotices) {
      stmtNotice.run(
        String(n.id || crypto.randomUUID()),
        String(n.title || ""),
        String(n.message || ""),
        Number(n.createdAt || Date.now())
      );
    }
  }
}

// ==========================================
// وظائف تثبيت المحادثات (بحد أقصى 3 محادثات فقط)
// ==========================================
export function getPinnedChats(email) {
  const db = getUserDb(email);
  if (!db) return [];
  try {
    const rows = db.prepare("SELECT chat_id FROM pinned_chats ORDER BY pinned_at ASC").all();
    return rows.map((r) => r.chat_id);
  } catch {
    return [];
  }
}

export function setChatPin(email, chatId, isPinned) {
  const db = getUserDb(email);
  if (!db) return { ok: false, error: "تعذر فتح قاعدة بيانات المستخدم" };

  try {
    if (isPinned) {
      const current = db.prepare("SELECT COUNT(*) as count FROM pinned_chats").get();
      if (current && current.count >= 3) {
        // فحص هل المحادثة مثبتة بالفعل
        const exists = db.prepare("SELECT chat_id FROM pinned_chats WHERE chat_id = ?").get(chatId);
        if (!exists) {
          return { ok: false, error: "عذراً، الحد الأقصى لتثبيت المحادثات هو 3 محادثات فقط 📌" };
        }
      }
      db.prepare("INSERT OR REPLACE INTO pinned_chats (chat_id, pinned_at) VALUES (?, ?)").run(chatId, Date.now());
      return { ok: true, isPinned: true };
    } else {
      db.prepare("DELETE FROM pinned_chats WHERE chat_id = ?").run(chatId);
      return { ok: true, isPinned: false };
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ==========================================
// وظائف حظر المستخدمين (Block / Unblock)
// ==========================================
export function getBlockedUsers(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const sysDb = getSystemDb();
  try {
    const rows = sysDb.prepare("SELECT blocked_email FROM user_blocks WHERE blocker_email = ?").all(cleanEmail);
    return rows.map((r) => r.blocked_email);
  } catch {
    return [];
  }
}

export function blockUser(blockerEmail, targetEmail) {
  const blocker = String(blockerEmail || "").trim().toLowerCase();
  const target = String(targetEmail || "").trim().toLowerCase();
  if (!blocker || !target || blocker === target) {
    return { ok: false, error: "بيانات الحظر غير صحيحة" };
  }
  const sysDb = getSystemDb();
  try {
    const id = `${blocker}_blocks_${target}`;
    sysDb.prepare("INSERT OR REPLACE INTO user_blocks (id, blocker_email, blocked_email, created_at) VALUES (?, ?, ?, ?)").run(id, blocker, target, Date.now());
    
    // تسجيلها أيضاً في قاعدة بيانات المستخدم الشخصية
    const uDb = getUserDb(blocker);
    if (uDb) {
      try {
        uDb.prepare("INSERT OR REPLACE INTO blocked_users (target_email, blocked_at) VALUES (?, ?)").run(target, Date.now());
      } catch {}
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function unblockUser(blockerEmail, targetEmail) {
  const blocker = String(blockerEmail || "").trim().toLowerCase();
  const target = String(targetEmail || "").trim().toLowerCase();
  const sysDb = getSystemDb();
  try {
    sysDb.prepare("DELETE FROM user_blocks WHERE blocker_email = ? AND blocked_email = ?").run(blocker, target);
    const uDb = getUserDb(blocker);
    if (uDb) {
      try {
        uDb.prepare("DELETE FROM blocked_users WHERE target_email = ?").run(target);
      } catch {}
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function isUserBlocked(blockerEmail, targetEmail) {
  const blocker = String(blockerEmail || "").trim().toLowerCase();
  const target = String(targetEmail || "").trim().toLowerCase();
  if (!blocker || !target) return false;
  const sysDb = getSystemDb();
  try {
    const row = sysDb.prepare("SELECT id FROM user_blocks WHERE blocker_email = ? AND blocked_email = ?").get(blocker, target);
    return Boolean(row);
  } catch {
    return false;
  }
}

// ==========================================
// وظائف نظام البلاغات والشكاوى (Reports)
// ==========================================
export function addReport(reporterEmail, reportedEmail, chatId, reason, details) {
  const reporter = String(reporterEmail || "").trim().toLowerCase();
  const reported = String(reportedEmail || "").trim().toLowerCase();
  if (!reporter || !reported) return { ok: false, error: "بيانات البلاغ غير مكتملة" };

  const sysDb = getSystemDb();
  try {
    const id = `rep_${crypto.randomUUID()}`;
    sysDb.prepare(`
      INSERT INTO reports (id, reporter_email, reported_email, chat_id, reason, details, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
    `).run(id, reporter, reported, String(chatId || ""), String(reason || "inappropriate"), String(details || ""), Date.now());
    return { ok: true, reportId: id };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function getReports(status = "") {
  const sysDb = getSystemDb();
  try {
    if (status) {
      return sysDb.prepare("SELECT * FROM reports WHERE status = ? ORDER BY created_at DESC").all(status);
    }
    return sysDb.prepare("SELECT * FROM reports ORDER BY created_at DESC").all();
  } catch {
    return [];
  }
}

export function resolveReport(reportId, action) {
  const sysDb = getSystemDb();
  try {
    const report = sysDb.prepare("SELECT * FROM reports WHERE id = ?").get(reportId);
    if (!report) return { ok: false, error: "البلاغ غير موجود" };

    const newStatus = action === "dismiss" ? "dismissed" : "resolved";
    sysDb.prepare("UPDATE reports SET status = ? WHERE id = ?").run(newStatus, reportId);
    return { ok: true, report };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
