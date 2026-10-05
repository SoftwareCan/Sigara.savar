import { html, jsonAttr } from '../lib/html.mjs';
import { splitLead } from '../lib/util.mjs';
import { storeBadges, waveTool } from './components.mjs';

// Extended exhale first: it is the technique the "Bırakma Günü" article suggests.
const ORDER = ['extended_exhale', 'box_breathing', 'equal_breathing', 'relaxing_breath', 'triangle_breathing', 'deep_breathing'];

export function toolsPage(ctx) {
  const { t, url, app } = ctx;
  const tl = t.tools;
  const techniques = [...ctx.content.breathing].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
  const fourD = ctx.articleById(tl.fourD.articleId);
  const fourDItems = fourD.contentSections.flatMap((c) => c.items);
  const nav = [
    ['kriz-bekcisi', tl.crisis.title],
    ['nefes', tl.breathing.title],
    ['yontem-4d', tl.fourD.title],
    ['kriz-plani', tl.plan.title],
    ['rehber-pdf', tl.pdf.title],
  ];
  const breathLabels = {
    inhale: tl.breathing.inhale,
    hold: tl.breathing.hold,
    exhale: tl.breathing.exhale,
    ready: tl.breathing.ready,
    start: tl.breathing.start,
    stop: tl.breathing.stop,
    cycle: tl.breathing.cycles('{n}'),
  };

  const main = html`<div class="page-head">
  <div class="wrap">
    <h1>${tl.title}</h1>
    <p class="lead">${tl.lead}</p>
    <nav class="tool-nav page-toc" aria-labelledby="tool-nav-title">
      <h2 id="tool-nav-title">${t.guide.toc}</h2>
      <ol>${nav.map(([id, label]) => html`<li><a href="#${id}">${label}</a></li>`)}</ol>
    </nav>
  </div>
</div>

<section class="tool-block tool-block--dark on-dark" id="kriz-bekcisi" aria-labelledby="kriz-title">
  <div class="wrap tool-split">
    <div class="tool-block__head">
      <h2 id="kriz-title">${tl.crisis.title}</h2>
      <p class="lead">${app.crisisGuardianWelcomeBody}</p>
      <ul class="resources">
        ${[['Info90', 'crisisGuardianInfo90'], ['InfoNotice', 'crisisGuardianInfoNotice'], ['InfoDelay', 'crisisGuardianInfoDelay']].map(([, key]) => html`<li class="resources__item">
          <h3>${app[`${key}Title`]}</h3>
          <p>${app[`${key}Body`]}</p>
        </li>`)}
      </ul>
    </div>
    <div class="tool-block__body">
      ${waveTool(ctx, { headingId: 'wave-title', title: tl.crisis.tryTitle })}
    </div>
  </div>
</section>

<div class="wrap">
  <section class="tool-block" id="nefes" aria-labelledby="nefes-title">
    <div class="tool-block__head">
      <h2 id="nefes-title">${tl.breathing.title}</h2>
      <p class="lead">${tl.breathing.lead}</p>
    </div>
    <div class="tool-block__body">
      <div class="breath" data-breath data-labels="${jsonAttr(breathLabels)}">
        <fieldset class="breath__choices">
          <legend>${tl.breathing.choose}</legend>
          <div class="breath__options">
            ${techniques.map((x, i) => html`<label class="breath__option">
              <input type="radio" name="teknik" value="${x.id}" data-inhale="${x.inhaleSeconds}" data-hold="${x.holdSeconds}" data-exhale="${x.exhaleSeconds}"${i === 0 ? html` checked` : ''}>
              <span><strong>${x.name}</strong><span>${tl.breathing.pattern(x.inhaleSeconds, x.holdSeconds, x.exhaleSeconds)}</span><span>${x.area}</span></span>
            </label>`)}
          </div>
        </fieldset>
        <div class="breath__stage">
          <div class="breath__circle">
            <span class="breath__ring" aria-hidden="true"></span>
            <span class="breath__fill" aria-hidden="true" data-breath-fill></span>
            <p class="breath__readout">
              <span class="breath__phase" data-breath-phase aria-live="polite"></span>
              <span class="breath__count" data-breath-count aria-hidden="true"></span>
            </p>
          </div>
          <p class="breath__meta" data-breath-meta>${tl.breathing.ready}</p>
          <button class="btn btn--primary" type="button" data-breath-toggle aria-pressed="false">${tl.breathing.start}</button>
        </div>
      </div>
      <p class="breath__safety">${tl.breathing.safety}</p>
    </div>
  </section>

  <section class="tool-block tool-split" id="yontem-4d" aria-labelledby="yontem-4d-title">
    <div class="tool-block__head">
      <h2 id="yontem-4d-title">${tl.fourD.title}</h2>
      <p class="lead">${tl.fourD.lead}</p>
      <p class="related"><a class="text-link" href="${url.article(fourD.id)}">${fourD.title}</a></p>
    </div>
    <div class="tool-block__body">
      <ol class="steps">
        ${fourDItems.map((item) => {
          const { lead, rest } = splitLead(item);
          return html`<li><h3>${lead || item}</h3>${lead ? html`<p>${rest}</p>` : ''}</li>`;
        })}
      </ol>
    </div>
  </section>

  <section class="tool-block tool-split" id="kriz-plani" aria-labelledby="plan-title">
    <div class="tool-block__head">
      <h2 id="plan-title">${tl.plan.title}</h2>
      <p class="lead">${tl.plan.lead}</p>
      <p class="related"><a class="text-link" href="${url.article(tl.plan.articleId)}">${ctx.articleById(tl.plan.articleId).title}</a></p>
    </div>
    <div class="tool-block__body">
      <div class="plan-form" data-plan data-saved="${tl.plan.saved}" data-clear="${tl.plan.clear}" data-confirm="${tl.plan.clearConfirm}">
        ${tl.plan.fields.map((f) => html`<div>
          <label for="plan-${f.id}">${f.label}</label>
          <textarea id="plan-${f.id}" name="${f.id}" rows="3" autocomplete="off"></textarea>
        </div>`)}
        <div class="plan-form__actions">
          <button class="btn btn--primary" type="button" data-plan-print>${tl.plan.print}</button>
          <button class="btn btn--ghost" type="button" data-plan-clear>${tl.plan.clear}</button>
          <p class="plan-form__status" data-plan-status role="status"></p>
        </div>
      </div>
    </div>
  </section>

  <section class="tool-block tool-split" id="rehber-pdf" aria-labelledby="pdf-title">
    <div class="tool-block__head">
      <h2 id="pdf-title">${tl.pdf.title}</h2>
      <p class="lead">${tl.pdf.text}</p>
    </div>
    <div class="tool-block__body">
      <a class="btn btn--ghost" href="${url.page('SigaraSavar.pdf')}" download>${tl.pdf.link}</a>
    </div>
  </section>

  <section class="tool-block" id="uygulamada" aria-labelledby="inapp-title">
    <div class="tool-block__head">
      <h2 id="inapp-title">${tl.inApp.title}</h2>
    </div>
    <div class="tool-block__body">
      <ul class="plain-cols">
        ${tl.inApp.items.map((i) => html`<li><strong>${i.title}</strong><p>${i.text}</p></li>`)}
      </ul>
      <div class="related">${storeBadges(ctx)}</div>
      <p class="medical-note">${t.footer.disclaimer}</p>
    </div>
  </section>
</div>`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.article.breadcrumbHome, item: url.abs(url.home()) },
      { '@type': 'ListItem', position: 2, name: tl.title, item: url.abs(url.tools()) },
    ],
  };

  return {
    path: url.tools(),
    title: `${tl.metaTitle} | ${t.meta.titleSuffix}`,
    ogTitle: tl.metaTitle,
    description: tl.description,
    ogImage: '/assets/og/araclar.png',
    current: 'tools',
    bodyClass: 'tools-page',
    main,
    jsonLd: [breadcrumb],
    scripts: ['/assets/js/wave.js', '/assets/js/tools.js'],
  };
}
