import { html } from '../lib/html.mjs';
import { storeBadges } from './components.mjs';
import { editorialCopy } from '../i18n/editorial.mjs';

export function downloadPage(ctx) {
  const d = ctx.t.downloadPage;
  const labels = editorialCopy(ctx.lang).download;
  const main = html`<section class="smart-download" aria-labelledby="download-page-title" data-download-page data-app-store="${ctx.config.stores.appStore}" data-google-play="${ctx.config.stores.googlePlay}" data-status-ios="${d.ios}" data-status-android="${d.android}" data-status-desktop="${d.desktop}" data-status-other="${d.other}" data-status-cancelled="${d.cancelled}">
  <div class="wrap smart-download__layout">
    <div class="smart-download__content">
      <p class="smart-download__eyebrow">${d.eyebrow}</p>
      <h1 id="download-page-title">${d.title}</h1>
      <p class="lead smart-download__lead">${d.lead}</p>
      <div class="smart-download__status" role="status" aria-live="polite">
        <span class="smart-download__pulse" aria-hidden="true"></span>
        <span data-download-status>${d.detecting}</span>
      </div>
      <button class="smart-download__cancel" type="button" data-download-cancel hidden>${d.cancel}</button>
      <div class="smart-download__stores">
        ${storeBadges(ctx)}
      </div>
      <p class="smart-download__note">${ctx.t.stores.note}</p>
      <p class="smart-download__privacy">${d.privacy}</p>
      <noscript><p class="smart-download__noscript">${d.other}</p></noscript>
    </div>
    <aside class="smart-download__visual" aria-labelledby="download-qr-title" data-download-qr>
      <div class="smart-download__app">
        <img src="${ctx.asset('/assets/brand/app-icon-512.png')}" width="144" height="144" alt="" fetchpriority="high">
        <div>
          <strong translate="no">Sigara Savar</strong>
          <span>${labels.tagline}</span>
        </div>
      </div>
      <div class="smart-download__qr-card">
        <img src="${ctx.asset('/assets/qr/indir.svg')}" width="216" height="216" alt="${d.qrTitle}: ${labels.qrLink}">
        <div>
          <h2 id="download-qr-title">${d.qrTitle}</h2>
          <p>${d.qrText}</p>
          <span>sigarasavar.com/indir</span>
        </div>
      </div>
    </aside>
  </div>
</section>`;

  const app = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: ctx.config.siteName,
    operatingSystem: 'iOS, Android',
    applicationCategory: 'HealthApplication',
    description: d.description,
    installUrl: [ctx.config.stores.appStore, ctx.config.stores.googlePlay],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
  };

  return {
    path: ctx.url.download(),
    title: d.metaTitle,
    ogTitle: d.title,
    description: d.description,
    ogImage: '/assets/og/default.png',
    current: 'app',
    bodyClass: 'download-page',
    main,
    jsonLd: [app],
    styles: ['/assets/css/download.css'],
    scripts: ['/assets/js/download.js'],
    preload: [{ href: ctx.asset('/assets/brand/app-icon-512.png'), as: 'image', type: 'image/png', fetchpriority: 'high' }],
  };
}
