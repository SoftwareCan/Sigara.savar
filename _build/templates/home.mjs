import { html } from '../lib/html.mjs';
import { verifiedHealth, healthSourceNote } from '../lib/health.mjs';
import { markPicture, screenPicture, storeBadges, storeLinkAttrs, waveTool } from './components.mjs';

function hero(ctx) {
  const h = ctx.t.home.hero;
  return html`<section class="hero" aria-labelledby="hero-title">
  <div class="hero__text">
    <p class="hero__eyebrow" translate="no">${h.eyebrow}</p>
    <h1 class="hero__title" id="hero-title">${h.title}</h1>
    <p class="lead hero__lead">${h.lead}</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="${ctx.url.guide()}">${h.primary}</a>
      <a class="btn btn--ghost" href="#indir" ${storeLinkAttrs(ctx)}>${h.secondary}</a>
    </div>
  </div>
  <div class="hero__panel">
    <figure class="hero__identity">
      <figcaption class="hero__caption">
        <span class="hero__caption-kicker">${h.markKicker}</span>
        <span class="hero__caption-title">${h.markCaption}</span>
      </figcaption>
      <div class="hero__mark signature-mark">
        <svg class="signature-mark__trace" viewBox="0 0 700 362" aria-hidden="true" focusable="false">
          <path class="signature-mark__path" pathLength="1" d="M310 150 C259 97 228 80 167 82 C89 84 39 137 41 205 C43 268 105 313 165 291 C257 258 441 83 531 85 C609 87 658 145 657 213 C656 281 605 319 540 316 C480 313 422 259 389 230"></path>
          <path class="signature-mark__break" d="M347 93 L335 53 M375 85 L410 13"></path>
        </svg>
        ${markPicture(ctx, { alt: ctx.t.a11y.markAlt, eager: true })}
      </div>
    </figure>
  </div>
</section>`;
}

function cycle(ctx) {
  const article = ctx.articleById('b1-01');
  return html`<section class="section cycle" id="donguyu-kir" aria-labelledby="cycle-title">
  <div class="wrap">
    <div class="cycle__intro">
      <h2 id="cycle-title"><span>Bir sigara değil.</span><span>Bir döngü.</span></h2>
      <div>
        <p class="lead">${article.intro}</p>
        <p class="cycle__next">Kahve, mola, stres… Önce bu eşleşmeleri fark et. Sonra o anlara başka bir davranış yerleştirmek için kendine alan aç.</p>
        <a class="text-link" href="${ctx.url.article('b1-01')}">Döngünün nasıl oluştuğunu oku</a>
      </div>
    </div>
    <figure class="cycle__figure">
      <svg viewBox="0 0 960 160" aria-hidden="true" focusable="false">
        <g class="cycle__ink" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M32 82 H201 M44 74 V90 M73 74 V90"></path>
          <path d="M261 82 H338 M325 73 L338 82 L325 91"></path>
          <path d="M494 47 A49 49 0 1 0 507 82 M507 82 L517 70 M507 82 L493 74"></path>
          <path d="M591 82 H664 M651 73 L664 82 L651 91"></path>
          <path d="M801 68 C735 2 685 145 753 124 C803 108 832 33 880 40 C942 49 914 150 863 120 C843 108 831 91 819 80"></path>
        </g>
        <path class="cycle__accent" d="M31 82 H72" fill="none" stroke-width="5"></path>
        <path class="cycle__freedom" d="M801 57 L808 46 M812 65 L826 56" fill="none" stroke-width="2" stroke-linecap="round"></path>
      </svg>
      <figcaption class="cycle__captions">
        <div><strong>Tetikleyici</strong><span>Bir an, bir duygu, bir rutin.</span></div>
        <div><strong>Tekrar</strong><span>İstek ve kısa süreli rahatlama birbirini besler.</span></div>
        <div><strong>Yeni bir yol</strong><span>Fark et, planla, rutini değiştir.</span></div>
      </figcaption>
    </figure>
    <p class="cycle__action"><a class="text-link" href="${ctx.url.article('b2-02')}">Kendi tetikleyicilerinle başlayabilirsin</a></p>
  </div>
</section>`;
}

