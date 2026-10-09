import { html } from '../lib/html.mjs';
import { searchKey, splitLead } from '../lib/util.mjs';
import { storeBadges } from './components.mjs';
import { editorialCopy } from '../i18n/editorial.mjs';

// Web-only links from an article to the matching browser tool.
const TOOL_LINKS = {
  'b1-07': { hash: '#nefes', labelIndex: 0 },
  'b3-02': { hash: '#kriz-bekcisi', labelIndex: 1 },
  'b3-03': { hash: '#kriz-bekcisi', labelIndex: 1 },
  'b3-04': { hash: '#yontem-4d', labelIndex: 2 },
  'b3-09': { hash: '#kriz-plani', labelIndex: 3 },
};

// Editorial connections use existing app articles. They complement the linear
// chapter order with a relevant next step in another chapter.
const RELATED_ARTICLES = {
  'b1-01': ['b2-01', 'b3-01'],
  'b1-02': ['b2-03', 'b3-05'],
  'b1-03': ['b2-05', 'b3-10'],
  'b1-04': ['b3-09', 'b2-08'],
  'b1-05': ['b2-02', 'b3-05'],
  'b1-06': ['b1-08', 'b3-10'],
  'b1-07': ['b3-04', 'b2-04'],
  'b1-08': ['b2-01', 'b3-02'],
  'b1-09': ['b2-01', 'b3-09'],
  'b2-01': ['b1-01', 'b3-01'],
  'b2-02': ['b1-05', 'b3-05'],
  'b2-03': ['b1-02', 'b3-07'],
  'b2-04': ['b1-07', 'b3-04'],
  'b2-05': ['b1-03', 'b3-10'],
  'b2-06': ['b1-02', 'b3-05'],
  'b2-07': ['b3-06', 'b3-08'],
  'b2-08': ['b1-04', 'b3-09'],
  'b2-09': ['b1-05', 'b3-10'],
  'b3-01': ['b1-08', 'b2-01'],
  'b3-02': ['b1-07', 'b2-04'],
  'b3-03': ['b1-08', 'b2-01'],
  'b3-04': ['b1-07', 'b2-04'],
  'b3-05': ['b1-05', 'b2-02'],
  'b3-06': ['b2-07', 'b3-08'],
  'b3-07': ['b2-03', 'b3-08'],
  'b3-08': ['b1-06', 'b2-07'],
  'b3-09': ['b1-04', 'b2-08'],
  'b3-10': ['b1-02', 'b2-08'],
  'b3-11': ['b1-04', 'b2-08'],
};

const editorialLabels = (ctx) => editorialCopy(ctx.lang).knowledge;

const prettify = (text) => String(text).replace(/\s->\s/g, ' → ');

export const displayTitle = (article, section) =>
  /^(?:bölüm özeti|chapter summary|resumen del capítulo|kapitelzusammenfassung|résumé (?:du chapitre|de la section))$/iu.test(article.title.trim()) ? `${section.title}: ${article.title}` : article.title;

function itemContent(text) {
  const { lead, rest } = splitLead(prettify(text));
  return lead ? html`<strong>${lead}:</strong> ${rest}` : html`${rest}`;
}

function postRow(ctx, article, section) {
  const { t, url } = ctx;
  const title = displayTitle(article, section);
  const key = searchKey(
    article.title,
    article.summary,
    article.intro,
    section.title,
    article.contentSections.map((c) => [c.title, c.body, c.items]),
    article.keyTakeaways,
  );
  return html`<li class="post-row" data-search="${key}" data-category="${ctx.sectionSlug(section.id)}">
      <a class="post-row__link" href="${url.article(article.id)}">
        <span class="post-row__num" aria-hidden="true">${article.order}</span>
        <span class="post-row__title">${title}</span>
        <span class="post-row__summary">${article.summary}</span>
        <span class="post-row__meta">${t.common.readTime(article.estimatedReadMinutes)}</span>
      </a>
    </li>`;
}

