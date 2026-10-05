import { html } from '../lib/html.mjs';
import { splitLead } from '../lib/util.mjs';
import { verifiedHealth, healthSourceNote, healthSources } from '../lib/health.mjs';
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
  { id: 'hazirlanma', title: 'Bırakmaya hazırlanma', articleId: 'b1-04', related: ['b1-02', 'b1-05'] },
  { id: 'birakma-gunu', title: 'Bırakma günü', articleId: 'b1-07', related: ['b3-09'] },
  { id: 'ilk-24-saat', title: 'İlk 24 saat', articleId: 'b1-08', related: ['b1-07', 'b3-02'] },
  { id: 'ilk-hafta', title: 'İlk hafta', articleId: 'b3-09', related: ['b1-08', 'b2-01'] },
  { id: 'krizler', title: 'İstek geldiğinde', articleId: 'b3-04', related: ['b3-02', 'b3-03'] },
  { id: 'tetikleyiciler', title: 'Tetikleyicilerini tanı', articleId: 'b1-05', related: ['b2-02', 'b3-05'] },
  { id: 'kayma-sonrasi', title: 'Yeniden sigara içtiysen', articleId: 'b3-08', related: ['b3-06', 'b3-07'] },
  { id: 'yeni-rutin', title: 'Rutini değiştirme', articleId: 'b2-04', related: ['b2-02', 'b2-05'] },
  { id: 'destek-alma', title: 'Destek alma', articleId: 'b1-06', related: ['b1-04'] },
];

function readingPhases(ctx) {
  return html`<ol class="guide-phases">
    ${READING_PHASES.map((phase, index) => {
      const article = ctx.articleById(phase.articleId);
      return html`<li class="guide-phase" id="${phase.id}">
        <div class="guide-phase__head">
          <span class="guide-phase__number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
          <h3>${phase.title}</h3>
        </div>
        <div class="guide-phase__body">
          <p>${article.summary}</p>
          <p class="guide-phase__article"><a href="${ctx.url.article(article.id)}">${article.title}</a><span>${ctx.t.common.readTime(article.estimatedReadMinutes)}</span></p>
          <ul class="guide-phase__related" aria-label="${phase.title}: ilgili yazılar">
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
  const prep = ctx.articleById(g.prepare.sourceId);
  const fourD = ctx.articleById('b3-04');
  const fourDItems = fourD.contentSections.flatMap((c) => c.items);
  const stages = ctx.content.journey;
  const milestones = verifiedHealth(ctx.content);
  const totalArticles = ctx.sections.reduce((count, section) => count + section.articles.length, 0);
  const toc = [
    ['okuma-yolu', 'Sürecine göre başla'],
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
      <p class="label">Bir sonraki adımın</p>
      <h2 id="okuma-yolu-title">Şu an nerede olduğundan başla.</h2>
      <p class="lead">Hazırlanıyor, ilk günleri geçiriyor ya da yeniden deniyor olabilirsin. Sana uygun başlığı seç; her adım Bilgi Merkezi’ndeki kısa yazılara açılır.</p>
    </div>
    <nav class="guide-quick-start" aria-label="Hızlı başlangıç">
      <a href="#ilk-24-saat">İlk günüm</a>
      <a href="#krizler">Şu an sigara istiyorum</a>
      <a href="#kayma-sonrasi">Yeniden sigara içtim</a>
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
      <p class="lead">İlk dakikalardan uzun vadeye, sigarayı bırakmanın genel sağlık kazanımları.</p>
      <p class="muted small">${healthSourceNote}</p>
    </div>
    <details class="guide-disclosure">
      <summary>${milestones.length} sağlık dönüm noktasını gör</summary>
      <ol class="recovery-table guide-health">
        ${milestones.map((h) => html`<li><strong>${h.duration}</strong><div><p>${h.summary}</p><p class="guide-health__detail">${h.detail}</p><a class="guide-health__source" href="${h.source.url}">${h.source.label}</a></div></li>`)}
      </ol>
    </details>
    <p class="guide-sources">Kaynaklar: ${healthSources.map((source, index) => html`${index ? ' · ' : ''}<a href="${source.url}">${source.label}</a>`)}</p>
  </section>

  <section class="guide-block" id="yolculuk" aria-labelledby="yolculuk-title">
    <div class="guide-block__head">
      <h2 id="yolculuk-title">${g.journey.title}</h2>
      <p class="lead">${g.journey.lead}</p>
    </div>
    <details class="guide-disclosure">
      <summary>Uygulamadaki ${stages.length} aşamayı gör</summary>
      <ol class="guide-journey-index">
        ${stages.map((stage) => html`<li><span class="guide-journey-index__number" aria-hidden="true">${String(stage.level).padStart(2, '0')}</span><strong>${stage.title}</strong><span>${stage.dayLabel}</span></li>`)}
      </ol>
      ${relatedList(ctx, ['b1-04', 'b1-07', 'b1-08'], 'İlk günler için herkese açık yazılar')}
      <p class="journey__inapp">${g.journey.inApp}</p>
    </details>
  </section>

  <section class="guide-block guide-library" aria-labelledby="tum-yazilar-title">
    <div class="guide-block__head">
      <h2 id="tum-yazilar-title">Bilgi Merkezi’ndeki tüm yazılar</h2>
      <p class="lead">${g.reading.lead}</p>
    </div>
    <details class="guide-disclosure">
      <summary>${ctx.sections.length} bölümdeki ${totalArticles} yazıyı gör</summary>
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
    <div><h2 id="guide-app-title">Bu desteği cebinde taşı.</h2><p>Bilgi Merkezi’ne dön, ilerlemeni takip et; zor anlar için araçlarını yanında tut.</p></div>
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
