import { html, raw, jsonLd } from '../lib/html.mjs';

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

const LANGUAGES = {
  tr: { name: 'Türkçe', label: 'Dil seçin', current: 'Dil' },
  en: { name: 'English', label: 'Choose a language', current: 'Language' },
  de: { name: 'Deutsch', label: 'Sprache wählen', current: 'Sprache' },
  es: { name: 'Español', label: 'Elige un idioma', current: 'Idioma' },
  fr: { name: 'Français', label: 'Choisir une langue', current: 'Langue' },
};

function languages(ctx, pagePath, footer = false) {
  const label = LANGUAGES[ctx.lang];
  const equivalents = ctx.languageLinks(pagePath);
  const options = equivalents.length ? equivalents : ctx.languageHomes();
  const links = options.map((option) => html`<li><a href="${option.path}" lang="${option.lang}" hreflang="${option.lang}" data-site-language="${option.lang}"${option.lang === ctx.lang ? raw(' aria-current="true"') : ''}>${LANGUAGES[option.lang].name}${option.lang === ctx.lang ? html`<span aria-hidden="true">✓</span>` : ''}</a></li>`);
  if (footer) return html`<nav class="footer-languages" aria-label="${label.label}"><span class="footer-languages__label">${label.current}</span><ul>${links}</ul></nav>`;
  return html`<details class="language-picker" data-language-picker>
        <summary aria-label="${label.current}: ${label.name}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18-3-3-3-15 0-18Z"/></svg>
          <span class="language-picker__code">${ctx.lang.toUpperCase()}</span>
          <svg class="language-picker__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg>
        </summary>
        <nav class="language-picker__panel" aria-label="${label.label}"><ul>${links}</ul></nav>
      </details>`;
}

function navItems(ctx) {
  const { t, url } = ctx;
  return [
    { key: 'app', href: url.home('#uygulama'), label: t.nav.app },
    { key: 'guide', href: url.guide(), label: t.nav.guide },
    { key: 'knowledge', href: url.knowledge(), label: t.nav.knowledge },
  ];
}

export function siteHeader(ctx, current, pagePath) {
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
      ${languages(ctx, pagePath)}
      ${config.AUTH_UI_ENABLED ? html`<div class="header-auth" data-auth-slot hidden></div>` : ''}
      <a class="btn btn--primary btn--sm header-cta" href="${url.download()}">${t.nav.download}</a>
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
      <a class="btn btn--primary menu-panel__download" href="${url.download()}">${t.nav.download}</a>
    </div>
  </div>
</header>`;
}

export function siteFooter(ctx, pagePath) {
  const { t, url, config } = ctx;
  const year = ctx.buildDate.slice(0, 4);
  const legalHref = (file) => `${url.page(file)}?lang=${ctx.lang}`;
  const legalSuffix = ctx.lang === 'fr' ? ' (en anglais)' : '';
  const deletionSuffix = { fr: ' (en anglais)', de: ' (auf Englisch)', es: ' (en inglés)' }[ctx.lang] || '';
  return html`<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <a class="brand" href="${url.home()}">
        <img src="${ctx.asset('/assets/brand/icon-96.png')}" width="34" height="34" alt="">
        <span class="brand__name" translate="no">Sigara Savar</span>
      </a>
      <nav aria-label="${t.a11y.footerNav}">
        <ul class="footer-links">
          <li><a href="${url.guide()}">${t.nav.guide}</a></li>
          <li><a href="${url.knowledge()}">${t.nav.knowledge}</a></li>
          <li><a href="${url.tools()}">${t.nav.tools}</a></li>
          <li><a href="mailto:${config.supportEmail}">${t.footer.contact}</a></li>
          <li><a href="${config.social.instagram}" rel="noopener">${t.footer.instagram}</a></li>
        </ul>
      </nav>
    </div>
    ${languages(ctx, pagePath, true)}
    <div class="footer-bottom">
      <div class="footer-meta">
        <nav aria-label="${t.footer.groups.legal}">
          <ul class="footer-links footer-links--legal">
            <li><a href="${legalHref('privacy.html')}">${t.footer.privacy}${legalSuffix}</a></li>
            <li><a href="${legalHref('terms.html')}">${t.footer.terms}${legalSuffix}</a></li>
            <li><a href="${legalHref('userDataDeletion.html')}">${t.footer.dataDeletion}${deletionSuffix}</a></li>
          </ul>
        </nav>
        <p class="footer-copyright">${t.footer.copyright(year)}</p>
      </div>
      <p class="footer-disclaimer">${t.footer.disclaimer}</p>
    </div>
  </div>
</footer>`;
}

export function headTags(ctx, page) {
  const { t, config, url } = ctx;
  const canonical = url.abs(page.path);
  const ogImage = url.abs(page.ogImage || '/assets/og/default.png');
  const alternates = page.noindex ? [] : ctx.languageLinks(page.path);
  const fallback = alternates.find((option) => option.lang === config.defaultLocale);
  return html`<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<link rel="canonical" href="${canonical}">
${alternates.map((option) => html`<link rel="alternate" hreflang="${option.lang}" href="${url.abs(option.path)}">\n`)}${fallback ? html`<link rel="alternate" hreflang="x-default" href="${url.abs(fallback.path)}">\n` : ''}
${page.noindex ? raw('<meta name="robots" content="noindex, follow">\n') : ''}<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy(config)}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="#fcfbf8">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${config.siteName}">
<meta property="og:locale" content="${ctx.localeConfig.ogLocale}">
${alternates.filter((option) => option.lang !== ctx.lang).map((option) => html`<meta property="og:locale:alternate" content="${option.ogLocale}">\n`)}
<meta property="og:title" content="${page.ogTitle || page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${page.ogImageAlt || page.ogTitle || page.title}">
${page.articlePublished ? html`<meta property="article:published_time" content="${page.articlePublished}">\n` : ''}${page.articleModified ? html`<meta property="article:modified_time" content="${page.articleModified}">\n` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${page.ogTitle || page.title}">
<meta name="twitter:description" content="${page.description}">
<meta name="twitter:image" content="${ogImage}">
<meta name="twitter:image:alt" content="${page.ogImageAlt || page.ogTitle || page.title}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="${ctx.asset('/assets/brand/favicon-32.png')}" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="${ctx.asset('/apple-touch-icon.png')}" sizes="180x180">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/source-sans-3.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin>
${(page.preload || []).map((p) => html`<link rel="preload" href="${p.href}" as="${p.as}"${p.type ? html` type="${p.type}"` : ''}${p.fetchpriority ? html` fetchpriority="${p.fetchpriority}"` : ''}>\n`)}<link rel="stylesheet" href="${ctx.asset('/assets/css/site.css')}">
<link rel="stylesheet" href="${ctx.asset('/assets/css/languages.css')}">
${(page.styles || []).map((s) => html`<link rel="stylesheet" href="${ctx.asset(s)}">\n`)}
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
${siteHeader(ctx, page.current, page.path)}
<main id="icerik" tabindex="-1">
${page.main}
</main>
${siteFooter(ctx, page.path)}
</body>
</html>
`;
}