export function knowledgeIndexPage(ctx) {
  const { t, url } = ctx;
  const k = t.knowledge;
  const totalArticles = ctx.sections.reduce((n, s) => n + s.articles.length, 0);
  const totalMinutes = ctx.sections.reduce((n, s) => n + s.minutes, 0);
  const labels = editorialLabels(ctx);
  const [featuredEntry, ...otherEntries] = k.entries;
  const featured = ctx.articleById(featuredEntry.id);
  const featuredSection = ctx.sectionById(featured.sectionId);

  const main = html`<div class="page-head">
  <div class="wrap">
    <h1>${k.title}</h1>
    <p class="lead">${k.lead}</p>
    <p class="page-head__meta">${k.stats(ctx.sections.length, totalArticles, totalMinutes)}</p>
    <div class="kc-discovery" id="yazilar">
      <form class="search" role="search" action="${url.knowledge()}" method="get" data-kc-search data-found="${k.search.found}" data-none="${k.search.none}">
        <label for="kc-q">${k.search.label}</label>
        <div class="search__field">
          <input id="kc-q" name="q" type="search" placeholder="${k.search.placeholder}" autocomplete="off" enterkeyhint="search">
          <button class="search__clear" type="button" data-kc-clear hidden aria-label="${k.search.clear}">×</button>
        </div>
        <p class="search__status" data-kc-status role="status" aria-live="polite"></p>
        <input type="hidden" name="bolum" value="" data-kc-category-input disabled>
        <button class="visually-hidden" type="submit">${k.search.submit}</button>
      </form>
      <nav class="kc-categories" aria-label="${k.sectionsNav}">
        <p class="kc-categories__label">${labels.browse}</p>
        <ul>
          <li><a href="${url.knowledge()}#yazilar" data-kc-category="" aria-current="true">${labels.all}<span>${totalArticles}</span></a></li>
          ${ctx.sections.map((s) => html`<li><a href="${url.section(s.id)}" data-kc-category="${ctx.sectionSlug(s.id)}">${s.title}<span>${s.articles.length}</span></a></li>`)}
        </ul>
      </nav>
    </div>
    <div class="kc-start" data-kc-entries role="group" aria-label="${k.entryTitle}">
      <article class="kc-featured" aria-labelledby="kc-featured-title">
        <p class="label">${featuredEntry.label}</p>
        <h2 id="kc-featured-title"><a href="${url.article(featured.id)}">${displayTitle(featured, featuredSection)}</a></h2>
        <p class="kc-featured__intro">${featured.intro || featured.summary}</p>
        <div class="kc-featured__footer">
          <a class="text-link" href="${url.article(featured.id)}">${labels.read}</a>
          <span class="meta muted">${t.common.readTime(featured.estimatedReadMinutes)}</span>
        </div>
      </article>
      <ul class="kc-shortcuts">
        ${otherEntries.map((e) => {
          const a = ctx.articleById(e.id);
          const s = ctx.sectionById(a.sectionId);
          return html`<li class="entry-point">
          <p class="label">${e.label}</p>
          <h2><a href="${url.article(a.id)}">${displayTitle(a, s)}</a></h2>
          <p>${a.summary}</p>
          <p class="meta muted">${t.common.readTime(a.estimatedReadMinutes)}</p>
        </li>`;
        })}
      </ul>
    </div>
  </div>
</div>
<div class="wrap">
  <div class="no-results" data-kc-empty hidden><p>${k.search.empty}</p></div>
  ${ctx.sections.map((s) => html`<section class="kc-section" id="${ctx.sectionSlug(s.id)}" data-kc-section="${ctx.sectionSlug(s.id)}" aria-labelledby="${ctx.sectionSlug(s.id)}-title">
    <div class="kc-section__head">
      <span class="label">${t.common.sectionLabel(s.order)}</span>
      <h2 id="${ctx.sectionSlug(s.id)}-title">${s.title}</h2>
      <p>${s.description}</p>
      <p class="meta muted">${t.common.articleCount(s.articles.length)}, ${t.common.readTime(s.minutes)}</p>
    </div>
    <ol class="post-list">
      ${s.articles.map((a) => postRow(ctx, a, s))}
    </ol>
  </section>`)}
  <p class="medical-note">${k.source} ${t.common.medicalNote}</p>
</div>`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.article.breadcrumbHome, item: url.abs(url.home()) },
      { '@type': 'ListItem', position: 2, name: k.title, item: url.abs(url.knowledge()) },
    ],
  };
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: k.title,
    description: k.description,
    url: url.abs(url.knowledge()),
    inLanguage: ctx.localeConfig.htmlLang,
    hasPart: ctx.allArticles.map((a) => ({
      '@type': 'Article',
      headline: displayTitle(a, ctx.sectionById(a.sectionId)),
      url: url.abs(url.article(a.id)),
    })),
  };

  return {
    path: url.knowledge(),
    title: `${k.metaTitle} | ${t.meta.titleSuffix}`,
    ogTitle: k.metaTitle,
    description: k.description,
    ogImage: '/assets/og/bilgi-merkezi.png',
    current: 'knowledge',
    bodyClass: 'knowledge-index',
    main,
    jsonLd: [breadcrumb, collection],
    scripts: ['/assets/js/knowledge.js'],
    styles: ['/assets/css/knowledge.css'],
  };
}

