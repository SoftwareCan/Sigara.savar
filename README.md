# Sigara Savar website

The public smoking-cessation information and support platform at [sigarasavar.com](https://www.sigarasavar.com/). The website is pre-rendered HTML with small progressive-enhancement scripts; visitors can read the Knowledge Center, follow the quitting guide and use browser tools without an account or app installation.

## Build and preview

Use Node.js 20 or newer. From the repository root:

```powershell
node _build/build.mjs
node _build/verify.mjs
node _build/serve.mjs
```

Open [the local preview](http://127.0.0.1:4173/). Stop the server with Ctrl+C. The preview supports readable directory routes, correct content types and the custom 404 page. It binds only to this computer and excludes hidden directories and `_build` source files.

The equivalent commands inside `_build` are `npm run build`, `npm run verify` and `npm run serve`. The build, checks and preview require no installed packages. If a managed execution sandbox prevents Node from resolving the Windows user-directory ancestry, run the same standard commands in a normal authorized local terminal; this is an execution-environment restriction.

## Content and routes

- `/bilgi-merkezi/` and `/bilgi-merkezi/<readable-slug>/`: 29 real app articles across 3 chapters.
- `/birakma-rehberi/`: guided reading paths into those articles.
- `/araclar/`: crisis flow, breathing exercises and a printable personal plan.
- Existing `/privacy.html`, `/terms.html` and `/userDataDeletion.html`: preserved multilingual legal documents.

Templates live in `_build/templates`, website copy in `_build/i18n/tr.mjs`, and the design in `assets/css`. Generated HTML is committed in the repository root and route directories; edit its source template and rebuild rather than editing generated pages.

Knowledge Center, health, breathing and journey data comes from the Flutter project `Sigara_Savar/quitSmoke`. `_build/content/SOURCE.json` records the source revision and paths. With the sibling Flutter checkout available, sync from `_build` with:

```powershell
npm run sync
npm run build
npm run verify
```

Readable slugs are maintained in `_build/content/slugs.json`. Keep `_build/content/publication-history.json` committed: it preserves real publication dates, changes article modification dates only when article content changes, and avoids refreshing sitemap dates for unchanged content or shared navigation/cache updates. A sync timestamp alone does not make an article newly updated.

## Verification and preservation

The static checker inspects all public pages for broken internal paths and fragments, duplicate IDs, exactly one main heading, unique titles, canonical and social metadata, Article dates, source-content completeness, image dimensions, sitemap inclusion, paused-authentication links and unverified rating claims. It also compares legal content inside `<main>` with Git HEAD when available. Browser verification is still needed for responsive layout, keyboard interaction, reduced motion and real tool behavior.

The build refreshes legal navigation and metadata while checking that document text inside `<main>` stays unchanged. Authentication remains paused via `AUTH_UI_ENABLED: false` in `_build/site.config.mjs`; existing authentication files are retained and marked `noindex`.

Store URLs, public origin and legal/auth file lists have one source in `_build/site.config.mjs`. Homepage and article sharing images live in `assets/og`. The optional OG generator supports `--only default` when only homepage copy changes; it uses the existing development browser tooling and is separate from the dependency-free website build.
