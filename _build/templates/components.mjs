import { html, jsonAttr } from '../lib/html.mjs';

export const SCREEN_SIZES = {
  kupalar: [720, 1561],
};

export function screenPicture(ctx, name, alt, { sizes = '(min-width: 960px) 22rem, 74vw', eager = false } = {}) {
  const [w, h] = SCREEN_SIZES[name] || [720, 1558];
  const src = (width, ext) => ctx.asset(`/assets/screens/${name}-${width}.${ext}`);
  return html`<picture>
      <source type="image/avif" srcset="${src(360, 'avif')} 360w, ${src(720, 'avif')} 720w" sizes="${sizes}">
      <img src="${src(720, 'webp')}" srcset="${src(360, 'webp')} 360w, ${src(720, 'webp')} 720w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" fetchpriority="${eager ? 'high' : 'auto'}" decoding="async">
    </picture>`;
}

export function markPicture(ctx, { alt, eager = false }) {
  return html`<picture>
      <source type="image/avif" srcset="${ctx.asset('/assets/brand/mark-white.avif')}">
      <img src="${ctx.asset('/assets/brand/mark-white.webp')}" width="700" height="362" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" fetchpriority="${eager ? 'high' : 'auto'}" decoding="async">
    </picture>`;
}

export function storeBadges(ctx) {
  const { t, config } = ctx;
  return html`<div class="store-badges">
      <a href="${config.stores.appStore}" rel="noopener"><img src="${ctx.asset('/assets/badges/app-store-tr.svg')}" width="151" height="40" alt="${t.stores.appStoreLong}" loading="lazy" decoding="async"></a>
      <a href="${config.stores.googlePlay}" rel="noopener"><img src="${ctx.asset('/assets/badges/google-play-tr.png')}" width="404" height="120" alt="${t.stores.googlePlayLong}" loading="lazy" decoding="async"></a>
    </div>`;
}

// Smooth, asymmetric "urge wave": quick rise, short peak, long decline.
const WAVE_PATH = 'M0 186 C60 186 110 176 150 140 C190 104 205 30 250 26 C300 22 320 70 360 110 C410 158 480 182 600 186';

export function waveTool(ctx, { headingId, headingLevel = 3, title }) {
  const { t, app } = ctx;
  const c = t.crisisTool;
  const heading = headingLevel === 2
    ? html`<h2 id="${headingId}">${title || t.tools.crisis.title}</h2>`
    : html`<h3 id="${headingId}">${title || t.tools.crisis.title}</h3>`;
  const labels = {
    inhale: c.breath.inhale,
    hold: c.breath.hold,
    exhale: c.breath.exhale,
    ready: t.tools.breathing.ready,
    done: app.crisisGuardianRoundComplete,
    started: `${app.crisisGuardianStep1Title}. ${app.crisisGuardianStep1Watch}`,
    lessTitle: app.crisisGuardianControlMessage,
    lessText: c.lessMessage,
    stillTitle: app.crisisGuardianSignalNotNeed,
    stillText: `${c.stillTitle} ${c.stillMessage}`,
  };
  return html`<div class="wave-tool" data-wave-tool data-labels="${jsonAttr(labels)}">
      ${heading}
      <p class="wave-tool__step"><strong>${app.crisisGuardianStep1Title}.</strong> ${app.crisisGuardianStep1Watch}</p>
      <ol class="wave-tool__static">
        <li>${app.crisisGuardianStep1Title}. ${app.crisisGuardianStep1Watch}</li>
        <li>${app.crisisGuardianStep2Title}</li>
        <li>${app.crisisGuardianStep3Title}</li>
      </ol>
      <div class="wave-tool__live">
        <figure class="wave-tool__figure">
          <svg class="wave-tool__svg" viewBox="0 0 600 200" role="img" aria-label="${c.waveLabel}: ${c.phases.join(', ')}">
            <line class="wave-tool__base" x1="0" y1="186" x2="600" y2="186"></line>
            <path class="wave-tool__ghost" d="${WAVE_PATH}"></path>
            <path class="wave-tool__path" d="${WAVE_PATH}" data-wave-path></path>
            <circle class="wave-tool__dot" r="7" cx="0" cy="186" data-wave-dot></circle>
          </svg>
          <ol class="wave-tool__phases" aria-hidden="true">
            ${c.phases.map((p) => html`<li data-wave-phase>${p}</li>`)}
          </ol>
        </figure>
        <div class="wave-tool__status">
          <p><span class="visually-hidden">${c.remaining}: </span><span class="wave-tool__time" data-wave-time>1:30</span></p>
          <p class="wave-tool__breath" aria-hidden="true"><strong data-wave-breath-name></strong><span data-wave-breath-count></span></p>
        </div>
        <p class="wave-tool__note">${c.breathNote}</p>
        <div class="wave-tool__actions">
          <button class="btn btn--light" type="button" data-wave-start>${c.start}</button>
          <button class="btn btn--outline-light" type="button" data-wave-finish hidden>${c.finish}</button>
        </div>
        <div class="wave-tool__question" data-wave-question hidden>
          <h4 tabindex="-1" data-wave-question-title>${app.crisisGuardianStep1Question}</h4>
          <p>${app.crisisGuardianStep1QuestionHint}</p>
          <div class="wave-tool__actions">
            <button class="btn btn--light" type="button" data-wave-answer="yes">${c.yes}</button>
            <button class="btn btn--outline-light" type="button" data-wave-answer="no">${c.no}</button>
          </div>
        </div>
        <div class="wave-tool__result" data-wave-result hidden>
          <strong tabindex="-1" data-wave-result-title></strong>
          <p data-wave-result-text></p>
          <div class="wave-tool__actions">
            <button class="btn btn--outline-light" type="button" data-wave-restart>${c.restart}</button>
          </div>
        </div>
        <p class="wave-tool__note">${c.appLink}</p>
        <p class="visually-hidden" aria-live="polite" data-wave-live></p>
      </div>
    </div>`;
}