export function articlePage(ctx, article) {
  const { t, url, config } = ctx;
  const section = ctx.sectionById(article.sectionId);
  const title = displayTitle(article, section);
  const index = section.articles.findIndex((a) => a.id === article.id);
  const flat = ctx.allArticles;
  const flatIndex = flat.findIndex((a) => a.id === article.id);
  const prev = flat[flatIndex - 1];
  const next = flat[flatIndex + 1];
  const path = url.article(article.id);
  const takeawayTitle = article.contentSections.some((c) => c.title.trim().toLocaleLowerCase(ctx.lang) === t.common.takeaways.toLocaleLowerCase(ctx.lang))
    ? t.common.takeawaysAlt
    : t.common.takeaways;
  const isCrisisSection = section.order === 3;
  const labels = editorialLabels(ctx);
  const toolInfo = TOOL_LINKS[article.id];
  const tool = toolInfo ? { ...toolInfo, label: labels.tools[toolInfo.labelIndex] } : null;
  const related = (RELATED_ARTICLES[article.id] || []).map((id) => ctx.articleById(id)).filter(Boolean);
  const sectionAnchor = (i) => `yazi-bolum-${i + 1}`;

  const body = article.contentSections.map((c, i) => html`<h2 id="${sectionAnchor(i)}">${c.title}</h2>
      ${c.body ? html`<p>${prettify(c.body)}</p>` : ''}
      ${c.items.length
        ? (c.numbered
          ? html`<ol>${c.items.map((i) => html`<li>${itemContent(i)}</li>`)}</ol>`
          : html`<ul>${c.items.map((i) => html`<li>${itemContent(i)}</li>`)}</ul>`)
        : ''}`);

  const cta = isCrisisSection
    ? html`<aside class="context-cta" aria-labelledby="cta-title">
        <h2 id="cta-title">${t.article.crisisCta.title}</h2>
        <p>${t.article.crisisCta.text}</p>
        <a class="btn btn--primary" href="${url.tools(tool ? tool.hash : '#kriz-bekcisi')}">${tool ? tool.label : t.article.crisisCta.link}</a>
        <div class="article-app-support">
          <h3>${t.article.appCta.title}</h3>
          <p>${t.article.appCta.text}</p>
          ${storeBadges(ctx)}
        </div>
      </aside>`
    : html`<aside class="context-cta" aria-labelledby="cta-title">
        <h2 id="cta-title">${t.article.appCta.title}</h2>
        <p>${t.article.appCta.text}</p>
        ${tool ? html`<p><a class="text-link" href="${url.tools(tool.hash)}">${tool.label}</a></p>` : ''}
        ${storeBadges(ctx)}
      </aside>`;

  const main = html`<div class="wrap article-layout">
  <nav class="breadcrumb" aria-label="${t.a11y.breadcrumb}">
    <ol>
      <li><a href="${url.home()}">${t.article.breadcrumbHome}</a></li>
      <li><a href="${url.knowledge()}">${t.knowledge.title}</a></li>
      <li><a href="${url.section(section.id)}">${section.title}</a></li>
    </ol>
  </nav>
  <div class="article-grid">
    <article class="article-main" aria-labelledby="article-title">
      <header class="article-head">
        <p class="label"><a href="${url.section(section.id)}">${t.common.sectionLabel(section.order)}: ${section.title}</a></p>
        <h1 id="article-title">${title}</h1>
        <p class="lead dek">${article.summary}</p>
        <div class="article-meta">
          <span>${t.common.readTimeLong(article.estimatedReadMinutes)}</span>
          <span>${t.article.position(index + 1, section.articles.length)}</span>
          <div class="share" data-share data-url="${url.abs(path)}" data-title="${title}">
            <button type="button" data-share-native hidden>${t.common.share}</button>
            <button type="button" data-share-copy data-done="${t.common.copied}">${t.common.copyLink}</button>
            <span class="share__status" data-share-status role="status" aria-live="polite"></span>
          </div>
        </div>
      </header>
      ${article.contentSections.length > 1 ? html`<nav class="article-section-index" aria-labelledby="article-section-index-title">
        <h2 id="article-section-index-title">${labels.onPage}</h2>
        <ol>${article.contentSections.map((c, i) => html`<li><a href="#${sectionAnchor(i)}">${c.title}</a></li>`)}</ol>
      </nav>` : ''}
      <div class="prose">
        ${article.intro ? html`<p class="intro">${prettify(article.intro)}</p>` : ''}
        ${body}
        ${article.keyTakeaways.length ? html`<section class="takeaways" aria-labelledby="takeaways-title">
          <h2 id="takeaways-title">${takeawayTitle}</h2>
          ${article.keyTakeaways.map((k) => html`<p>${prettify(k)}</p>`)}
        </section>` : ''}
      </div>
      ${cta}
      <p class="medical-note">${t.common.medicalNote}</p>
      ${related.length ? html`<section class="article-related" aria-labelledby="article-related-title">
        <h2 id="article-related-title">${labels.related}</h2>
        <ul>${related.map((a) => html`<li>
          <a href="${url.article(a.id)}">${displayTitle(a, ctx.sectionById(a.sectionId))}</a>
          <span>${t.common.readTime(a.estimatedReadMinutes)}</span>
        </li>`)}</ul>
      </section>` : ''}
      <nav aria-label="${t.article.prev} / ${t.article.next}">
        <ul class="pager">
          ${prev ? html`<li><a href="${url.article(prev.id)}" rel="prev"><span>${t.article.prev}</span><strong>${displayTitle(prev, ctx.sectionById(prev.sectionId))}</strong></a></li>` : ''}
          ${next ? html`<li class="pager__next-item"><a class="pager__next" href="${url.article(next.id)}" rel="next"><span>${t.article.next}</span><strong>${displayTitle(next, ctx.sectionById(next.sectionId))}</strong></a></li>` : ''}
        </ul>
      </nav>
    </article>
    <aside class="article-aside" aria-labelledby="aside-title">
      <h2 id="aside-title">${t.article.inSection}</h2>
      <ol class="toc-list">
        ${section.articles.map((a) => html`<li><a href="${url.article(a.id)}"${a.id === article.id ? html` aria-current="page"` : ''}>${displayTitle(a, section)}</a></li>`)}
      </ol>
      <p class="small toc-back"><a class="text-link" href="${url.knowledge()}">${t.article.backToKc}</a></p>
    </aside>
  </div>
</div>`;

  const ogImage = ctx.ogFor(`/assets/og/${ctx.articleSlug(article.id)}.png`);
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: article.summary,
    inLanguage: ctx.localeConfig.htmlLang,
    url: url.abs(path),
    mainEntityOfPage: url.abs(path),
    image: [url.abs(ogImage)],
    datePublished: ctx.articlePublishedAt(article.id),
    dateModified: ctx.articleModifiedAt(article.id),
    articleSection: section.title,
    timeRequired: `PT${article.estimatedReadMinutes}M`,
    author: { '@type': 'Organization', name: config.siteName, url: `${config.baseUrl}/` },
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      logo: { '@type': 'ImageObject', url: url.abs('/assets/brand/app-icon-512.png') },
    },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.article.breadcrumbHome, item: url.abs(url.home()) },
      { '@type': 'ListItem', position: 2, name: t.knowledge.title, item: url.abs(url.knowledge()) },
      { '@type': 'ListItem', position: 3, name: section.title, item: url.abs(url.section(section.id)) },
      { '@type': 'ListItem', position: 4, name: title, item: url.abs(path) },
    ],
  };

  return {
    path,
    title: `${title} | ${config.siteName} ${t.knowledge.title}`,
    ogTitle: title,
    description: article.summary,
    ogType: 'article',
    ogImage,
    current: 'knowledge',
    bodyClass: 'article-page',
    styles: ['/assets/css/knowledge.css'],
    articlePublished: ctx.articlePublishedAt(article.id),
    articleModified: ctx.articleModifiedAt(article.id),
    main,
    jsonLd: [articleLd, breadcrumb],
  };
}
