# Sigara Savar — product design and five languages

9 October 2026. This is the current iteration; it supersedes the earlier minimalist/balanced homepage in HOMEPAGE_REFINEMENT.md.

## Design direction and audit

The previous version relied on one small screenshot and sparse text columns. It preserved content but did not provide the product presence or visual rhythm the user wanted. QuitNow’s live English homepage was inspected visually: a confident colour field, genuine product screens, short feature stories and clear conversion points are its useful principles. Competitor assets, testimonials, download counts and ratings were not reused.

The new homepage uses Sigara Savar green (#43C682), deep green text (#123C2C), white (#FFFFFF), a quiet reading surface (#F5F8F6), and light mint (#E6F4EB). Source Sans 3 carries the product headings and body; the existing Newsreader logo and editorial article typography remain. Content stays inside the existing controlled width. Green hero → alternating product stories → useful reading → green download section creates a deliberate rhythm.

## Implemented

- Green hero with two genuine app screens (Gelişim and Yolculuk), a natural two-line desktop slogan and clear download/guide actions.
- Three short stories for progress/achievements, craving support and community. Real trophies, crisis-area and Explore screenshots replace generic feature cards.
- Three real article previews; detailed education, health timeline and tools remain on their dedicated pages.
- Working header and footer language navigation in Turkish, English, German, Spanish and French. Switching an article keeps the same article in the target language.
- All 29 Knowledge Center articles available in each of the five languages, using the app’s real translations. Guide, tools, download page and interface labels are localized too.
- Accent-insensitive search handles Turkish characters, French/Spanish accents and German ß.
- © 2026 Sigara Savar® with the translated rights-reserved text.
- A single 700 ms product entrance using transform/opacity, disabled by prefers-reduced-motion. No animation library or homepage JavaScript.

## Routes

| Language | Home | Knowledge Center | Guide | Tools | Download |
| --- | --- | --- | --- | --- | --- |
| Türkçe | / | /bilgi-merkezi/ | /birakma-rehberi/ | /araclar/ | /indir/ |
| English | /en/ | /en/knowledge-center/ | /en/quit-guide/ | /en/tools/ | /en/download/ |
| Deutsch | /de/ | /de/wissenszentrum/ | /de/rauchstopp-leitfaden/ | /de/werkzeuge/ | /de/herunterladen/ |
| Español | /es/ | /es/centro-de-informacion/ | /es/guia-para-dejar/ | /es/herramientas/ | /es/descargar/ |
| Français | /fr/ | /fr/centre-de-connaissances/ | /fr/guide-arret-tabac/ | /fr/outils/ | /fr/telecharger/ |

Each Knowledge Center has 29 readable individual article slugs. The original Turkish URLs remain intact.

## Source files

Flutter checkout: ../Sigara_Savar/quitSmoke (read only).

- lib/features/explore/system_posts/data/knowledge_center_content.dart
- lib/features/explore/system_posts/data/knowledge_center_content_en.dart
- lib/features/explore/system_posts/data/knowledge_center_content_de.dart
- lib/features/explore/system_posts/data/knowledge_center_content_es.dart
- lib/features/explore/system_posts/data/knowledge_center_content_fr.dart
- lib/features/health/presentation/data/health_goals_l10n.dart
- lib/features/games/presentation/data/breathing_exercise_l10n.dart
- lib/features/progress/domain/growth_insights.dart and growth_insights_l10n.dart
- lib/l10n/app_{tr,en,de,es,fr}.arb

Existing TR/EN/DE/ES data was preserved. French data was imported from the real French sources. Per-language import dates and source revisions are recorded in _build/content/SOURCE.json.

## Files created

- _build/i18n/home.mjs — the new homepage copy in five languages.
- _build/i18n/en.mjs, de.mjs, es.mjs, fr.mjs — localized interface dictionaries.
- _build/i18n/editorial.mjs — localized guide, article and download labels.
- _build/content/fr/{knowledge,health,breathing,journey,app-strings}.json.
- assets/css/languages.css.
- Generated routes in en/, de/, es/, fr/ (34 pages per language).
- This report.

## Files modified

- _build/templates/home.mjs, layout.mjs, knowledge.mjs, guide.mjs, tools.mjs, download.mjs, components.mjs, legal.mjs.
- _build/build.mjs, site.config.mjs, sync-flutter-content.mjs, verify.mjs.
- _build/lib/health.mjs, util.mjs.
- _build/content/slugs.json, SOURCE.json, publication-history.json.
- assets/css/home.css, site.css; assets/js/site.js, knowledge.js; lang.js.
- Generated Turkish pages, shared legal chrome, sitemap.xml and documentation.

## SEO and performance

Unique localized titles/descriptions, canonical URLs, five reciprocal hreflang links plus x-default, alternate OpenGraph locales, Article/Breadcrumb structured data and sitemap coverage. Source article publication history is preserved. Existing branded favicon, apple-touch icon, manifest and sharing images remain.

No dependencies were added. All pages are pre-rendered HTML. Fonts remain local (about 74 KB combined). Homepage CSS is about 10 KB uncompressed. Screens use responsive AVIF/WebP with fixed dimensions; below-the-fold images are lazy loaded. The two 360 px hero AVIFs total about 36 KB. These are asset sizes, not a claimed Lighthouse score or a real-user speed measurement.

## QA completed

- Build and static verifier: 174 public pages, 12,595 local references, 1,180 source-content checks, 850 equivalent-language route checks passed.
- All five homepages tested at 360, 390, 430, 768, 1024, 1280 and 1440 px (35 combinations), no horizontal overflow against document client width.
- 14 additional narrow/wide checks across translated Knowledge Center, guide, tools and download pages passed.
- Mobile navigation, French language selection, accent-free French search, French-to-German article switching and the localized crisis flow tested in the browser.
- Genuine store badges loaded; registered-mark copyright visible; inspected browser console had no warnings/errors.
- Desktop and mobile screenshots inspected. Motion has a reduced-motion fallback; visible focus styles and semantic controls preserved.
- Legal main content continues to match Git HEAD exactly. JavaScript syntax checks passed.

## Intentionally unchanged / remaining recommendations

Existing legal documents, paused authentication, store destinations, actual article bodies and the Flutter app are preserved. Legal documents retain their original language coverage: French readers are clearly linked to English legal text; the data-deletion document uses English for German/Spanish too. Language query parameters select the supported document without rewriting it.

Application screenshots and existing social-sharing artwork remain Turkish. Localized screenshots and approved French legal translations would complete those remaining asset/document gaps. The PDF remains Turkish and is explicitly labelled as such. A native-language editorial review is recommended before international publishing. No production deployment was performed.
