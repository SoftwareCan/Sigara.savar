import { html } from '../lib/html.mjs';
import { splitLead } from '../lib/util.mjs';
import { verifiedHealth, healthSourceNoteFor, healthSourcesFor } from '../lib/health.mjs';
import { editorialCopy } from '../i18n/editorial.mjs';
import { storeBadges } from './components.mjs';
import { displayTitle } from './knowledge.mjs';

function relatedList(ctx, ids, heading) {
  return html`<div class="related">
    <h3>${heading}</h3>
    <ul>
      ${ids.map((id) => {
        const a = ctx.articleById(id);
        return html`<li><a href="${ctx.url.article(id)}">${displayTitle(a, ctx.sectionById(a.sectionId))}</a></li>`;
      })}
    </ul>
  </div>`;
}

// The guide is an index into existing app articles, not a separate medical plan.
const READING_PHASES = [
  { id: 'hazirlanma', articleId: 'b1-04', related: ['b1-02', 'b1-05'] },
  { id: 'birakma-gunu', articleId: 'b1-07', related: ['b3-09'] },
  { id: 'ilk-24-saat', articleId: 'b1-08', related: ['b1-07', 'b3-02'] },
  { id: 'ilk-hafta', articleId: 'b3-09', related: ['b1-08', 'b2-01'] },
  { id: 'krizler', articleId: 'b3-04', related: ['b3-02', 'b3-03'] },
  { id: 'tetikleyiciler', articleId: 'b1-05', related: ['b2-02', 'b3-05'] },
  { id: 'kayma-sonrasi', articleId: 'b3-08', related: ['b3-06', 'b3-07'] },
  { id: 'yeni-rutin', articleId: 'b2-04', related: ['b2-02', 'b2-05'] },
  { id: 'destek-alma', articleId: 'b1-06', related: ['b1-04'] },
];

function readingPhases(ctx) {
  const labels = editorialCopy(ctx.lang).guide;
  return html`<ol class="guide-phases">
    ${READING_PHASES.map((phase, index) => {
      const article = ctx.articleById(phase.articleId);
      const title = labels.phases[index];
      return html`<li class="guide-phase" id="${phase.id}">
        <div class="guide-phase__head">
          <span class="guide-phase__number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
          <h3>${title}</h3>
        </div>
        <div class="guide-phase__body">
          <p>${article.summary}</p>
          <p class="guide-phase__article"><a href="${ctx.url.article(article.id)}">${article.title}</a><span>${ctx.t.common.readTime(article.estimatedReadMinutes)}</span></p>
          <ul class="guide-phase__related" aria-label="${title}: ${labels.related}">
            ${phase.related.map((id) => html`<li><a href="${ctx.url.article(id)}">${ctx.articleById(id).title}</a></li>`)}
          </ul>
        </div>
      </li>`;
    })}
  </ol>`;
}