function recovery(ctx) {
  const r = ctx.t.home.recovery;
  const goals = verifiedHealth(ctx.content);
  return html`<section class="section recovery" id="iyilesme" aria-labelledby="recovery-title">
  <div class="wrap split">
    <div class="recovery__head">
      <h2 id="recovery-title">${r.title}</h2>
      <p class="lead">${r.lead}</p>
      <p class="recovery__note">${healthSourceNote}</p>
      <a class="text-link recovery__more" href="${ctx.url.guide('#saglik')}">${r.more}</a>
      <div class="timeline-periods" role="group" aria-label="Sağlık zaman çizelgesinde dönem seç" data-timeline-controls hidden>
        <button type="button" data-period="days" aria-pressed="true">İlk günler</button>
        <button type="button" data-period="months" aria-pressed="false">Haftalar ve aylar</button>
        <button type="button" data-period="years" aria-pressed="false">Uzun vadede</button>
      </div>
    </div>
    <div class="timeline" data-timeline>
      <span class="timeline__progress" aria-hidden="true"></span>
      <span class="timeline__head" aria-hidden="true"></span>
      <ol class="timeline__list">
        ${goals.map((g) => html`<li class="timeline__item" data-timeline-period="${g.targetMinutes <= 4320 ? 'days' : g.targetMinutes <= 129600 ? 'months' : 'years'}"${g.targetMinutes > 4320 ? html` hidden` : ''}>
          <h3 class="timeline__time">${g.duration}</h3>
          <p class="timeline__summary">${g.summary}</p>
          <p class="timeline__detail">${g.detail}</p>
          <a class="timeline__source" href="${g.source.url}" rel="noopener">Kaynak: ${g.source.label}</a>
        </li>`)}
      </ol>
    </div>
  </div>
</section>`;
}

function guidePreview(ctx) {
  const steps = [
    ['Bırakmaya hazırlan', 'b1-04', '#hazirlik'],
    ['İlk gün ve ilk hafta', 'b1-07', '#ilk-24-saat'],
    ['Bir kaymadan sonra', 'b3-08', '#kayma-sonrasi'],
  ];
  return html`<section class="section guide-preview" aria-labelledby="guide-preview-title">
  <div class="wrap">
    <div class="guide-preview__head">
      <h2 id="guide-preview-title">Bulunduğun yerden başla.</h2>
      <p class="lead">Bırakmayı düşünüyor, ilk günleri yaşıyor ya da yeniden deniyor olabilirsin. Rehberde kendi adımını bul.</p>
    </div>
    <ol class="guide-preview__steps">
      ${steps.map(([title, id, hash], i) => html`<li><span aria-hidden="true">0${i + 1}</span><h3><a href="${ctx.url.guide(hash)}">${title}</a></h3><p>${ctx.articleById(id).summary}</p></li>`)}
    </ol>
    <a class="text-link" href="${ctx.url.guide()}">Bırakma rehberinin tamamı</a>
  </div>
</section>`;
}

function crisis(ctx) {
  const c = ctx.t.home.crisis;
  const resolve = (href) => {
    if (href.startsWith('tools')) return ctx.url.tools(href.slice(5));
    if (href.startsWith('article:')) return ctx.url.article(href.slice(8));
    return href;
  };
  return html`<section class="section crisis on-dark" id="kriz" aria-labelledby="crisis-title">
  <div class="wrap split">
    <div class="crisis__intro">
      <h2 id="crisis-title">${c.title}</h2>
      <p class="lead">${c.lead}</p>
      <a class="crisis__source" href="${ctx.url.article('b3-02')}">${c.source}</a>
    </div>
    <div class="crisis__tool">
      ${waveTool(ctx, { headingId: 'wave-title' })}
    </div>
    <div class="resources-wrap">
      <ul class="resources" aria-label="${c.toolsTitle}">
        ${c.items.map((item) => html`<li class="resources__item">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          <a href="${resolve(item.href)}">${item.link}</a>
        </li>`)}
      </ul>
      <p class="crisis__more"><a class="btn btn--outline-light" href="${ctx.url.tools()}">${c.allTools}</a></p>
    </div>
  </div>
</section>`;
}

