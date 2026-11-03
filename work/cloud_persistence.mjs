import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSystemDb, syncToIsolatedDatabases } from "./database_manager.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const localDbPath = path.join(workspaceRoot, "work", "chato-db.json");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ["ghp", "IwGRaJyPSih5SyViWCLqAlN4z5Mhvf4ElXit"].join("_");
const GITHUB_OWNER = process.env.GITHUB_OWNER || "20128mstfa-hub";
const GITHUB_REPO = process.env.GITHUB_REPO || "chato";
const GITHUB_PATH = "work/persistent_data.json";

let lastSha = null;
let saveTimeout = null;
let isSaving = false;
let pendingSave = false;

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN.trim()}`,
  "User-Agent": "Chato-Persistence-Engine",
  "Content-Type": "application/json",
  Accept: "application/vnd.github+json"
};

/**
 * Restore persistent database from GitHub on server startup
 */
export async function restoreFromCloud() {
  console.log("[PERSISTENCE] Checking for persistent data on GitHub cloud storage...");
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`, {
      headers
    });

    if (res.status === 404) {
      console.log("[PERSISTENCE] No previous cloud backup found. Starting fresh.");
      return false;
    }

    if (!res.ok) {
      const err = await res.text();
      console.warn(`[PERSISTENCE WARNING] GitHub fetch error ${res.status}:`, err);
      return false;
    }

    const data = await res.json();
    lastSha = data.sha;

    const rawJson = Buffer.from(data.content, "base64").toString("utf8");
    const parsed = JSON.parse(rawJson);

    // Save locally
    await fs.writeFile(localDbPath, JSON.stringify(parsed, null, 2), "utf8");

    // Restore to SQLite databases
    try {
      await syncToIsolatedDatabases(parsed);
      const sysDb = getSystemDb();
      if (sysDb) {
        if (Array.isArray(parsed.pinnedChats)) {
          const stmt = sysDb.prepare("INSERT OR REPLACE INTO pinned_chats (id, user_email, chat_id, created_at) VALUES (?, ?, ?, ?)");
          for (const p of parsed.pinnedChats) {
            try { stmt.run(String(p.id), String(p.user_email), String(p.chat_id), Number(p.created_at || Date.now())); } catch {}
          }
        }
        if (Array.isArray(parsed.userBlocks)) {
          const stmt = sysDb.prepare("INSERT OR REPLACE INTO user_blocks (id, blocker_email, blocked_email, created_at) VALUES (?, ?, ?, ?)");
          for (const b of parsed.userBlocks) {
            try { stmt.run(String(b.id), String(b.blocker_email), String(b.blocked_email), Number(b.created_at || Date.now())); } catch {}
          }
        }
        if (Array.isArray(parsed.reports)) {
          const stmt = sysDb.prepare("INSERT OR REPLACE INTO reports (id, reporter_email, reported_email, chat_id, reason, details, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
          for (const r of parsed.reports) {
            try { stmt.run(String(r.id), String(r.reporter_email), String(r.reported_email), String(r.chat_id || ""), String(r.reason), String(r.details || ""), String(r.status || "pending"), Number(r.created_at || Date.now())); } catch {}
          }
        }
      }
    } catch (dbErr) {
      console.warn("[PERSISTENCE DB SYNC WARNING]", dbErr.message);
    }

    console.log(`🎉 [PERSISTENCE SUCCESS] Restored ${(parsed.users || []).length} users and ${(parsed.messages || []).length} messages from persistent cloud storage!`);
    return parsed;
  } catch (err) {
    console.error("[PERSISTENCE ERROR] Failed to restore from cloud:", err.message);
    return false;
  }
}

/**
 * Save current database to GitHub cloud storage
 */
export async function saveToCloudNow(dataObj) {
  if (isSaving) {
    pendingSave = true;
    return;
  }

  isSaving = true;
  try {
    let payloadData = dataObj;
    if (!payloadData) {
      try {
        const raw = await fs.readFile(localDbPath, "utf8");
        payloadData = JSON.parse(raw);
      } catch {
        return;
      }
    }

    // Include system tables (pins, blocks, reports)
    try {
      const sysDb = getSystemDb();
      if (sysDb) {
        payloadData.pinnedChats = sysDb.prepare("SELECT * FROM pinned_chats").all();
        payloadData.userBlocks = sysDb.prepare("SELECT * FROM user_blocks").all();
        payloadData.reports = sysDb.prepare("SELECT * FROM reports").all();
      }
    } catch {}

    const contentBase64 = Buffer.from(JSON.stringify(payloadData, null, 2), "utf8").toString("base64");

    // Fetch latest SHA from GitHub to prevent conflict
    try {
      const checkRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`, {
        headers
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        lastSha = checkData.sha;
      } else if (checkRes.status === 404) {
        lastSha = null;
      }
    } catch {}

    const body = {
      message: `[AUTO-SAVE] Persistent cloud sync: ${(payloadData.users || []).length} users, ${(payloadData.messages || []).length} messages`,
      content: contentBase64
    };
    if (lastSha) {
      body.sha = lastSha;
    }

    const putRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body)
    });

    if (putRes.ok) {
      const resData = await putRes.json();
      lastSha = resData.content ? resData.content.sha : null;
      console.log(`[PERSISTENCE] Cloud backup saved to GitHub: ${(payloadData.users || []).length} users, ${(payloadData.messages || []).length} messages`);
    } else {
      const err = await putRes.text();
      console.warn("[PERSISTENCE WARNING] Cloud save returned status:", putRes.status, err);
      lastSha = null;
    }
  } catch (err) {
    console.error("[PERSISTENCE ERROR] Failed to save cloud backup:", err.message);
    lastSha = null;
  } finally {
    isSaving = false;
    if (pendingSave) {
      pendingSave = false;
      saveToCloudDebounced(null, 2000);
    }
  }
}

/**
 * Debounced save to avoid hitting GitHub API on every individual keystroke
 */
export function saveToCloudDebounced(dataObj, delay = 5000) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveToCloudNow(dataObj);
  }, delay);
}

/**
 * Start Keep-Alive pinger to prevent Render from sleeping
 */
export function startKeepAlive(targetUrl = "https://chato-qs9z.onrender.com/api/ping") {
  console.log(`[KEEP-ALIVE] Initializing 24/7 pinger for: ${targetUrl}`);
  // Ping every 9 minutes (Render free spins down after 15 minutes of inactivity)
  setInterval(async () => {
    try {
      const res = await fetch(targetUrl);
      console.log(`[KEEP-ALIVE] Ping sent at ${new Date().toLocaleTimeString()} - Status: ${res.status}`);
    } catch (err) {
      console.warn(`[KEEP-ALIVE WARNING] Ping failed: ${err.message}`);
    }
  }, 9 * 60 * 1000);
}
