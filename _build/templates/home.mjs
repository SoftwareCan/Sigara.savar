import { html } from '../lib/html.mjs';
import { firstSentence } from '../lib/util.mjs';
import { markPicture, screenPicture, storeBadges, storeLinkAttrs, waveTool } from './components.mjs';

function hero(ctx) {
  const h = ctx.t.home.hero;
  return html`<section class="hero" aria-labelledby="hero-title">
  <div class="hero__text">
    <h1 class="hero__title" id="hero-title">${h.title}</h1>
    <p class="lead hero__lead">${h.lead}</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="${ctx.url.knowledge()}">${h.primary}</a>
      <a class="btn btn--ghost" href="#indir" ${storeLinkAttrs(ctx)}>${h.secondary}</a>
    </div>
  </div>
  <div class="hero__panel">
    <div class="hero__mark">${markPicture(ctx, { alt: ctx.t.a11y.markAlt, eager: true })}</div>
    <p class="hero__caption">${h.markCaption}</p>
  </div>
</section>`;
}

function recovery(ctx) {
  const r = ctx.t.home.recovery;
  const goals = r.milestones
    .map((m) => ctx.content.health.find((g) => g.targetMinutes === m))
    .filter(Boolean);
  return html`<section class="section recovery" id="iyilesme" aria-labelledby="recovery-title">
  <div class="wrap split">
    <div class="recovery__head">
      <h2 id="recovery-title">${r.title}</h2>
      <p class="lead">${r.lead}</p>
      <p class="recovery__note">${r.note}</p>
      <a class="text-link recovery__more" href="${ctx.url.guide('#saglik')}">${r.more}</a>
    </div>
    <div class="timeline" data-timeline>
      <span class="timeline__progress" aria-hidden="true"></span>
      <span class="timeline__head" aria-hidden="true"></span>
      <ol class="timeline__list">
        ${goals.map((g) => html`<li class="timeline__item">
          <h3 class="timeline__time">${g.duration}</h3>
          <p class="timeline__summary">${g.summary}</p>
          <p class="timeline__detail">${firstSentence(g.detail)}</p>
        </li>`)}
      </ol>
    </div>
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
    <div class="community__rules">
      <h3>${c.rulesTitle}</h3>
      <p>${c.rulesIntro}</p>
      <ul class="plain-list">
        ${c.ruleKeys.map((k) => html`<li><strong>${app[`communityRules${k}Title`]}</strong><p>${app[`communityRules${k}Description`]}</p></li>`)}
      </ul>
    </div>
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
${recovery(ctx)}
${crisis(ctx)}
${knowledge(ctx)}
${appStory(ctx)}
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
    scripts: ['/assets/js/home.js', '/assets/js/wave.js'],
    preload: [{ href: ctx.asset('/assets/brand/mark-white.avif'), as: 'image', type: 'image/avif', fetchpriority: 'high' }],
  };
}
