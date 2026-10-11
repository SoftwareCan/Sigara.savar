import { html } from '../lib/html.mjs';
import { screenPicture } from './components.mjs';
import { galleryCopy } from '../i18n/gallery.mjs';

function storePicture(ctx, number, alt, eager = false) {
  const name = `store-${String(number).padStart(2, '0')}`;
  const localeFolder = ['en', 'de', 'es'].includes(ctx.lang) ? `${ctx.lang}/` : '';
  const path = (size, type) => ctx.asset(`/assets/gallery/${localeFolder}${name}-${size}.${type}`);
  return html`<picture>
    <source type="image/avif" srcset="${path(360, 'avif')} 360w, ${path(720, 'avif')} 720w" sizes="(min-width: 1100px) 250px, (min-width: 760px) 210px, 160px">
    <img src="${path(720, 'webp')}" srcset="${path(360, 'webp')} 360w, ${path(720, 'webp')} 720w" sizes="(min-width: 1100px) 250px, (min-width: 760px) 210px, 160px" width="1242" height="2688" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" fetchpriority="${eager ? 'high' : 'auto'}" decoding="async">
  </picture>`;
}

export function heroGallery(ctx, h) {
  const g = galleryCopy(ctx.lang);
  const currentScreen = (name, eager) => screenPicture(ctx, name, name === 'gelisim' ? h.alts.progress : h.alts.journey, { sizes: '(min-width: 1100px) 250px, (min-width: 760px) 210px, 160px', eager });
  const scenes = ['en', 'de', 'es'].includes(ctx.lang) ? [
    [['store', 1], ['store', 2]],
    [['store', 3], ['store', 4]],
    [['store', 5], ['store', 6]],
    [['store', 7], ['store', 1]],
  ] : [
    [['screen', 'gelisim'], ['screen', 'yolculuk-detoks']],
    [['store', 1], ['store', 2]],
    [['store', 3], ['store', 4]],
    [['store', 5], ['store', 6]],
    [['store', 7], ['screen', 'gelisim']],
  ];
  return html`<div class="home-hero__visual hero-gallery" role="region" aria-roledescription="${g.carousel}" aria-label="${g.name}" data-hero-gallery>
    <div class="hero-gallery__stage" id="hero-gallery-stage">
      ${scenes.map((pair, index) => html`<div class="hero-gallery__scene${index === 0 ? ' is-active' : ''}" role="group" aria-roledescription="${g.slide}" aria-label="${index + 1} / ${scenes.length}" data-gallery-scene${index ? html` hidden aria-hidden="true"` : ''}>
        ${pair.map(([type, asset], position) => html`<div class="home-phone home-phone--${position ? 'back' : 'front'}${type === 'store' ? ' home-phone--store' : ''}">${type === 'store' ? storePicture(ctx, asset, g.alts[asset - 1], index === 0) : currentScreen(asset, index === 0)}</div>`)}
      </div>`)}
    </div>
  </div>`;
}
