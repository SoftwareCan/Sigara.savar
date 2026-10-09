#!/usr/bin/env node
// Checks the built public site as a linked document collection, without a browser.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import config from './site.config.mjs';
import { searchKey } from './lib/util.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const base = new URL(config.baseUrl);
const errors = [];
const notes = [];
let references = 0;
let contentChecks = 0;
const fail = (file, message) => errors.push(`${file}: ${message}`);
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(read(file));
const slash = (value) => value.split(path.sep).join('/');
const decode = (value) => String(value).replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (match, code) => {
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  if (!code.startsWith('#')) return entities[code.toLowerCase()] || match;
  const point = parseInt(code.slice(code[1].toLowerCase() === 'x' ? 2 : 1), code[1].toLowerCase() === 'x' ? 16 : 10);
  return point >= 0 && point <= 0x10ffff ? String.fromCodePoint(point) : match;
});
const attrs = (source) => Object.fromEntries([...source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)]
  .map(([, key, double, single, bare]) => [key.toLowerCase(), decode(double ?? single ?? bare ?? '')]));
const visible = (source) => decode(source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' '))
  .replace(/\s*->\s*/g, ' → ').replace(/\s+/g, ' ').trim();
const main = (source) => (/<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(source) || [])[1] || '';
const hasType = (node, type) => [node['@type']].flat().includes(type);
const pageRoute = (file) => file === 'index.html' ? '/' : file.endsWith('/index.html') ? `/${file.slice(0, -10)}` : `/${file}`;

function filesIn(directory = '') {
  return fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === '_build' || entry.isSymbolicLink()) return [];
    const relative = slash(path.join(directory, entry.name));
    return entry.isDirectory() ? filesIn(relative) : entry.name.endsWith('.html') ? [relative] : [];
  });
}

