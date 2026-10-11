#!/usr/bin/env node
// Public static site + server-protected admin. No runtime dependencies.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createAdminAuth } from './lib/admin-auth.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.pdf': 'application/pdf', '.mp4': 'video/mp4',
};
const withinRoot = (file) => {
  const relative = path.relative(root, file);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
};
function publicFile(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  // Reject NTFS stream/directory aliases and trailing-dot/space normalization.
  if (parts.some((part) => part.startsWith('.') || part.toLowerCase() === '_build' || /[:<>"|?*\x00-\x1f]/.test(part) || /[. ]$/.test(part))) return null;
  let file = path.resolve(root, `.${pathname}`);
  if (!withinRoot(file)) return null;
  for (let i = 1; i <= parts.length; i += 1) {
    const segment = path.join(root, ...parts.slice(0, i));
    if (fs.existsSync(segment) && fs.lstatSync(segment).isSymbolicLink()) return null;
  }
  if (!fs.existsSync(file)) return null;
  if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) || fs.lstatSync(file).isSymbolicLink()) return null;
  if (!Object.hasOwn(mime, path.extname(file).toLowerCase())) return null;
  return fs.statSync(file).isFile() ? file : null;
}
function sendFile(req, res, file, status = 200) {
  if (!fs.existsSync(file)) { res.writeHead(503); res.end('Build the website before starting the server.'); return; }
  res.writeHead(status, {
    'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Content-Length': fs.statSync(file).size,
  });
  if (req.method === 'HEAD') res.end();
  else fs.createReadStream(file).on('error', () => res.destroy()).pipe(res);
}
export async function createSiteServer({ origin, credentialFile = path.join(root, '.local/admin-credentials.json'), now } = {}) {
  const auth = await createAdminAuth({ credentialFile, origin, now });
  const expectedHost = new URL(origin).host;
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    let url, pathname;
    try {
      url = new URL(req.url, origin);
      pathname = decodeURIComponent(url.pathname).replace(/\\/g, '/').replace(/\/{2,}/g, '/');
      if (pathname.includes('\0')) throw new Error('path');
    } catch { res.writeHead(400); res.end('Invalid request path'); return; }
    const isAdmin = /^\/admin(?:\/|$)/i.test(pathname);
    try {
      if (isAdmin) {
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'");
        if (req.headers.host !== expectedHost) { res.writeHead(403); res.end('Invalid admin host'); return; }
        pathname = pathname.toLowerCase();
        if (await auth.handle(req, res, pathname)) return;
        if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
        if (!['/admin', '/admin/', '/admin/index.html', '/admin/security', '/admin/security/'].includes(pathname)) { sendFile(req, res, path.join(root, '404.html'), 404); return; }
        if (pathname === '/admin') { res.writeHead(308, { Location: '/admin/' }); res.end(); return; }
        const authenticated = auth.authenticated(req);
        if (pathname.startsWith('/admin/security') && !authenticated) { res.writeHead(303, { Location: '/admin/' }); res.end(); return; }
        const file = !authenticated ? 'admin/index.html' : pathname.startsWith('/admin/security') ? '_build/private/admin-security.html' : '_build/private/admin.html';
        sendFile(req, res, path.join(root, file));
        return;
      }
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end('Method not allowed'); return; }
      const file = publicFile(pathname);
      if (file && path.basename(file) === 'index.html' && !url.pathname.endsWith('/') && !url.pathname.endsWith('/index.html')) {
        res.writeHead(308, { Location: `${url.pathname}/${url.search}` }); res.end(); return;
      }
      sendFile(req, res, file || path.join(root, '404.html'), file ? 200 : 404);
    } catch {
      // Do not log request bodies, credentials, cookies or credential-file paths.
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('İşlem tamamlanamadı. Lütfen tekrar dene.');
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const host = process.env.HOST || '127.0.0.1';
  const port = Number(process.env.PORT || 4174);
  const origin = process.env.ADMIN_ORIGIN || `http://${host}:${port}`;
  if (process.env.NODE_ENV === 'production' && !origin.startsWith('https://')) throw new Error('Production admin requires ADMIN_ORIGIN=https://your-domain');
  if (!['127.0.0.1', 'localhost', '::1'].includes(host) && !origin.startsWith('https://')) throw new Error('Remote binding requires HTTPS');
  const server = await createSiteServer({ origin, credentialFile: process.env.ADMIN_CREDENTIAL_FILE || undefined });
  server.on('error', (error) => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use.` : error.message); process.exitCode = 1; });
  server.listen(port, host, () => console.log(`Sigara Savar: ${origin}/ — admin sessions enabled`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => { process.exitCode = 0; }));
}
