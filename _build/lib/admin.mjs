// Public content only. The local editor never reads credentials, users or Firebase.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { galleryCopy } from '../i18n/gallery.mjs';

const LANGUAGE_NAMES = { tr: 'Türkçe', en: 'English', de: 'Deutsch', es: 'Español', fr: 'Français' };
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const text = (value) => value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

export function adminInventory(root, config) {
  const contentRoot = path.join(root, '_build/content');
  const slugs = readJson(path.join(contentRoot, 'slugs.json'));
  const source = readJson(path.join(contentRoot, 'SOURCE.json'));
  const history = readJson(path.join(contentRoot, 'publication-history.json'));
  const articles = [];
  const locales = [];
  for (const [locale, localeConfig] of Object.entries(config.locales).filter(([, item]) => item.enabled)) {
    const sections = readJson(path.join(contentRoot, locale, 'knowledge.json'));
    const prefix = localeConfig.prefix ? `/${localeConfig.prefix}` : '';
    let count = 0;
    for (const section of sections) {
      for (const article of section.articles) {
        const route = `${prefix}/${localeConfig.routes.knowledge}/${slugs[locale].articles[article.id]}/`;
        const file = path.join(root, route, 'index.html');
        const html = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
        const seoTitle = text((/<title>([\s\S]*?)<\/title>/i.exec(html) || [])[1] || article.title);
        const seoDescription = text((/<meta name="description" content="([^"]*)"/i.exec(html) || [])[1] || article.summary);
        const checks = {
          page: Boolean(html),
          title: Boolean(seoTitle && html.includes('<title>')),
          description: Boolean(seoDescription && /<meta name="description"/.test(html)),
          canonical: html.includes(`rel="canonical" href="${config.baseUrl}${route}"`),
          languages: (html.match(/<link rel="alternate" hreflang=/g) || []).length === 6,
          article: /"@type":"Article"/.test(html),
          heading: (html.match(/<h1\b/g) || []).length === 1,
        };
        articles.push({
          ...article, locale, sectionTitle: section.title, sectionOrder: section.order,
          route, seoTitle, seoDescription, checks,
          published: history.articles?.[locale]?.[article.id]?.published || null,
          modified: history.articles?.[locale]?.[article.id]?.modified || null,
          sourceHash: crypto.createHash('sha256').update(JSON.stringify(article)).digest('hex').slice(0, 16),
        });
        count += 1;
      }
    }
    locales.push({ code: locale, name: LANGUAGE_NAMES[locale], count });
  }
  const media = [];
  const galleryFile = path.join(contentRoot, 'gallery.json');
  const galleryManifest = fs.existsSync(galleryFile) ? readJson(galleryFile) : [];
  const gallery = galleryManifest.map((item, index) => ({
    id: item.id, position: index + 1, width: item.width, height: item.height,
    sourceHash: item.originalSha256,
    path: item.variants.find((variant) => variant.path.endsWith('-360.webp'))?.path || item.variants[0]?.path,
    alts: Object.fromEntries(locales.map((locale) => [locale.code, galleryCopy(locale.code).alts[index]])),
  }));
  const dimensions = new Map(galleryManifest.flatMap((item) => item.variants.map((variant) => [variant.path, { width: variant.width, height: variant.height }])));
  const mediaGroups = { gallery: 'Mağaza görselleri', screens: 'Uygulama ekranları', brand: 'Marka', og: 'Sosyal paylaşım' };
  for (const [directory, group] of Object.entries(mediaGroups)) {
    const full = path.join(root, 'assets', directory);
    if (!fs.existsSync(full)) continue;
    for (const file of fs.readdirSync(full).sort()) {
      if (!/\.(avif|webp|png|jpe?g|svg)$/i.test(file)) continue;
      const assetPath = `/assets/${directory}/${file}`;
      media.push({ name: file, path: assetPath, group, bytes: fs.statSync(path.join(full, file)).size, format: path.extname(file).slice(1).toUpperCase(), ...(dimensions.get(assetPath) || {}) });
    }
  }
  return { version: 1, generatedAt: new Date().toISOString(), locales, articles, media, gallery, source: { project: source.project, syncedAt: source.syncedAt, localeSyncedAt: source.localeSyncedAt || {} } };
}
