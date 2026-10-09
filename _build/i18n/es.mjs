// Website interface copy; educational content is synced from the application.
export default {
  locale: 'es', dateLocale: 'es-ES',
  meta: {
    siteDescription: 'Información, seguimiento y comunidad para dejar de fumar. Descubre el Centro de Información gratuito, las herramientas para los antojos y la app Sigara Savar.',
    titleSuffix: 'Sigara Savar',
  },
  a11y: {
    skip: 'Saltar al contenido', mainNav: 'Navegación principal', mobileNav: 'Navegación móvil', breadcrumb: 'Ruta de navegación', footerNav: 'Enlaces del sitio',
    external: '(se abre en una pestaña nueva)', logoAlt: 'Logotipo de Sigara Savar', markAlt: 'Símbolo de Sigara Savar: un cigarrillo con forma de infinito, roto por el centro',
  },
  nav: {
    home: 'Inicio', knowledge: 'Centro de Información', guide: 'Guía para dejar de fumar', tools: 'Herramientas', community: 'Comunidad', app: 'La app', download: 'Descargar la app', menu: 'Menú', close: 'Cerrar',
    crisisShortcut: '¿Un momento difícil? Prueba el ejercicio de 90 segundos',
  },
  stores: {
    appStore: 'App Store', googlePlay: 'Google Play', appStoreLong: 'Descargar en el App Store', googlePlayLong: 'Descargar en Google Play', iphone: 'Para iPhone', android: 'Para Android',
    note: 'Descarga gratuita. Algunas funciones requieren una suscripción Premium.',
  },
  downloadPage: {
    title: 'Descarga Sigara Savar', metaTitle: 'Descarga Sigara Savar | iPhone y Android',
    description: 'Descarga gratis Sigara Savar en el App Store para iPhone o en Google Play para Android.', eyebrow: 'Para iPhone y Android',
    lead: 'Si abres esta página desde el móvil, te llevará a la tienda adecuada para tu dispositivo. También puedes elegirla abajo.',
    detecting: 'Identificando tu dispositivo…', ios: 'Abriendo el App Store…', android: 'Abriendo Google Play…',
    desktop: 'Escanea el código QR para continuar en tu móvil o elige tu tienda.', other: 'Elige tu tienda para continuar.',
    cancel: 'Detener la redirección automática', cancelled: 'Redirección automática detenida. Puedes elegir tu tienda abajo.', qrTitle: 'Escanea con tu móvil',
    qrText: 'Este enlace abre automáticamente la tienda adecuada para tu móvil.', privacy: 'El tipo de dispositivo se identifica solo en esta página para abrir la tienda adecuada.',
  },
  footer: {
    tagline: 'Información, seguimiento, apoyo y comunidad para dejar de fumar.',
    groups: { site: 'Sigara Savar', support: 'Ayuda', legal: 'Información legal', app: 'Descargar la app' },
    contact: 'Contacto', dataDeletion: 'Eliminación de datos', privacy: 'Política de privacidad', terms: 'Condiciones del servicio', crisisGuide: 'Guía para los antojos de nicotina (PDF, en turco)', instagram: 'Instagram',
    disclaimer: 'Sigara Savar no es un producto sanitario y no ofrece asesoramiento médico, diagnóstico, tratamiento, terapia, asistencia de emergencia ni un programa que garantice dejar de fumar. El contenido de este sitio tiene fines informativos generales. En caso de emergencia, contacta con los servicios de emergencia de tu zona.',
    copyright: (year) => `© ${year} Sigara Savar® · Todos los derechos reservados.`,
  },
  common: {
    readTime: (m) => `${m}\u00a0min de lectura`, readTimeLong: (m) => `${m}\u00a0minutos de lectura`, articleCount: (n) => `${n}\u00a0${n === 1 ? 'artículo' : 'artículos'}`, sectionLabel: (n) => `Sección\u00a0${n}`,
    takeaways: 'Qué conviene recordar', takeawaysAlt: 'La idea principal', share: 'Compartir', copyLink: 'Copiar enlace', copied: 'Enlace copiado',
    medicalNote: 'Este contenido es informativo y no sustituye el asesoramiento médico. Consulta a un profesional sanitario sobre tu situación de salud personal.',
  },
  home: {},
  knowledge: {
    title: 'Centro de Información', metaTitle: 'Centro de Información: artículos para dejar de fumar',
    description: '29 artículos breves sobre dependencia de la nicotina, abstinencia, antojos, desencadenantes, deslices y recaídas. El Centro de Información de Sigara Savar.',
    lead: 'Artículos breves para entender el proceso de dejar de fumar: cómo funciona la dependencia, qué puede pasar los primeros días, cómo afrontar los antojos y cómo retomar el camino después de un desliz.',
    stats: (sections, articles, minutes) => `${sections} secciones, ${articles} artículos y ${minutes} minutos de lectura en total`,
    search: {
      label: 'Buscar artículos', placeholder: 'Por ejemplo: abstinencia, desencadenantes, desliz…', submit: 'Buscar', found: '{n} artículos encontrados', none: 'No hay artículos que coincidan',
      empty: 'No hay artículos que coincidan con tu búsqueda. Prueba con una palabra más corta o explora las secciones.', clear: 'Borrar búsqueda',
    },
    entryTitle: 'Dos puntos de partida', entries: [{ id: 'b1-01', label: 'Si quieres empezar desde el principio' }, { id: 'b3-02', label: 'Si estás afrontando un antojo ahora mismo' }],
    sectionsNav: 'Secciones', source: 'Estos artículos proceden del Centro de Información de la app Sigara Savar.',
  },
  article: {
    breadcrumbHome: 'Inicio', position: (i, n) => `Artículo ${i} de ${n} en esta sección`, prev: 'Artículo anterior', next: 'Artículo siguiente', inSection: 'Artículos de esta sección', backToKc: 'Volver al Centro de Información',
    crisisCta: { title: 'Si el antojo acaba de llegar', text: 'El ejercicio de 90 segundos te guía paso a paso mientras esperas a que pase la ola.', link: 'Prueba el Guardián de Crisis' },
    appCta: { title: 'Estos artículos también están en la app', text: 'Además del Centro de Información, la app Sigara Savar te permite seguir tu tiempo sin fumar, tus hitos de salud y el Mapa del Viaje.' },
  },
  guide: {
    title: 'Guía para dejar de fumar', metaTitle: 'Guía para dejar de fumar: de la decisión al primer año',
    description: 'Una guía paso a paso con artículos del Centro de Información: preparación, día de dejarlo, primera semana, antojos y cómo seguir después de un desliz.',
    lead: 'Desde el día en que decides dejarlo hasta el primer año y más allá: qué puedes experimentar, qué pasos puedes probar y dónde encontrar apoyo.', toc: 'En esta página',
    prepare: { title: 'Antes de dejarlo', lead: 'Intentar resolverlo todo el día que dejas de fumar puede ser difícil. Prepararte antes facilita las decisiones, sobre todo en los momentos en que solías fumar de forma automática.', sourceId: 'b1-04', related: ['b1-05', 'b1-07', 'b1-06'] },
    journey: {
      title: 'Mapa del Viaje', lead: 'El Mapa del Viaje de la app divide el proceso en 12 etapas. Puedes explorarlas abajo y acceder a los artículos gratuitos para los primeros días.',
      developments: '¿Qué ocurre en esta etapa?', attention: 'En qué fijarte', traps: 'Pensamientos trampa',
      inApp: 'El Mapa del Viaje de la app explica qué ocurre en cada etapa, a qué prestar atención y qué pensamientos pueden convertirse en trampas.', lockedTitle: (from, to) => `Etapas ${from}–${to}`,
    },
    recovery: { title: '¿Qué cambia en tu cuerpo?', lead: 'Una selección de los hitos de salud de la app, contrastados con fuentes de organismos sanitarios. Los plazos no son un calendario personal ni una medición de tu salud.' },
    hardMoments: { title: 'Para los momentos difíciles', lead: 'Elegir de antemano qué harás cuando llegue un antojo reduce las decisiones que tendrás que tomar en ese momento.', planLink: 'Crea tu plan para los antojos', toolsLink: 'Ver las herramientas', related: ['b3-02', 'b3-04', 'b3-08'] },
    reading: { title: 'Tu recorrido de lectura', lead: 'El Centro de Información está ordenado para leerlo de principio a fin. Cada sección se apoya en la anterior.' },
  },
  tools: {
    title: 'Herramientas', metaTitle: 'Antojos de fumar: respiración, 90 segundos y un plan',
    description: 'Herramientas gratuitas para usar en el navegador cuando llega un antojo: el ejercicio de 90 segundos del Guardián de Crisis, 6 técnicas de respiración, el método 4D y un plan personal.',
    lead: 'Herramientas que puedes usar al momento, sin crear una cuenta. Funcionan en tu navegador; lo que escribas se queda en este dispositivo.',
    crisis: { title: 'Guardián de Crisis: 90 segundos', tryTitle: 'Pruébalo ahora', lead: 'Una versión web breve del ejercicio del Guardián de Crisis de la app.' },
    breathing: {
      title: 'Ejercicios de respiración', lead: 'Las 6 técnicas de la app. Elige una y sigue el ritmo.', choose: 'Técnica', start: 'Empezar', stop: 'Parar', inhale: 'Inhala', hold: 'Mantén', exhale: 'Exhala despacio', ready: 'Empieza cuando estés listo',
      cycles: (n) => `Ronda ${n}`, pattern: (i, h, e) => h ? `Inhala ${i} s, mantén ${h} s, exhala ${e} s` : `Inhala ${i} s, exhala ${e} s`,
      safety: 'Si notas mareo, dolor en el pecho, dificultad para respirar o alguna sensación inusual, para de inmediato y vuelve a respirar con normalidad. Si tienes asma, EPOC, una enfermedad cardíaca, estás embarazada o tienes otra condición de salud, consulta antes a un profesional sanitario.',
    },
    fourD: { title: 'El método 4D', lead: 'Cuatro pasos para darte un poco de margen cuando aparece un antojo intenso.', articleId: 'b3-04' },
    plan: {
      title: 'Mi plan para los antojos', lead: 'Un plan al que recurrir en un momento difícil. Tus respuestas se guardan en este navegador y no se nos envían. También puedes imprimirlas.', articleId: 'b3-09',
      fields: [{ id: 'triggers', label: 'Mis tres desencadenantes más fuertes' }, { id: 'first', label: 'Lo primero que haré cuando llegue un antojo' }, { id: 'place', label: 'Una forma de cambiar de entorno' }, { id: 'person', label: 'Alguien a quien llamar o escribir' }, { id: 'sentence', label: 'Una frase que quiero recordarme' }],
      saved: 'Guardado en este dispositivo', print: 'Imprimir', clear: 'Borrar', clearConfirm: 'Pulsa de nuevo para borrar', printTitle: 'Mi plan para los antojos',
    },
    pdf: { title: 'Guía para los antojos de nicotina', text: 'Un resumen de dos páginas sobre los síntomas de los antojos y técnicas para aplicar al momento. Disponible en turco.', link: 'Descargar PDF (2 páginas, turco)' },
    inApp: {
      title: 'Más herramientas en la app', items: [
        { title: 'Prueba de retención de la respiración', text: 'Registra cuánto tiempo puedes aguantar la respiración. No es una medición médica.' },
        { title: 'Recordatorio de agua', text: 'Un objetivo diario de agua y recordatorios.' },
        { title: 'Diario', text: 'Un espacio para anotar los momentos difíciles y las pequeñas victorias.' },
        { title: 'Concurso de preguntas', text: 'Compite con amigos y aprended juntos.' },
        { title: 'Juegos breves', text: 'Serpiente, Burbujas, Reflejos y Memoria de colores: pequeñas pausas para cambiar de foco.' },
      ],
    },
  },
  crisisTool: {
    start: 'Empezar 90 segundos', finish: 'Terminar', restart: 'Otros 90 segundos', phases: ['Subida', 'Pico', 'Descenso'], waveLabel: 'Ola del antojo', remaining: 'Tiempo restante',
    breath: { inhale: 'Inhala', hold: 'Mantén', exhale: 'Exhala despacio' }, breathNote: '4-4-6: inhala durante 4 segundos, mantén 4 y exhala durante 6.',
    yes: 'Sí', no: 'No', lessMessage: 'La ola ha bajado. Has comprobado que puedes atravesarla sin fumar.',
    stillTitle: 'No tienes que decidir ahora.', stillMessage: 'Prueba otra ronda de respiración, cambia de entorno o escribe a alguien. La ola sube, pero no dura para siempre.',
    appLink: 'El Guardián de Crisis de la app continúa con un temporizador para posponer y recordatorios.',
  },
  notFound: { title: 'Página no encontrada', lead: 'La página que buscas puede haberse movido o no existir.', links: 'Puedes continuar desde aquí' },
  legal: { dataDeletion: 'Eliminación de datos' },
};
