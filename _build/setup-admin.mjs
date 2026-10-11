#!/usr/bin/env node
// Generates a unique local password; never prints it or ships it in site files.
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { passwordRecord } from './lib/admin-auth.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, '.local');
const file = path.join(directory, 'admin-credentials.json');
await fs.mkdir(directory, { recursive: true, mode: 0o700 });
try { await fs.access(file); console.log('Admin account already exists. Use the authenticated password-change page.'); }
catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const username = 'sigarasavar.admin';
  const password = randomBytes(24).toString('base64url');
  const record = await passwordRecord(username, password);
  await fs.writeFile(file, JSON.stringify(record) + '\n', { flag: 'wx', mode: 0o600 });
  try {
    await fs.writeFile(path.join(directory, 'admin-access.txt'), `Sigara Savar — yerel yönetici girişi\n\nAdres: http://127.0.0.1:4174/admin/\nKullanıcı adı: ${username}\nİlk şifre: ${password}\n\nBu dosya Git dışında tutulur ve web sunucusunda yayınlanmaz.\nİlk girişten sonra Hesap güvenliği bölümünden şifreni değiştirebilirsin.\nŞifre değişince bu ilk şifre geçersiz olur. Canlı site hesabı kurulmuş değildir.\n`, { flag: 'wx', mode: 0o600 });
  } catch (handoffError) {
    await fs.unlink(file); // Roll back only the new record created above, not an existing account.
    throw handoffError;
  }
  console.log('Admin account created. Private handoff: .local/admin-access.txt');
}
