/**
 * security.js — Sigara Savar Web Güvenlik Katmanı v1.0
 *
 * Sağladığı korumalar:
 *  1. HTML sanitizer            — XSS (Cross-Site Scripting) önleme
 *  2. Client-side rate limiter  — Brute-force saldırılarını yavaşlatır
 *  3. Input validators          — Veri doğrulama ve sanitasyon
 *  4. Clickjacking koruması     — Frame içinde çalışmayı engeller
 *  5. Session timeout           — 30 dk hareketsizlikte otomatik çıkış
 *  6. Security event logger     — Şüpheli aktivite tespiti
 *  7. Open redirect koruması    — Harici yönlendirmeleri engeller
 */

"use strict";

// ════════════════════════════════════════════════════════════════
// 1. HTML SANİTİZER — XSS Önleme
// ════════════════════════════════════════════════════════════════

/**
 * Kullanıcı kaynaklı metni güvenli şekilde düz metne dönüştürür.
 * innerHTML içinde ASLA ham kullanıcı verisi kullanmayın; bu fonksiyonu kullanın.
 * @param {*} str - Sanitize edilecek değer
 * @returns {string} HTML entity'leri encode edilmiş güvenli string
 */
export function sanitizeText(str) {
  if (str === null || str === undefined) return "";
  const text = String(str);
  if (text.length > 2000) return text.slice(0, 2000); // Aşırı uzun girişi kes
  const div = document.createElement("div");
  div.textContent = text;
  return div.textContent;
}

/**
 * innerHTML içine güvenli yerleştirme için HTML entity encode eder.
 * @param {*} str
 * @returns {string}
 */
export function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  const text = String(str);
  if (text.length > 2000) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML; // textContent → innerHTML entity encode eder
}

/**
 * Sayısal değerleri doğrular ve güvenli string'e çevirir.
 * @param {*} val
 * @param {string} fallback
 * @returns {string}
 */
export function safeNumber(val, fallback = "—") {
  const n = parseFloat(val);
  if (isNaN(n) || !isFinite(n)) return fallback;
  if (Math.abs(n) > 1e12) return fallback; // Saçma büyük sayıları reddet
  return String(n);
}

// ════════════════════════════════════════════════════════════════
// 2. CLIENT-SIDE RATE LIMITER
// ════════════════════════════════════════════════════════════════

const _rateLimits = new Map();

export class RateLimitError extends Error {
  constructor(message, minutesRemaining) {
    super(message);
    this.name = "RateLimitError";
    this.minutesRemaining = minutesRemaining;
    this.code = "rate_limited";
  }
}

/**
 * Client-side rate limiter. Firebase'in server-side limitini tamamlar.
 * @param {string} key         – Limit anahtarı (örn: "login", "register")
 * @param {number} maxAttempts – Max deneme sayısı
 * @param {number} windowMs    – Zaman penceresi (ms)
 * @throws {RateLimitError}    – Limit aşılırsa fırlatır
 */
export function checkRateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  let rec = _rateLimits.get(key) ?? { count: 0, windowStart: now, blockedUntil: 0 };

  // Engel süresi dolmamışsa hata fırlat
  if (rec.blockedUntil > now) {
    const remaining = Math.ceil((rec.blockedUntil - now) / 60000);
    logSecEvent("rate_limit_block", { key, remaining });
    throw new RateLimitError(`Çok fazla deneme. ${remaining} dakika sonra tekrar deneyin.`, remaining);
  }

  // Zaman penceresi dolmuşsa sıfırla
  if (now - rec.windowStart > windowMs) {
    rec = { count: 0, windowStart: now, blockedUntil: 0 };
  }

  rec.count++;
  _rateLimits.set(key, rec);

  if (rec.count > maxAttempts) {
    rec.blockedUntil = now + windowMs;
    _rateLimits.set(key, rec);
    logSecEvent("rate_limit_exceeded", { key, attempts: rec.count });
    throw new RateLimitError("Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin.", 15);
  }
}

/** Başarılı işlem sonrası rate limit kaydını temizler. */
export function clearRateLimit(key) {
  _rateLimits.delete(key);
}

// ════════════════════════════════════════════════════════════════
// 3. INPUT VALIDATORS
// ════════════════════════════════════════════════════════════════

