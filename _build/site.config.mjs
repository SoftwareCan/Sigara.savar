// Single source of truth for the static build. Change, then run: node _build/build.mjs

export default {
  baseUrl: 'https://www.sigarasavar.com',
  siteName: 'Sigara Savar',
  // First web publication of the Bilgi Merkezi articles (Article.datePublished).
  contentPublished: '2026-10-04',

  // Website sign-in is paused. Keep false until the auth flow is finished:
  // no login entry points, no header-auth.js, no Firebase origins in the CSP.
  // Setting it to true restores the header account slot on the next build.
  AUTH_UI_ENABLED: false,

  defaultLocale: 'tr',
  // Only enabled locales are built. Source app content is synced in
  // _build/content/<lang>/; enabling one needs _build/i18n/<lang>.mjs and slugs.
  locales: {
    tr: {
      enabled: true,
      htmlLang: 'tr',
      ogLocale: 'tr_TR',
      prefix: '',
      routes: { knowledge: 'bilgi-merkezi', guide: 'birakma-rehberi', tools: 'araclar', download: 'indir' },
    },
    en: {
      enabled: true,
      htmlLang: 'en',
      ogLocale: 'en_US',
      prefix: 'en',
      routes: { knowledge: 'knowledge-center', guide: 'quit-guide', tools: 'tools', download: 'download' },
    },
    es: {
      enabled: true,
      htmlLang: 'es',
      ogLocale: 'es_ES',
      prefix: 'es',
      routes: { knowledge: 'centro-de-informacion', guide: 'guia-para-dejar', tools: 'herramientas', download: 'descargar' },
    },
    de: {
      enabled: true,
      htmlLang: 'de',
      ogLocale: 'de_DE',
      prefix: 'de',
      routes: { knowledge: 'wissenszentrum', guide: 'rauchstopp-leitfaden', tools: 'werkzeuge', download: 'herunterladen' },
    },
    fr: {
      enabled: true,
      htmlLang: 'fr',
      ogLocale: 'fr_FR',
      prefix: 'fr',
      routes: { knowledge: 'centre-de-connaissances', guide: 'guide-arret-tabac', tools: 'outils', download: 'telecharger' },
    },
  },

  // Official store links from the Flutter app (lib/core/constants/app_constants.dart).
  stores: {
    appStoreId: '6757662325',
    appStore: 'https://apps.apple.com/tr/app/sigara-savar/id6757662325?l=tr',
    androidPackage: 'com.quitsmoke.quit_smoke',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.quitsmoke.quit_smoke',
  },

  social: {
    instagram: 'https://www.instagram.com/sigara.savar',
  },

  supportEmail: 'sigarasavardestek@gmail.com',

  // Legal pages are maintained by hand; the build only refreshes their header/footer.
  legalPages: ['privacy.html', 'terms.html', 'userDataDeletion.html'],
  // Kept in the repo for later, never linked, never in the sitemap, always noindex.
  authPages: ['auth.html', 'dashboard.html'],
};