export function guidePage(ctx) {
  const { t, url } = ctx;
  const g = t.guide;
  const labels = editorialCopy(ctx.lang).guide;
  const prep = ctx.articleById(g.prepare.sourceId);
  const fourD = ctx.articleById('b3-04');
  const fourDItems = fourD.contentSections.flatMap((c) => c.items);
  const stages = ctx.content.journey;
  const milestones = verifiedHealth(ctx.content, ctx.lang);
  const sourceNote = healthSourceNoteFor(ctx.lang);
  const sources = healthSourcesFor(ctx.lang);
  const totalArticles = ctx.sections.reduce((count, section) => count + section.articles.length, 0);
  const toc = [
    ['okuma-yolu', labels.byStage],
    ['hazirlik', g.prepare.title],
    ['zor-anlar', g.hardMoments.title],
    ['saglik', g.recovery.title],
    ['yolculuk', g.journey.title],
  ];
  const relatedHeading = t.knowledge.title;

  const main = html`<div class="page-head">
  <div class="wrap">
    <h1>${g.title}</h1>
    <p class="lead">${g.lead}</p>
    <nav class="page-toc" aria-labelledby="toc-title">
      <h2 id="toc-title">${g.toc}</h2>
      <ol>${toc.map(([id, label]) => html`<li><a href="#${id}">${label}</a></li>`)}</ol>
    </nav>
  </div>
</div>

<div class="wrap">
  <section class="guide-block guide-reading" id="okuma-yolu" aria-labelledby="okuma-yolu-title">
    <div class="guide-block__head">
      <p class="label">${labels.nextStep}</p>
      <h2 id="okuma-yolu-title">${labels.start}</h2>
      <p class="lead">${labels.intro}</p>
    </div>
    <nav class="guide-quick-start" aria-label="${labels.quick}">
      <a href="#ilk-24-saat">${labels.quickLinks[0]}</a>
      <a href="#krizler">${labels.quickLinks[1]}</a>
      <a href="#kayma-sonrasi">${labels.quickLinks[2]}</a>
    </nav>
    ${readingPhases(ctx)}
  </section>

  <section class="guide-block" id="hazirlik" aria-labelledby="hazirlik-title">
    <div class="guide-block__head">
      <h2 id="hazirlik-title">${g.prepare.title}</h2>
      <p class="lead">${g.prepare.lead}</p>
    </div>
    <ol class="steps">
      ${prep.contentSections.map((c) => html`<li><h3>${c.title}</h3><p>${c.body}</p></li>`)}
    </ol>
    ${relatedList(ctx, [g.prepare.sourceId, ...g.prepare.related], relatedHeading)}
  </section>

  <section class="guide-block" id="zor-anlar" aria-labelledby="zor-anlar-title">
    <div class="guide-block__head">
      <h2 id="zor-anlar-title">${g.hardMoments.title}</h2>
      <p class="lead">${g.hardMoments.lead}</p>
    </div>
    <ol class="steps">
      ${fourDItems.map((item) => {
        const { lead, rest } = splitLead(item);
        return html`<li><h3>${lead || item}</h3>${lead ? html`<p>${rest}</p>` : ''}</li>`;
      })}
    </ol>
    <p class="related">
      <a class="btn btn--primary" href="${url.tools('#kriz-plani')}">${g.hardMoments.planLink}</a>
      <a class="btn btn--ghost" href="${url.tools()}">${g.hardMoments.toolsLink}</a>
    </p>
    ${relatedList(ctx, g.hardMoments.related, relatedHeading)}
  </section>

  <section class="guide-block" id="saglik" aria-labelledby="saglik-title">
    <div class="guide-block__head">
      <h2 id="saglik-title">${g.recovery.title}</h2>
      <p class="lead">${labels.recoveryLead}</p>
      <p class="muted small">${sourceNote}</p>
    </div>
    <details class="guide-disclosure">
      <summary>${labels.milestones(milestones.length)}</summary>
      <ol class="recovery-table guide-health">
        ${milestones.map((h) => html`<li><strong>${h.duration}</strong><div><p>${h.summary}</p><p class="guide-health__detail">${h.detail}</p><a class="guide-health__source" href="${h.source.url}">${h.source.label}</a></div></li>`)}
      </ol>
    </details>
    <p class="guide-sources">${labels.sources}: ${sources.map((source, index) => html`${index ? ' · ' : ''}<a href="${source.url}">${source.label}</a>`)}</p>
  </section>

  <section class="guide-block" id="yolculuk" aria-labelledby="yolculuk-title">
    <div class="guide-block__head">
      <h2 id="yolculuk-title">${g.journey.title}</h2>
      <p class="lead">${g.journey.lead}</p>
    </div>
    <details class="guide-disclosure">
      <summary>${labels.stages(stages.length)}</summary>
      <ol class="guide-journey-index">
        ${stages.map((stage) => html`<li><span class="guide-journey-index__number" aria-hidden="true">${String(stage.level).padStart(2, '0')}</span><strong>${stage.title}</strong><span>${stage.dayLabel}</span></li>`)}
      </ol>
      ${relatedList(ctx, ['b1-04', 'b1-07', 'b1-08'], labels.earlyArticles)}
      <p class="journey__inapp">${g.journey.inApp}</p>
    </details>
  </section>

  <section class="guide-block guide-library" aria-labelledby="tum-yazilar-title">
    <div class="guide-block__head">
      <h2 id="tum-yazilar-title">${labels.allArticles}</h2>
      <p class="lead">${g.reading.lead}</p>
    </div>
    <details class="guide-disclosure">
      <summary>${labels.library(ctx.sections.length, totalArticles)}</summary>
    <div class="reading-path">
      ${ctx.sections.map((s) => html`<div>
        <p class="label">${t.common.sectionLabel(s.order)}</p>
        <h3><a href="${url.section(s.id)}">${s.title}</a></h3>
        <ol>${s.articles.map((a) => html`<li><a href="${url.article(a.id)}">${displayTitle(a, s)}</a></li>`)}</ol>
      </div>`)}
    </div>
    </details>
  </section>
  <p class="medical-note">${t.common.medicalNote}</p>
  <aside class="guide-app" aria-labelledby="guide-app-title">
    <div><h2 id="guide-app-title">${labels.appTitle}</h2><p>${labels.appText}</p></div>
    <div>${storeBadges(ctx)}<p class="small muted">${t.stores.note}</p></div>
  </aside>
</div>`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.article.breadcrumbHome, item: url.abs(url.home()) },
      { '@type': 'ListItem', position: 2, name: g.title, item: url.abs(url.guide()) },
    ],
  };

  return {
    path: url.guide(),
    title: `${g.metaTitle} | ${t.meta.titleSuffix}`,
    ogTitle: g.metaTitle,
    description: g.description,
    ogImage: '/assets/og/birakma-rehberi.png',
    current: 'guide',
    bodyClass: 'guide-page',
    styles: ['/assets/css/guide.css'],
    main,
    jsonLd: [breadcrumb],
  };
}
