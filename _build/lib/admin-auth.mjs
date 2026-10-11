// One-operator admin sessions. Secrets are local/server-only, never browser assets.
import fs from 'node:fs/promises';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(scrypt);
const COST = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
const IDLE = 30 * 60 * 1000;
const LIFETIME = 8 * 60 * 60 * 1000;
const WINDOW = 15 * 60 * 1000;
const token = () => randomBytes(32).toString('base64url');
const equal = (a, b) => typeof a === 'string' && typeof b === 'string' && Buffer.byteLength(a) === Buffer.byteLength(b) && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function passwordRecord(username, password) {
  if (!/^[a-zA-Z0-9._-]{3,64}$/.test(username)) throw new Error('Invalid admin username');
  if (password.length < 16 || password.length > 128) throw new Error('Password must contain 16–128 characters');
  const salt = randomBytes(16).toString('hex');
  const hash = (await derive(password, salt, 64, COST)).toString('hex');
  return { version: 1, username, salt, hash };
}
export async function saveRecord(file, record) {
  // Atomic replacement prevents a stopped process from leaving a partial password record.
  const temporary = `${file}.${randomBytes(8).toString('hex')}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(record) + '\n', { mode: 0o600, flag: 'wx' });
  await fs.rename(temporary, file);
}

export async function createAdminAuth({ credentialFile, origin, now = Date.now }) {
  const url = new URL(origin);
  const secure = url.protocol === 'https:';
  if (!secure && !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) throw new Error('Remote admin access requires an HTTPS origin');
  if (url.origin !== origin || url.username || url.password) throw new Error('ADMIN_ORIGIN must be an exact origin without a path');
  let record;
  try { record = JSON.parse(await fs.readFile(credentialFile, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (record && (record.version !== 1 || !/^[a-zA-Z0-9._-]{3,64}$/.test(record.username) || !/^[a-f0-9]{32}$/.test(record.salt) || !/^[a-f0-9]{128}$/.test(record.hash))) throw new Error('Invalid admin credential file');
  const sessions = new Map();
  const attempts = new Map();
  const cookieName = secure ? '__Host-sigarasavar-admin' : 'sigarasavar-admin';
  let inFlight = 0;
  const cookie = (value, age) => `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${secure ? '; Secure' : ''}`;
  function getSession(req) {
    const id = (req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
    const session = sessions.get(id);
    if (!session) return null;
    if (now() > session.expires || now() - session.used > IDLE) { sessions.delete(id); return null; }
    session.used = now();
    return { id, ...session };
  }
  function newSession(authenticated, res) {
    for (const [key, session] of sessions) if (session.expires < now() || now() - session.used > IDLE) sessions.delete(key);
    if (sessions.size >= 500) {
      const anonymous = [...sessions].find(([, session]) => !session.authenticated)?.[0];
      if (anonymous) sessions.delete(anonymous);
      else if (authenticated) sessions.delete(sessions.keys().next().value);
      else return null; // Anonymous traffic must never evict a signed-in operator.
    }
    const id = token();
    const session = { authenticated, csrf: token(), used: now(), expires: now() + (authenticated ? LIFETIME : WINDOW) };
    sessions.set(id, session);
    res.setHeader('Set-Cookie', cookie(id, authenticated ? LIFETIME / 1000 : WINDOW / 1000));
    return { id, ...session };
  }
  function allowedAttempt(ip) {
    for (const [key, entry] of attempts) if (entry.until < now()) attempts.delete(key);
    if (attempts.size >= 1000 && !attempts.has(ip)) return false;
    const keys = [ip, 'all'];
    if (keys.some((key) => (attempts.get(key)?.count || 0) >= (key === 'all' ? 20 : 5))) return false;
    for (const key of keys) {
      const entry = attempts.get(key) || { count: 0, until: now() + WINDOW };
      entry.count += 1;
      attempts.set(key, entry);
    }
    return true;
  }
  async function passwordMatches(password) {
    const hash = (await derive(password, record.salt, 64, COST)).toString('hex');
    return equal(hash, record.hash);
  }
  function json(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' });
    res.end(JSON.stringify(data));
  }
  async function body(req) {
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) throw new Error('json');
    let bytes = 0;
    const chunks = [];
    for await (const chunk of req) {
      bytes += chunk.length;
      if (bytes > 8192) throw new Error('size');
      chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  }
  return {
    authenticated: (req) => Boolean(getSession(req)?.authenticated),
    async handle(req, res, pathname) {
      if (!['/admin/session', '/admin/login', '/admin/logout', '/admin/password'].includes(pathname)) return false;
      if (req.headers.host !== url.host) { json(res, 403, { error: 'Geçersiz site adresi.' }); return true; }
      if (pathname === '/admin/session' && req.method === 'GET') {
        const session = getSession(req) || newSession(false, res);
        if (!session) { json(res, 429, { error: 'Sunucu meşgul. Biraz sonra tekrar dene.' }); return true; }
        json(res, 200, { configured: Boolean(record), authenticated: session.authenticated, csrf: session.csrf, username: session.authenticated ? record?.username : undefined });
        return true;
      }
      if (req.method !== 'POST' || pathname === '/admin/session') { json(res, 405, { error: 'Bu işlem desteklenmiyor.' }); return true; }
      const session = getSession(req);
      if (req.headers.origin !== origin || !session) { json(res, 403, { error: 'Oturum doğrulanamadı. Sayfayı yenileyip tekrar dene.' }); return true; }
      let input;
      try { input = await body(req); } catch { json(res, 400, { error: 'İstek okunamadı.' }); return true; }
      if (!input || !equal(input.csrf, session.csrf)) { json(res, 403, { error: 'Oturum doğrulanamadı. Sayfayı yenile.' }); return true; }
      if (pathname === '/admin/logout') {
        sessions.delete(session.id);
        res.setHeader('Set-Cookie', cookie('', 0));
        json(res, 200, { ok: true });
        return true;
      }
      if (!record) { json(res, 503, { error: 'Yönetici hesabı henüz yapılandırılmadı.' }); return true; }
      const change = pathname === '/admin/password';
      if (change && !session.authenticated) { json(res, 401, { error: 'Tekrar giriş yapmalısın.' }); return true; }
      const password = change ? input.currentPassword : input.password;
      if (typeof password !== 'string' || password.length > 128 || (!change && typeof input.username !== 'string')) { json(res, 400, { error: 'Giriş bilgilerini kontrol et.' }); return true; }
      if (inFlight >= 2 || !allowedAttempt(req.socket.remoteAddress || 'unknown')) { json(res, 429, { error: 'Çok fazla deneme yapıldı. 15 dakika sonra tekrar dene.' }); return true; }
      inFlight += 1;
      try {
        const matches = await passwordMatches(password);
        if (!matches || (!change && !equal(input.username, record.username))) { json(res, 401, { error: 'Kullanıcı adı veya şifre hatalı.' }); return true; }
        if (change) {
          if (typeof input.newPassword !== 'string' || input.newPassword.length < 16 || input.newPassword.length > 128 || input.newPassword === password) { json(res, 400, { error: 'Öncekinden farklı, en az 16 karakterlik bir şifre seç.' }); return true; }
          const replacement = await passwordRecord(record.username, input.newPassword);
          await saveRecord(credentialFile, replacement);
          record = replacement;
          sessions.clear(); // Revoke all earlier sessions on password change.
        } else sessions.delete(session.id);
        newSession(true, res); // Always rotate the identifier at authentication.
        json(res, 200, { ok: true });
      } finally { inFlight -= 1; }
      return true;
    },
  };
}
