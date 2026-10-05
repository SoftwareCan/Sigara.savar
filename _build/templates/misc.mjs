import { html } from '../lib/html.mjs';

export function notFoundPage(ctx) {
  const { t, url } = ctx;
  const main = html`<div class="wrap not-found">
  <h1>${t.notFound.title}</h1>
  <p class="lead">${t.notFound.lead}</p>
  <h2 class="visually-hidden">${t.notFound.links}</h2>
  <ul>
    <li><a href="${url.home()}">${t.nav.home}</a></li>
    <li><a href="${url.knowledge()}">${t.nav.knowledge}</a></li>
    <li><a href="${url.guide()}">${t.nav.guide}</a></li>
    <li><a href="${url.tools()}">${t.nav.tools}</a></li>
    <li><a href="${url.tools('#kriz-bekcisi')}">${t.nav.crisisShortcut}</a></li>
  </ul>
</div>`;
  return {
    path: '/404.html',
    title: `${t.notFound.title} | ${t.meta.titleSuffix}`,
    description: t.meta.siteDescription,
    noindex: true,
    current: null,
    bodyClass: 'not-found-page',
    main,
  };
}

export function manifest(ctx) {
  const { config, t } = ctx;
  return JSON.stringify({
    name: config.siteName,
    short_name: config.siteName,
    description: t.meta.siteDescription,
    lang: ctx.localeConfig.htmlLang,
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: '#fcfbf8',
    theme_color: '#fcfbf8',
    icons: [
      { src: '/assets/brand/app-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/brand/app-icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/assets/brand/app-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }, null, 2) + '\n';
}

export function sitemap(ctx, entries) {
  const xml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
  const urls = entries.map((e) => `  <url>\n    <loc>${xml(ctx.url.abs(e.path))}</loc>\n    <lastmod>${xml(e.lastmod)}</lastmod>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

export function robots(ctx) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${ctx.url.abs('/sitemap.xml')}\n`;
}
