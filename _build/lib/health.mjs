// Public health milestones are a curated view of the Flutter health catalogue.
// Keep raw app content unchanged: only existing targetMinutes are eligible, and
// public wording excludes unsupported micro-milestones and absolute promises.
export const healthVerificationDate = '2026-10-05';

export const healthSources = Object.freeze([
  {
    key: 'who',
    label: 'Dünya Sağlık Örgütü (WHO)',
    url: 'https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation',
  },
  {
    key: 'nhs',
    label: 'NHS · Better Health',
    url: 'https://www.nhs.uk/better-health/quit-smoking/ready-to-quit-smoking/what-could-happen-when-you-quit-smoking/',
  },
  {
    key: 'cdc',
    label: 'CDC · Sigarayı bırakmanın faydaları',
    url: 'https://www.cdc.gov/tobacco/about/benefits-of-quitting.html',
  },
]);

export const healthSourceNote =
  'Uygulamanın sağlık hedeflerinden seçildi; WHO, NHS ve CDC kaynaklarıyla karşılaştırıldı. Süreler genel bir çerçevedir; kişisel sağlık durumuna göre değişebilir.';

const HEALTH_COPY = {
  en: {
    sources: ['World Health Organization (WHO)', 'NHS · Better Health', 'CDC · Benefits of quitting smoking'],
    note: 'Selected from the app’s health goals and checked against WHO, NHS and CDC sources. These timings are a general guide; individual health circumstances vary.',
    milestones: [
      ['Heart rate and blood pressure begin to return towards normal.', 'The first changes may begin within minutes of the last cigarette.'],
      ['Carbon monoxide in the blood returns to the normal range.', 'WHO’s general timeline places this change at around 12 hours.'],
      ['Your senses of taste and smell may begin to improve.', 'The NHS highlights improvements in taste and smell within the first two days.'],
      ['The bronchial tubes relax; breathing may become easier.', 'The NHS includes this among the general benefits at around 72 hours.'],
      ['Blood circulation may improve.', 'WHO’s timeline places these benefits within a 2–12 week period.'],
      ['Coughing and shortness of breath may decrease over time.', 'WHO describes these changes over a period of 1–9 months.'],
      ['Lung function may improve and respiratory symptoms may ease.', 'The NHS describes these benefits over 3–9 months; change does not happen on one fixed date.'],
      ['The risk of coronary heart disease falls to about half.', 'WHO’s comparison is with someone who continues to smoke.'],
      ['The risk of dying from lung cancer falls to about half.', 'The comparison in the NHS’s general timeline is with someone who continues to smoke.'],
      ['The risk of coronary heart disease approaches that of a non-smoker.', 'The CDC includes this among the longer-term benefits seen after about 15 years.'],
    ],
  },
  de: {
    sources: ['Weltgesundheitsorganisation (WHO)', 'NHS · Better Health', 'CDC · Vorteile des Rauchstopps'],
    note: 'Aus den Gesundheitszielen der App ausgewählt und mit Quellen von WHO, NHS und CDC abgeglichen. Die Zeitangaben sind eine allgemeine Orientierung; der Verlauf hängt von der persönlichen Gesundheit ab.',
    milestones: [
      ['Puls und Blutdruck beginnen, sich zu normalisieren.', 'Die ersten Veränderungen können schon Minuten nach der letzten Zigarette beginnen.'],
      ['Der Kohlenmonoxidgehalt im Blut kehrt in den Normalbereich zurück.', 'Im allgemeinen Zeitverlauf der WHO liegt diese Veränderung bei etwa 12 Stunden.'],
      ['Geschmacks- und Geruchssinn können sich verbessern.', 'Der NHS beschreibt eine Erholung von Geschmack und Geruch in den ersten zwei Tagen.'],
      ['Die Bronchien entspannen sich; das Atmen kann leichter werden.', 'Der NHS nennt dies als allgemeinen Vorteil nach etwa 72 Stunden.'],
      ['Die Durchblutung kann sich verbessern.', 'Die WHO ordnet diese Vorteile einem Zeitraum von 2–12 Wochen zu.'],
      ['Husten und Kurzatmigkeit können mit der Zeit abnehmen.', 'Die WHO beschreibt diese Veränderungen über einen Zeitraum von 1–9 Monaten.'],
      ['Die Lungenfunktion kann sich verbessern und Atembeschwerden können nachlassen.', 'Der NHS beschreibt diese Vorteile im Zeitraum von 3–9 Monaten; die Veränderung ist nicht an einen festen Tag gebunden.'],
      ['Das Risiko einer koronaren Herzkrankheit sinkt auf etwa die Hälfte.', 'Die WHO vergleicht dabei mit einer Person, die weiterhin raucht.'],
      ['Das Risiko, an Lungenkrebs zu sterben, sinkt auf etwa die Hälfte.', 'Der allgemeine Zeitverlauf des NHS vergleicht dabei mit einer Person, die weiterhin raucht.'],
      ['Das Risiko einer koronaren Herzkrankheit nähert sich dem einer nichtrauchenden Person an.', 'Die CDC zählt dies zu den langfristigen Vorteilen nach etwa 15 Jahren.'],
    ],
  },
  es: {
    sources: ['Organización Mundial de la Salud (OMS)', 'NHS · Better Health', 'CDC · Beneficios de dejar de fumar'],
    note: 'Seleccionados de los objetivos de salud de la aplicación y contrastados con fuentes de la OMS, el NHS y los CDC. Los plazos son orientativos y pueden variar según la salud de cada persona.',
    milestones: [
      ['El pulso y la presión arterial empiezan a acercarse a valores normales.', 'Los primeros cambios pueden empezar minutos después del último cigarrillo.'],
      ['El monóxido de carbono en la sangre vuelve al rango normal.', 'La cronología general de la OMS sitúa este cambio alrededor de las 12 horas.'],
      ['El gusto y el olfato pueden empezar a mejorar.', 'El NHS destaca la recuperación del gusto y el olfato durante los dos primeros días.'],
      ['Los bronquios se relajan y respirar puede resultar más fácil.', 'El NHS incluye este cambio entre los beneficios generales alrededor de las 72 horas.'],
      ['La circulación sanguínea puede mejorar.', 'La OMS sitúa estos beneficios en un periodo de 2–12 semanas.'],
      ['La tos y la dificultad para respirar pueden disminuir con el tiempo.', 'La OMS describe estos cambios en un periodo de 1–9 meses.'],
      ['La función pulmonar puede mejorar y las molestias respiratorias pueden disminuir.', 'El NHS describe estos beneficios entre los 3 y los 9 meses; el cambio no ocurre en una fecha fija.'],
      ['El riesgo de enfermedad coronaria se reduce aproximadamente a la mitad.', 'La comparación de la OMS es con una persona que sigue fumando.'],
      ['El riesgo de morir por cáncer de pulmón se reduce aproximadamente a la mitad.', 'La comparación de la cronología general del NHS es con una persona que sigue fumando.'],
      ['El riesgo de enfermedad coronaria se acerca al de una persona que no fuma.', 'Los CDC incluyen este cambio entre los beneficios a largo plazo que se observan después de unos 15 años.'],
    ],
  },
  fr: {
    sources: ['Organisation mondiale de la Santé (OMS)', 'NHS · Better Health', 'CDC · Bénéfices de l’arrêt du tabac'],
    note: 'Sélectionnées parmi les objectifs de santé de l’application et comparées aux sources de l’OMS, du NHS et des CDC. Ces délais sont des repères généraux ; ils varient selon la santé de chacun.',
    milestones: [
      ['Le pouls et la tension artérielle commencent à revenir vers la normale.', 'Les premiers changements peuvent débuter quelques minutes après la dernière cigarette.'],
      ['Le taux de monoxyde de carbone dans le sang revient dans la plage normale.', 'La chronologie générale de l’OMS situe ce changement autour de 12 heures.'],
      ['Le goût et l’odorat peuvent commencer à s’améliorer.', 'Le NHS souligne une récupération du goût et de l’odorat au cours des deux premiers jours.'],
      ['Les bronches se détendent ; respirer peut devenir plus facile.', 'Le NHS cite ce changement parmi les bénéfices généraux autour de 72 heures.'],
      ['La circulation sanguine peut s’améliorer.', 'L’OMS situe ces bénéfices dans une période de 2 à 12 semaines.'],
      ['La toux et l’essoufflement peuvent diminuer avec le temps.', 'L’OMS décrit ces changements sur une période de 1 à 9 mois.'],
      ['La fonction pulmonaire peut s’améliorer et les troubles respiratoires peuvent diminuer.', 'Le NHS décrit ces bénéfices entre 3 et 9 mois ; le changement ne dépend pas d’une date unique.'],
      ['Le risque de maladie coronarienne est réduit de moitié environ.', 'La comparaison de l’OMS porte sur une personne qui continue de fumer.'],
      ['Le risque de mourir d’un cancer du poumon est réduit de moitié environ.', 'La comparaison de la chronologie générale du NHS porte sur une personne qui continue de fumer.'],
      ['Le risque de maladie coronarienne se rapproche de celui d’une personne qui ne fume pas.', 'Les CDC citent ce changement parmi les bénéfices à long terme observés après environ 15 ans.'],
    ],
  },
};

