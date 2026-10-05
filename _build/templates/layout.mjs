import { html, raw, jsonLd } from '../lib/html.mjs';
import { storeBadges, storeLinkAttrs } from './components.mjs';

const FIREBASE = {
  script: ['https://www.gstatic.com', 'https://www.google.com', 'https://www.recaptcha.net', 'https://apis.google.com'],
  img: ['https://*.googleusercontent.com'],
  connect: [
    'https://*.googleapis.com',
    'https://*.firebaseio.com',
    'wss://*.firebaseio.com',
    'https://firebaseinstallations.googleapis.com',
    'https://www.google.com',
    'https://www.gstatic.com',
    'https://www.recaptcha.net',
  ],
  frame: [
    'https://sigara-savar.firebaseapp.com',
    'https://www.google.com',
    'https://accounts.google.com',
    'https://appleid.apple.com',
    'https://www.recaptcha.net',
  ],
};

// Firebase origins are only allowed while the (paused) website sign-in is enabled.
export function contentSecurityPolicy(config) {
  const auth = config.AUTH_UI_ENABLED;
  const join = (base, extra) => [base, ...(auth ? extra : [])].join(' ');
  return [
    "default-src 'self'",
    join("script-src 'self'", FIREBASE.script),
    "style-src 'self'",
    join("img-src 'self' data:", FIREBASE.img),
    "font-src 'self'",
    join("connect-src 'self'", FIREBASE.connect),
    auth ? `frame-src ${FIREBASE.frame.join(' ')}` : "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
}

function navItems(ctx) {
  const { t, url } = ctx;
  return [
    { key: 'knowledge', href: url.knowledge(), label: t.nav.knowledge },
    { key: 'guide', href: url.guide(), label: t.nav.guide },
    { key: 'tools', href: url.tools(), label: t.nav.tools },
    { key: 'community', href: url.home('#topluluk'), label: t.nav.community },
    { key: 'app', href: url.home('#uygulama'), label: t.nav.app },
  ];
}

export function siteHeader(ctx, current) {
  const { t, url, config } = ctx;
  const items = navItems(ctx);
  const currentAttr = (key) => (key === current ? raw(' aria-current="page"') : '');
  return html`<a class="skip-link" href="#icerik">${t.a11y.skip}</a>
<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="brand" href="${url.home()}"${current === 'home' ? raw(' aria-current="page"') : ''}>
      <img src="${ctx.asset('/assets/brand/icon-96.png')}" width="34" height="34" alt="">
      <span class="brand__name" translate="no">Sigara Savar</span>
    </a>
    <nav class="nav" aria-label="${t.a11y.mainNav}">
      <ul class="nav__list">
        ${items.map((i) => html`<li><a class="nav__link" href="${i.href}"${currentAttr(i.key)}>${i.label}</a></li>`)}
      </ul>
    </nav>
    <div class="header-actions">
      ${config.AUTH_UI_ENABLED ? html`<div class="header-auth" data-auth-slot hidden></div>` : ''}
      <a class="btn btn--primary btn--sm header-cta" href="${url.home('#indir')}" ${storeLinkAttrs(ctx)}>${t.nav.download}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-panel" data-open-label="${t.nav.menu}" data-close-label="${t.nav.close}">
        <span class="menu-toggle__icon" aria-hidden="true"></span>
        <span class="menu-toggle__label">${t.nav.menu}</span>
      </button>
    </div>
  </div>
  <div class="menu-panel" id="menu-panel" hidden>
    <div class="wrap">
      <nav aria-label="${t.a11y.mobileNav}">
        <ul class="menu-panel__list">
          ${items.map((i) => html`<li><a href="${i.href}"${currentAttr(i.key)}>${i.label}</a></li>`)}
        </ul>
      </nav>
      <div class="menu-panel__stores">
        <p>${t.footer.groups.app}</p>
        ${storeBadges(ctx)}
      </div>
      <a class="menu-panel__crisis" href="${url.tools('#kriz-bekcisi')}">${t.nav.crisisShortcut}</a>
    </div>
  </div>
</header>`;
}

export function siteFooter(ctx) {
  const { t, url, config } = ctx;
  const year = ctx.buildDate.slice(0, 4);
  return html`<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="brand" href="${url.home()}">
          <img src="${ctx.asset('/assets/brand/icon-96.png')}" width="34" height="34" alt="">
          <span class="brand__name" translate="no">Sigara Savar</span>
        </a>
        <p>${t.footer.tagline}</p>
      </div>
      <nav class="footer-groups" aria-label="${t.a11y.footerNav}">
        <div class="footer-group">
          <h2>${t.footer.groups.site}</h2>
          <ul>
            <li><a href="${url.knowledge()}">${t.nav.knowledge}</a></li>
            <li><a href="${url.guide()}">${t.nav.guide}</a></li>
            <li><a href="${url.tools()}">${t.nav.tools}</a></li>
            <li><a href="${url.home('#topluluk')}">${t.nav.community}</a></li>
            <li><a href="${url.home('#uygulama')}">${t.nav.app}</a></li>
          </ul>
        </div>
        <div class="footer-group">
          <h2>${t.footer.groups.support}</h2>
          <ul>
            <li><a href="mailto:${config.supportEmail}">${t.footer.contact}</a></li>
            <li><a href="${url.page('userDataDeletion.html')}">${t.footer.dataDeletion}</a></li>
            <li><a href="${url.page('SigaraSavar.pdf')}">${t.footer.crisisGuide}</a></li>
          </ul>
        </div>
        <div class="footer-group">
          <h2>${t.footer.groups.legal}</h2>
          <ul>
            <li><a href="${url.page('privacy.html')}">${t.footer.privacy}</a></li>
            <li><a href="${url.page('terms.html')}">${t.footer.terms}</a></li>
          </ul>
        </div>
        <div class="footer-group">
          <h2>${t.footer.groups.app}</h2>
          <ul>
            <li><a href="${config.stores.appStore}" rel="noopener">${t.stores.appStore}</a></li>
            <li><a href="${config.stores.googlePlay}" rel="noopener">${t.stores.googlePlay}</a></li>
            <li><a href="${config.social.instagram}" rel="noopener">${t.footer.instagram}</a></li>
          </ul>
        </div>
      </nav>
    </div>
    <div class="footer-bottom">
      <p>${t.footer.disclaimer}</p>
      <p>${t.footer.copyright(year)}</p>
    </div>
  </div>
</footer>`;
}

export function headTags(ctx, page) {
  const { t, config, url } = ctx;
  const canonical = url.abs(page.path);
  const ogImage = url.abs(page.ogImage || '/assets/og/default.png');
  return html`<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<link rel="canonical" href="${canonical}">
${page.noindex ? raw('<meta name="robots" content="noindex, follow">\n') : ''}<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy(config)}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="#fcfbf8">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${config.siteName}">
<meta property="og:locale" content="${ctx.localeConfig.ogLocale}">
<meta property="og:title" content="${page.ogTitle || page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${page.ogImageAlt || page.ogTitle || page.title}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="${ctx.asset('/assets/brand/favicon-32.png')}" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/source-sans-3.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin>
${(page.preload || []).map((p) => html`<link rel="preload" href="${p.href}" as="${p.as}"${p.type ? html` type="${p.type}"` : ''}${p.fetchpriority ? html` fetchpriority="${p.fetchpriority}"` : ''}>\n`)}<link rel="stylesheet" href="${ctx.asset('/assets/css/site.css')}">
<noscript><link rel="stylesheet" href="${ctx.asset('/assets/css/noscript.css')}"></noscript>
${(page.jsonLd || []).map((data) => html`${jsonLd(data)}\n`)}<script src="${ctx.asset('/assets/js/site.js')}" defer></script>
${(page.scripts || []).map((s) => html`<script src="${ctx.asset(s)}" defer></script>\n`)}${config.AUTH_UI_ENABLED ? raw('<script type="module" src="/header-auth.js"></script>\n') : ''}`;
}

export function layout(ctx, page) {
  return `<!DOCTYPE html>
<html lang="${ctx.localeConfig.htmlLang}">
<head>
${headTags(ctx, page)}
</head>
<body${page.bodyClass ? ` class="${page.bodyClass}"` : ''}>
${siteHeader(ctx, page.current)}
<main id="icerik" tabindex="-1">
${page.main}
</main>
${siteFooter(ctx)}
</body>
</html>
`;
}
