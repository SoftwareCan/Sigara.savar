// A reviewable gallery plan, stored only in this browser; never changes the site.
(() => {
  'use strict';
  const source = document.getElementById('admin-inventory');
  if (!source) return;
  let data;
  try { data = JSON.parse(source.textContent); } catch { return; }
  if (!data.gallery?.length) return;
  const KEY = 'sigara-savar-gallery-draft-v1';
  const originals = new Map(data.gallery.map((item) => [item.id, item]));
  const $ = (query) => document.querySelector(query);
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (text, className, onClick) => {
    const control = element('button', className, text);
    control.type = 'button';
    control.addEventListener('click', onClick);
    return control;
  };
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const defaults = () => ({ order: data.gallery.map((item) => item.id), items: Object.fromEntries(data.gallery.map((item) => [item.id, { alts: { ...item.alts }, sourceHash: item.sourceHash }])) });
  const signature = (value) => JSON.stringify({ order: value.order, items: value.items });
  function valid(value) {
    return value && Array.isArray(value.order) && value.order.length === originals.size && new Set(value.order).size === originals.size && value.order.every((id) => originals.has(id)) && value.items && typeof value.items === 'object' && value.order.every((id) => {
      const item = value.items[id];
      return item && typeof item.sourceHash === 'string' && item.sourceHash.length <= 64 && item.alts && data.locales.every((locale) => typeof item.alts[locale.code] === 'string' && item.alts[locale.code].length <= 600 && item.alts[locale.code].trim().length > 0);
    });
  }
  function clean(value) {
    return { order: [...value.order], items: Object.fromEntries(value.order.map((id) => [id, { sourceHash: value.items[id].sourceHash, alts: Object.fromEntries(data.locales.map((locale) => [locale.code, value.items[id].alts[locale.code]])) }])), ...(value.updatedAt ? { updatedAt: value.updatedAt } : {}) };
  }
  let saved = null;
  let plan = defaults();
  let currentId = null;
  let modalBaseline = '';
  let returnFocus;
  let toastTimer;
  let storageIssue = false;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      if (stored.version !== 1 || !valid(stored.plan)) throw new Error('Invalid gallery plan');
      saved = clean(stored.plan);
      plan = clone(saved);
    }
  } catch { storageIssue = true; }
  const dirty = () => signature(plan) !== signature(saved || defaults());
  const modal = $('#admin-media-editor');
  const form = $('#admin-media-form');
  function toast(text) {
    const node = $('[data-admin-toast]');
    clearTimeout(toastTimer);
    node.textContent = text;
    node.hidden = false;
    if (modal.open) $('[data-media-editor-feedback]').textContent = text;
    toastTimer = setTimeout(() => { node.hidden = true; }, 4400);
  }
  function updateStatus() {
    $('[data-gallery-draft-status]').textContent = dirty() ? 'Kaydedilmemiş plan' : saved ? 'Yerel galeri taslağı' : 'Kaynak düzeni';
    $('[data-gallery-draft-status]').classList.toggle('admin-tag--draft', Boolean(dirty() || saved));
    $('[data-gallery-save-state]').textContent = dirty() ? 'Değişiklikleri saklamak için galeri planını kaydet.' : saved ? 'Galeri planı bu tarayıcıda kayıtlı. Site henüz değişmedi.' : 'Değişiklikler siteye otomatik uygulanmaz.';
    const summary = $('[data-media-draft-summary]');
    summary.replaceChildren();
    summary.hidden = !saved;
    if (saved) {
      const row = element('div', 'admin-draft-row');
      const copy = element('div');
      copy.append(element('h3', '', 'Ana sayfa galerisi planı'), element('p', '', `${plan.order.length} görsel · 5 dilde alternatif metin · Yerel taslak`));
      const actions = element('div', 'admin-draft-actions');
      const edit = element('a', 'admin-button', 'Galeri planını aç');
      edit.href = '#media';
      edit.dataset.adminTab = 'media';
      actions.append(edit, button('Dışa aktar', 'admin-button', () => exportPlan(saved)));
      row.append(copy, actions);
      summary.append(row);
      $('[data-drafts-empty]').hidden = true;
    }
  }
  function render() {
    const rows = $('[data-gallery-plan-rows]');
    rows.replaceChildren();
    plan.order.forEach((id, index) => {
      const item = originals.get(id);
      const row = element('div', 'admin-gallery-row');
      const position = element('span', 'admin-gallery-position', String(index + 1).padStart(2, '0'));
      const image = element('img');
      image.src = item.path;
      image.alt = '';
      image.width = item.width;
      image.height = item.height;
      image.loading = 'lazy';
      const copy = element('div', 'admin-gallery-copy');
      copy.append(element('h4', '', `Galeri görseli ${item.position}`), element('p', '', plan.items[id].alts.tr));
      const controls = element('div', 'admin-gallery-row-actions');
      const up = button('↑', 'admin-icon-button', () => move(index, -1));
      up.disabled = index === 0;
      up.setAttribute('aria-label', `Galeri görseli ${item.position}: önceki sıraya taşı`);
      const down = button('↓', 'admin-icon-button', () => move(index, 1));
      down.disabled = index === plan.order.length - 1;
      down.setAttribute('aria-label', `Galeri görseli ${item.position}: sonraki sıraya taşı`);
      const edit = button('Alt metinler', 'admin-button', () => openEditor(id));
      edit.setAttribute('aria-label', `Galeri görseli ${item.position} için alternatif metinleri düzenle`);
      controls.append(up, down, edit);
      row.append(position, image, copy, controls);
      rows.append(row);
    });
    updateStatus();
  }
  function move(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= plan.order.length) return;
    [plan.order[index], plan.order[target]] = [plan.order[target], plan.order[index]];
    render();
    const row = $('[data-gallery-plan-rows]').children[target];
    const preferred = row.querySelector(delta < 0 ? '.admin-gallery-row-actions button:nth-child(1)' : '.admin-gallery-row-actions button:nth-child(2)');
    (preferred.disabled ? row.querySelector('.admin-gallery-row-actions button:not(:disabled)') : preferred)?.focus();
    toast(`Görsel ${target + 1}. sıraya taşındı. Plan henüz kaydedilmedi.`);
  }
  function readAlts() {
    return Object.fromEntries(data.locales.map((locale) => [locale.code, form.elements.namedItem(`alt-${locale.code}`).value.trim()]));
  }
  function openEditor(id) {
    currentId = id;
    returnFocus = document.activeElement;
    const item = originals.get(id);
    $('[data-media-editor-context]').textContent = `Galeri görseli ${item.position} · ${item.width} × ${item.height}`;
    $('[data-media-editor-preview]').src = item.path;
    const fields = $('[data-media-alt-fields]');
    fields.replaceChildren();
    data.locales.forEach((locale) => {
      const label = element('label', '', locale.name);
      const textarea = element('textarea');
      textarea.name = `alt-${locale.code}`;
      textarea.lang = locale.code;
      textarea.rows = 3;
      textarea.maxLength = 600;
      textarea.required = true;
      textarea.value = plan.items[id].alts[locale.code];
      label.append(textarea);
      fields.append(label);
    });
    modalBaseline = JSON.stringify(readAlts());
    modal.showModal();
    document.body.classList.add('admin-dialog-open');
    form.elements.namedItem('alt-tr')?.focus();
  }
  function closeEditor() {
    if (JSON.stringify(readAlts()) !== modalBaseline && !window.confirm('Alternatif metin değişiklikleri plana eklenmedi. Kapatılsın mı?')) return;
    modal.close();
  }
  function exportPlan(value) {
    if (!valid(value)) { toast('Galeri planındaki alanları kontrol et.'); return; }
    const payload = { format: 'sigara-savar-gallery-draft', version: 1, exportedAt: new Date().toISOString(), scope: 'local-review-only', gallery: clean(value) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }));
    const link = element('a');
    link.href = url;
    link.download = `sigara-savar-galeri-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Galeri planı dışa aktarıldı. Siteye uygulanmadı.');
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const alts = readAlts();
    const empty = data.locales.find((locale) => !alts[locale.code]);
    if (empty) { form.elements.namedItem(`alt-${empty.code}`).focus(); toast(`${empty.name} alternatif metnini tamamla.`); return; }
    plan.items[currentId] = { sourceHash: originals.get(currentId).sourceHash, alts };
    modalBaseline = JSON.stringify(alts);
    modal.close();
    render();
    toast('Alternatif metinler plana eklendi. Kalıcı saklamak için planı kaydet.');
  });
  $('[data-close-media-editor]').addEventListener('click', closeEditor);
  modal.addEventListener('cancel', (event) => { event.preventDefault(); closeEditor(); });
  modal.addEventListener('close', () => { currentId = null; document.body.classList.remove('admin-dialog-open'); if (returnFocus?.isConnected) returnFocus.focus(); });
  $('[data-gallery-save]').addEventListener('click', () => {
    const next = { ...clean(plan), updatedAt: new Date().toISOString() };
    if (!valid(next)) { toast('Galeri planındaki alanları kontrol et.'); return; }
    try { localStorage.setItem(KEY, JSON.stringify({ version: 1, plan: next })); saved = clone(next); plan = clone(next); updateStatus(); toast('Galeri planı bu tarayıcıya kaydedildi.'); }
    catch { toast('Galeri planı kaydedilemedi. Planı JSON olarak dışa aktarabilirsin.'); }
  });
  $('[data-gallery-export]').addEventListener('click', () => exportPlan(plan));
  $('[data-gallery-reset]').addEventListener('click', () => {
    if ((dirty() || saved) && !window.confirm('Yerel galeri planı kaldırılsın ve kaynak sırasına dönülsün mü?')) return;
    try { localStorage.removeItem(KEY); saved = null; plan = defaults(); render(); toast('Kaynak galeri düzenine dönüldü.'); }
    catch { toast('Tarayıcı kaydı kaldırılamadı. Depolama ayarlarını kontrol et.'); }
  });
  document.addEventListener('sigara-admin-collect-media', (event) => { if (saved) event.detail.gallery = clone(saved); });
  window.addEventListener('beforeunload', (event) => { if (dirty() || (currentId && JSON.stringify(readAlts()) !== modalBaseline)) { event.preventDefault(); event.returnValue = ''; } });
  render();
  if (storageIssue) toast('Eski galeri taslağı okunamadı. Kaynak düzeni gösteriliyor.');
})();
