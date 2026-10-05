const FOLD = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };

// Must match assets/js/knowledge.js so typed queries hit the prebuilt index.
export function searchKey(...parts) {
  return parts
    .flat()
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('tr')
    .replace(/i̇/g, 'i')
    .replace(/[çğıöşüâîû]/g, (c) => FOLD[c])
    .replace(/\s+/g, ' ')
    .trim();
}

export const sum = (list, pick) => list.reduce((n, item) => n + pick(item), 0);

// Health goal "detail" fields are paragraphs separated by blank lines.
export const paragraphs = (text) =>
  String(text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export const firstSentence = (text) => paragraphs(text)[0] || '';

// "Ertele: İstek geldiğinde…" -> { lead: 'Ertele', rest: 'İstek geldiğinde…' }
export function splitLead(item) {
  const m = /^([^:]{2,40}):\s+(.+)$/s.exec(item);
  return m ? { lead: m[1], rest: m[2] } : { lead: null, rest: item };
}