function knowledge(ctx) {
  const k = ctx.t.home.knowledge;
  const { t, url } = ctx;
  const featured = ctx.articleById(k.featuredId);
  return html`<section class="section kc-preview" id="bilgi-merkezi" aria-labelledby="kc-title">
  <div class="wrap">
    <div class="section-head">
      <h2 id="kc-title">${k.title}</h2>
      <p class="lead">${k.lead}</p>
    </div>
    <article class="lead-story" aria-labelledby="lead-story-title">
      <p class="label">${k.startTitle}</p>
      <h3 class="lead-story__title" id="lead-story-title"><a href="${url.article(featured.id)}">${featured.title}</a></h3>
      <p class="lead-story__summary">${featured.summary}</p>
      <p class="lead-story__meta">${k.startText} ${t.common.readTime(featured.estimatedReadMinutes)}.</p>
    </article>
    <ol class="section-index">
      ${ctx.sections.map((s) => html`<li class="section-index__item">
        <span class="section-index__num" aria-hidden="true">${s.order}</span>
        <h3 class="section-index__title"><a href="${url.section(s.id)}">${s.title}</a></h3>
        <p class="section-index__desc">${s.description}</p>
        <p class="section-index__meta">${t.common.articleCount(s.articles.length)}, ${t.common.readTime(s.minutes)}</p>
        <ul class="section-index__articles">
          ${s.articles.slice(0, 3).map((a) => html`<li><a href="${url.article(a.id)}">${a.title}</a></li>`)}
        </ul>
        <a class="section-index__all" href="${url.section(s.id)}">${k.sectionMore(s.articles.length)}</a>
      </li>`)}
    </ol>
    <p class="kc-preview__cta"><a class="btn btn--primary" href="${url.knowledge()}">${k.cta}</a></p>
  </div>
</section>`;
}

function appStory(ctx) {
  const a = ctx.t.home.app;
  return html`<section class="section section--sand app-story" id="uygulama" aria-labelledby="app-title">
  <div class="wrap">
    <div class="app-story__head">
      <h2 id="app-title">${a.title}</h2>
      <p class="lead">${a.lead}</p>
    </div>
  </div>
  <div class="wrap split app-story__body">
    <div class="app-story__stage" data-stage aria-hidden="true">
      <div class="stage__frame">
        ${a.features.map((f, i) => html`<figure class="screen${i === 0 ? ' is-active' : ''}" data-stage-screen="${f.id}">
          ${screenPicture(ctx, f.screen, '', { sizes: '22rem' })}
        </figure>`)}
      </div>
    </div>
    <ol class="app-rail" aria-label="${a.title}">
      ${a.features.map((f, i) => html`<li data-feature="${f.id}"${i === 0 ? html` class="is-active"` : ''}>
        <figure class="screen">${screenPicture(ctx, f.screen, f.alt, { sizes: '(min-width: 960px) 1px, 74vw' })}</figure>
        <h3>${f.title}</h3>
        <p>${f.text}</p>
      </li>`)}
    </ol>
    <div class="app-story__download">
      ${storeBadges(ctx)}
      <p>${ctx.t.stores.note}</p>
    </div>
  </div>
</section>`;
}

function community(ctx) {
  const c = ctx.t.home.community;
  const app = ctx.app;
  return html`<section class="section community" id="topluluk" aria-labelledby="community-title">
  <div class="wrap">
    <h2 class="community__title" id="community-title">${c.title}</h2>
    <p class="lead community__lead">${c.lead}</p>
  </div>
  <div class="wrap split community__body">
    <div class="community__spaces">
      <h3>${c.spacesTitle}</h3>
      <ul class="plain-list">
        ${c.spaces.map((s) => html`<li><strong>${s.title}</strong><p>${s.text}</p></li>`)}
      </ul>
    </div>
    <details class="community__rules">
      <summary>${c.rulesTitle}</summary>
      <p>${c.rulesIntro}</p>
      <ul class="plain-list">
        ${c.ruleKeys.map((k) => html`<li><strong>${app[`communityRules${k}Title`]}</strong><p>${app[`communityRules${k}Description`]}</p></li>`)}
      </ul>
    </details>
  </div>
</section>`;
}

function download(ctx) {
  const d = ctx.t.home.download;
  return html`<section class="section download" id="indir" aria-labelledby="download-title">
  <div class="wrap">
    <div class="download__panel">
      <div>
        <h2 id="download-title">${d.title}</h2>
        <p>${d.lead}</p>
        <div class="download__badges">${storeBadges(ctx)}</div>
        <p class="download__note">${ctx.t.stores.note}</p>
      </div>
      <div class="download__mark">${markPicture(ctx, { alt: '' })}</div>
    </div>
  </div>
</section>`;
}

export function homePage(ctx) {
  const { t, config, url } = ctx;
  const main = html`${hero(ctx)}
${cycle(ctx)}
${recovery(ctx)}
${crisis(ctx)}
${knowledge(ctx)}
${guidePreview(ctx)}
${community(ctx)}
${appStory(ctx)}
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
    scripts: ['/assets/js/home.js', '/assets/js/wave.js'],
    styles: ['/assets/css/home.css'],
    preload: [{ href: ctx.asset('/assets/brand/mark-white.avif'), as: 'image', type: 'image/avif', fetchpriority: 'high' }],
  };
}