export const healthSourceNoteFor = (lang = 'tr') => HEALTH_COPY[lang]?.note || healthSourceNote;
export const healthSourcesFor = (lang = 'tr') => healthSources.map((source, index) => ({
  ...source,
  label: HEALTH_COPY[lang]?.sources[index] || source.label,
}));

const MILESTONES = [
  {
    targetMinutes: 20,
    summary: 'Nabız ve kan basıncı normale dönmeye başlar.',
    detail: 'İlk değişimler, son sigaradan sonraki dakikalarda başlayabilir.',
    source: 'who',
  },
  {
    targetMinutes: 720,
    summary: 'Kandaki karbonmonoksit seviyesi normal aralığa döner.',
    detail: 'WHO’nun genel zaman çizelgesinde bu değişim 12 saat civarında yer alır.',
    source: 'who',
  },
  {
    targetMinutes: 2880,
    summary: 'Tat ve koku alma duyuları iyileşmeye başlayabilir.',
    detail: 'NHS, ilk iki günde tat ve koku duyularındaki toparlanmaya dikkat çeker.',
    source: 'nhs',
  },
  {
    targetMinutes: 4320,
    summary: 'Bronşlar gevşer; nefes almak kolaylaşabilir.',
    detail: 'NHS bu değişimi 72 saat civarındaki genel kazanımlar arasında sayar.',
    source: 'nhs',
  },
  {
    targetMinutes: 20160,
    summary: 'Kan dolaşımında iyileşmeler görülebilir.',
    detail: 'Bu kazanımlar WHO’nun zaman çizelgesinde 2–12 haftalık dönemde yer alır.',
    source: 'who',
  },
  {
    targetMinutes: 43200,
    summary: 'Öksürük ve nefes darlığı zamanla azalabilir.',
    detail: 'WHO bu değişimleri 1–9 aylık bir dönem içinde ele alır.',
    source: 'who',
  },
  {
    targetMinutes: 129600,
    summary: 'Akciğer fonksiyonları gelişebilir; solunum şikâyetleri azalabilir.',
    detail: 'NHS bu kazanımları 3–9 aylık dönemde açıklar; değişim tek bir tarihe bağlı değildir.',
    source: 'nhs',
  },
  {
    targetMinutes: 525600,
    summary: 'Koroner kalp hastalığı riski yaklaşık yarıya iner.',
    detail: 'WHO’nun verdiği bu karşılaştırma, sigara içmeye devam eden birine göredir.',
    source: 'who',
  },
  {
    targetMinutes: 5256000,
    summary: 'Akciğer kanserinden ölüm riski yaklaşık yarıya iner.',
    detail: 'NHS’nin genel zaman çizelgesindeki karşılaştırma, sigara içmeye devam eden birine göredir.',
    source: 'nhs',
  },
  {
    targetMinutes: 7884000,
    summary: 'Koroner kalp hastalığı riski, sigara içmeyen birinin riskine yaklaşır.',
    detail: 'CDC bu değişimi yaklaşık 15 yıl sonra görülen uzun vadeli kazanımlar arasında sayar.',
    source: 'cdc',
  },
];

/** Accepts the app health array, or the site's content object with a health array. */
export function verifiedHealth(content, lang = 'tr') {
  const goals = Array.isArray(content) ? content : content?.health;
  if (!Array.isArray(goals)) return [];
  const sources = healthSourcesFor(lang);
  return MILESTONES.flatMap((milestone, index) => {
    const appGoal = goals.find((goal) => goal.targetMinutes === milestone.targetMinutes);
    if (!appGoal) return [];
    return [{
      duration: appGoal.duration,
      targetMinutes: appGoal.targetMinutes,
      summary: HEALTH_COPY[lang]?.milestones[index][0] || milestone.summary,
      detail: HEALTH_COPY[lang]?.milestones[index][1] || milestone.detail,
      source: sources.find((source) => source.key === milestone.source),
      verifiedAt: healthVerificationDate,
    }];
  });
}
