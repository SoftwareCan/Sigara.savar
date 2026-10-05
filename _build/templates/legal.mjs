// Refreshes the chrome (head, header, footer) of the hand-maintained legal pages.
// The legal text inside <main> is never touched. The first run migrates the
// old header/footer; later runs only replace the marker-delimited regions.

import { headTags, siteFooter, siteHeader } from './layout.mjs';

const MARK = {
  head: ['<!-- site:head -->', '<!-- /site:head -->'],
  header: ['<!-- site:header -->', '<!-- /site:header -->'],
  footer: ['<!-- site:footer -->', '<!-- /site:footer -->'],
};

const TITLES = {
  'privacy.html': 'Gizlilik Politikası',
  'terms.html': 'Hizmet Şartları',
  'userDataDeletion.html': 'Veri Silme Talimatları',
};

const LANG_NAMES = { tr: 'Türkçe', en: 'English', es: 'Español', de: 'Deutsch' };

function replaceRegion(source, [start, end], content) {
  const a = source.indexOf(start);
  const b = source.indexOf(end);
  if (a < 0 || b < 0) throw new Error(`Marker ${start} missing`);
  return source.slice(0, a + start.length) + '\n' + content + '\n' + source.slice(b);
}

function pageMeta(ctx, file, source) {
  const description = (/<meta name="description"\s+content="([^"]*)"/s.exec(source) || [])[1] || '';
  return {
    path: `/${file}`,
    title: `${TITLES[file]} | ${ctx.t.meta.titleSuffix}`,
    description: description.replace(/\s+/g, ' ').trim(),
    current: null,
  };
}

function migrate(source) {
  const header = /<header>([\s\S]*?)<\/header>/.exec(source);
  const footer = /<footer>([\s\S]*?)<\/footer>/.exec(source);
  if (!header || !footer) throw new Error('Unexpected legal page structure');

  const titleSpans = (/<div>\s*<h1>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/.exec(header[1]) || [])[1] || '';
  const navInner = (/<nav[^>]*>([\s\S]*?)<\/nav>/.exec(header[1]) || [])[1] || '';
  const links = [...navInner.matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/g)]
    .filter(([, href]) => href !== 'index.html')
    .map(([, href, inner]) => `        <li><a href="/${href}">${inner.replace(/\s+/g, ' ').trim()}</a></li>`);
  const langs = [...header[1].matchAll(/data-lang="([a-z]{2})"/g)].map((m) => m[1]);
  const buttons = langs.map((l, i) => `        <button type="button" data-lang="${l}" lang="${l}" aria-label="${LANG_NAMES[l] || l}"${i === 0 ? ' class="active"' : ''}>${l.toUpperCase()}</button>`);
  const notes = [...footer[1].matchAll(/<p class="muted">([\s\S]*?)<\/p>/g)].map((m) => m[1].trim());

  const policyBar = `<section class="policy-bar" aria-labelledby="policy-title">
  <div class="wrap policy-bar__inner">
    <h1 class="policy-bar__title" id="policy-title">${titleSpans.replace(/\s+/g, ' ').trim()}</h1>
    <ul class="policy-bar__links">
${links.join('\n')}
    </ul>
    <div class="lang-switch" role="group" aria-label="Dil / Language">
${buttons.join('\n')}
    </div>
  </div>
</section>`;

  let out = source.replace(header[0], `${MARK.header[0]}\n${MARK.header[1]}\n${policyBar}`);
  const footnote = notes.length ? `<section class="policy-footnote" aria-label="Not / Note">\n    <p>${notes.join('</p>\n    <p>')}</p>\n</section>\n` : '';
  out = out.replace(footer[0], `${footnote}${MARK.footer[0]}\n${MARK.footer[1]}`);
  // Skip-link target; the legal text inside <main> stays byte-identical.
  out = out.replace(/<main>/, '<main id="icerik" tabindex="-1">');

  // Replace the old head links (icons, stylesheet) with the managed region; keep lang.js.
  out = out.replace(/(<head>)([\s\S]*?)(<script src="lang\.js[^"]*" defer><\/script>)/, (_, open, inner, langScript) => `${open}\n${MARK.head[0]}\n${MARK.head[1]}\n    ${langScript}`);
  if (!out.includes(MARK.head[0])) throw new Error('Could not place head marker');
  return out;
}

export function refreshLegalPage(ctx, file, source) {
  let out = source.includes(MARK.header[0]) ? source : migrate(source);
  const meta = pageMeta(ctx, file, source);
  out = replaceRegion(out, MARK.head, String(headTags(ctx, meta)).trim());
  out = replaceRegion(out, MARK.header, String(siteHeader(ctx, null)));
  out = replaceRegion(out, MARK.footer, String(siteFooter(ctx)));
  return out;
}

export function noindexAuthPage(source) {
  if (/<meta name="robots"/.test(source)) return source;
  return source.replace(/<meta charset="UTF-8">/i, (m) => `${m}\n  <meta name="robots" content="noindex, nofollow">`);
}

// Extracts <main>…</main> so the build can prove the legal text is unchanged.
export const mainContent = (source) => (/<main[^>]*>([\s\S]*?)<\/main>/.exec(source) || [])[1];
