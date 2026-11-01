import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";
import http from "node:http";

function base64UrlEncode(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return Buffer.from(b64, "base64");
}

let vapidConfig = null;

export async function initVapid(dataDir) {
  const vapidPath = path.join(dataDir, "vapid.json");
  try {
    const raw = await fs.readFile(vapidPath, "utf8");
    vapidConfig = JSON.parse(raw);
  } catch {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", {
      namedCurve: "prime256v1",
      publicKeyEncoding: { type: "spki", format: "der" },
      privateKeyEncoding: { type: "pkcs8", format: "der" }
    });
    const rawPub = publicKey.slice(publicKey.length - 65);
    vapidConfig = {
      publicKeyBase64Url: base64UrlEncode(rawPub),
      publicKeyDerBase64: publicKey.toString("base64"),
      privateKeyDerBase64: privateKey.toString("base64"),
      subject: "mailto:support@chato.com"
    };
    await fs.writeFile(vapidPath, JSON.stringify(vapidConfig, null, 2), "utf8");
  }
  return vapidConfig;
}

export function getVapidPublicKey() {
  return vapidConfig?.publicKeyBase64Url || "";
}

function derToJose(der) {
  let offset = 3;
  const rLen = der[offset];
  offset++;
  let r = der.slice(offset, offset + rLen);
  offset += rLen + 1;
  const sLen = der[offset];
  offset++;
  let s = der.slice(offset, offset + sLen);

  if (r.length === 33 && r[0] === 0) r = r.slice(1);
  if (s.length === 33 && s[0] === 0) s = s.slice(1);

  const raw = Buffer.alloc(64);
  r.copy(raw, 32 - r.length);
  s.copy(raw, 64 - s.length);
  return raw;
}

function createVapidJwt(audience) {
  if (!vapidConfig) return "";
  const header = { alg: "ES256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    aud: audience,
    exp: now + (12 * 3600),
    sub: vapidConfig.subject || "mailto:support@chato.com"
  };

  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claims))}`;
  const privKeyObj = crypto.createPrivateKey({
    key: Buffer.from(vapidConfig.privateKeyDerBase64, "base64"),
    format: "der",
    type: "pkcs8"
  });
  const sign = crypto.createSign("SHA256");
  sign.update(unsigned);
  const derSig = sign.sign(privKeyObj);
  const joseSig = derToJose(derSig);
  return `${unsigned}.${base64UrlEncode(joseSig)}`;
}

function encryptPayload(payloadString, clientP256dhBase64, clientAuthBase64) {
  const clientPublicKey = base64UrlDecode(clientP256dhBase64);
  const clientAuth = base64UrlDecode(clientAuthBase64);
  const salt = crypto.randomBytes(16);

  const localEcdh = crypto.createECDH("prime256v1");
  localEcdh.generateKeys();
  const localPublicKey = localEcdh.getPublicKey();

  const sharedSecret = localEcdh.computeSecret(clientPublicKey);

  // RFC 8291 Section 3.2
  const authInfo = Buffer.from("WebPush: info\0", "utf8");
  const keyInfo = Buffer.concat([authInfo, clientPublicKey, localPublicKey]);
  const ikm = crypto.hkdfSync("sha256", sharedSecret, clientAuth, keyInfo, 32);

  const cekInfo = Buffer.from("Content-Encoding: aes128gcm\0", "utf8");
  const nonceInfo = Buffer.from("Content-Encoding: nonce\0", "utf8");

  const contentEncryptionKey = crypto.hkdfSync("sha256", ikm, salt, cekInfo, 16);
  const nonce = crypto.hkdfSync("sha256", ikm, salt, nonceInfo, 12);

  const cipher = crypto.createCipheriv("aes-128-gcm", contentEncryptionKey, nonce);
  const payloadBuf = Buffer.from(payloadString, "utf8");
  const padded = Buffer.concat([payloadBuf, Buffer.from([2])]);
  const encrypted = Buffer.concat([cipher.update(padded), cipher.final(), cipher.getAuthTag()]);

  const rs = Buffer.alloc(4);
  rs.writeUInt32BE(padded.length + 16, 0);
  const idLen = Buffer.from([localPublicKey.length]);

  return Buffer.concat([salt, rs, idLen, localPublicKey, encrypted]);
}

export async function sendWebPush(subscription, payload) {
  if (!subscription || !subscription.endpoint) return { ok: false, error: "Missing endpoint" };
  const endpointUrl = new URL(subscription.endpoint);
  const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;
  const jwt = createVapidJwt(audience);
  const vapidHeader = `vapid t=${jwt}, k=${vapidConfig?.publicKeyBase64Url || ""}`;

  let bodyBuf = Buffer.alloc(0);
  const headers = {
    "TTL": "86400",
    "Urgency": "high",
    "Authorization": vapidHeader
  };

  const p256dh = subscription.keys?.p256dh || subscription.p256dh;
  const auth = subscription.keys?.auth || subscription.auth;

  if (payload && p256dh && auth) {
    try {
      const payloadStr = typeof payload === "string" ? payload : JSON.stringify(payload);
      bodyBuf = encryptPayload(payloadStr, p256dh, auth);
      headers["Content-Encoding"] = "aes128gcm";
      headers["Content-Type"] = "application/octet-stream";
      headers["Content-Length"] = String(bodyBuf.length);
    } catch (err) {
      console.warn("[WebPush Encrypt Error]", err?.message);
    }
  }

  return new Promise((resolve) => {
    const client = endpointUrl.protocol === "https:" ? https : http;
    const req = client.request(subscription.endpoint, {
      method: "POST",
      headers
    }, (res) => {
      let respData = "";
      res.on("data", (chunk) => { respData += chunk; });
      res.on("end", () => {
        const isOk = res.statusCode >= 200 && res.statusCode < 300;
        resolve({
          ok: isOk,
          statusCode: res.statusCode,
          body: respData,
          expired: res.statusCode === 410 || res.statusCode === 404
        });
      });
    });

    req.on("error", (err) => {
      resolve({ ok: false, error: err.message });
    });

    if (bodyBuf.length > 0) {
      req.write(bodyBuf);
    }
    req.end();
  });
}

export async function sendPushToUser(userEmail, payload, database) {
  const cleanEmail = String(userEmail || "").trim().toLowerCase();
  if (!cleanEmail || !database) return [];

  const subscriptions = [];
  // 1. From database.userDevices
  (database.userDevices || []).forEach((d) => {
    if (d.email && d.email.toLowerCase() === cleanEmail && d.push_subscription && d.push_subscription.endpoint) {
      subscriptions.push(d.push_subscription);
    }
  });

  // 2. From database.pushSubscriptions
  (database.pushSubscriptions || []).forEach((s) => {
    if (s.user_email && s.user_email.toLowerCase() === cleanEmail && s.endpoint) {
      subscriptions.push(s);
    }
  });

  const results = [];
  for (const sub of subscriptions) {
    try {
      const res = await sendWebPush(sub, payload);
      results.push(res);
    } catch {}
  }
  return results;
}
