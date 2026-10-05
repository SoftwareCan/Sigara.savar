import { html } from '../lib/html.mjs';
import { splitLead } from '../lib/util.mjs';
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

export function guidePage(ctx) {
  const { t, url } = ctx;
  const g = t.guide;
  const prep = ctx.articleById(g.prepare.sourceId);
  const fourD = ctx.articleById('b3-04');
  const fourDItems = fourD.contentSections.flatMap((c) => c.items);
  const stages = ctx.content.journey;
  const open = stages.filter((s) => !s.requiresPremium);
  const locked = stages.filter((s) => s.requiresPremium);
  const toc = [
    ['hazirlik', g.prepare.title],
    ['yolculuk', g.journey.title],
    ['saglik', g.recovery.title],
    ['zor-anlar', g.hardMoments.title],
    ['okuma-yolu', g.reading.title],
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

  <section class="guide-block" id="yolculuk" aria-labelledby="yolculuk-title">
    <div class="guide-block__head">
      <h2 id="yolculuk-title">${g.journey.title}</h2>
      <p class="lead">${g.journey.lead}</p>
    </div>
    <ol class="journey">
      ${open.map((s) => html`<li class="journey__stage journey__stage--open">
        <span class="journey__num" aria-hidden="true">${s.level}</span>
        <h3>${s.title}</h3>
        <p class="journey__when">${s.dayLabel}</p>
        <div class="journey__detail">
          <div><h4>${g.journey.developments}</h4><p>${s.developments}</p></div>
          <div><h4>${g.journey.attention}</h4><ul>${s.attentionPoints.map((p) => html`<li>${p}</li>`)}</ul></div>
          <div class="traps"><h4>${g.journey.traps}</h4><ul>${s.traps.map((p) => html`<li>“${p}”</li>`)}</ul></div>
        </div>
      </li>`)}
      <li class="journey__stage">
        <span class="journey__num" aria-hidden="true">${locked[0].level}</span>
        <h3>${g.journey.lockedTitle(locked[0].level, locked[locked.length - 1].level)}</h3>
        <ul class="journey__locked">
          ${locked.map((s) => html`<li><span>${s.title}</span><span>${s.dayLabel}</span></li>`)}
        </ul>
        <p class="journey__inapp">${g.journey.inApp}</p>
        <div class="related">${storeBadges(ctx)}</div>
      </li>
    </ol>
  </section>

  <section class="guide-block" id="saglik" aria-labelledby="saglik-title">
    <div class="guide-block__head">
      <h2 id="saglik-title">${g.recovery.title}</h2>
      <p class="lead">${g.recovery.lead}</p>
      <p class="muted small">${t.home.recovery.note}</p>
    </div>
    <ol class="recovery-table">
      ${ctx.content.health.map((h) => html`<li><strong>${h.duration}</strong><span>${h.summary}</span></li>`)}
    </ol>
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

  <section class="guide-block" id="okuma-yolu" aria-labelledby="okuma-yolu-title">
    <div class="guide-block__head">
      <h2 id="okuma-yolu-title">${g.reading.title}</h2>
      <p class="lead">${g.reading.lead}</p>
    </div>
    <div class="reading-path">
      ${ctx.sections.map((s) => html`<div>
        <p class="label">${t.common.sectionLabel(s.order)}</p>
        <h3><a href="${url.section(s.id)}">${s.title}</a></h3>
        <ol>${s.articles.map((a) => html`<li><a href="${url.article(a.id)}">${displayTitle(a, s)}</a></li>`)}</ol>
      </div>`)}
    </div>
  </section>
  <p class="medical-note">${t.common.medicalNote}</p>
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
    main,
    jsonLd: [breadcrumb],
  };
}
