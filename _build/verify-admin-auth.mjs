// Integration tests use an isolated disposable account, never the owner's password.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { passwordRecord, createAdminAuth } from './lib/admin-auth.mjs';
import { createSiteServer } from './serve.mjs';

const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'sigara-auth-test-'));
const credentialFile = path.join(directory, 'credentials.json');
const password = randomBytes(24).toString('base64url');
const changed = randomBytes(24).toString('base64url');
await fs.writeFile(credentialFile, JSON.stringify(await passwordRecord('test.admin', password)));
const port = 4189;
const origin = `http://127.0.0.1:${port}`;
let clock = Date.now();
const server = await createSiteServer({ origin, credentialFile, now: () => clock });
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
function client() {
  let cookie = '';
  let csrf;
  return {
    get cookie() { return cookie; },
    async request(route, input, headers = {}) {
      const response = await fetch(origin + route, {
        redirect: 'manual', headers: { Cookie: cookie, ...(input ? { Origin: origin, 'Content-Type': 'application/json' } : {}), ...headers },
        ...(input ? { method: 'POST', body: JSON.stringify({ csrf, ...input }) } : {}),
      });
      const next = response.headers.get('set-cookie');
      if (next) cookie = next.split(';')[0];
      const text = await response.text();
      const data = response.headers.get('content-type')?.includes('application/json') ? JSON.parse(text) : null;
      if (data?.csrf) csrf = data.csrf;
      return { status: response.status, text, data, headers: response.headers };
    },
  };
}
try {
  const guest = client();
  for (const route of ['/admin/', '/admin/index.html', '/AdMiN/index.html', '/%61dmin/index.html']) {
    const result = await guest.request(route);
    assert.equal(result.status, 200);
    assert(result.text.includes('data-admin-access="login"'));
    assert(!result.text.includes('id="admin-inventory"'), 'Guest must not receive panel data');
  }
  for (const route of ['/.local/admin-credentials.json', '/.local/admin-access.txt', '/_build/private/admin.html', '/_BUILD/private/admin.html', '/%5fbuild/private/admin.html', '/_build::$INDEX_ALLOCATION/private/admin.html', '/_build:$I30:$INDEX_ALLOCATION/private/admin.html', '/_build%20/private/admin.html', '/_build./private/admin.html', '/README.md']) {
    assert.equal((await guest.request(route)).status, 404, `Private path leaked: ${route}`);
  }
  assert.equal((await guest.request('/admin/security')).status, 303);
  const initial = await guest.request('/admin/session');
  assert.equal(initial.data.authenticated, false);
  assert(initial.headers.get('set-cookie').includes('HttpOnly'));
  assert(initial.headers.get('set-cookie').includes('SameSite=Strict'));
  const anonymousCookie = guest.cookie;
  assert.equal((await guest.request('/admin/login', { username: 'test.admin', password }, { Origin: 'https://other.example' })).status, 403);
  assert.equal((await guest.request('/admin/login', { username: 'test.admin', password, csrf: 'invalid' })).status, 403);
  assert.equal((await guest.request('/admin/login', { username: 'test.admin', password: 'incorrect' })).status, 401);
  assert.equal((await guest.request('/admin/login', { username: 'test.admin', password })).status, 200);
  assert.notEqual(guest.cookie, anonymousCookie, 'Login must rotate the session identifier');
  const protectedPage = await guest.request('/admin/');
  assert(protectedPage.text.includes('id="admin-inventory"'));
  assert.equal(protectedPage.headers.get('x-frame-options'), 'DENY');
  assert.equal(protectedPage.headers.get('cache-control'), 'no-store');
  assert.equal((await guest.request('/admin/session')).data.authenticated, true);
  for (let i = 0; i < 501; i++) await client().request('/admin/session');
  assert.equal((await guest.request('/admin/session')).data.authenticated, true, 'Anonymous requests must not evict authenticated sessions');
  const oldSession = guest.cookie;
  assert.equal((await guest.request('/admin/password', { currentPassword: password, newPassword: 'short' })).status, 400);
  assert.equal((await guest.request('/admin/password', { currentPassword: password, newPassword: changed })).status, 200);
  assert.notEqual(guest.cookie, oldSession);
  const stale = await fetch(origin + '/admin/session', { headers: { Cookie: oldSession } });
  assert.equal((await stale.json()).authenticated, false, 'Password change must revoke older sessions');
  await guest.request('/admin/session');
  assert.equal((await guest.request('/admin/logout', {})).status, 200);
  assert((await guest.request('/admin/')).text.includes('data-admin-access="login"'));
  clock += 16 * 60 * 1000;
  await guest.request('/admin/session');
  assert.equal((await guest.request('/admin/login', { username: 'test.admin', password })).status, 401);
  assert.equal((await guest.request('/admin/login', { username: 'test.admin', password: changed })).status, 200);
  clock += 31 * 60 * 1000;
  assert.equal((await guest.request('/admin/session')).data.authenticated, false, 'Idle sessions must expire');
  const attacker = client();
  await attacker.request('/admin/session');
  for (let i = 0; i < 5; i++) assert.equal((await attacker.request('/admin/login', { username: 'test.admin', password: 'wrong' })).status, 401);
  assert.equal((await attacker.request('/admin/login', { username: 'test.admin', password: changed })).status, 429);
  await assert.rejects(createAdminAuth({ credentialFile, origin: 'http://example.com' }), /HTTPS/);
  const secure = await createAdminAuth({ credentialFile, origin: 'https://admin.example.com' });
  const secureHeaders = new Map();
  await secure.handle({ method: 'GET', headers: { host: 'admin.example.com' } }, { setHeader: (k, v) => secureHeaders.set(k, v), writeHead() {}, end() {} }, '/admin/session');
  assert(secureHeaders.get('Set-Cookie').startsWith('__Host-'));
  assert(secureHeaders.get('Set-Cookie').endsWith('; Secure'));
  console.log('Admin checks passed: protected paths, CSRF/origin, password verification/change, session rotation/revocation/expiry, rate limits, private files and secure cookies.');
} finally {
  await new Promise((resolve) => server.close(resolve));
  // Only the test's own two known paths; no recursive cleanup.
  await fs.unlink(credentialFile);
  await fs.rmdir(directory);
}
