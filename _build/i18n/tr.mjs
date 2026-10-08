// Turkish interface copy. Article, health, journey, breathing and crisis texts
// come from the Flutter app via _build/content/tr/*.json; this file holds the
// website's own copy so another locale can be added as i18n/<lang>.mjs.

export default {
  locale: 'tr',
  dateLocale: 'tr-TR',

  meta: {
    siteDescription:
      'Sigara bırakma sürecinde bilgi, takip, destek ve topluluk tek yerde. Ücretsiz Bilgi Merkezi, kriz araçları ve Sigara Savar uygulaması.',
    titleSuffix: 'Sigara Savar',
  },

  a11y: {
    skip: 'İçeriğe geç',
    mainNav: 'Ana menü',
    mobileNav: 'Mobil menü',
    breadcrumb: 'Sayfa konumu',
    footerNav: 'Site bağlantıları',
    external: '(yeni sekmede açılır)',
    logoAlt: 'Sigara Savar logosu',
    markAlt: 'Sigara Savar işareti: ortasından kırılmış, sonsuzluk biçiminde bir sigara',
  },

  nav: {
    home: 'Ana sayfa',
    knowledge: 'Bilgi Merkezi',
    guide: 'Bırakma Rehberi',
    tools: 'Araçlar',
    community: 'Topluluk',
    app: 'Uygulama',
    download: 'Uygulamayı İndir',
    menu: 'Menü',
    close: 'Kapat',
    crisisShortcut: 'Şu an zor bir andaysan: 90 saniyelik akış',
  },

  stores: {
    appStore: 'App Store',
    googlePlay: 'Google Play',
    appStoreLong: 'App Store’dan indir',
    googlePlayLong: 'Google Play’den indir',
    iphone: 'iPhone için',
    android: 'Android için',
    note: 'Uygulama ücretsiz indirilir; bazı özellikler Premium üyelik gerektirir.',
  },

  downloadPage: {
    title: 'Sigara Savar’ı indir',
    metaTitle: 'Sigara Savar’ı indir | iPhone ve Android',
    description: 'Sigara Savar uygulamasını iPhone için App Store’dan veya Android için Google Play’den ücretsiz indir.',
    eyebrow: 'iPhone ve Android için',
    lead: 'Telefonundan açtığında cihazına uygun uygulama mağazasına yönlendirir. İstersen aşağıdan mağazanı seçebilirsin.',
    detecting: 'Cihazın belirleniyor…',
    ios: 'App Store’a yönlendiriliyorsun…',
    android: 'Google Play’e yönlendiriliyorsun…',
    desktop: 'Telefondan devam etmek için QR kodu tara veya mağazanı seç.',
    other: 'Mağazanı seçerek indirmeye devam edebilirsin.',
    cancel: 'Otomatik yönlendirmeyi durdur',
    cancelled: 'Otomatik yönlendirme durduruldu. Mağazanı aşağıdan seçebilirsin.',
    qrTitle: 'Telefonunla tara',
    qrText: 'Bu bağlantı telefonuna uygun mağazayı otomatik açar.',
    privacy: 'Cihaz türü yalnızca bu sayfada, doğru mağazayı açmak için belirlenir.',
  },

  footer: {
    tagline: 'Sigara bırakma sürecinde bilgi, takip, destek ve topluluk.',
    groups: {
      site: 'Sigara Savar',
      support: 'Destek',
      legal: 'Yasal',
      app: 'Uygulamayı indir',
    },
    contact: 'İletişim',
    dataDeletion: 'Veri silme',
    privacy: 'Gizlilik Politikası',
    terms: 'Hizmet Şartları',
    crisisGuide: 'Nikotin Krizi Rehberi (PDF)',
    instagram: 'Instagram',
    disclaimer:
      'Sigara Savar tıbbi cihaz değildir; tıbbi tavsiye, teşhis, tedavi, terapi, acil yardım veya garantili bir sigara bırakma programı sunmaz. Sitedeki içerikler genel bilgilendirme amaçlıdır. Acil durumlarda bulunduğunuz yerdeki acil yardım hizmetlerine başvurun.',
    copyright: (year) => `© ${year} Sigara Savar`,
  },

  common: {
    readTime: (m) => `${m}\u00a0dk okuma`,
    readTimeLong: (m) => `${m}\u00a0dakikalık okuma`,
    articleCount: (n) => `${n}\u00a0yazı`,
    sectionLabel: (n) => `Bölüm\u00a0${n}`,
    takeaways: 'Aklında kalsın',
    takeawaysAlt: 'Bölümün ana fikri',
    share: 'Paylaş',
    copyLink: 'Bağlantıyı kopyala',
    copied: 'Bağlantı kopyalandı',
    medicalNote:
      'Bu içerik genel bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. Kişisel sağlık durumun için bir sağlık profesyoneline danış.',
  },

  home: {
    title: 'Sigaradan Sonsuza Kadar Kurtul | Sigara Savar',
    description:
      'Sigara Savar, sigarayı bırakma sürecinde ilerlemeni takip edebileceğin mobil uygulama. Kriz araçları, topluluk, ücretsiz bilgi ve bırakma rehberiyle tanış.',
    hero: {
      eyebrow: 'SIGARA SAVAR',
      title: 'Sigaradan Sonsuza Kadar Kurtul.',
      lead: 'Sigarayı bırakmak isteyenler için bir mobil uygulama. İlerlemeni takip et; kriz araçlarına ve topluluğa tek yerden ulaş.',
      primary: 'Uygulamayı İndir',
      secondary: 'Bırakma Rehberini Keşfet',
      alt: 'Sigara Savar Gelişim ekranı: sigarasız geçen süre, gelişim puanı, sağlık hedefleri ve başarılar',
    },
    benefits: {
      title: 'Bırakma sürecinde ihtiyaç duydukların, tek yerde.',
      items: [
        { title: 'Takip', text: 'Sigarasız geçen zamanını, içmediğin sigaraları ve birikimini gör.' },
        { title: 'Zor anlar', text: 'Kriz Bekçisi, nefes egzersizleri ve kısa oyunlarla odağını değiştir.' },
        { title: 'Bilgi', text: 'Ne yaşadığını ve bırakma sürecini kısa yazılarla anla.' },
        { title: 'Topluluk', text: 'İlerlemeni paylaş, deneyimlerden öğren, birbirinize destek olun.' },
      ],
    },
    app: {
      title: 'Her gün aynı değil. Desteğin hazır.',
      features: [
        {
          id: 'acil', label: 'Zor anlar', title: 'Kriz geldiğinde hazır ol.',
          text: 'Kriz Bekçisi, nefes egzersizleri ve dikkatini değiştiren kısa oyunlar. İstek geldiğinde başvurabileceğin araçlar Acil Alan’da bir arada.',
          screen: 'acil-alan',
          alt: 'Gerçek Acil Alan ekranı: Kriz Bekçisi, nefes egzersizleri, su hatırlatıcı ve oyunlar',
          link: 'Kriz araçlarını keşfet',
        },
        {
          id: 'yolculuk', label: 'Yolculuğun', title: 'Bulunduğun adımı tanı.',
          text: 'Yolculuk Haritası, karar gününden sonraki aşamaları anlamana yardımcı olur. Her adımda neler yaşayabileceğini ve nelere dikkat edebileceğini oku.',
          screen: 'yolculuk-detoks',
          alt: 'Gerçek Yolculuk Haritası ekranı: Detoks aşaması ve bu döneme ilişkin bilgiler',
          link: 'Sağlık yolculuğunu rehberde gör',
        },
      ],
    },
    knowledge: {
      title: 'Ne yaşadığını anlamak da sürecin bir parçası.',
      featuredId: 'b1-01',
      secondaryIds: ['b3-02', 'b3-08'],
      cta: 'Tüm Bilgi Merkezini Keşfet',
    },
    community: {
      title: 'Bu yolu yalnız yürümek zorunda değilsin.',
      lead: 'İlk sigarasız gününü, zor geçen bir molayı ya da küçük bir kazanımını paylaş. Aynı süreci yaşayan insanlarla konuş, birbirinizden güç alın.',
      note: 'Topluluk desteği kişisel deneyimlere dayanır.',
    },
    download: {
      title: 'İlerlemeni yanında taşı.',
      lead: 'Sigara Savar, iPhone ve Android’de.',
    },
  },

  knowledge: {
    title: 'Bilgi Merkezi',
    metaTitle: 'Bilgi Merkezi: sigarayı bırakma rehber yazıları',
    description:
      'Sigara bağımlılığı, yoksunluk, sigara isteği (craving), tetikleyiciler, kayma ve nüks hakkında 29 kısa yazı. Sigara Savar Bilgi Merkezi.',
    lead:
      'Sigarayı bırakma sürecini anlamak için hazırlanmış kısa yazılar. Bağımlılığın nasıl çalıştığını, ilk günlerde neler olabileceğini, sigara isteğiyle nasıl baş edileceğini ve bir kaymadan sonra nasıl toparlanılacağını anlatır.',
    stats: (sections, articles, minutes) => `${sections} bölüm, ${articles} yazı, toplam ${minutes} dakikalık okuma`,
    search: {
      label: 'Yazılarda ara',
      placeholder: 'Örneğin: yoksunluk, tetikleyici, kayma…',
      submit: 'Ara',
      found: '{n} yazı bulundu',
      none: 'Eşleşen yazı yok',
      empty: 'Bu aramayla eşleşen yazı yok. Daha kısa bir kelime dene ya da bölümlere göz at.',
      clear: 'Aramayı temizle',
    },
    entryTitle: 'İki başlangıç noktası',
    entries: [
      { id: 'b1-01', label: 'Baştan başlamak istersen' },
      { id: 'b3-02', label: 'Şu an bir istekle uğraşıyorsan' },
    ],
    sectionsNav: 'Bölümler',
    source: 'Bu yazılar Sigara Savar uygulamasının Bilgi Merkezi içeriğidir.',
  },

  article: {
    breadcrumbHome: 'Ana sayfa',
    position: (i, n) => `Bölümdeki ${i}. yazı (${n} yazıdan)`,
    prev: 'Önceki yazı',
    next: 'Sonraki yazı',
    inSection: 'Bu bölümdeki yazılar',
    backToKc: 'Bilgi Merkezine dön',
    crisisCta: {
      title: 'İstek şu an geldiyse',
      text: '90 saniyelik akış, dalganın geçmesini beklerken ne yapacağını adım adım gösterir.',
      link: 'Kriz Bekçisi’ni dene',
    },
    appCta: {
      title: 'Bu yazılar uygulamada da var',
      text: 'Sigara Savar uygulamasında Bilgi Merkezi’nin yanında sigarasız geçen süreni, sağlık hedeflerini ve Yolculuk Haritası’nı takip edebilirsin.',
    },
  },

  guide: {
    title: 'Bırakma Rehberi',
    metaTitle: 'Sigara bırakma rehberi: karar gününden ilk yıla',
    description:
      'Bırakmaya hazırlık, bırakma günü, ilk hafta, krizler ve bir kaymadan sonra toparlanma için gerçek Bilgi Merkezi yazılarıyla adım adım sigara bırakma rehberi.',
    lead:
      'Karar gününden ilk yıla ve sonrasına: bu süreçte neler olabileceğini, hangi adımların işe yarayabileceğini ve nereden destek alabileceğini bir arada topladık.',
    toc: 'Bu sayfada',
    prepare: {
      title: 'Bırakmadan önce',
      lead: 'Bırakma günü geldiğinde her şeyi o anda çözmeye çalışmak zor olabilir. Önceden hazırlık, özellikle otomatik sigara anlarında karar vermeyi kolaylaştırır.',
      sourceId: 'b1-04',
      related: ['b1-05', 'b1-07', 'b1-06'],
    },
    journey: {
      title: 'Yolculuk Haritası',
      lead: 'Uygulamadaki Yolculuk Haritası süreci 12 aşamaya ayırır. Aşağıdaki dizinde bu aşamaları görebilir, ilk günler için herkese açık yazılara geçebilirsin.',
      developments: 'Bu aşamada neler oluyor?',
      attention: 'Dikkat edilmesi gerekenler',
      traps: 'Tuzak düşünceler',
      inApp: 'Bu aşamaların her birinde neler olduğu, nelere dikkat etmen gerektiği ve hangi düşüncelerin tuzak olabileceği uygulamadaki Yolculuk Haritası’nda anlatılıyor.',
      lockedTitle: (from, to) => `${from}–${to}. aşamalar`,
    },
    recovery: {
      title: 'Vücudunda neler değişir?',
      lead: 'Uygulamanın sağlık hedeflerinden, sağlık kurumlarının kaynaklarıyla doğrulanan bir seçki. Süreler kişisel bir takvim ya da sağlık ölçümü değildir.',
    },
    hardMoments: {
      title: 'Zor anlar için',
      lead: 'İstek geldiğinde ne yapacağını önceden seçmek, kriz anında daha az karar vermeni sağlar.',
      planLink: 'Kendi kriz planını oluştur',
      toolsLink: 'Araçlara git',
      related: ['b3-02', 'b3-04', 'b3-08'],
    },
    reading: {
      title: 'Okuma yolu',
      lead: 'Bilgi Merkezi baştan sona okunacak şekilde sıralandı. Her bölüm bir önceki bölümün üzerine kurulur.',
    },
  },

  tools: {
    title: 'Araçlar',
    metaTitle: 'Sigara krizi anında: nefes egzersizi, 90 saniye ve kriz planı',
    description:
      'Sigara isteği geldiğinde tarayıcıda hemen kullanabileceğin ücretsiz araçlar: 90 saniyelik Kriz Bekçisi akışı, 6 nefes tekniği, 4D yöntemi ve kişisel kriz planı.',
    lead:
      'Zor bir anda hemen kullanabileceğin, üyelik gerektirmeyen araçlar. Hepsi tarayıcında çalışır; yazdıkların yalnızca bu cihazda kalır.',
    crisis: {
      title: 'Kriz Bekçisi: 90 saniye',
      tryTitle: 'Şimdi dene',
      lead: 'Uygulamadaki Kriz Bekçisi akışının kısa web sürümü.',
    },
    breathing: {
      title: 'Nefes egzersizleri',
      lead: 'Uygulamadaki 6 teknik. Birini seç, ritme göre nefes al.',
      choose: 'Teknik',
      start: 'Başlat',
      stop: 'Durdur',
      inhale: 'Nefes al',
      hold: 'Tut',
      exhale: 'Yavaşça ver',
      ready: 'Hazır olduğunda başlat',
      cycles: (n) => `${n}. tur`,
      pattern: (i, h, e) => (h ? `${i} sn al, ${h} sn tut, ${e} sn ver` : `${i} sn al, ${e} sn ver`),
      safety:
        'Baş dönmesi, göğüs ağrısı, nefes darlığı ya da olağan dışı bir his fark edersen hemen dur ve normal nefesine dön. Astım, KOAH, kalp hastalığı, hamilelik veya başka bir sağlık durumun varsa önce bir sağlık profesyoneline danış.',
    },
    fourD: {
      title: '4D yöntemi',
      lead: 'Güçlü bir istek geldiğinde birkaç dakikalık alan açmak için dört adım.',
      articleId: 'b3-04',
    },
    plan: {
      title: 'Kriz planım',
      lead: 'Zor anda sıfırdan düşünmek yerine hazır bir yol haritası. Doldurduklarını bu tarayıcı saklar; bize gönderilmez. İstersen yazdırabilirsin.',
      articleId: 'b3-09',
      fields: [
        { id: 'triggers', label: 'En güçlü üç tetikleyicim' },
        { id: 'first', label: 'İstek geldiğinde ilk uygulayacağım adım' },
        { id: 'place', label: 'Ortamı değiştirebileceğim seçenek' },
        { id: 'person', label: 'Arayabileceğim ya da yazabileceğim kişi' },
        { id: 'sentence', label: 'Kendime hatırlatacağım cümle' },
      ],
      saved: 'Bu cihazda kaydedildi',
      print: 'Yazdır',
      clear: 'Temizle',
      clearConfirm: 'Silmek için tekrar bas',
      printTitle: 'Kriz planım',
    },
    pdf: {
      title: 'Nikotin Krizi Rehberi',
      text: 'Kriz belirtileri ve anında uygulanabilecek yöntemlerin 2 sayfalık özeti.',
      link: 'PDF olarak indir (2 sayfa)',
    },
    inApp: {
      title: 'Uygulamadaki diğer araçlar',
      items: [
        { title: 'Nefes Gücü Testi', text: 'Nefesini ne kadar tutabildiğini kaydeder. Tıbbi bir ölçüm değildir.' },
        { title: 'Su Hatırlatıcı', text: 'Günlük su hedefi ve hatırlatmalar.' },
        { title: 'Günlük', text: 'Zor anlarını ve küçük zaferlerini not etmek için.' },
        { title: 'Bilgi Yarışması', text: 'Arkadaşlarınla yarış, birlikte öğren.' },
        { title: 'Kısa oyunlar', text: 'Yılan, Baloncuk Patlat, Refleks ve Renk Hafıza: odağını değiştirecek küçük molalar.' },
      ],
    },
  },

  crisisTool: {
    // Labels not present in the app's ARB.
    start: '90 saniyeyi başlat',
    finish: 'Bitir',
    restart: 'Bir 90 saniye daha',
    phases: ['Yükseliş', 'Zirve', 'Azalma'],
    waveLabel: 'İstek dalgası',
    remaining: 'Kalan süre',
    breath: { inhale: 'Nefes al', hold: 'Tut', exhale: 'Yavaşça ver' },
    breathNote: '4-4-6: 4 saniye nefes al, 4 saniye tut, 6 saniyede ver.',
    yes: 'Evet',
    no: 'Hayır',
    lessMessage: 'Dalga azaldı. Sigara içmeden geçebildiğini kendin gördün.',
    stillTitle: 'Kararı şimdi vermek zorunda değilsin.',
    stillMessage: 'Bir tur daha nefes al, ortamını değiştir ya da birine yaz. Dalga yükselir ama sonsuza kadar sürmez.',
    appLink: 'Uygulamadaki Kriz Bekçisi erteleme süresi ve hatırlatmalarla devam eder.',
  },

  notFound: {
    title: 'Bu sayfa bulunamadı',
    lead: 'Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.',
    links: 'Buradan devam edebilirsin',
  },

  legal: {
    dataDeletion: 'Veri Silme',
  },
};
