// Tiny escaping template helper: every interpolated value is HTML-escaped
// unless it was produced by html`` or wrapped in raw().

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

class SafeHtml {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

export const raw = (value) => new SafeHtml(String(value ?? ''));

function render(value) {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  return esc(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) out += render(values[i]) + strings[i + 1];
  return new SafeHtml(out);
}

// JSON for <script type="application/ld+json">: never lets content close the tag.
export const jsonLd = (data) =>
  raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);

// JSON inside an attribute (data-labels).
export const jsonAttr = (data) => JSON.stringify(data);
