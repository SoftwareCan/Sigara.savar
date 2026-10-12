// Regression checks for complete dictionaries and locale-specific artwork.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import config from './site.config.mjs';
import english from './i18n/en.mjs';
import { homeCopy } from './i18n/home.mjs';
import { editorialCopy } from './i18n/editorial.mjs';
import { galleryCopy } from './i18n/gallery.mjs';
const root = new URL('../', import.meta.url);
function shape(reference, actual, key) {
  assert.equal(typeof actual, typeof reference, key);
  if (Array.isArray(reference)) assert.equal(actual.length, reference.length, key);
  if (reference && typeof reference === 'object') {
    for (const field of Object.keys(reference)) shape(reference[field], actual[field], `${key}.${field}`);
  }
}
let images = 0;
for (const [lang, locale] of Object.entries(config.locales).filter(([, item]) => item.enabled)) {
  const dictionary = (await import(`./i18n/${lang}.mjs`)).default;
  shape(english, dictionary, lang);
  shape(homeCopy('en'), homeCopy(lang), `${lang}.home`);
  shape(editorialCopy('en'), editorialCopy(lang), `${lang}.editorial`);
  shape(galleryCopy('en'), galleryCopy(lang), `${lang}.gallery`);
  const html = fs.readFileSync(new URL(`${locale.prefix ? `${locale.prefix}/` : ''}index.html`, root), 'utf8');
  const folder = `/assets/gallery/${lang === 'tr' ? '' : `${lang}/`}`;
  const art = [...html.matchAll(/<img[^>]+src="(\/assets\/gallery\/[^"?]+)/g)].map(match => match[1]);
  assert.ok(art.length >= 10, `${lang}: expected hero and feature artwork`);
  assert.ok(art.every(src => src.startsWith(folder)), `${lang}: wrong image locale`);
  for (let number = 1; number <= 7; number++) assert.ok(art.some(src => src.includes(`store-0${number}-`)), `${lang}: missing image ${number}`);
  const manifest = JSON.parse(fs.readFileSync(new URL(`_build/content/gallery${lang === 'tr' ? '' : `-${lang}`}.json`, root), 'utf8'));
  assert.equal(manifest.length, 7);
  for (const item of manifest) for (const variant of item.variants) {
    assert.equal(fs.statSync(new URL(variant.path.slice(1), root)).size, variant.bytes);
    images++;
  }
}
console.log(`Localization checks passed: 7 complete dictionaries, localized hero/features, ${images} image variants.`);
