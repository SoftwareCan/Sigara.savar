// Website interface copy; educational content is synced from the application.
export default {
  locale: 'en', dateLocale: 'en-GB',
  meta: {
    siteDescription: 'Information, progress tracking and community for your smoke-free journey. Explore the free Knowledge Centre, craving tools and Sigara Savar app.',
    titleSuffix: 'Sigara Savar',
  },
  a11y: {
    skip: 'Skip to content', mainNav: 'Main navigation', mobileNav: 'Mobile navigation', breadcrumb: 'Breadcrumb', footerNav: 'Site links',
    external: '(opens in a new tab)', logoAlt: 'Sigara Savar logo', markAlt: 'Sigara Savar symbol: an infinity-shaped cigarette broken in the middle',
  },
  nav: {
    home: 'Home', knowledge: 'Knowledge Centre', guide: 'Quit Guide', tools: 'Tools', community: 'Community', app: 'The app', download: 'Get the app', menu: 'Menu', close: 'Close',
    crisisShortcut: 'Having a difficult moment? Try the 90-second exercise',
  },
  stores: {
    appStore: 'App Store', googlePlay: 'Google Play', appStoreLong: 'Download on the App Store', googlePlayLong: 'Get it on Google Play', iphone: 'For iPhone', android: 'For Android',
    note: 'Free to download. Some features require a Premium subscription.',
  },
  downloadPage: {
    title: 'Download Sigara Savar', metaTitle: 'Download Sigara Savar | iPhone and Android',
    description: 'Download Sigara Savar for free from the App Store for iPhone or Google Play for Android.', eyebrow: 'For iPhone and Android',
    lead: 'On your phone, this page opens the right app store for your device. You can also choose your store below.',
    detecting: 'Checking your device…', ios: 'Opening the App Store…', android: 'Opening Google Play…',
    desktop: 'Scan the QR code to continue on your phone, or choose your store.', other: 'Choose your store to continue.',
    cancel: 'Stop automatic redirect', cancelled: 'Automatic redirect stopped. Choose your store below.', qrTitle: 'Scan with your phone',
    qrText: 'This link automatically opens the right store for your phone.', privacy: 'Your device type is checked only on this page to open the right store.',
  },
  footer: {
    tagline: 'Information, progress tracking, support and community for quitting smoking.',
    groups: { site: 'Sigara Savar', support: 'Support', legal: 'Legal', app: 'Get the app' },
    contact: 'Contact', dataDeletion: 'Data deletion', privacy: 'Privacy Policy', terms: 'Terms of Service', crisisGuide: 'Nicotine Craving Guide (PDF, in Turkish)', instagram: 'Instagram',
    disclaimer: 'Sigara Savar is not a medical device. It does not provide medical advice, diagnosis, treatment, therapy, emergency assistance or a guaranteed smoking cessation programme. The content on this site is for general information. In an emergency, contact your local emergency services.',
    copyright: (year) => `© ${year} Sigara Savar® · All rights reserved.`,
  },
  common: {
    readTime: (m) => `${m}\u00a0min read`, readTimeLong: (m) => `${m}-minute read`, articleCount: (n) => `${n}\u00a0${n === 1 ? 'article' : 'articles'}`, sectionLabel: (n) => `Section\u00a0${n}`,
    takeaways: 'Key takeaways', takeawaysAlt: 'The main idea', share: 'Share', copyLink: 'Copy link', copied: 'Link copied',
    medicalNote: 'This content is for general information and is not a substitute for medical advice. Consult a healthcare professional about your own health.',
  },
  home: {},
  knowledge: {
    title: 'Knowledge Centre', metaTitle: 'Knowledge Centre: guides to quitting smoking',
    description: '29 short articles on nicotine dependence, withdrawal, cravings, triggers, slips and relapse. The Sigara Savar Knowledge Centre.',
    lead: 'Short articles to help you understand quitting smoking: how dependence works, what the first days can feel like, how to handle cravings and how to get back on track after a slip.',
    stats: (sections, articles, minutes) => `${sections} sections, ${articles} articles, ${minutes} minutes of reading in total`,
    search: {
      label: 'Search articles', placeholder: 'Try withdrawal, triggers, slips…', submit: 'Search', found: '{n} articles found', none: 'No matching articles',
      empty: 'No articles match your search. Try a shorter word or browse the sections.', clear: 'Clear search',
    },
    entryTitle: 'Two places to start', entries: [{ id: 'b1-01', label: 'If you want to start at the beginning' }, { id: 'b3-02', label: 'If you are dealing with a craving right now' }],
    sectionsNav: 'Sections', source: 'These articles come from the Knowledge Centre in the Sigara Savar app.',
  },
  article: {
    breadcrumbHome: 'Home', position: (i, n) => `Article ${i} of ${n} in this section`, prev: 'Previous article', next: 'Next article', inSection: 'Articles in this section', backToKc: 'Back to the Knowledge Centre',
    crisisCta: { title: 'If a craving has just arrived', text: 'The 90-second exercise takes you through what to do while you wait for the wave to pass.', link: 'Try the Crisis Guardian' },
    appCta: { title: 'These articles are in the app too', text: 'Alongside the Knowledge Centre, the Sigara Savar app helps you track your smoke-free time, health milestones and Journey Map.' },
  },
  guide: {
    title: 'Quit Guide', metaTitle: 'Quit smoking guide: from your decision to your first year',
    description: 'A step-by-step guide with articles from our Knowledge Centre: preparing to quit, quit day, the first week, cravings and getting back on track after a slip.',
    lead: 'From the day you decide to quit to your first year and beyond: explore what you may experience, steps you can try and where to find support.', toc: 'On this page',
    prepare: { title: 'Before you quit', lead: 'It can be hard to work everything out on quit day. Preparing ahead can make decisions easier, especially at the times when you would usually smoke without thinking.', sourceId: 'b1-04', related: ['b1-05', 'b1-07', 'b1-06'] },
    journey: {
      title: 'Journey Map', lead: 'The app’s Journey Map divides the process into 12 stages. Browse them below and open the freely available articles for the early days.',
      developments: 'What happens at this stage?', attention: 'Things to look out for', traps: 'Thought traps',
      inApp: 'The Journey Map in the app explains what happens at each stage, what to look out for and which thoughts can become traps.', lockedTitle: (from, to) => `Stages ${from}–${to}`,
    },
    recovery: { title: 'What changes in your body?', lead: 'A selection of the app’s health milestones, checked against public health sources. These timings are not an individual health assessment or a personal timetable.' },
    hardMoments: { title: 'For difficult moments', lead: 'Choosing what you will do before a craving arrives leaves you with fewer decisions to make in the moment.', planLink: 'Make your craving plan', toolsLink: 'Explore the tools', related: ['b3-02', 'b3-04', 'b3-08'] },
    reading: { title: 'Your reading path', lead: 'The Knowledge Centre is arranged to be read in order. Each section builds on the one before it.' },
  },
  tools: {
    title: 'Tools', metaTitle: 'Smoking cravings: breathing exercises, 90 seconds and a plan',
    description: 'Free tools to use in your browser when a craving arrives: the 90-second Crisis Guardian exercise, 6 breathing techniques, the 4D method and a personal craving plan.',
    lead: 'Tools you can use straight away, without an account. They work in your browser; anything you write stays on this device.',
    crisis: { title: 'Crisis Guardian: 90 seconds', tryTitle: 'Try it now', lead: 'A short web version of the Crisis Guardian exercise in the app.' },
    breathing: {
      title: 'Breathing exercises', lead: 'The app’s 6 techniques. Choose one and follow the rhythm.', choose: 'Technique', start: 'Start', stop: 'Stop', inhale: 'Breathe in', hold: 'Hold', exhale: 'Breathe out slowly', ready: 'Start when you are ready',
      cycles: (n) => `Round ${n}`, pattern: (i, h, e) => h ? `In for ${i}s, hold for ${h}s, out for ${e}s` : `In for ${i}s, out for ${e}s`,
      safety: 'If you feel dizzy, have chest pain, become short of breath or notice anything unusual, stop immediately and return to your normal breathing. If you have asthma, COPD, heart disease, are pregnant or have another health condition, consult a healthcare professional first.',
    },
    fourD: { title: 'The 4D method', lead: 'Four steps to give yourself a little space when a strong craving arrives.', articleId: 'b3-04' },
    plan: {
      title: 'My craving plan', lead: 'A plan to turn to instead of starting from scratch in a difficult moment. Your answers are saved in this browser and are not sent to us. You can also print them.', articleId: 'b3-09',
      fields: [{ id: 'triggers', label: 'My three strongest triggers' }, { id: 'first', label: 'The first thing I will do when a craving arrives' }, { id: 'place', label: 'A way I can change my surroundings' }, { id: 'person', label: 'Someone I can call or message' }, { id: 'sentence', label: 'A sentence to remind myself of' }],
      saved: 'Saved on this device', print: 'Print', clear: 'Clear', clearConfirm: 'Press again to clear', printTitle: 'My craving plan',
    },
    pdf: { title: 'Nicotine Craving Guide', text: 'A two-page summary of craving symptoms and techniques to try straight away. Available in Turkish.', link: 'Download PDF (2 pages, Turkish)' },
    inApp: {
      title: 'More tools in the app', items: [
        { title: 'Breath-hold Test', text: 'Records how long you can hold your breath. It is not a medical measurement.' },
        { title: 'Water Reminder', text: 'A daily water goal and reminders.' },
        { title: 'Journal', text: 'A place to note difficult moments and small wins.' },
        { title: 'Quiz', text: 'Challenge friends and learn together.' },
        { title: 'Short games', text: 'Snake, Bubble Pop, Reflex and Colour Memory: short breaks to shift your focus.' },
      ],
    },
  },
  crisisTool: {
    start: 'Start 90 seconds', finish: 'Finish', restart: 'Another 90 seconds', phases: ['Rising', 'Peak', 'Easing'], waveLabel: 'Craving wave', remaining: 'Time remaining',
    breath: { inhale: 'Breathe in', hold: 'Hold', exhale: 'Breathe out slowly' }, breathNote: '4-4-6: breathe in for 4 seconds, hold for 4, breathe out for 6.',
    yes: 'Yes', no: 'No', lessMessage: 'The wave has eased. You have seen that you can get through it without smoking.',
    stillTitle: 'You do not have to decide right now.', stillMessage: 'Try another round of breathing, change your surroundings or message someone. The wave rises, but it does not last forever.',
    appLink: 'The Crisis Guardian in the app continues with a delay timer and reminders.',
  },
  notFound: { title: 'Page not found', lead: 'The page you are looking for may have moved or may not exist.', links: 'Continue from here' },
  legal: { dataDeletion: 'Data Deletion' },
};
