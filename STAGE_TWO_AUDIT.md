---
published: false
---

# Stage two audit — 5 October 2026

The live website and checkout already contain the first platform transformation. This pass extends that implementation; it does not replace it.

## Keep

- Newsreader / Source Sans 3, paper/sand surfaces, #43C682 brand green and dark green accessible links.
- Static dependency-free HTML generation in `_build`, 29 readable article routes, browser crisis/breathing/plan tools, real optimized app screenshots.
- Current public navigation (Knowledge Center, guide, tools, community, app); authentication disabled through `AUTH_UI_ENABLED`, with code preserved.
- Existing Apple and Google store URLs, PDF, hosting/verification files, legal routes and all four legal languages.
- Semantic layouts, skip links, responsive navigation, visible focus, reduced-motion support, local fonts, AVIF/WebP images.

## Gaps to close

- Hero does not yet use “Sigaradan Sonsuza Kadar Kurtul.” or the guide as the main CTA. No dedicated explanation of the habit cycle.
- Hero motion reveals the bitmap with a mask, rather than telling the cigarette → break → infinity story.
- Homepage timeline is lengthy and repeats absolute health summaries. The raw app dataset is real, but that alone does not verify each claim. Display only corroborated milestones with careful wording and source links.
- Guide is dominated by app journey stages; visitors need a direct index for preparation, first day/week, cravings, triggers, slips and support.
- Knowledge Center lacks category filtering and a clearly featured article. Articles need in-page navigation and contextual related reading.
- Community rules take substantial homepage space; keep them accessible while leading with real support and small wins.
- Article publication date is later than its modification date. Sitemap dates are tied to build time. Refresh title/description and homepage sharing image.

## Source verification

Flutter app: sibling `Sigara_Savar/quitSmoke`, revision `51d3c38f`. Existing content exports match all 20 locale payloads without changes: 3 categories, 29 articles, 26 health goals, 6 breathing techniques, 12 journey stages per locale. No content sync or invented articles needed. The model has no external citation metadata.

## Verification plan

Build and serve locally; inspect desktop/mobile layouts at 360, 390, 430, 768, 1024, 1280, 1440 px. Check category/search history, article anchors, guide links, crisis/breathing controls, navigation keyboard behavior, legal language switching, reduced motion, semantic SEO, internal links, console errors and asset sizes. Record new findings rather than reusing the previous pass’s QA claims.
