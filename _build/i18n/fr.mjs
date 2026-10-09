// Website interface copy; educational content is synced from the application.
export default {
  locale: 'fr', dateLocale: 'fr-FR',
  meta: {
    siteDescription: 'Des informations, un suivi et une communauté pour arrêter de fumer. Découvrez le Centre de connaissances gratuit, les outils et l’application Sigara Savar.',
    titleSuffix: 'Sigara Savar',
  },
  a11y: {
    skip: 'Aller au contenu', mainNav: 'Navigation principale', mobileNav: 'Navigation mobile', breadcrumb: 'Fil d’Ariane', footerNav: 'Liens du site',
    external: '(s’ouvre dans un nouvel onglet)', logoAlt: 'Logo Sigara Savar', markAlt: 'Symbole Sigara Savar : une cigarette en forme de signe infini, brisée au centre',
  },
  nav: {
    home: 'Accueil', knowledge: 'Centre de connaissances', guide: 'Guide pour arrêter', tools: 'Outils', community: 'Communauté', app: 'L’application', download: 'Télécharger l’app', menu: 'Menu', close: 'Fermer',
    crisisShortcut: 'Un moment difficile ? Essayez l’exercice de 90 secondes',
  },
  stores: {
    appStore: 'App Store', googlePlay: 'Google Play', appStoreLong: 'Télécharger dans l’App Store', googlePlayLong: 'Télécharger sur Google Play', iphone: 'Pour iPhone', android: 'Pour Android',
    note: 'Téléchargement gratuit. Certaines fonctionnalités nécessitent un abonnement Premium.',
  },
  downloadPage: {
    title: 'Téléchargez Sigara Savar', metaTitle: 'Télécharger Sigara Savar | iPhone et Android',
    description: 'Téléchargez gratuitement Sigara Savar dans l’App Store pour iPhone ou sur Google Play pour Android.', eyebrow: 'Pour iPhone et Android',
    lead: 'Sur votre téléphone, cette page ouvre la boutique adaptée à votre appareil. Vous pouvez aussi la choisir ci-dessous.',
    detecting: 'Identification de votre appareil…', ios: 'Ouverture de l’App Store…', android: 'Ouverture de Google Play…',
    desktop: 'Scannez le QR code pour continuer sur votre téléphone ou choisissez votre boutique.', other: 'Choisissez votre boutique pour continuer.',
    cancel: 'Arrêter la redirection automatique', cancelled: 'La redirection automatique est arrêtée. Choisissez votre boutique ci-dessous.', qrTitle: 'Scannez avec votre téléphone',
    qrText: 'Ce lien ouvre automatiquement la boutique adaptée à votre téléphone.', privacy: 'Le type d’appareil est identifié uniquement sur cette page afin d’ouvrir la bonne boutique.',
  },
  footer: {
    tagline: 'Des informations, un suivi, du soutien et une communauté pour arrêter de fumer.',
    groups: { site: 'Sigara Savar', support: 'Aide', legal: 'Informations légales', app: 'Télécharger l’app' },
    contact: 'Contact', dataDeletion: 'Suppression des données', privacy: 'Politique de confidentialité', terms: 'Conditions d’utilisation', crisisGuide: 'Guide des envies de nicotine (PDF, en turc)', instagram: 'Instagram',
    disclaimer: 'Sigara Savar n’est pas un dispositif médical et ne fournit ni conseil médical, ni diagnostic, ni traitement, ni thérapie, ni aide d’urgence, ni programme garantissant l’arrêt du tabac. Le contenu de ce site est fourni à titre d’information générale. En cas d’urgence, contactez les services d’urgence de votre région.',
    copyright: (year) => `© ${year} Sigara Savar® · Tous droits réservés.`,
  },
  common: {
    readTime: (m) => `${m}\u00a0min de lecture`, readTimeLong: (m) => `${m}\u00a0minutes de lecture`, articleCount: (n) => `${n}\u00a0${n === 1 ? 'article' : 'articles'}`, sectionLabel: (n) => `Chapitre\u00a0${n}`,
    takeaways: 'À retenir', takeawaysAlt: 'L’idée essentielle', share: 'Partager', copyLink: 'Copier le lien', copied: 'Lien copié',
    medicalNote: 'Ce contenu est fourni à titre d’information générale et ne remplace pas un avis médical. Consultez un professionnel de santé pour toute question concernant votre situation personnelle.',
  },
  home: {},
  knowledge: {
    title: 'Centre de connaissances', metaTitle: 'Centre de connaissances : comprendre l’arrêt du tabac',
    description: '29 articles courts sur la dépendance à la nicotine, le sevrage, les envies, les déclencheurs, les écarts et les rechutes. Le Centre de connaissances Sigara Savar.',
    lead: 'Des articles courts pour comprendre l’arrêt du tabac : comment fonctionne la dépendance, ce qui peut arriver les premiers jours, comment faire face aux envies et comment repartir après un écart.',
    stats: (sections, articles, minutes) => `${sections} chapitres, ${articles} articles, ${minutes} minutes de lecture au total`,
    search: {
      label: 'Rechercher des articles', placeholder: 'Par exemple : sevrage, déclencheurs, écart…', submit: 'Rechercher', found: '{n} articles trouvés', none: 'Aucun article correspondant',
      empty: 'Aucun article ne correspond à votre recherche. Essayez un mot plus court ou parcourez les chapitres.', clear: 'Effacer la recherche',
    },
    entryTitle: 'Deux points de départ', entries: [{ id: 'b1-01', label: 'Si vous souhaitez commencer par le début' }, { id: 'b3-02', label: 'Si vous faites face à une envie en ce moment' }],
    sectionsNav: 'Chapitres', source: 'Ces articles proviennent du Centre de connaissances de l’application Sigara Savar.',
  },
  article: {
    breadcrumbHome: 'Accueil', position: (i, n) => `Article ${i} sur ${n} dans ce chapitre`, prev: 'Article précédent', next: 'Article suivant', inSection: 'Articles de ce chapitre', backToKc: 'Retour au Centre de connaissances',
    crisisCta: { title: 'Si l’envie vient d’arriver', text: 'L’exercice de 90 secondes vous guide pas à pas pendant que vous attendez que la vague passe.', link: 'Essayer le Gardien de crise' },
    appCta: { title: 'Ces articles sont aussi dans l’application', text: 'En plus du Centre de connaissances, l’application Sigara Savar vous permet de suivre votre temps sans tabac, vos étapes de santé et votre Carte du parcours.' },
  },
  guide: {
    title: 'Guide pour arrêter de fumer', metaTitle: 'Guide pour arrêter de fumer : de la décision à la première année',
    description: 'Un guide pas à pas avec les articles du Centre de connaissances : préparation, jour d’arrêt, première semaine, envies et reprise du parcours après un écart.',
    lead: 'De votre décision à la première année et au-delà : ce que vous pouvez ressentir, les pistes à essayer et les soutiens vers lesquels vous tourner.', toc: 'Sur cette page',
    prepare: { title: 'Avant d’arrêter', lead: 'Tout prévoir le jour de l’arrêt peut être difficile. Se préparer à l’avance facilite les décisions, surtout dans les moments où vous fumiez par automatisme.', sourceId: 'b1-04', related: ['b1-05', 'b1-07', 'b1-06'] },
    journey: {
      title: 'Carte du parcours', lead: 'La Carte du parcours de l’application divise le processus en 12 étapes. Explorez-les ci-dessous et accédez aux articles gratuits consacrés aux premiers jours.',
      developments: 'Que se passe-t-il à cette étape ?', attention: 'Les points à surveiller', traps: 'Les pensées pièges',
      inApp: 'La Carte du parcours de l’application explique ce qui se passe à chaque étape, les points à surveiller et les pensées qui peuvent devenir des pièges.', lockedTitle: (from, to) => `Étapes ${from} à ${to}`,
    },
    recovery: { title: 'Qu’est-ce qui change dans votre corps ?', lead: 'Une sélection des étapes de santé de l’application, vérifiées à partir de sources d’organismes de santé. Ces délais ne constituent ni un calendrier personnel ni une mesure de votre santé.' },
    hardMoments: { title: 'Pour les moments difficiles', lead: 'Choisir à l’avance ce que vous ferez face à une envie réduit le nombre de décisions à prendre sur le moment.', planLink: 'Créer votre plan face aux envies', toolsLink: 'Découvrir les outils', related: ['b3-02', 'b3-04', 'b3-08'] },
    reading: { title: 'Votre parcours de lecture', lead: 'Le Centre de connaissances est organisé pour être lu dans l’ordre. Chaque chapitre s’appuie sur le précédent.' },
  },
  tools: {
    title: 'Outils', metaTitle: 'Envie de fumer : respiration, 90 secondes et un plan',
    description: 'Des outils gratuits dans votre navigateur : l’exercice de 90 secondes du Gardien de crise, 6 techniques de respiration, la méthode des 4 D et un plan personnel face aux envies.',
    lead: 'Des outils à utiliser immédiatement dans un moment difficile, sans créer de compte. Ils fonctionnent dans votre navigateur ; vos réponses restent sur cet appareil.',
    crisis: { title: 'Gardien de crise : 90 secondes', tryTitle: 'Essayer maintenant', lead: 'Une version web courte de l’exercice du Gardien de crise de l’application.' },
    breathing: {
      title: 'Exercices de respiration', lead: 'Les 6 techniques de l’application. Choisissez-en une et suivez le rythme.', choose: 'Technique', start: 'Commencer', stop: 'Arrêter', inhale: 'Inspirez', hold: 'Retenez', exhale: 'Expirez lentement', ready: 'Commencez quand vous êtes prêt',
      cycles: (n) => `Cycle ${n}`, pattern: (i, h, e) => h ? `Inspirez ${i} s, retenez ${h} s, expirez ${e} s` : `Inspirez ${i} s, expirez ${e} s`,
      safety: 'En cas de vertiges, de douleur thoracique, d’essoufflement ou de sensation inhabituelle, arrêtez immédiatement et reprenez une respiration normale. Si vous souffrez d’asthme, de BPCO, d’une maladie cardiaque, si vous êtes enceinte ou avez un autre problème de santé, demandez d’abord l’avis d’un professionnel de santé.',
    },
    fourD: { title: 'La méthode des 4 D', lead: 'Quatre étapes pour vous laisser un peu de temps lorsqu’une envie forte apparaît.', articleId: 'b3-04' },
    plan: {
      title: 'Mon plan face aux envies', lead: 'Un plan à retrouver dans les moments difficiles. Vos réponses sont enregistrées dans ce navigateur et ne nous sont pas envoyées. Vous pouvez aussi les imprimer.', articleId: 'b3-09',
      fields: [{ id: 'triggers', label: 'Mes trois principaux déclencheurs' }, { id: 'first', label: 'Ma première action lorsqu’une envie arrive' }, { id: 'place', label: 'Une façon de changer d’environnement' }, { id: 'person', label: 'Une personne à appeler ou à qui écrire' }, { id: 'sentence', label: 'Une phrase à me rappeler' }],
      saved: 'Enregistré sur cet appareil', print: 'Imprimer', clear: 'Effacer', clearConfirm: 'Appuyez à nouveau pour effacer', printTitle: 'Mon plan face aux envies',
    },
    pdf: { title: 'Guide des envies de nicotine', text: 'Un résumé de deux pages sur les signes des envies et les techniques à essayer immédiatement. Disponible en turc.', link: 'Télécharger le PDF (2 pages, turc)' },
    inApp: {
      title: 'D’autres outils dans l’application', items: [
        { title: 'Test de retenue du souffle', text: 'Enregistre le temps pendant lequel vous pouvez retenir votre souffle. Ce n’est pas une mesure médicale.' },
        { title: 'Rappel pour boire de l’eau', text: 'Un objectif quotidien et des rappels.' },
        { title: 'Journal', text: 'Pour noter les moments difficiles et les petites victoires.' },
        { title: 'Quiz', text: 'Défiez vos amis et apprenez ensemble.' },
        { title: 'Jeux courts', text: 'Snake, Bulles, Réflexes et Mémoire des couleurs : de courtes pauses pour déplacer votre attention.' },
      ],
    },
  },
  crisisTool: {
    start: 'Commencer les 90 secondes', finish: 'Terminer', restart: 'Encore 90 secondes', phases: ['Montée', 'Sommet', 'Descente'], waveLabel: 'Vague de l’envie', remaining: 'Temps restant',
    breath: { inhale: 'Inspirez', hold: 'Retenez', exhale: 'Expirez lentement' }, breathNote: '4-4-6 : inspirez pendant 4 secondes, retenez 4 secondes, expirez pendant 6 secondes.',
    yes: 'Oui', no: 'Non', lessMessage: 'La vague est retombée. Vous avez vu que vous pouviez la traverser sans fumer.',
    stillTitle: 'Vous n’avez pas à décider maintenant.', stillMessage: 'Essayez un autre cycle de respiration, changez d’environnement ou écrivez à quelqu’un. La vague monte, mais elle ne dure pas éternellement.',
    appLink: 'Le Gardien de crise de l’application poursuit l’accompagnement avec un minuteur pour différer et des rappels.',
  },
  notFound: { title: 'Page introuvable', lead: 'La page que vous cherchez a peut-être été déplacée ou n’existe pas.', links: 'Continuez à partir d’ici' },
  legal: { dataDeletion: 'Suppression des données' },
};
