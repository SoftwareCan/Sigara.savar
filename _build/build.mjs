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
import { downloadPage } from './templates/download.mjs';
import { manifest, notFoundPage, robots, sitemap } from './templates/misc.mjs';
import { mainContent, noindexAuthPage, refreshLegalPage } from './templates/legal.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(here, rel), 'utf8'));
const buildDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(new Date());
const written = [];
const historyFile = 'content/publication-history.json';
const history = fs.existsSync(path.join(here, historyFile))
  ? readJson(historyFile)
  : { version: 1, articles: {}, pages: {} };

// Rebuilding does not make unchanged content new. Keep an auditable content
// fingerprint for each article and an independent substantive-page fingerprint
// for sitemap dates. Asset cache hashes and shared site chrome do not count.
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const priorSitemapFile = path.join(root, 'sitemap.xml');
const priorSitemap = fs.existsSync(priorSitemapFile) ? fs.readFileSync(priorSitemapFile, 'utf8') : '';
const priorDates = new Map([...priorSitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
  .map(([, loc, date]) => [loc.replace(config.baseUrl, ''), date]));

function substantivePage(source, legal = false) {
  const main = mainContent(source) || '';
  const title = legal ? '' : (/<title>([\s\S]*?)<\/title>/.exec(source) || [])[1] || '';
  const description = legal ? '' : (/<meta name="description"\s+content="([^"]*)"/.exec(source) || [])[1] || '';
  return hash(`${title}\n${description}\n${main}`
    .replace(/<!--[^]*?-->/g, '')
    .replace(/\?v=[a-f0-9]+/g, '')
    .replace(/\s+/g, ' ')
    .trim());
}

function pageLastModified(pagePath, rel, generated, legal = false) {
  const file = path.join(root, rel);
  const previous = history.pages[pagePath];
  const before = previous?.hash || (fs.existsSync(file) ? substantivePage(fs.readFileSync(file, 'utf8'), legal) : null);
  const after = substantivePage(generated, legal);
  const lastmod = before === after
    ? previous?.lastmod || priorDates.get(pagePath) || config.contentPublished || buildDate
    : buildDate;
  history.pages[pagePath] = { hash: after, lastmod };
  return lastmod;
}

function articleDates(lang, sections) {
  const initial = !history.articles[lang];
  const previous = history.articles[lang] || {};
  const entries = {};
  for (const section of sections) {
    for (const article of section.articles) {
      const fingerprint = hash(JSON.stringify({
        title: article.title,
        summary: article.summary,
        estimatedReadMinutes: article.estimatedReadMinutes,
        intro: article.intro,
        contentSections: article.contentSections,
        keyTakeaways: article.keyTakeaways,
        section: section.title,
      }));
      const prev = previous[article.id];
      const published = prev?.published || (initial && lang === config.defaultLocale ? config.contentPublished || buildDate : buildDate);
      const modified = prev?.hash === fingerprint ? prev.modified : prev ? buildDate : published;
      entries[article.id] = { hash: fingerprint, published, modified };
    }
  }
  history.articles[lang] = entries;
  return entries;
}

function write(rel, content) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return;
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

const allSlugs = readJson('content/slugs.json');
const enabledLocales = Object.entries(config.locales).filter(([, locale]) => locale.enabled).map(([lang]) => lang);

function localeUrls(lang) {
  const locale = config.locales[lang];
  const prefix = locale.prefix ? `/${locale.prefix}` : '';
  const routes = locale.routes;
  const slugs = allSlugs[lang];
  return {
    home: (hash = '') => `${prefix}/${hash}`,
    knowledge: () => `${prefix}/${routes.knowledge}/`,
    article: (id) => `${prefix}/${routes.knowledge}/${slugs.articles[id]}/`,
    section: (id) => `${prefix}/${routes.knowledge}/#${slugs.sections[id]}`,
    guide: (hash = '') => `${prefix}/${routes.guide}/${hash}`,
    tools: (hash = '') => `${prefix}/${routes.tools}/${hash}`,
    download: () => `${prefix}/${routes.download}/`,
    page: (file) => `/${file}`,
    abs: (p) => `${config.baseUrl}${p}`,
  };
}

