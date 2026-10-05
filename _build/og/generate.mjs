#!/usr/bin/env node
// Renders 1200x630 Open Graph images into assets/og/ with a local Chrome.
// Optional step (needs playwright-core):  cd _build && npm install && node og/generate.mjs
// Use --only default to refresh only the homepage image after a copy change.
// Then run node _build/build.mjs so pages reference the new images.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const build = path.resolve(here, '..');
const root = path.resolve(build, '..');
const out = path.join(root, 'assets/og');
fs.mkdirSync(out, { recursive: true });

const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => fs.existsSync(p));

const read = (rel) => fs.readFileSync(path.join(root, rel));
const dataUri = (rel, type) => `data:${type};base64,${read(rel).toString('base64')}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const t = (await import(pathToFileURL(path.join(build, 'i18n/tr.mjs')).href)).default;
const slugs = JSON.parse(fs.readFileSync(path.join(build, 'content/slugs.json'), 'utf8')).tr;
const sections = JSON.parse(fs.readFileSync(path.join(build, 'content/tr/knowledge.json'), 'utf8'));

const fonts = `
@font-face { font-family: N; src: url(${dataUri('assets/fonts/newsreader.woff2', 'font/woff2')}) format("woff2"); font-weight: 400 600; }
@font-face { font-family: S; src: url(${dataUri('assets/fonts/source-sans-3.woff2', 'font/woff2')}) format("woff2"); font-weight: 400 700; }`;
const mark = dataUri('assets/brand/mark-white.webp', 'image/webp');
const icon = dataUri('assets/brand/icon-192.png', 'image/png');

function template({ label, title, size }) {
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><style>${fonts}
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #fcfbf8; color: #102320; font-family: S; display: grid; grid-template-columns: 1fr 380px; overflow: hidden; }
  .text { display: flex; flex-direction: column; padding: 64px 56px 52px 72px; }
  .label { font: 600 26px/1.2 S; color: #18704f; }
  h1 { margin-top: 22px; font: 500 ${size}px/1.06 N; letter-spacing: -0.015em; text-wrap: balance; font-variant-ligatures: no-common-ligatures; }
  .brand { margin-top: auto; display: flex; align-items: center; gap: 16px; font: 600 30px/1 N; }
  .brand img { width: 52px; height: 52px; }
  .brand span { font: 500 22px/1 S; color: #4a5652; margin-left: 8px; }
  .panel { background: #43c682; border-radius: 40px 0 0 40px; display: grid; place-items: center; }
  .panel img { width: 300px; height: auto; }
  </style></head><body>
  <div class="text"><p class="label">${esc(label)}</p><h1>${esc(title)}</h1>
  <div class="brand"><img src="${icon}" alt="">Sigara Savar<span>sigarasavar.com</span></div></div>
  <div class="panel"><img src="${mark}" alt=""></div></body></html>`;
}

const sizeFor = (title) => (title.length > 70 ? 58 : title.length > 44 ? 66 : 76);
const jobs = [
  { file: 'default.png', label: 'Sigara Savar', title: t.home.hero.title },
  { file: 'bilgi-merkezi.png', label: 'Sigara Savar', title: t.knowledge.title },
  { file: 'birakma-rehberi.png', label: 'Sigara Savar', title: t.guide.metaTitle },
  { file: 'araclar.png', label: t.tools.title, title: t.tools.metaTitle },
];
for (const s of sections) {
  for (const a of s.articles) {
    const title = /^bölüm özeti$/i.test(a.title.trim()) ? `${s.title}: ${a.title}` : a.title;
    jobs.push({ file: `${slugs.articles[a.id]}.png`, label: `${t.knowledge.title}, ${t.common.sectionLabel(s.order)}`, title });
  }
}

const onlyIndex = process.argv.indexOf('--only');
const requested = onlyIndex >= 0 ? process.argv[onlyIndex + 1] : null;
if (onlyIndex >= 0 && !requested) throw new Error('--only requires an image name, e.g. default');
const selectedJobs = requested ? jobs.filter((job) => job.file === `${requested.replace(/\.png$/, '')}.png`) : jobs;
if (!selectedJobs.length) throw new Error(`Unknown Open Graph image: ${requested}`);

// Export a temporary local preview for the Codex browser workflow. No browser
// automation is launched in this mode; capture the page at 1200×630, then remove it.
if (process.argv.includes('--prepare')) {
  for (const job of selectedJobs) {
    fs.writeFileSync(path.join(out, `preview-${job.file.replace(/\.png$/, '')}.html`), template({ ...job, size: sizeFor(job.title) }));
  }
  console.log(`Prepared ${selectedJobs.length} local Open Graph previews in assets/og/`);
  process.exit(0);
}

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const job of selectedJobs) {
  await page.setContent(template({ ...job, size: sizeFor(job.title) }), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, job.file), type: 'png' });
}
await browser.close();
console.log(`Generated ${selectedJobs.length} images in assets/og/`);
