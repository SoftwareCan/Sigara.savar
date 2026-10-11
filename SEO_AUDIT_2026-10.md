# Sigara Savar technical SEO audit

Live audit: **10 October 2026**; final local validation: **11 October 2026**, Europe/Istanbul. Scope: the existing static website, its article templates, search metadata, crawl signals and the new local content workspace. The final local implementation supports six languages following the Brazilian Portuguese expansion. No public deployment or search-engine submission was performed.

## Evidence and limits

The committed baseline passed the repository checker: **174 public HTML documents, 173 sitemap URLs, 145 sourced article pages, 1,180 source-content checks and 850 equivalent-language route checks**. The difference between document and sitemap counts is the deliberately excluded 404 page. There are 29 articles per language in Turkish, English, German, Spanish and French.

Public HTTP requests were made directly against the live site. The web text extractor returned an older cached homepage, so live response status, canonical and language-tag conclusions below use direct HTTP evidence instead of that cached representation. Search Console, Bing Webmaster Tools and CrUX account data were not connected. This audit makes no claims about rankings, keyword volumes, indexed-page counts, organic traffic or field Core Web Vitals scores.

| Live URL checked | Observed response | Meaning |
| --- | --- | --- |
| `https://www.sigarasavar.com/` | 200; self canonical; five language alternates plus `x-default` | Correct preferred homepage and language annotations |
| `https://www.sigarasavar.com/en/` | 200; English self canonical; equivalent alternates | Localized homepage is independently accessible |
| `/bilgi-merkezi/bagimlilik-nedir/` | 200; self canonical; equivalent alternates | Real article routes are available without login |
| `/robots.txt` | 200; permits crawling and names the HTTPS sitemap | Existing crawl discovery should be preserved |
| `/sitemap.xml` | 200; 173 URLs | Published sitemap is available; this is not an indexed-page count |
| An intentionally nonexistent route | 404 | Correct missing-page response, not a soft 404 |
| `https://sigarasavar.com/` | 301 to the HTTPS `www` homepage | Correct apex consolidation |
| `http://www.sigarasavar.com/` | **200; no redirect** | Hosting should redirect HTTP to HTTPS |
| `/index.html` | 200; canonical points to `/` | Duplicate entry URL is consolidated by canonical; a hosting redirect is optional |
| `/bilgi-merkezi/?q=nikotin` | 200; canonical points to `/bilgi-merkezi/` | Filter state does not create a new canonical content page |
| `/_build/site.config.mjs` | 404 | Build source was not publicly served in the checked deployment |
| `/admin/` before this implementation | 404 | New workspace has not been published by this task |

## Changes implemented

### 1. Make article ownership and dates visible

Article headers now identify **Sigara Savar** as the organization that prepared the content and show a localized publication date. An update date appears only when it differs from publication. Dates come from the existing per-article publication history and match `<time datetime>`, Article JSON-LD and Open Graph values. Article bodies and app-sourced facts are unchanged. No doctor, clinical reviewer, professional qualification or treatment claim was added.