// Equivalent pages share a stable content ID even when their readable URLs differ.
// Legal documents retain their existing translations and therefore have no duplicate
// localized routes or hreflang claims here.
function languageLinks(lang, pagePath) {
  const current = localeUrls(lang);
  let route;
  let articleId;
  for (const key of ['home', 'knowledge', 'guide', 'tools', 'download']) {
    if (pagePath === current[key]()) { route = key; break; }
  }
  if (!route) {
    articleId = Object.keys(allSlugs[lang].articles).find((id) => pagePath === current.article(id));
    if (articleId) route = 'article';
  }
  if (!route) return [];
  return enabledLocales.map((locale) => ({
    lang: locale,
    path: route === 'article' ? localeUrls(locale).article(articleId) : localeUrls(locale)[route](),
    ogLocale: config.locales[locale].ogLocale,
  }));
}

async function buildLocale(lang) {
  const localeConfig = config.locales[lang];
  const t = brandNbsp((await import(pathToFileURL(path.join(here, 'i18n', `${lang}.mjs`)).href)).default);
  const slugs = allSlugs[lang];
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
  const dates = articleDates(lang, sections);
  for (const a of allArticles) {
    if (!slugs.articles[a.id]) throw new Error(`Article ${a.id} has no slug in content/slugs.json`);
  }

  const r = localeConfig.routes;
  const url = localeUrls(lang);

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
    languageLinks: (pagePath) => languageLinks(lang, pagePath),
    languageHomes: () => enabledLocales.map((locale) => ({ lang: locale, path: localeUrls(locale).home() })),
    buildDate,
    asset,
    articleById: (id) => allArticles.find((a) => a.id === id),
    sectionById: (id) => sections.find((s) => s.id === id),
    sectionSlug: (id) => slugs.sections[id],
    articleSlug: (id) => slugs.articles[id],
    articlePublishedAt: (id) => dates[id].published,
    articleModifiedAt: (id) => dates[id].modified,
    ogFor: (p) => (fs.existsSync(path.join(root, p)) ? p : '/assets/og/default.png'),
  };

  const out = (rel) => (localeConfig.prefix ? `${localeConfig.prefix}/${rel}` : rel);
  const pages = [];
  const emit = (rel, page) => {
    const generated = layout(ctx, page).replace(/^[\t ]+$/gm, '');
    if (!page.noindex) pages.push({ path: page.path, lastmod: pageLastModified(page.path, out(rel), generated) });
    write(out(rel), generated);
  };

  emit('index.html', homePage(ctx));
  emit(`${r.knowledge}/index.html`, knowledgeIndexPage(ctx));
  for (const a of allArticles) emit(`${r.knowledge}/${slugs.articles[a.id]}/index.html`, articlePage(ctx, a));
  emit(`${r.guide}/index.html`, guidePage(ctx));
  emit(`${r.tools}/index.html`, toolsPage(ctx));
  emit(`${r.download}/index.html`, downloadPage(ctx));

  // Warn about article folders that no longer map to a slug (renamed/removed content).
  const kcDir = path.join(root, out(r.knowledge));
  const known = new Set(Object.values(slugs.articles));
  for (const entry of fs.readdirSync(kcDir, { withFileTypes: true })) {
    if (entry.isDirectory() && !known.has(entry.name)) console.warn(`! Stale article folder: ${out(r.knowledge)}/${entry.name}`);
  }

  return { ctx, pages };
}

async function main() {
  const enabled = enabledLocales;
  const results = [];
  for (const lang of enabled) results.push(await buildLocale(lang));
  const primary = results.find((x) => x.ctx.lang === config.defaultLocale) || results[0];
  const { ctx } = primary;

  // Site-wide files.
  write('404.html', layout(ctx, notFoundPage(ctx)));
  write('site.webmanifest', manifest(ctx));
  write('robots.txt', robots(ctx));

  // Legal pages: chrome refreshed, legal text verified unchanged.
  const legalEntries = [];
  for (const file of config.legalPages) {
    const full = path.join(root, file);
    const before = fs.readFileSync(full, 'utf8');
    const after = refreshLegalPage(ctx, file, before);
    if (mainContent(before) !== mainContent(after)) throw new Error(`Legal text changed in ${file}; aborting.`);
    legalEntries.push({ path: `/${file}`, lastmod: pageLastModified(`/${file}`, file, after, true) });
    if (after !== before) write(file, after);
  }
  for (const file of config.authPages) {
    const full = path.join(root, file);
    const before = fs.readFileSync(full, 'utf8');
    const after = noindexAuthPage(before);
    if (after !== before) write(file, after);
  }

  write('sitemap.xml', sitemap(ctx, [...results.flatMap((x) => x.pages), ...legalEntries]));
  write(`_build/${historyFile}`, JSON.stringify(history, null, 2) + '\n');

  console.log(`Built ${written.length} files (${enabled.join(', ')}), AUTH_UI_ENABLED=${config.AUTH_UI_ENABLED}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