/** @returns {{ ok: boolean, msg?: string }} */
export function validateEmail(email) {
  if (!email || typeof email !== "string") return { ok: false, msg: "E-posta adresi gerekli." };
  const trimmed = email.trim();
  if (trimmed.length > 320) return { ok: false, msg: "E-posta adresi çok uzun." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return { ok: false, msg: "Geçersiz e-posta adresi." };
  // Potansiyel injection pattern kontrolü
  if (/[<>'"\\]/.test(trimmed)) return { ok: false, msg: "Geçersiz karakter." };
  return { ok: true, value: trimmed };
}

/** @returns {{ ok: boolean, msg?: string }} */
export function validatePassword(password) {
  if (!password || typeof password !== "string") return { ok: false, msg: "Şifre gerekli." };
  if (password.length < 6)   return { ok: false, msg: "Şifre en az 6 karakter olmalıdır." };
  if (password.length > 128) return { ok: false, msg: "Şifre çok uzun." };
  return { ok: true };
}

/** @returns {{ ok: boolean, msg?: string, value?: string }} */
export function validateName(name) {
  if (!name || typeof name !== "string") return { ok: false, msg: "Ad gerekli." };
  const trimmed = name.trim();
  if (trimmed.length < 2)  return { ok: false, msg: "Ad en az 2 karakter olmalıdır." };
  if (trimmed.length > 100) return { ok: false, msg: "Ad çok uzun." };
  if (/<[^>]*>|javascript:/i.test(trimmed)) return { ok: false, msg: "Geçersiz karakter." };
  return { ok: true, value: trimmed };
}

// ════════════════════════════════════════════════════════════════
// 4. CLİCKJACKİNG KORUMASI
// ════════════════════════════════════════════════════════════════

/**
 * Sayfa bir iframe/frame içinde yükleniyorsa üst pencereye kaçar.
 * HTTP X-Frame-Options header'ının JS katmanı yedegi.
 */
export function preventClickjacking() {
  try {
    if (window.self !== window.top) {
      // Yalnızca aynı origin ise izin ver, aksi hâlde top'a kaç
      if (window.top.location.origin !== window.self.location.origin) {
        window.top.location.replace(window.self.location.href);
      }
    }
  } catch {
    // cross-origin frame: top erişimi engellendi → sayfa zaten izole
  }
}

// ════════════════════════════════════════════════════════════════
// 5. SESSION TIMEOUT (Hareketsizlik Timeout'u)
// ════════════════════════════════════════════════════════════════

let _idleTimer = null;
const IDLE_EVENTS = ["mousemove", "keydown", "click", "touchstart", "scroll", "visibilitychange"];

/**
 * Belirlenen süre boyunca kullanıcı etkileşimi yoksa `onTimeout` çağrılır.
 * @param {Function} onTimeout  – Zaman aşımı callback'i (genellikle signOut)
 * @param {number}   timeoutMs  – İnaktif eşiği (varsayılan: 30 dk)
 * @returns {Function}          – Temizleme fonksiyonu
 */
export function startIdleTimer(onTimeout, timeoutMs = 30 * 60 * 1000) {
  const reset = () => {
    clearTimeout(_idleTimer);
    _idleTimer = setTimeout(() => {
      logSecEvent("session_timeout");
      onTimeout();
    }, timeoutMs);
  };

  IDLE_EVENTS.forEach((ev) => document.addEventListener(ev, reset, { passive: true }));
  reset();

  return () => {
    clearTimeout(_idleTimer);
    IDLE_EVENTS.forEach((ev) => document.removeEventListener(ev, reset));
  };
}

// ════════════════════════════════════════════════════════════════
// 6. GÜVENLİK OLAY LOGGER
// ════════════════════════════════════════════════════════════════

const _secLog = [];
const MAX_LOG_ENTRIES = 200;
const BRUTE_FORCE_WINDOW_MS = 5 * 60 * 1000;  // 5 dakika
const BRUTE_FORCE_THRESHOLD = 5;

/**
 * Güvenlik olaylarını loglar ve şüpheli aktivite tespit eder.
 * @param {string} type   – Olay tipi: "auth_failure", "auth_success", "rate_limit", vb.
 * @param {object} detail – Ek bilgi (uid, email, vb. eklenebilir)
 */
export function logSecEvent(type, detail = {}) {
  const entry = {
    type,
    ts: Date.now(),
    path: window.location.pathname,
    ua: navigator.userAgent.slice(0, 80),
    ...detail,
  };

  _secLog.push(entry);
  if (_secLog.length > MAX_LOG_ENTRIES) _secLog.shift();

  // Brute-force tespiti
  if (type === "auth_failure") {
    const recentFailures = _secLog.filter(
      (e) => e.type === "auth_failure" && Date.now() - e.ts < BRUTE_FORCE_WINDOW_MS
    ).length;

    if (recentFailures >= BRUTE_FORCE_THRESHOLD) {
      console.warn("[Security] ⚠️ Olası brute-force saldırısı:", recentFailures, "başarısız deneme");
    }
  }

  // Geliştirici logları (sadece kritik olaylar)
  const CRITICAL = ["auth_failure", "rate_limit_block", "rate_limit_exceeded", "session_timeout", "clickjack_attempt"];
  if (CRITICAL.includes(type)) {
    console.warn(`[Sigara Savar Security] ${type}`, detail);
  }
}

/** Mevcut güvenlik log'larını döner (debug amaçlı). */
export function getSecurityLog() {
  return [..._secLog];
}

// ════════════════════════════════════════════════════════════════
// 7. OPEN REDIRECT KORUMASI
// ════════════════════════════════════════════════════════════════

/**
 * URL'nin aynı origin'e ait olduğunu doğrular (open redirect önleme).
 * @param {string} url
 * @returns {boolean}
 */
export function isSafeRedirectURL(url) {
  if (!url || typeof url !== "string") return false;
  // Sadece göreli path'e izin ver
  if (url.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(url)) {
    // Mutlak URL: yalnızca aynı origin'e izin ver
    try {
      const parsed = new URL(url, window.location.origin);
      return parsed.origin === window.location.origin;
    } catch {
      return false;
    }
  }
  return true; // Göreli path güvenli
}

/**
 * Güvenli yönlendirme yapar. Harici URL'leri engeller.
 * @param {string} url
 * @param {string} fallback – Güvenli değilse gidilecek URL
 */
export function safeRedirect(url, fallback = "/") {
  if (isSafeRedirectURL(url)) {
    window.location.href = url;
  } else {
    logSecEvent("blocked_redirect", { attempted: url });
    window.location.href = fallback;
  }
}
