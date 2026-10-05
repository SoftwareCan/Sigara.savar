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
export function verifiedHealth(content) {
  const goals = Array.isArray(content) ? content : content?.health;
  if (!Array.isArray(goals)) return [];
  return MILESTONES.flatMap((milestone) => {
    const appGoal = goals.find((goal) => goal.targetMinutes === milestone.targetMinutes);
    if (!appGoal) return [];
    return [{
      duration: appGoal.duration,
      targetMinutes: appGoal.targetMinutes,
      summary: milestone.summary,
      detail: milestone.detail,
      source: healthSources.find((source) => source.key === milestone.source),
      verifiedAt: healthVerificationDate,
    }];
  });
}
