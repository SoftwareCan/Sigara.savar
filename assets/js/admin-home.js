// Browser-local homepage copy drafts. This workspace has no publication endpoint.
(() => {
  'use strict';
  const sourceNode = document.getElementById('admin-home-inventory');
  const form = document.getElementById('admin-home-form');
  const selector = document.getElementById('admin-home-locale');
  if (!sourceNode || !form || !selector) return;
  let data;
  try { data = JSON.parse(sourceNode.textContent); } catch { return; }
  if (data.version !== 1 || !Array.isArray(data.groups) || !Array.isArray(data.locales) || !data.locales.length) return;

  const STORAGE_KEY = 'sigara-savar-home-copy-drafts-v1';
  const fields = data.groups.flatMap((group) => group.fields);
  const originals = new Map(data.locales.map((locale) => [locale.code, locale]));
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const $ = (query) => document.querySelector(query);
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const signature = (values) => JSON.stringify(fields.map((field) => values[field.path]));
  const validValues = (values) => values && typeof values === 'object' && !Array.isArray(values) &&
    Object.keys(values).length === fields.length && fields.every((field) =>
      Object.hasOwn(values, field.path) && typeof values[field.path] === 'string' &&
      values[field.path].length <= field.maxLength && values[field.path].trim().length > 0);
  const cleanValues = (values) => Object.fromEntries(fields.map((field) => [field.path, values[field.path]]));
  const validDraft = (code, draft) => {
    const original = originals.get(code);
    return original && draft && typeof draft === 'object' && !Array.isArray(draft) &&
      draft.locale === code && draft.route === original.route && /^[a-f0-9]{64}$/.test(draft.sourceHash) &&
      typeof draft.updatedAt === 'string' && draft.updatedAt.length <= 40 && Number.isFinite(Date.parse(draft.updatedAt)) && validValues(draft.values);
  };
  const cleanDraft = (draft) => ({ locale: draft.locale, route: draft.route, sourceHash: draft.sourceHash, updatedAt: draft.updatedAt, values: cleanValues(draft.values) });
  if (!data.locales.every((locale) => validValues(locale.values))) return;

  let saved = Object.create(null);
  let readIssue = '';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.version !== 1 || !parsed.drafts || typeof parsed.drafts !== 'object' || Array.isArray(parsed.drafts)) throw new Error('Invalid homepage drafts');
      for (const [code, draft] of Object.entries(parsed.drafts)) {
        if (validDraft(code, draft)) saved[code] = cleanDraft(draft);
        else readIssue = 'Bazı ana sayfa taslakları okunamadı. Geçerli taslaklar korundu; diğer diller kaynak metinlerle açıldı.';
      }
    }
  } catch { readIssue = 'Ana sayfa taslakları okunamadı. Kaynak metinler gösteriliyor. Değişikliklerini dışa aktarabilirsin.'; }
  const working = Object.fromEntries(data.locales.map((locale) => [locale.code, clone(saved[locale.code]?.values || locale.values)]));
  let current = data.locales[0].code;
  let toastTimer;
  const dirty = (code) => signature(working[code]) !== signature(saved[code]?.values || originals.get(code).values);
  const anyDirty = () => data.locales.some((locale) => dirty(locale.code));

  function toast(message) {
    const node = $('[data-admin-toast]');
    if (!node) return;
    clearTimeout(toastTimer);
    node.textContent = message;
    node.hidden = false;
    toastTimer = setTimeout(() => { node.hidden = true; }, 4500);
  }
  function showError(message = '') {
    const node = $('[data-home-error]');
    node.textContent = message;
    node.hidden = !message;
  }
  function readForm() {
    working[current] = Object.fromEntries(fields.map((field) => [field.path, form.elements.namedItem(field.path).value]));
  }
  function exportable(draft) {
    const original = originals.get(draft.locale);
    const copy = clone(original.copy);
    for (const field of fields) {
      const parts = field.path.split('.');
      const name = parts.pop();
      const target = parts.reduce((value, part) => value[part], copy);
      target[name] = draft.values[field.path];
    }
    return { locale: draft.locale, route: draft.route, sourceHash: draft.sourceHash, updatedAt: draft.updatedAt, copy };
  }
  function renderSummary() {
    const summary = $('[data-home-draft-summary]');
    if (!summary) return;
    summary.replaceChildren();
    const drafts = data.locales.map((locale) => saved[locale.code]).filter(Boolean);
    summary.hidden = !drafts.length;
    for (const draft of drafts) {
      const locale = originals.get(draft.locale);
      const row = element('div', 'admin-draft-row');
      const text = element('div');
      text.append(element('h3', '', `${locale.name} ana sayfa metinleri`), element('p', '', `${draft.route} · Yerel taslak${draft.sourceHash !== locale.sourceHash ? ' · Kaynak metinler güncellenmiş' : ''}`));
      const actions = element('div', 'admin-draft-actions');
      const edit = element('a', 'admin-button', 'Metinleri aç');
      edit.href = '#home';
      edit.dataset.adminTab = 'home';
      edit.addEventListener('click', () => { readForm(); current = locale.code; render(); });
      const download = element('button', 'admin-button', 'Dışa aktar');
      download.type = 'button';
      download.addEventListener('click', () => exportDraft(draft));
      actions.append(edit, download);
      row.append(text, actions);
      summary.append(row);
    }
    if (drafts.length) $('[data-drafts-empty]')?.setAttribute('hidden', '');
  }
  function updateStatus() {
    const draft = saved[current];
    const hasChanges = dirty(current);
    const stale = draft && draft.sourceHash !== originals.get(current).sourceHash;
    const state = $('[data-home-draft-status]');
    state.textContent = hasChanges ? 'Kaydedilmemiş değişiklikler' : draft ? 'Yerel ana sayfa taslağı' : 'Kaynak metinler';
    state.classList.toggle('admin-tag--draft', Boolean(hasChanges || draft));
    $('[data-home-save-state]').textContent = hasChanges ? 'Bu dildeki değişiklikleri saklamak için taslağı kaydet.' : draft ? 'Bu dilin taslağı tarayıcıda kayıtlı. Siteye uygulanmadı.' : 'Değişiklikler bu tarayıcıya kaydedilir; siteye uygulanmaz.';
    $('[data-home-source-state]').textContent = stale ? 'Kaynak metinler güncellenmiş. Kaydedilmiş taslağı yeni kaynakla gözden geçir.' : `Kaynak: ${data.sourceFile}`;
    $('[data-home-save]').disabled = !hasChanges;
    $('[data-home-reset]').disabled = !hasChanges && !draft;
    $('[data-home-preview-title]').textContent = working[current].title;
    $('[data-home-preview-description]').textContent = working[current].description;
    for (const field of fields.filter((item) => item.path === 'title' || item.path === 'description')) {
      document.querySelector(`[data-home-count="${field.path}"]`).textContent = `${working[current][field.path].length} karakter · Önizleme, arama motorunun gösterimini garanti etmez.`;
    }
    renderSummary();
  }
  function render() {
    const locale = originals.get(current);
    selector.value = current;
    for (const field of fields) {
      const control = form.elements.namedItem(field.path);
      control.value = working[current][field.path];
      control.lang = current;
      control.setCustomValidity('');
    }
    $('[data-home-source-link]').href = locale.route;
    $('[data-home-source-link]').setAttribute('aria-label', `${locale.name} kaynak ana sayfasını aç`);
    $('[data-home-preview-url]').textContent = `${location.origin}${locale.route}`;
    updateStatus();
  }
  function validateCurrent() {
    readForm();
    const invalid = fields.find((field) => !working[current][field.path].trim() || working[current][field.path].length > field.maxLength);
    if (!invalid) return true;
    const control = form.elements.namedItem(invalid.path);
    control.closest('details').open = true;
    control.setCustomValidity(!control.value.trim() ? 'Bu alanı tamamla.' : `En fazla ${invalid.maxLength} karakter kullan.`);
    control.reportValidity();
    control.focus();
    showError(`${invalid.label} alanını kontrol et.`);
    return false;
  }
  function makeDraft() {
    const locale = originals.get(current);
    return { locale: current, route: locale.route, sourceHash: locale.sourceHash, updatedAt: new Date().toISOString(), values: cleanValues(working[current]) };
  }
  function persist(next) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, drafts: next }));
      saved = next;
      showError();
      updateStatus();
      return true;
    } catch {
      showError('Taslak kaydedilemedi. Tarayıcı depolamasını kontrol et veya değişikliklerini dışa aktar.');
      return false;
    }
  }
  function exportDraft(draft) {
    if (!validDraft(draft.locale, draft)) { showError('Dışa aktarılacak metinlerdeki alanları kontrol et.'); return; }
    const payload = { format: 'sigara-savar-home-copy-draft', version: 1, exportedAt: new Date().toISOString(), scope: 'local-review-only', sourceFile: data.sourceFile, homepages: [exportable(draft)] };
    const blobUrl = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }));
    const link = element('a');
    link.href = blobUrl;
    link.download = `sigara-savar-ana-sayfa-${draft.locale}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    toast('Ana sayfa taslağı dışa aktarıldı. Siteye uygulanmadı.');
  }
  form.addEventListener('input', (event) => {
    event.target.setCustomValidity?.('');
    readForm();
    showError();
    updateStatus();
  });
  selector.addEventListener('change', () => { readForm(); current = selector.value; render(); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateCurrent()) return;
    const next = { ...saved, [current]: makeDraft() };
    if (persist(next)) toast(`${originals.get(current).name} ana sayfa taslağı bu tarayıcıya kaydedildi.`);
  });
  $('[data-home-export]').addEventListener('click', () => { if (validateCurrent()) exportDraft(makeDraft()); });
  $('[data-home-reset]').addEventListener('click', () => {
    if ((dirty(current) || saved[current]) && !window.confirm(`${originals.get(current).name} ana sayfa taslağı kaldırılsın ve kaynak metinlere dönülsün mü?`)) return;
    const next = { ...saved };
    delete next[current];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, drafts: next }));
      saved = next;
      working[current] = clone(originals.get(current).values);
      render();
      showError();
      toast('Bu dildeki kaynak ana sayfa metinlerine dönüldü.');
    } catch { showError('Tarayıcıdaki taslak kaldırılamadı. Depolama ayarlarını kontrol et.'); }
  });
  document.addEventListener('sigara-admin-collect-media', (event) => {
    event.detail.homepages = data.locales.map((locale) => saved[locale.code]).filter(Boolean).map(exportable);
    renderSummary();
  });
  window.addEventListener('beforeunload', (event) => { if (anyDirty()) { event.preventDefault(); event.returnValue = ''; } });
  render();
  if (readIssue) showError(readIssue);
})();
