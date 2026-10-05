#!/usr/bin/env node
// Static site build — no dependencies. Run from anywhere: node _build/build.mjs
// Reads _build/content (synced from the Flutter app) and writes HTML into the repo root.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

import config from './site.config.mjs';
import { layout } from './templates/layout.mjs';
import { homePage } from './templates/home.mjs';
import { articlePage, knowledgeIndexPage } from './templates/knowledge.mjs';
import { guidePage } from './templates/guide.mjs';
import { toolsPage } from './templates/tools.mjs';
import { manifest, notFoundPage, robots, sitemap } from './templates/misc.mjs';
import { mainContent, noindexAuthPage, refreshLegalPage } from './templates/legal.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(here, rel), 'utf8'));
const buildDate = new Date().toISOString().slice(0, 10);
const written = [];

function write(rel, content) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  written.push(rel);
}

const hashCache = new Map();
function asset(p) {
  if (!hashCache.has(p)) {
    const file = path.join(root, p);
    if (!fs.existsSync(file)) throw new Error(`Missing asset: ${p}`);
    const hash = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
    hashCache.set(p, `${p}?v=${hash}`);
  }
  return hashCache.get(p);
}

// Keeps the brand name on one line everywhere in visible copy.
function brandNbsp(value) {
  if (typeof value === 'string') return value.replace(/Sigara Savar/g, 'Sigara Savar');
  if (typeof value === 'function') return (...args) => brandNbsp(value(...args));
  if (Array.isArray(value)) return value.map(brandNbsp);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, brandNbsp(v)]));
  return value;
}

async function buildLocale(lang) {
  const localeConfig = config.locales[lang];
  const t = brandNbsp((await import(pathToFileURL(path.join(here, 'i18n', `${lang}.mjs`)).href)).default);
  const slugs = readJson('content/slugs.json')[lang];
  if (!slugs) throw new Error(`No slugs for locale ${lang}`);
  const content = {
    knowledge: readJson(`content/${lang}/knowledge.json`),
    health: readJson(`content/${lang}/health.json`),
    breathing: readJson(`content/${lang}/breathing.json`),
    journey: readJson(`content/${lang}/journey.json`),
  };
  const app = readJson(`content/${lang}/app-strings.json`);
  const source = readJson('content/SOURCE.json');

  const sections = content.knowledge
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      ...s,
      articles: s.articles.slice().sort((a, b) => a.order - b.order),
      minutes: s.articles.reduce((n, a) => n + a.estimatedReadMinutes, 0),
    }));
  const allArticles = sections.flatMap((s) => s.articles);
  for (const a of allArticles) {
    if (!slugs.articles[a.id]) throw new Error(`Article ${a.id} has no slug in content/slugs.json`);
  }

  const prefix = localeConfig.prefix ? `/${localeConfig.prefix}` : '';
  const r = localeConfig.routes;
  const url = {
    home: (hash = '') => `${prefix}/${hash}`,
    knowledge: () => `${prefix}/${r.knowledge}/`,
    article: (id) => `${prefix}/${r.knowledge}/${slugs.articles[id]}/`,
    section: (id) => `${prefix}/${r.knowledge}/#${slugs.sections[id]}`,
    guide: (hash = '') => `${prefix}/${r.guide}/${hash}`,
    tools: (hash = '') => `${prefix}/${r.tools}/${hash}`,
    page: (file) => `/${file}`,
    abs: (p) => `${config.baseUrl}${p}`,
  };

  const ctx = {
    config: { ...config, contentPublished: config.contentPublished || buildDate },
    t,
    lang,
    localeConfig,
    content,
    app,
    source,
    sections,
    allArticles,
    url,
    buildDate,
    asset,
    articleById: (id) => allArticles.find((a) => a.id === id),
    sectionById: (id) => sections.find((s) => s.id === id),
    sectionSlug: (id) => slugs.sections[id],
    articleSlug: (id) => slugs.articles[id],
    ogFor: (p) => (fs.existsSync(path.join(root, p)) ? p : '/assets/og/default.png'),
  };

  const out = (rel) => (localeConfig.prefix ? `${localeConfig.prefix}/${rel}` : rel);
  const pages = [];
  const emit = (rel, page) => {
    write(out(rel), layout(ctx, page));
    if (!page.noindex) pages.push({ path: page.path, lastmod: buildDate });
  };

  emit('index.html', homePage(ctx));
  emit(`${r.knowledge}/index.html`, knowledgeIndexPage(ctx));
  for (const a of allArticles) emit(`${r.knowledge}/${slugs.articles[a.id]}/index.html`, articlePage(ctx, a));
  emit(`${r.guide}/index.html`, guidePage(ctx));
  emit(`${r.tools}/index.html`, toolsPage(ctx));

  // Warn about article folders that no longer map to a slug (renamed/removed content).
  const kcDir = path.join(root, out(r.knowledge));
  const known = new Set(Object.values(slugs.articles));
  for (const entry of fs.readdirSync(kcDir, { withFileTypes: true })) {
    if (entry.isDirectory() && !known.has(entry.name)) console.warn(`! Stale article folder: ${out(r.knowledge)}/${entry.name}`);
  }

  return { ctx, pages };
}

async function main() {
  const enabled = Object.entries(config.locales).filter(([, l]) => l.enabled).map(([k]) => k);
  const results = [];
  for (const lang of enabled) results.push(await buildLocale(lang));
  const primary = results.find((x) => x.ctx.lang === config.defaultLocale) || results[0];
  const { ctx } = primary;

  // Site-wide files.
  write('404.html', layout(ctx, notFoundPage(ctx)));
  write('site.webmanifest', manifest(ctx));
  write('robots.txt', robots(ctx));

  // Legal pages: chrome refreshed, legal text verified unchanged.
  for (const file of config.legalPages) {
    const full = path.join(root, file);
    const before = fs.readFileSync(full, 'utf8');
    const after = refreshLegalPage(ctx, file, before);
    if (mainContent(before) !== mainContent(after)) throw new Error(`Legal text changed in ${file}; aborting.`);
    if (after !== before) write(file, after);
  }
  for (const file of config.authPages) {
    const full = path.join(root, file);
    const before = fs.readFileSync(full, 'utf8');
    const after = noindexAuthPage(before);
    if (after !== before) write(file, after);
  }

  const legalEntries = config.legalPages.map((f) => ({ path: `/${f}`, lastmod: buildDate }));
  write('sitemap.xml', sitemap(ctx, [...results.flatMap((x) => x.pages), ...legalEntries]));

  console.log(`Built ${written.length} files (${enabled.join(', ')}), AUTH_UI_ENABLED=${config.AUTH_UI_ENABLED}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