const pages = new Map();
for (const file of filesIn()) {
  if (config.authPages.includes(file)) continue;
  const source = read(file);
  // Search Console ownership files are protocol tokens, not content pages.
  if (/^google-site-verification:\s*\S+\s*$/.test(source)) continue;
  const tags = [...source.matchAll(/<(?![!/?])([a-z][\w:-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi)]
    .map((match) => ({ name: match[1].toLowerCase(), attrs: attrs(match[2]) }));
  const ids = new Set();
  for (const tag of tags) {
    if (!('id' in tag.attrs)) continue;
    if (ids.has(tag.attrs.id)) fail(file, `duplicate id ${tag.attrs.id}`);
    ids.add(tag.attrs.id);
  }
  const meta = Object.fromEntries(tags.filter((tag) => tag.name === 'meta').map((tag) => [tag.attrs.name || tag.attrs.property, tag.attrs.content]));
  const canonical = tags.find((tag) => tag.name === 'link' && tag.attrs.rel === 'canonical')?.attrs.href;
  const schemas = [];
  for (const [, attrSource, body] of source.matchAll(/<script\b([^>]*?)>([\s\S]*?)<\/script>/gi)) {
    if (attrs(attrSource).type !== 'application/ld+json') continue;
    try {
      const parsed = JSON.parse(body);
      for (const node of [parsed].flat()) schemas.push(...(node['@graph'] || [node]));
    } catch { fail(file, 'invalid JSON-LD'); }
  }
  pages.set(file, { source, tags, ids, meta, canonical, schemas, route: pageRoute(file) });
}

function localTarget(href, from) {
  let url;
  try { url = new URL(href, new URL(pages.get(from).route, base)); }
  catch { fail(from, `invalid URL ${href}`); return null; }
  if (url.origin !== base.origin) return null;
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { fail(from, `invalid encoded URL ${href}`); return null; }
  const segments = pathname.replace(/\\/g, '/').split('/').filter(Boolean);
  if (segments.some((part) => part.startsWith('.') || part === '_build')) {
    fail(from, `non-public path ${href}`);
    return null;
  }
  let file = path.resolve(root, `.${pathname}`);
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    fail(from, `path leaves site root ${href}`);
    return null;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  references += 1;
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    fail(from, `missing internal target ${href}`);
    return null;
  }
  return { file: slash(path.relative(root, file)), url };
}

const titles = new Map();
for (const [file, page] of pages) {
  const { source, tags, ids, meta, canonical, schemas, route } = page;
  const title = decode((/<title>([\s\S]*?)<\/title>/i.exec(source) || [])[1] || '').trim();
  if (!title) fail(file, 'missing title');
  else if (titles.has(title)) fail(file, `duplicate title also used in ${titles.get(title)}`);
  else titles.set(title, file);
  if (!meta.description?.trim()) fail(file, 'missing meta description');
  if (canonical !== new URL(route, base).href) fail(file, `canonical does not match route ${route}`);
  if (tags.filter((tag) => tag.name === 'h1').length !== 1) fail(file, 'expected exactly one h1');
  if (!ids.has('icerik')) fail(file, 'missing main skip-link target');
  for (const field of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    if (!meta[field]) fail(file, `missing ${field} metadata`);
  }
  if (meta['og:url'] !== canonical) fail(file, 'Open Graph URL differs from canonical');
  if (/aggregateRating|ratingValue/i.test(source) || /(?:five[-_ ]stars?|5\s*yıldız|beş\s*yıldız|★★★★★|class=["'][^"']*store[-_]rating)/i.test(source)) {
    fail(file, 'unverified store-rating claim found');
  }
  if (!config.AUTH_UI_ENABLED && (tags.some((tag) => 'data-auth-slot' in tag.attrs) || tags.some((tag) => tag.name === 'script' && /(?:header-auth|auth|firebase)\.js/i.test(tag.attrs.src || '')))) {
    fail(file, 'paused authentication UI/script exposed');
  }
  for (const tag of tags) {
    const targetAttrs = [];
    if (tag.attrs.src) targetAttrs.push(tag.attrs.src);
    if (['a', 'link'].includes(tag.name) && tag.attrs.href) targetAttrs.push(tag.attrs.href);
    if (tag.name === 'form' && tag.attrs.action) targetAttrs.push(tag.attrs.action);
    if (tag.attrs.srcset) targetAttrs.push(...tag.attrs.srcset.split(',').map((item) => item.trim().split(/\s+/)[0]));
    for (const href of targetAttrs) {
      const target = localTarget(href, file);
      if (!target) continue;
      if (!config.AUTH_UI_ENABLED && config.authPages.some((auth) => auth.toLowerCase() === target.file.toLowerCase())) fail(file, `paused authentication link ${href}`);
      if (target.url.hash && tag.name === 'a') {
        let fragment;
        try { fragment = decodeURIComponent(target.url.hash.slice(1)); }
        catch { fail(file, `invalid fragment ${href}`); continue; }
        if (pages.has(target.file) && !pages.get(target.file).ids.has(fragment)) fail(file, `missing fragment ${href}`);
      }
    }
    if (tag.name === 'img') {
      if (!('alt' in tag.attrs)) fail(file, 'image missing alt attribute');
      if (!tag.attrs.width || !tag.attrs.height) fail(file, `image missing dimensions ${tag.attrs.src}`);
    }
    for (const attribute of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
      for (const id of (tag.attrs[attribute] || '').split(/\s+/).filter(Boolean)) if (!ids.has(id)) fail(file, `${attribute} references missing id ${id}`);
    }
  }
  localTarget(meta['og:image'] || '', file);
  for (const schema of schemas.filter((node) => hasType(node, 'Article'))) {
    if (schema.url !== canonical || schema.mainEntityOfPage !== canonical) fail(file, 'Article URLs do not match canonical');
    if (!schema.headline || !schema.description || !schema.image?.length || !schema.author || !schema.publisher) fail(file, 'incomplete Article structured data');
    for (const field of ['datePublished', 'dateModified']) if (!/^\d{4}-\d{2}-\d{2}$/.test(schema[field] || '') || Number.isNaN(Date.parse(schema[field]))) fail(file, `invalid Article.${field}`);
    if (schema.dateModified < schema.datePublished) fail(file, 'Article modification date precedes publication');
    if (!schemas.some((node) => hasType(node, 'BreadcrumbList'))) fail(file, 'Article missing BreadcrumbList');
  }
}

const slugs = readJson('_build/content/slugs.json');
for (const [locale, localeConfig] of Object.entries(config.locales).filter(([, entry]) => entry.enabled)) {
  const sections = readJson(`_build/content/${locale}/knowledge.json`);
  const prefix = localeConfig.prefix ? `${localeConfig.prefix}/` : '';
  const knowledgeDir = `${prefix}${localeConfig.routes.knowledge}`;
  const index = pages.get(`${knowledgeDir}/index.html`);
  for (const section of sections) {
    for (const article of section.articles) {
      const slug = slugs[locale]?.articles[article.id];
      const file = `${knowledgeDir}/${slug}/index.html`;
      const page = pages.get(file);
      if (!slug || slug === article.id) fail(file, 'missing readable article slug');
      if (!page) { fail(file, 'source article has no generated page'); continue; }
      if (!index?.source.includes(`/${knowledgeDir}/${slug}/`)) fail(file, 'article not reachable from Knowledge Center index');
      if (!page.schemas.some((node) => hasType(node, 'Article'))) fail(file, 'article missing Article structured data');
      const articleBody = visible((/<div class="prose">([\s\S]*?)<\/div>/.exec(page.source) || [])[1] || main(page.source));
      const expected = [article.intro, ...article.contentSections.flatMap((content) => [content.title, content.body, ...content.items]), ...article.keyTakeaways].filter(Boolean);
      for (const text of expected) {
        contentChecks += 1;
        if (!articleBody.includes(visible(text))) fail(file, `source content missing: ${text.slice(0, 72)}…`);
      }
      const schema = page.schemas.find((node) => hasType(node, 'Article'));
      if (schema?.timeRequired !== `PT${article.estimatedReadMinutes}M`) fail(file, 'reading time differs from app content');
    }
  }
}

// Equivalent language routes must keep the reader on the same content, not
// silently send article readers back to a translated home page.
const enabledLanguages = Object.entries(config.locales).filter(([, item]) => item.enabled);
const localeRoute = (language, kind, id) => {
  const settings = config.locales[language];
  const prefix = settings.prefix ? `/${settings.prefix}` : '';
  if (kind === 'home') return `${prefix}/`;
  const route = settings.routes[kind === 'article' ? 'knowledge' : kind];
  return `${prefix}/${route}/${kind === 'article' ? `${slugs[language].articles[id]}/` : ''}`;
};
const byRoute = new Map([...pages].map(([file, page]) => [page.route, { file, ...page }]));
let languageChecks = 0;
for (const [language] of enabledLanguages) {
  const identities = ['home', 'knowledge', 'guide', 'tools', 'download'].map(kind => [kind]);
  identities.push(...Object.keys(slugs[language].articles).map(id => ['article', id]));
  for (const [kind, id] of identities) {
    const page = byRoute.get(localeRoute(language, kind, id));
    if (!page) continue; // Missing pages are also caught by the source checks.
    const htmlLanguage = page.tags.find(tag => tag.name === 'html')?.attrs.lang;
    if (htmlLanguage !== language) fail(page.file, `incorrect document language ${htmlLanguage}`);
    const alternates = page.tags.filter(tag => tag.name === 'link' && tag.attrs.rel === 'alternate' && tag.attrs.hreflang);
    if (alternates.length !== enabledLanguages.length + 1) fail(page.file, 'missing language alternates');
    for (const [target] of enabledLanguages) {
      const expected = localeRoute(target, kind, id);
      const alternate = alternates.find(tag => tag.attrs.hreflang === target);
      if (alternate?.attrs.href !== config.baseUrl + expected) fail(page.file, `incorrect ${target} alternate`);
      const selectorLinks = page.tags.filter(tag => tag.name === 'a' && tag.attrs['data-site-language'] === target);
      if (selectorLinks.length !== 2 || selectorLinks.some(tag => tag.attrs.href !== expected)) fail(page.file, `${target} picker loses current content`);
      languageChecks++;
    }
    if (alternates.find(tag => tag.attrs.hreflang === 'x-default')?.attrs.href !== config.baseUrl + localeRoute(config.defaultLocale, kind, id)) fail(page.file, 'incorrect default language');
    if (/\bundefined\b|\[object Object\]/.test(visible(main(page.source)))) fail(page.file, 'unresolved interface copy');
  }
}
for (const [query, expected] of [['İSTEK', 'istek'], ['PRÉPARATION', 'preparation'], ['NICOTÍNICA', 'nicotinica'], ['Größere', 'grossere']]) {
  if (searchKey(query) !== expected) fail('search index', `accent-insensitive lookup failed for ${query}`);
}

const sitemap = read('sitemap.xml');
const sitemapPaths = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decode(url)));
for (const [file, page] of pages) {
  const indexed = !/noindex/i.test(page.meta.robots || '');
  if (indexed && !sitemapPaths.has(page.canonical)) fail(file, 'indexable page missing from sitemap');
  if (!indexed && sitemapPaths.has(page.canonical)) fail(file, 'noindex page included in sitemap');
}
for (const absolute of sitemapPaths) {
  const target = localTarget(absolute, 'index.html');
  if (target && config.authPages.includes(target.file)) fail('sitemap.xml', `paused authentication URL ${absolute}`);
}
if (!read('robots.txt').includes(`Sitemap: ${config.baseUrl}/sitemap.xml`)) fail('robots.txt', 'missing canonical sitemap location');
for (const file of config.authPages) if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(read(file))) fail(file, 'paused auth page missing noindex');
for (const file of config.legalPages) {
  try {
    const original = execFileSync('git', ['show', `HEAD:${file}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 8 * 1024 * 1024 });
    const fingerprint = (source) => crypto.createHash('sha256').update(main(source).replace(/\r\n/g, '\n')).digest('hex');
    if (!main(original) || fingerprint(original) !== fingerprint(read(file))) fail(file, 'legal main content differs from Git HEAD');
  } catch { notes.push(`${file}: Git HEAD comparison unavailable; build still enforces legal-main preservation.`); }
}
const manifest = readJson('site.webmanifest');
for (const icon of manifest.icons || []) localTarget(icon.src, 'index.html');
if (!manifest.icons?.some((icon) => icon.sizes === '192x192') || !manifest.icons?.some((icon) => icon.sizes === '512x512')) fail('site.webmanifest', 'missing application icon sizes');

for (const note of notes) console.warn(`Note: ${note}`);
if (errors.length) {
  console.error(`Static QA failed (${errors.length} findings):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Static QA passed: ${pages.size} public pages, ${references} local references, ${contentChecks} source-content checks, ${languageChecks} language-route checks; metadata, article dates, sitemap, auth exclusion and legal preservation verified.`);
}