Google recommends a visible, appropriately labelled publication or update date and agreement between visible and structured values. It also states that time is optional; only recorded calendar dates are emitted here, rather than invented publication times. [Google: byline dates](https://developers.google.com/search/docs/appearance/publication-dates)

### 2. Keep Article media truthful

The previous Article `image` field referenced generated cards consisting of a title and brand mark. That optional field is removed from Article JSON-LD because these pages contain no editorial illustrations. The existing cards remain useful Open Graph and Twitter sharing artwork, and the publisher’s actual logo remains organization metadata.

Google distinguishes representative article images from logos or captions and says Article properties should be included when they apply; no Article property is universally required. Removing an unsuitable image is more accurate than fabricating an illustration or implying rich-result eligibility. [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)

### 3. Shorten article title boilerplate

Individual titles now use `Article title | Sigara Savar`, keeping the article’s subject first and eliminating the repeated Knowledge Center suffix. Source titles are preserved, including chapter-summary disambiguation. Homepage brand titles are unchanged.

This follows Google’s advice to use concise descriptive titles, brand them briefly and avoid repetitive boilerplate. There is no artificial universal 60-character limit or keyword stuffing. [Google: title links](https://developers.google.com/search/docs/appearance/title-link)

### 4. Set explicit preview and workspace directives

Indexable pages permit `max-image-preview:large`, allowing a larger image preview when a search engine chooses one. This grants permission; it does not guarantee an image result, Discover eligibility or improved rankings. Existing noindex pages retain their exclusion. The new admin workspace receives `noindex, nofollow` and no language alternates.

Admin is excluded from sitemap and public links while remaining crawlable so crawlers can read its noindex instruction. A robots block would not reliably prevent indexing. Noindex is not authentication; this workspace operates on existing public content and browser-local drafts, and no private server records are introduced. [Google: robots meta directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)

### 5. Strengthen regression checks

The checker now verifies exactly one title, description and canonical; a query-free and fragment-free canonical; valid real calendar dates that are not in the future; visible author and date agreement with Article markup; H1/headline consistency; article social-date consistency; sitemap duplicate URLs, canonical targets and valid lastmod values; and admin exclusion from public links, language alternates and sitemap. Diagnostic URLs are bounded to avoid enormous data-URI output.

The existing tests continue to protect every app-sourced paragraph, item and takeaway in all five languages, along with internal paths/fragments, readable article slugs, reciprocal equivalent-language routes, auth exclusion, legal text and image dimensions.

## Good existing work preserved

- All articles are pre-rendered and reachable through ordinary links. Reading does not depend on client-side routing or authentication.
- Each language uses its own URL and self canonical. Reciprocal `hreflang` annotations include the page itself, its actual equivalents and the established Turkish fallback. Adding a duplicate XML annotation scheme is unnecessary: Google treats HTML, HTTP-header and sitemap implementations as equivalent alternatives. [Google: localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- The canonical HTTPS origin agrees across head metadata, internal routes and sitemap. Query filter state points to the collection canonical. [Google: canonical consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- Sitemap lastmod values already use substantive content history rather than advancing on every build. This matches both Google and Bing guidance; fabricated freshness, priority values and change frequencies were not added. [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Bing: accurate lastmod](https://blogs.bing.com/webmaster/2023/2/The-Importance-of-Setting-the-lastmod-Tag-in-Your-Sitemap/)
- Existing Organization, WebSite, Article, CollectionPage and BreadcrumbList data, favicon/logo assets, social metadata, paused authentication and multilingual legal documents remain in place. No rating, FAQ, medical-review or medical-device markup was invented.

## Remaining work in priority order

1. **At the next approved hosting change, enforce a permanent HTTP-to-HTTPS redirect.** The observed HTTP homepage serves 200; an HTML canonical and resource-upgrade policy do not replace a server redirect. Keep the already working apex-to-`www` redirect. Google treats permanent redirects as a stronger consolidation signal than sitemap inclusion. [Google: canonical signals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
2. **After an approved deployment, verify actual search-engine processing.** In Search Console and Bing Webmaster Tools, inspect representative home/article/guide pages in each language, confirm selected canonicals, sitemap processing and indexing exclusions, and run Google’s Rich Results Test. Sitemap discovery is already supported by robots.txt; account submission and coverage were not claimed or changed. [Google: Article validation workflow](https://developers.google.com/search/docs/appearance/structured-data/article), [Bing: sitemap management](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed)
3. **Use real search data for editorial priorities.** Review queries, pages and click-through patterns before expanding the current corpus. Extend educational content only from verified project material and credible documented sources. Medical review, reviewer identity and per-article references should be displayed only after an actual review or source mapping exists. Google places particular emphasis on trust for health-related information. [Google: helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
4. **Measure performance separately after deployment.** The existing static build, local fonts, image variants and small scripts are useful foundations, but they are not a measured Core Web Vitals result. Check real LCP, INP and CLS data and targeted lab traces for the hero gallery and reading pages before adding more visual work. Page experience matters alongside content relevance; passing a score does not guarantee ranking. [Google: page experience](https://developers.google.com/search/docs/appearance/page-experience)

## Validation status

The committed baseline passed the full static checker. Modified source files passed syntax and whitespace checks. Initial five-language browser testing covered the seven requested widths, homepage languages, article layout, and draft save/export workflows. Following the Brazilian Portuguese expansion and legal translations, final static verification on **11 October 2026** passed for **208 public pages and one separate noindex workspace**, with **16,116 local-reference checks, 1,416 source-content checks and 1,224 language-route checks**. Verification covers article/source fidelity, visible publication dates, canonical and language relationships, sitemap exclusions, and all six legal language versions. Every pre-existing legal language block remained byte-identical during translation; translated section structures, links and numeric dates/durations match English. This report distinguishes local implementation from unchanged production hosting.
