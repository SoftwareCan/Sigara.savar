import { html } from '../lib/html.mjs';
import { screenPicture, storeBadges } from './components.mjs';
import { displayTitle } from './knowledge.mjs';

function hero(ctx) {
  const h = ctx.t.home.hero;
  return html`<section class="home-hero wrap" aria-labelledby="hero-title">
    <div class="home-hero__copy">
      <p class="home-eyebrow" translate="no">${h.eyebrow}</p>
      <h1 id="hero-title">${h.title}</h1>
      <p class="home-lead">${h.lead}</p>
      <div class="home-hero__actions">
        <a class="btn btn--primary" href="${ctx.url.download()}">${h.primary}</a>
        <a class="text-link" href="${ctx.url.guide()}">${h.secondary}</a>
      </div>
    </div>
    <div class="home-hero__visual">
      <figure class="product-shot home-hero__screen">
        ${screenPicture(ctx, 'gelisim', h.alt, { sizes: '(min-width: 960px) 280px, 240px', eager: true })}
      </figure>
    </div>
  </section>`;
}

function benefits(ctx) {
  const b = ctx.t.home.benefits;
  return html`<section class="home-section home-benefits" aria-labelledby="benefits-title">
    <div class="wrap">
      <h2 class="home-heading" id="benefits-title">${b.title}</h2>
      <ul class="home-benefits__list">
        ${b.items.map((item) => html`<li><h3>${item.title}</h3><p>${item.text}</p></li>`)}
      </ul>
      <div class="home-cycle" id="donguyu-kir">
        <h3>Bir sigara değil,<br>bir döngü.</h3>
        <div><p>Tetikleyicilerini tanı. İstek anları için plan yap. Rutininde yeni bir yol aç.</p>
          <a class="text-link" href="${ctx.url.article('b1-01')}">Döngüyü anlamak</a>
        </div>
      </div>
    </div>
  </section>`;
}

function product(ctx) {
  const a = ctx.t.home.app;
  return html`<section class="home-section home-product" id="uygulama" aria-labelledby="product-title" data-product>
    <div class="wrap">
      <h2 class="home-heading" id="product-title">${a.title}</h2>
      <div class="product-tabs" aria-label="Uygulamayı keşfet" data-product-tabs hidden>
        ${a.features.map((f) => html`<button type="button" id="tab-${f.id}" aria-controls="panel-${f.id}" data-product-tab="${f.id}">${f.label}</button>`)}
      </div>
      ${a.features.map((f) => html`<div class="product-panel" id="panel-${f.id}" data-product-panel="${f.id}">
        <div class="product-panel__copy" id="${f.id === 'acil' ? 'kriz' : 'iyilesme'}">
          <h3>${f.title}</h3>
          <p>${f.text}</p>
          <a class="text-link" href="${f.id === 'acil' ? ctx.url.tools() : ctx.url.guide('#saglik')}">${f.link}</a>
        </div>
        <figure class="product-shot">
          ${screenPicture(ctx, f.screen, f.alt, { sizes: '(min-width: 760px) 250px, 230px' })}
        </figure>
      </div>`)}
    </div>
  </section>`;
}

function learning(ctx) {
  const k = ctx.t.home.knowledge;
  const stories = [k.featuredId, ...k.secondaryIds].map((id) => ctx.articleById(id));
  const states = [
    ['Hazırlanıyorum', '#hazirlanma'],
    ['İlk günlerdeyim', '#ilk-24-saat'],
    ['Yeniden başlıyorum', '#kayma-sonrasi'],
  ];
  return html`<section class="home-section home-learning" id="bilgi-merkezi" aria-labelledby="learning-title">
    <div class="wrap">
      <h2 class="home-heading" id="learning-title">${k.title}</h2>
      <div class="home-stories">
        ${stories.map((article, i) => html`<article class="home-story${i === 0 ? ' home-story--featured' : ''}">
          <p class="home-story__meta">${ctx.t.common.readTime(article.estimatedReadMinutes)}</p>
          <h3><a href="${ctx.url.article(article.id)}">${displayTitle(article, ctx.sectionById(article.sectionId))}</a></h3>
          ${i === 0 ? html`<p class="home-story__summary">${article.summary}</p>` : ''}
        </article>`)}
      </div>
      <a class="text-link" href="${ctx.url.knowledge()}">${k.cta}</a>
      <div class="home-guide">
        <div><h3>Bırakmaya nereden başlayacağını bilmiyor musun?</h3>
          <a class="text-link" href="${ctx.url.guide()}">Bırakma Rehberine Git</a>
        </div>
        <nav aria-label="Bırakma rehberinde sana uygun başlangıç">
          ${states.map(([label, hash]) => html`<a href="${ctx.url.guide(hash)}">${label}<span aria-hidden="true">↗</span></a>`)}
        </nav>
      </div>
    </div>
  </section>`;
}

function community(ctx) {
  const c = ctx.t.home.community;
  return html`<section class="home-section home-community" id="topluluk" aria-labelledby="community-title">
    <div class="wrap home-community__inner">
      <div>
        <h2 class="home-heading" id="community-title">${c.title}</h2>
        <p class="home-lead">${c.lead}</p>
        <p class="home-community__note">${c.note}</p>
      </div>
      <figure class="home-community__visual">
        <div class="home-community__crop">
          ${screenPicture(ctx, 'kesfet', 'Keşfet ekranındaki Topluluk Yazıları: üyelerin deneyimleri, yazıları ve yorumları', { sizes: '(min-width: 960px) 380px, (min-width: 430px) 350px, 85vw' })}
        </div>
        <figcaption>Keşfet · Topluluk Yazıları</figcaption>
      </figure>
    </div>
  </section>`;
}

function download(ctx) {
  const d = ctx.t.home.download;
  return html`<section class="home-section home-download" id="indir" aria-labelledby="download-title">
    <div class="wrap home-download__inner">
      <div><h2 class="home-heading" id="download-title">${d.title}</h2><p>${d.lead}</p></div>
      <div>${storeBadges(ctx)}<p class="home-download__note">${ctx.t.stores.note}</p></div>
    </div>
  </section>`;
}

export function homePage(ctx) {
  const { t, config, url } = ctx;
  const main = html`${hero(ctx)}
${benefits(ctx)}
${product(ctx)}
${learning(ctx)}
${community(ctx)}
${download(ctx)}`;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${config.baseUrl}/#organization`,
    name: config.siteName,
    url: `${config.baseUrl}/`,
    logo: url.abs('/assets/brand/app-icon-512.png'),
    email: config.supportEmail,
    sameAs: [config.social.instagram, config.stores.appStore, config.stores.googlePlay],
  };
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${config.baseUrl}/#website`,
    name: config.siteName,
    url: `${config.baseUrl}/`,
    inLanguage: ctx.localeConfig.htmlLang,
    publisher: { '@id': `${config.baseUrl}/#organization` },
  };
  const app = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: config.siteName,
    operatingSystem: 'iOS, Android',
    applicationCategory: 'HealthApplication',
    description: t.meta.siteDescription,
    installUrl: [config.stores.appStore, config.stores.googlePlay],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
    publisher: { '@id': `${config.baseUrl}/#organization` },
  };

  return {
    path: url.home(),
    title: t.home.title,
    ogTitle: t.home.title,
    description: t.home.description,
    ogImage: '/assets/og/default.png',
    current: 'home',
    bodyClass: 'home',
    main,
    jsonLd: [organization, website, app],
    scripts: ['/assets/js/home.js'],
    styles: ['/assets/css/home.css'],
  };
}
