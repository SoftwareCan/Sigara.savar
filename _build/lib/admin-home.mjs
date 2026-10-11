// Homepage editing uses public product copy only; drafts never affect the build.
import crypto from 'node:crypto';
import { homeCopy } from '../i18n/home.mjs';

const LANGUAGE_NAMES = { tr: 'Türkçe', en: 'English', de: 'Deutsch', es: 'Español', fr: 'Français', 'pt-BR': 'Português (Brasil)' };
const field = (path, label, maxLength = 240, multiline = false) => ({ path, label, maxLength, multiline });
const sectionFields = (id, detail = true) => [
  field(`${id}.label`, 'Bölüm etiketi', 180),
  field(`${id}.title`, 'Bölüm başlığı'),
  field(`${id}.text`, 'Ana metin', 1400, true),
  ...(detail ? [field(`${id}.detail`, 'Destekleyici metin', 1000, true)] : []),
  field(`${id}.link`, 'Bağlantı metni', 180),
];

const groups = [
  { id: 'hero', title: 'Karşılama alanı', description: 'Ana mesaj ve ilk bağlantılar. Bağlantı hedefleri kaynak siteden korunur.', fields: [field('hero', 'Ana başlık (H1)'), field('lead', 'Giriş metni', 1400, true), field('download', 'Uygulama düğmesi', 180), field('guide', 'Bırakma rehberi bağlantısı', 180), field('availability', 'Platform bilgisi', 180)] },
  { id: 'jumps', title: 'Bölüm bağlantıları', description: 'Karşılama alanının altındaki üç kısa yönlendirme.', fields: [field('jumpLabel', 'Gezinme açıklaması (ekran okuyucu)', 180), field('jumps.0', 'İlerleme bağlantısı', 180), field('jumps.1', 'İstek anları bağlantısı', 180), field('jumps.2', 'Topluluk bağlantısı', 180)] },
  { id: 'progress', title: 'Gelişim ve başarılar', description: 'İlerleme takibini anlatan bölüm.', fields: sectionFields('progress') },
  { id: 'craving', title: 'İstek anları', description: 'Araçlara yönlendiren bölüm. Tedavi veya başarı garantisi veren ifadeler kullanma.', fields: sectionFields('craving') },
  { id: 'community', title: 'Topluluk', description: 'Deneyim paylaşımı ve topluluk desteği. Profesyonel sağlık desteği iddiası ekleme.', fields: sectionFields('community') },
  { id: 'learning', title: 'Bilgi Merkezi', description: 'Yazılara yönlendiren tanıtım. Yazı metinleri ayrı içerik düzenleyicisinde yer alır.', fields: sectionFields('learning', false) },
  { id: 'end', title: 'Son indirme alanı', description: 'Sayfanın sonundaki mesaj. Resmî mağaza bağlantıları korunur.', fields: [field('end.title', 'Başlık'), field('end.text', 'Destekleyici metin', 1400, true), field('end.note', 'Mağaza açıklaması', 240)] },
  { id: 'seo', title: 'Ana sayfa SEO metinleri', description: 'Arama ve sosyal paylaşım için başlık ile açıklama. Canonical, dil bağlantıları ve yapılandırılmış veri değişmez.', fields: [field('title', 'Arama ve sosyal paylaşım başlığı', 240), field('description', 'Meta açıklaması', 1000, true)] },
];

const atPath = (value, key) => key.split('.').reduce((item, part) => item[part], value);

export function homepageAdminData(config) {
  const fields = groups.flatMap((group) => group.fields);
  const locales = Object.entries(config.locales).filter(([, locale]) => locale.enabled).map(([code, locale]) => {
    const copy = JSON.parse(JSON.stringify(homeCopy(code)));
    return {
      code, name: LANGUAGE_NAMES[code] || code,
      route: locale.prefix ? `/${locale.prefix}/` : '/',
      sourceHash: crypto.createHash('sha256').update(JSON.stringify(copy)).digest('hex'),
      values: Object.fromEntries(fields.map(({ path }) => [path, atPath(copy, path)])),
      copy,
    };
  });
  return { version: 1, sourceFile: '_build/i18n/home.mjs', groups, locales };
}
