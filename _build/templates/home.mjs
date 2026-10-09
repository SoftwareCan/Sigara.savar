import { html } from '../lib/html.mjs';
import { screenPicture, storeBadges } from './components.mjs';
import { displayTitle } from './knowledge.mjs';
import { homeCopy } from '../i18n/home.mjs';

const arrow = html`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function hero(ctx, h) {
  return html`<section class="home-hero" aria-labelledby="hero-title">
    <div class="wrap home-hero__inner">
      <div class="home-hero__copy">
        <h1 id="hero-title">${h.hero}</h1>
        <p class="home-lead">${h.lead}</p>
        <div class="home-hero__actions">
          <a class="btn btn--primary" href="${ctx.url.download()}">${h.download}${arrow}</a>
          <a class="text-link" href="${ctx.url.guide()}">${h.guide}</a>
        </div>
        <p class="home-hero__availability">${h.availability}</p>
      </div>
      <figure class="home-hero__visual">
        <div class="home-phones">
          <div class="home-phone home-phone--back">${screenPicture(ctx, 'yolculuk-detoks', h.alts.journey, { sizes: '(min-width: 1000px) 245px, (min-width: 760px) 210px, 172px', eager: true })}</div>
          <div class="home-phone home-phone--front">${screenPicture(ctx, 'gelisim', h.alts.progress, { sizes: '(min-width: 1000px) 270px, (min-width: 760px) 230px, 184px', eager: true })}</div>
        </div>
        <figcaption>${h.screenNote}</figcaption>
      </figure>
    </div>
  </section>
  <nav class="home-jumps" aria-label="${h.jumpLabel}"><div class="wrap">
    ${['uygulama', 'zor-anlar', 'topluluk'].map((id, i) => html`<a href="#${id}">${h.jumps[i]}${arrow}</a>`)}
  </div></nav>`;
}

function feature(ctx, data, { id, screen, tone, reverse, href }) {
  return html`<section class="home-feature${reverse ? ' home-feature--reverse' : ''}" id="${id}" aria-labelledby="${id}-title">
    <div class="wrap home-feature__inner">
      <div class="home-feature__copy">
        <p class="home-kicker">${data.label}</p>
        <h2 class="home-heading" id="${id}-title">${data.title}</h2>
        <p class="home-feature__lead">${data.text}</p>
        <p class="home-feature__detail">${data.detail}</p>
        <a class="home-link" href="${href}">${data.link}${arrow}</a>
      </div>
      <div class="home-feature__visual home-feature__visual--${tone}">
        <div class="home-feature__screen">${screenPicture(ctx, screen, data.alt, { sizes: '(min-width: 1000px) 270px, (min-width: 760px) 230px, 230px' })}</div>
      </div>
    </div>
  </section>`;
}

function learning(ctx, h) {
  const l = h.learning;
  return html`<section class="home-learning" id="bilgi-merkezi" aria-labelledby="learning-title">
    <div class="wrap">
      <div class="home-learning__heading">
        <div><p class="home-kicker">${l.label}</p><h2 class="home-heading" id="learning-title">${l.title}</h2></div>
        <div><p>${l.text}</p><a class="home-link" href="${ctx.url.knowledge()}">${l.link}${arrow}</a></div>
      </div>
      <div class="home-reading">
        ${['b1-04', 'b3-02', 'b3-08'].map((id) => {
          const article = ctx.articleById(id);
          return html`<article class="home-story">
            <p class="home-story__time">${ctx.t.common.readTime(article.estimatedReadMinutes)}</p>
            <h3><a href="${ctx.url.article(id)}">${displayTitle(article, ctx.sectionById(article.sectionId))}</a></h3>
            <p class="home-story__summary">${article.summary}</p>
          </article>`;
        })}
      </div>
    </div>
  </section>`;
}

function download(ctx, h) {
  return html`<section class="home-download" id="indir" aria-labelledby="download-title">
    <div class="wrap home-download__inner">
      <h2 class="home-heading" id="download-title">${h.end.title}</h2>
      <p>${h.end.text}</p>
      ${storeBadges(ctx)}
      <p class="home-download__note">${h.end.note}</p>
    </div>
  </section>`;
}

export function homePage(ctx) {
  const { t, config, url } = ctx;
  const h = homeCopy(ctx.lang);
  const main = html`${hero(ctx, h)}
${feature(ctx, h.progress, { id: 'uygulama', screen: 'kupalar', tone: 'mint', href: url.download() })}
${feature(ctx, h.craving, { id: 'zor-anlar', screen: 'acil-alan', tone: 'warm', reverse: true, href: url.tools() })}
${feature(ctx, h.community, { id: 'topluluk', screen: 'kesfet', tone: 'blue', href: url.download() })}
${learning(ctx, h)}
${download(ctx, h)}`;

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
    title: h.title,
    ogTitle: h.title,
    description: h.description,
    ogImage: '/assets/og/default.png',
    current: 'home',
    bodyClass: 'home',
    main,
    jsonLd: [organization, website, app],
    styles: ['/assets/css/home.css'],
  };
}
