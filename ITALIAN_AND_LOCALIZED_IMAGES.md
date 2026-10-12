# Italian and localized artwork

Completed 12 October 2026. Changes are in the local repository; no production deployment was performed.

## Delivered

- Seven public languages: Turkish, English, German, Spanish, French, Brazilian Portuguese and Italian.
- Italian homepage, 29 real Knowledge Center articles, quitting guide, tools, download page, search labels, accessibility labels, legal navigation and three complete legal-document translations.
- Italian educational content imported from the existing Flutter app, not newly invented articles. Existing six-language legal bodies remain unchanged.
- The supplied artwork is now used for each language in the hero and the three homepage feature sections. All seven images appear in each gallery. Turkish retains the previous app screenshots in addition to its supplied artwork.
- Four-second automatic gallery transitions, without navigation/playback controls, retained. Existing reduced-motion, offscreen and hidden-tab behavior retained.
- Italian content and translated image alternatives available in the existing admin workspace. Media inventory now includes language subdirectories. Older image drafts retain edited values and gain missing locale fields. Admin credentials and authentication are unchanged.
- A two-page Italian downloadable guide, sourced directly from Italian app articles `b3-02` and `b3-04`, replaces the Turkish PDF link on the Italian tools page. This is a localized educational edition, not a literal translation of the old PDF. The original Turkish PDF and other language editions are unchanged.

## Routes and SEO

- `/it/`
- `/it/centro-informazioni/` and 29 readable Italian article slugs
- `/it/guida-per-smettere/`
- `/it/strumenti/`
- `/it/scarica/`
- `/privacy.html?lang=it`, `/terms.html?lang=it`, `/userDataDeletion.html?lang=it`

Italian pages include unique titles/descriptions, canonical URLs, reciprocal language alternates, OpenGraph/Twitter text, Article and breadcrumb data where applicable, and sitemap entries. Existing publication dates are retained; new Italian article dates are recorded by the publication-history mechanism.

## Sources

Flutter project: `../Sigara_Savar/quitSmoke`, revision recorded in `_build/content/SOURCE.json` (`edef3e19` for Italian).

- `lib/features/explore/system_posts/data/knowledge_center_content_it.dart`
- `lib/features/health/presentation/data/health_goals_l10n.dart` (`kHealthGoalsIt`)
- `lib/features/games/presentation/data/breathing_exercise_l10n.dart` (`kBreathingTechniquesIt`)
- `lib/features/progress/domain/growth_insights_l10n.dart` (`kJourneyMapMilestonesIt`)
- `lib/l10n/app_it.arb`

Artwork: the supplied `AppStrore/HazırTR`, `HazırEN`, `HazırDE`, `HazırES`, `HazırFR`, `HazırPT`, `HazırIT` folders. Existing TR/EN/DE/ES manifests match the supplied originals by SHA-256. French filenames (`FR1.png`, `FR2 .png`, etc.) are supported by the optimizer without renaming user files.

## Files

Created:

- `_build/i18n/it.mjs`, `_build/content/it/*.json`
- `_build/content/gallery-{fr,pt-BR,it}.json`
- `assets/gallery/{fr,pt-BR,it}/`: 84 optimized image variants
- `it/`: 34 generated Italian pages
- `_build/verify-localization.mjs`
- `_build/create-italian-guide.py`, `assets/guides/guida-desiderio-it.pdf`

Updated sources:

- `_build/site.config.mjs`, `_build/sync-flutter-content.mjs`, `_build/optimize-gallery.py`
- `_build/content/{slugs,SOURCE,publication-history}.json`
- `_build/i18n/{home,editorial,gallery}.mjs`
- `_build/lib/{health,admin,admin-home}.mjs`
- `_build/templates/{home,gallery,layout,knowledge,legal,tools}.mjs`
- `assets/css/home.css`, `assets/js/admin-media.js`, `lang.js`
- `privacy.html`, `terms.html`, `userDataDeletion.html`, `_build/verify.mjs`
- Generated public HTML and `sitemap.xml`, plus README documentation.

## Verification

- Build successful.
- Static verification: 242 public pages, one noindex admin login; 19,453 local references, 1,652 source-content checks and 1,666 language-route checks passed. Existing legal blocks preserved.
- Localization verification: complete dictionary shapes, all seven artwork sets, all 196 AVIF/WebP variants and their manifest sizes passed.
- Gallery checks: four-second autoplay, looping, reduced motion, visibility handling, image failures and pending image decode cancellation passed.
- Italian homepage tested at 360, 390, 430, 768, 1024, 1280 and 1440px, without horizontal overflow.
- All seven homepages checked at 390 and 1440px: no horizontal overflow or broken active gallery images.
- Italian mobile navigation, article layout, guide, tools, download page, legal language switching and search verified in the browser. Search for `nicotina` returned 11 articles.
- Both PDF pages rendered and visually inspected; Italian download link verified.

No production dependencies or animation libraries added. Image variants are 360/720px, AVIF/WebP, with dimensions and lazy loading. Originals are unchanged. The existing brand, store destinations, public authentication pause and legal meaning are preserved.

## Running checks

```powershell
node --preserve-symlinks --preserve-symlinks-main _build/build.mjs
node --preserve-symlinks --preserve-symlinks-main _build/verify.mjs
node --preserve-symlinks --preserve-symlinks-main _build/verify-localization.mjs
node --preserve-symlinks --preserve-symlinks-main _build/verify-gallery.mjs
```

Remaining: deploy through the existing hosting workflow when desired. The admin workspace still manages local drafts/export; this update does not add automatic production publishing. The shared social-sharing bitmap is unchanged; localized metadata text is present.
