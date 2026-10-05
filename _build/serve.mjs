#!/usr/bin/env node
// Dependency-free development server. Public files only; no build/source folders.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = '127.0.0.1';
const port = 4173;
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

function publicFile(url) {
  const decoded = decodeURIComponent(url.pathname).replace(/\\/g, '/');
  if (decoded.includes('\0')) return null;
  const parts = decoded.split('/').filter(Boolean);
  if (parts.some((part) => part.startsWith('.') || part.toLowerCase() === '_build')) return null;
  let file = path.resolve(root, `.${decoded}`);
  if (!withinRoot(file)) return null;
  // A symlink inside the checkout must not expose files outside the public root.
  for (let i = 1; i <= parts.length; i += 1) {
    const segment = path.join(root, ...parts.slice(0, i));
    if (fs.existsSync(segment) && fs.lstatSync(segment).isSymbolicLink()) return null;
  }
  if (!fs.existsSync(file)) return null;
  if (fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || fs.lstatSync(file).isSymbolicLink()) return null;
  }
  return fs.statSync(file).isFile() ? file : null;
}

const server = http.createServer((request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }
  let url;
  let file;
  try {
    url = new URL(request.url, `http://${host}:${port}`);
    file = publicFile(url);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Invalid request path');
    return;
  }
  if (file && path.basename(file) === 'index.html' && !url.pathname.endsWith('/') && !url.pathname.endsWith('/index.html')) {
    response.writeHead(308, { Location: `${url.pathname}/${url.search}` });
    response.end();
    return;
  }
  const status = file ? 200 : 404;
  file ||= path.join(root, '404.html');
  if (!fs.existsSync(file)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : 'Page not found');
    return;
  }
  response.writeHead(status, {
    'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Content-Length': fs.statSync(file).size,
  });
  if (request.method === 'HEAD') response.end();
  else fs.createReadStream(file).on('error', () => response.destroy()).pipe(response);
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Stop the existing preview first.` : error.message);
  process.exitCode = 1;
});
server.listen(port, host, () => console.log(`Sigara Savar preview: http://${host}:${port}/ (Ctrl+C to stop)`));
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => { process.exitCode = 0; }));
}
