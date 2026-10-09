// Website interface copy; educational content is synced from the application.
export default {
  locale: 'de', dateLocale: 'de-DE',
  meta: {
    siteDescription: 'Wissen, Fortschritt und Gemeinschaft für deinen Rauchstopp. Entdecke das kostenlose Wissenszentrum, Hilfen bei Rauchverlangen und die Sigara Savar App.',
    titleSuffix: 'Sigara Savar',
  },
  a11y: {
    skip: 'Zum Inhalt springen', mainNav: 'Hauptnavigation', mobileNav: 'Mobile Navigation', breadcrumb: 'Seitenpfad', footerNav: 'Seitenlinks',
    external: '(öffnet in einem neuen Tab)', logoAlt: 'Sigara Savar Logo', markAlt: 'Sigara Savar Symbol: eine in der Mitte durchbrochene Zigarette in Form eines Unendlichkeitszeichens',
  },
  nav: {
    home: 'Startseite', knowledge: 'Wissenszentrum', guide: 'Rauchstopp-Leitfaden', tools: 'Hilfsmittel', community: 'Community', app: 'Die App', download: 'App herunterladen', menu: 'Menü', close: 'Schließen',
    crisisShortcut: 'Gerade ein schwieriger Moment? Probiere die 90-Sekunden-Übung',
  },
  stores: {
    appStore: 'App Store', googlePlay: 'Google Play', appStoreLong: 'Im App Store herunterladen', googlePlayLong: 'Bei Google Play herunterladen', iphone: 'Für iPhone', android: 'Für Android',
    note: 'Kostenloser Download. Einige Funktionen erfordern ein Premium-Abonnement.',
  },
  downloadPage: {
    title: 'Sigara Savar herunterladen', metaTitle: 'Sigara Savar herunterladen | iPhone und Android',
    description: 'Lade Sigara Savar kostenlos im App Store für iPhone oder bei Google Play für Android herunter.', eyebrow: 'Für iPhone und Android',
    lead: 'Auf deinem Smartphone öffnet diese Seite den passenden App-Store. Du kannst deinen Store auch unten auswählen.',
    detecting: 'Dein Gerät wird erkannt…', ios: 'Der App Store wird geöffnet…', android: 'Google Play wird geöffnet…',
    desktop: 'Scanne den QR-Code, um auf deinem Smartphone fortzufahren, oder wähle deinen Store.', other: 'Wähle deinen Store, um fortzufahren.',
    cancel: 'Automatische Weiterleitung stoppen', cancelled: 'Die automatische Weiterleitung wurde gestoppt. Wähle deinen Store unten aus.', qrTitle: 'Mit dem Smartphone scannen',
    qrText: 'Dieser Link öffnet automatisch den passenden Store für dein Smartphone.', privacy: 'Der Gerätetyp wird nur auf dieser Seite ermittelt, um den richtigen Store zu öffnen.',
  },
  footer: {
    tagline: 'Wissen, Fortschritt, Unterstützung und Gemeinschaft für deinen Rauchstopp.',
    groups: { site: 'Sigara Savar', support: 'Hilfe', legal: 'Rechtliches', app: 'App herunterladen' },
    contact: 'Kontakt', dataDeletion: 'Datenlöschung', privacy: 'Datenschutzerklärung', terms: 'Nutzungsbedingungen', crisisGuide: 'Leitfaden bei Rauchverlangen (PDF, Türkisch)', instagram: 'Instagram',
    disclaimer: 'Sigara Savar ist kein Medizinprodukt und bietet keine medizinische Beratung, Diagnose, Behandlung, Therapie, Notfallhilfe oder garantierte Raucherentwöhnung. Die Inhalte dieser Website dienen der allgemeinen Information. Wende dich in einem Notfall an den örtlichen Rettungsdienst.',
    copyright: (year) => `© ${year} Sigara Savar® · Alle Rechte vorbehalten.`,
  },
  common: {
    readTime: (m) => `${m}\u00a0Min. Lesezeit`, readTimeLong: (m) => `${m}\u00a0Minuten Lesezeit`, articleCount: (n) => `${n}\u00a0Artikel`, sectionLabel: (n) => `Kapitel\u00a0${n}`,
    takeaways: 'Das Wichtigste im Überblick', takeawaysAlt: 'Der Kerngedanke', share: 'Teilen', copyLink: 'Link kopieren', copied: 'Link kopiert',
    medicalNote: 'Dieser Inhalt dient der allgemeinen Information und ersetzt keine medizinische Beratung. Besprich persönliche Gesundheitsfragen mit einer medizinischen Fachperson.',
  },
  home: {},
  knowledge: {
    title: 'Wissenszentrum', metaTitle: 'Wissenszentrum: Artikel zum Rauchstopp',
    description: '29 kurze Artikel über Nikotinabhängigkeit, Entzug, Rauchverlangen, Auslöser, Ausrutscher und Rückfälle. Das Wissenszentrum von Sigara Savar.',
    lead: 'Kurze Artikel, die dir helfen, den Rauchstopp zu verstehen: wie Abhängigkeit entsteht, was in den ersten Tagen passieren kann, wie du mit Rauchverlangen umgehst und nach einem Ausrutscher weitermachst.',
    stats: (sections, articles, minutes) => `${sections} Kapitel, ${articles} Artikel, insgesamt ${minutes} Minuten Lesezeit`,
    search: {
      label: 'Artikel durchsuchen', placeholder: 'Zum Beispiel: Entzug, Auslöser, Ausrutscher…', submit: 'Suchen', found: '{n} Artikel gefunden', none: 'Keine passenden Artikel',
      empty: 'Zu deiner Suche gibt es keine passenden Artikel. Versuche ein kürzeres Wort oder stöbere in den Kapiteln.', clear: 'Suche löschen',
    },
    entryTitle: 'Zwei Einstiegsmöglichkeiten', entries: [{ id: 'b1-01', label: 'Wenn du ganz von vorne beginnen möchtest' }, { id: 'b3-02', label: 'Wenn du gerade Rauchverlangen hast' }],
    sectionsNav: 'Kapitel', source: 'Diese Artikel stammen aus dem Wissenszentrum der Sigara Savar App.',
  },
  article: {
    breadcrumbHome: 'Startseite', position: (i, n) => `Artikel ${i} von ${n} in diesem Kapitel`, prev: 'Vorheriger Artikel', next: 'Nächster Artikel', inSection: 'Artikel in diesem Kapitel', backToKc: 'Zurück zum Wissenszentrum',
    crisisCta: { title: 'Wenn das Rauchverlangen gerade da ist', text: 'Die 90-Sekunden-Übung zeigt dir Schritt für Schritt, was du tun kannst, während du wartest, bis die Welle abklingt.', link: 'Krisenwächter ausprobieren' },
    appCta: { title: 'Diese Artikel findest du auch in der App', text: 'Neben dem Wissenszentrum kannst du in der Sigara Savar App deine rauchfreie Zeit, gesundheitliche Meilensteine und deine Reisekarte verfolgen.' },
  },
  guide: {
    title: 'Rauchstopp-Leitfaden', metaTitle: 'Rauchstopp-Leitfaden: vom Entschluss bis zum ersten Jahr',
    description: 'Schritt für Schritt zum Rauchstopp mit Artikeln aus dem Wissenszentrum: Vorbereitung, erster Tag, erste Woche, Rauchverlangen und Weitermachen nach einem Ausrutscher.',
    lead: 'Vom Entschluss bis zum ersten Jahr und darüber hinaus: Erfahre, was dich erwarten kann, welche Schritte du ausprobieren kannst und wo du Unterstützung findest.', toc: 'Auf dieser Seite',
    prepare: { title: 'Bevor du aufhörst', lead: 'Am Tag des Rauchstopps alles auf einmal lösen zu wollen, kann schwer sein. Vorbereitung erleichtert Entscheidungen – besonders in Momenten, in denen du sonst automatisch zur Zigarette greifst.', sourceId: 'b1-04', related: ['b1-05', 'b1-07', 'b1-06'] },
    journey: {
      title: 'Reisekarte', lead: 'Die Reisekarte in der App unterteilt den Weg in 12 Etappen. Hier kannst du sie überblicken und die frei zugänglichen Artikel für die ersten Tage lesen.',
      developments: 'Was passiert in dieser Etappe?', attention: 'Worauf du achten kannst', traps: 'Gedankenfallen',
      inApp: 'Die Reisekarte in der App erklärt, was in jeder Etappe passiert, worauf du achten kannst und welche Gedanken zu Fallen werden können.', lockedTitle: (from, to) => `Etappen ${from}–${to}`,
    },
    recovery: { title: 'Was verändert sich in deinem Körper?', lead: 'Eine Auswahl gesundheitlicher Meilensteine aus der App, abgeglichen mit Quellen von Gesundheitsorganisationen. Die Zeitangaben sind weder ein persönlicher Zeitplan noch eine Messung deiner Gesundheit.' },
    hardMoments: { title: 'Für schwierige Momente', lead: 'Wenn du vorher festlegst, was du bei Rauchverlangen tun möchtest, musst du in dem Moment weniger Entscheidungen treffen.', planLink: 'Deinen Krisenplan erstellen', toolsLink: 'Zu den Hilfsmitteln', related: ['b3-02', 'b3-04', 'b3-08'] },
    reading: { title: 'Dein Lesepfad', lead: 'Das Wissenszentrum ist zum Lesen in Reihenfolge aufgebaut. Jedes Kapitel knüpft an das vorherige an.' },
  },
  tools: {
    title: 'Hilfsmittel', metaTitle: 'Bei Rauchverlangen: Atemübungen, 90 Sekunden und ein Plan',
    description: 'Kostenlose Hilfsmittel direkt im Browser: die 90-Sekunden-Übung des Krisenwächters, 6 Atemtechniken, die 4D-Methode und ein persönlicher Krisenplan.',
    lead: 'Hilfsmittel für schwierige Momente, sofort und ohne Konto nutzbar. Sie laufen in deinem Browser; deine Eingaben bleiben auf diesem Gerät.',
    crisis: { title: 'Krisenwächter: 90 Sekunden', tryTitle: 'Jetzt ausprobieren', lead: 'Eine kurze Webversion der Krisenwächter-Übung aus der App.' },
    breathing: {
      title: 'Atemübungen', lead: 'Die 6 Techniken aus der App. Wähle eine aus und folge dem Rhythmus.', choose: 'Technik', start: 'Starten', stop: 'Stoppen', inhale: 'Einatmen', hold: 'Halten', exhale: 'Langsam ausatmen', ready: 'Starte, wenn du bereit bist',
      cycles: (n) => `Runde ${n}`, pattern: (i, h, e) => h ? `${i} Sek. einatmen, ${h} Sek. halten, ${e} Sek. ausatmen` : `${i} Sek. einatmen, ${e} Sek. ausatmen`,
      safety: 'Wenn dir schwindelig wird, du Brustschmerzen, Atemnot oder ein ungewöhnliches Gefühl bemerkst, höre sofort auf und atme wieder normal. Bei Asthma, COPD, einer Herzerkrankung, Schwangerschaft oder anderen gesundheitlichen Beschwerden solltest du vorher medizinischen Rat einholen.',
    },
    fourD: { title: 'Die 4D-Methode', lead: 'Vier Schritte, um dir bei starkem Rauchverlangen etwas Freiraum zu verschaffen.', articleId: 'b3-04' },
    plan: {
      title: 'Mein Krisenplan', lead: 'Ein Plan, auf den du in schwierigen Momenten zurückgreifen kannst. Deine Antworten werden nur in diesem Browser gespeichert und nicht an uns gesendet. Du kannst sie auch ausdrucken.', articleId: 'b3-09',
      fields: [{ id: 'triggers', label: 'Meine drei stärksten Auslöser' }, { id: 'first', label: 'Mein erster Schritt bei Rauchverlangen' }, { id: 'place', label: 'Wie ich meine Umgebung wechseln kann' }, { id: 'person', label: 'Wen ich anrufen oder anschreiben kann' }, { id: 'sentence', label: 'Ein Satz, an den ich mich erinnern möchte' }],
      saved: 'Auf diesem Gerät gespeichert', print: 'Drucken', clear: 'Löschen', clearConfirm: 'Zum Löschen erneut drücken', printTitle: 'Mein Krisenplan',
    },
    pdf: { title: 'Leitfaden bei Rauchverlangen', text: 'Eine zweiseitige Übersicht über Anzeichen von Rauchverlangen und sofort anwendbare Techniken. Auf Türkisch verfügbar.', link: 'PDF herunterladen (2 Seiten, Türkisch)' },
    inApp: {
      title: 'Weitere Hilfsmittel in der App', items: [
        { title: 'Atemhalte-Test', text: 'Hält fest, wie lange du die Luft anhalten kannst. Keine medizinische Messung.' },
        { title: 'Trinkerinnerung', text: 'Ein tägliches Trinkziel und Erinnerungen.' },
        { title: 'Tagebuch', text: 'Platz für schwierige Momente und kleine Erfolge.' },
        { title: 'Quiz', text: 'Tritt gegen Freunde an und lernt gemeinsam.' },
        { title: 'Kurze Spiele', text: 'Snake, Bubble Pop, Reaktion und Farbgedächtnis: kleine Pausen, um deinen Fokus zu verändern.' },
      ],
    },
  },
  crisisTool: {
    start: '90 Sekunden starten', finish: 'Beenden', restart: 'Noch einmal 90 Sekunden', phases: ['Anstieg', 'Höhepunkt', 'Abklingen'], waveLabel: 'Welle des Rauchverlangens', remaining: 'Verbleibende Zeit',
    breath: { inhale: 'Einatmen', hold: 'Halten', exhale: 'Langsam ausatmen' }, breathNote: '4-4-6: 4 Sekunden einatmen, 4 Sekunden halten, 6 Sekunden ausatmen.',
    yes: 'Ja', no: 'Nein', lessMessage: 'Die Welle ist abgeklungen. Du hast selbst erlebt, dass du sie ohne Zigarette überstehen kannst.',
    stillTitle: 'Du musst dich nicht jetzt entscheiden.', stillMessage: 'Atme noch eine Runde, wechsle deine Umgebung oder schreibe jemandem. Die Welle steigt an, aber sie bleibt nicht für immer.',
    appLink: 'Der Krisenwächter in der App begleitet dich weiter mit Aufschub-Timer und Erinnerungen.',
  },
  notFound: { title: 'Seite nicht gefunden', lead: 'Die gesuchte Seite wurde möglicherweise verschoben oder existiert nicht.', links: 'Hier kannst du weitermachen' },
  legal: { dataDeletion: 'Datenlöschung' },
};
