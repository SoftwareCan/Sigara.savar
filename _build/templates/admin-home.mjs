import { html, raw } from '../lib/html.mjs';

export function homepageAdminPanel(data) {
  const first = data.locales[0];
  return html`<section class="admin-panel" id="home" data-admin-view="home" aria-labelledby="home-admin-title" hidden>
  <div class="admin-panel-heading"><div><h2 id="home-admin-title">Ana sayfa metinleri</h2><p>Beş dildeki karşılama alanını, bölüm metinlerini ve SEO başlıklarını düzenle.</p></div><span class="admin-tag" data-home-draft-status>Kaynak metinler</span></div>
  <div class="admin-filters"><label><span class="visually-hidden">Ana sayfa dili</span><select id="admin-home-locale">${data.locales.map((locale) => html`<option value="${locale.code}">${locale.name}</option>`)}</select></label><a class="admin-button" data-home-source-link href="${first.route}" target="_blank" rel="noopener">Kaynak sayfayı aç</a><p data-home-source-state>Kaynak: ${data.sourceFile}</p></div>
  <form id="admin-home-form" novalidate>
    <div class="admin-home-fields">${data.groups.map((group) => html`<details class="admin-home-section"${group.id === 'hero' ? raw(' open') : ''}><summary>${group.title}</summary><p class="admin-field-note">${group.description}</p><div class="admin-editor-fields">${group.fields.map((field) => html`<label>${field.label}${field.multiline ? html`<textarea name="${field.path}" rows="3" maxlength="${field.maxLength}" required lang="${first.code}">${first.values[field.path]}</textarea>` : html`<input name="${field.path}" value="${first.values[field.path]}" maxlength="${field.maxLength}" required lang="${first.code}">`}${group.id === 'seo' ? html`<span data-home-count="${field.path}"></span>` : ''}</label>`)}</div>${group.id === 'seo' ? html`<div class="admin-search-preview"><span data-home-preview-url>${first.route}</span><strong data-home-preview-title>${first.values.title}</strong><p data-home-preview-description>${first.values.description}</p></div>` : ''}</details>`)}</div>
    <div class="admin-editor-footer"><p data-home-save-state role="status" aria-live="polite">Değişiklikler bu tarayıcıya kaydedilir; siteye uygulanmaz.</p><div><button class="admin-button" type="button" data-home-reset>Kaynağa dön</button><button class="admin-button" type="button" data-home-export>Dışa aktar</button><button class="admin-button admin-button--primary" type="submit" data-home-save>Taslağı kaydet</button></div></div>
    <p class="admin-field-note admin-home-error" data-home-error role="status" hidden></p>
  </form>
  <noscript><div class="admin-editorial-note"><p>Ana sayfa taslaklarını düzenlemek ve kaydetmek için JavaScript’i etkinleştir. Kaynak sayfalara dil seçicisindeki bağlantıdan ulaşabilirsin.</p></div></noscript>
</section>
<script type="application/json" id="admin-home-inventory">${raw(JSON.stringify(data).replace(/</g, '\\u003c'))}</script>`;
}
