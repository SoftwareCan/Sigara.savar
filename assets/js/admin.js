// Browser-local editing of public source content. No remote writes or user data.
(() => {
  'use strict';
  const inventoryNode = document.getElementById('admin-inventory');
  if (!inventoryNode) return;
  let data;
  try { data = JSON.parse(inventoryNode.textContent); } catch { return; }
  const STORAGE_KEY = 'sigara-savar-content-drafts-v1';
  const articleMap = new Map(data.articles.map((article) => [`${article.locale}:${article.id}`, article]));
  const localeNames = new Map(data.locales.map((locale) => [locale.code, locale.name]));
  const viewNames = { home: 'Ana sayfa', content: 'İçerikler', translations: 'Diller', media: 'Medya', seo: 'SEO kontrolü', drafts: 'Taslaklar' };
  const checkNames = { page: 'Sayfa dosyası', title: 'Başlık', description: 'Meta açıklaması', canonical: 'Canonical', languages: 'Dil bağlantıları', article: 'Article verisi', heading: 'Tek H1 başlığı' };
  const $ = (selector, from = document) => from.querySelector(selector);
  const $$ = (selector, from = document) => [...from.querySelectorAll(selector)];
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (label, className, action) => {
    const node = element('button', className, label);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  };
  const keyOf = (article) => `${article.locale}:${article.id}`;
  const normalized = (text) => String(text).toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
  const dateText = (value) => new Intl.DateTimeFormat('tr', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
  const shortText = (value, max) => typeof value === 'string' && value.length <= max;
  const validLines = (value) => Array.isArray(value) && value.length <= 100 && value.every((line) => shortText(line, 12000));
  let drafts = Object.create(null);
  let storageError = '';
  let toastTimer;
  let currentKey = null;
  let editorBaseline = '';
  let returnFocus = null;
  const dialog = $('#admin-editor');
  const form = $('#admin-editor-form');

  function validDraft(key, draft) {
    const original = articleMap.get(key);
    return original && draft && typeof draft === 'object' && draft.id === original.id && draft.locale === original.locale && draft.route === original.route &&
      shortText(draft.title, 240) && shortText(draft.summary, 1000) && shortText(draft.intro, 12000) &&
      shortText(draft.seoTitle, 240) && shortText(draft.seoDescription, 1000) &&
      shortText(draft.sourceHash, 64) && typeof draft.updatedAt === 'string' && Number.isFinite(Date.parse(draft.updatedAt)) &&
      Array.isArray(draft.contentSections) && draft.contentSections.length === original.contentSections.length &&
      draft.contentSections.every((section) => section && shortText(section.title, 500) && (section.body === null || shortText(section.body, 50000)) && validLines(section.items) && typeof section.numbered === 'boolean') && validLines(draft.keyTakeaways);
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.version !== 1 || !parsed.drafts || typeof parsed.drafts !== 'object' || Array.isArray(parsed.drafts)) throw new Error('Invalid drafts');
      for (const [key, draft] of Object.entries(parsed.drafts)) {
        if (validDraft(key, draft)) drafts[key] = draft;
        else storageError = 'Bazı eski taslaklar okunamadı. Kaynak içerikler kullanılmaya devam ediyor.';
      }
    }
  } catch { storageError = 'Tarayıcıdaki taslaklar okunamadı. Kaynak içerikler gösteriliyor.'; }

  function toast(message) {
    const node = $('[data-admin-toast]');
    clearTimeout(toastTimer);
    node.textContent = message;
    node.hidden = false;
    if (dialog.open) $('[data-editor-save-state]').textContent = message;
    toastTimer = setTimeout(() => { node.hidden = true; }, 4200);
  }
  function persist(next) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, drafts: next }));
      drafts = next;
      return true;
    } catch {
      toast('Taslak kaydedilemedi. Tarayıcı depolamasını kontrol et veya taslağı dışa aktar.');
      return false;
    }
  }
  function exportFile(items, includeMedia = false) {
    const collected = { gallery: null, homepages: [] };
    if (includeMedia) document.dispatchEvent(new CustomEvent('sigara-admin-collect-media', { detail: collected }));
    const homepages = Array.isArray(collected.homepages) ? collected.homepages : [];
    if (!items.length && !collected.gallery && !homepages.length) { toast('Dışa aktarılacak bir taslak yok. Önce değişikliklerini kaydet.'); return; }
    const payload = { format: 'sigara-savar-editorial-drafts', version: 1, exportedAt: new Date().toISOString(), scope: 'local-review-only', drafts: items, ...(collected.gallery ? { gallery: collected.gallery } : {}), ...(homepages.length ? { homepages } : {}) };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = element('a');
    link.href = url;
    link.download = `sigara-savar-taslaklar-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast([`${items.length} yazı taslağı`, ...(collected.gallery ? ['galeri planı'] : []), ...(homepages.length ? [`${homepages.length} ana sayfa taslağı`] : [])].join(', ') + ' dışa aktarıldı.');
  }
  function showView(id, focus = false) {
    if (!(Object.hasOwn(viewNames, id))) id = 'content';
    $$('[data-admin-view]').forEach((panel) => { panel.hidden = panel.dataset.adminView !== id; });
    $$('.admin-sidebar [data-admin-tab]').forEach((link) => {
      if (link.dataset.adminTab === id) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    $('[data-admin-breadcrumb]').textContent = viewNames[id];
    if (id === 'translations') renderLanguages();
    if (id === 'media') renderMedia();
    if (id === 'seo') renderSeo();
    if (id === 'drafts') renderDrafts();
    if (focus) {
      const heading = $(`#${id} h2`);
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
  function updateCounts() {
    $$('[data-draft-count]').forEach((node) => { node.textContent = Object.keys(drafts).length; });
  }
  function renderArticles() {
    const query = normalized($('#admin-search').value);
    const locale = $('#admin-locale').value;
    const section = $('#admin-section').value;
    const filtered = data.articles.filter((article) => article.locale === locale && (section === 'all' || article.sectionId === section) && normalized([drafts[keyOf(article)]?.title || article.title, article.summary, ...(article.tags || [])].join(' ')).includes(query));
    const rows = $('[data-article-rows]');
    rows.replaceChildren();
    for (const article of filtered) {
      const key = keyOf(article);
      const draft = drafts[key];
      const row = element('tr');
      const title = element('td');
      const titleButton = button(draft?.title || article.title, 'admin-article-link', () => openEditor(key));
      titleButton.dataset.editArticle = key;
      title.append(titleButton, element('span', 'admin-row-path', article.route));
      const status = element('td');
      status.append(element('span', `admin-tag${draft ? ' admin-tag--draft' : ''}`, draft ? 'Yerel taslak' : 'Kaynak içerik'));
      const action = element('td');
      const edit = button('›', 'admin-icon-button', () => openEditor(key));
      edit.setAttribute('aria-label', `${article.title} yazısını düzenle`);
      action.append(edit);
      row.append(title, element('td', '', article.sectionTitle), element('td', '', `${article.estimatedReadMinutes} dk`), status, action);
      rows.append(row);
    }
    $('[data-content-count]').textContent = `${filtered.length} yazı`;
    $('[data-content-footer]').textContent = `${localeNames.get(locale)} · ${filtered.length} yazı gösteriliyor`;
    $('[data-content-empty]').hidden = filtered.length > 0;
  }
  function renderLanguages() {
    const list = $('[data-language-rows]');
    list.replaceChildren();
    for (const locale of data.locales) {
      const row = element('div', 'admin-language-row');
      const name = element('div', 'admin-language-name');
      name.append(element('span', '', locale.code.toUpperCase()), document.createTextNode(locale.name));
      const draftCount = Object.values(drafts).filter((draft) => draft.locale === locale.code).length;
      const label = `${locale.count} kaynak yazı${draftCount ? ` · ${draftCount} yerel taslak` : ''}`;
      row.append(name, element('p', '', label), button('Yazıları gör', 'admin-button', () => {
        $('#admin-locale').value = locale.code;
        $('#admin-section').value = 'all';
        $('#admin-search').value = '';
        renderArticles();
        location.hash = 'content';
        showView('content', true);
      }));
      list.append(row);
    }
  }
  function renderMedia() {
    const query = normalized($('#admin-media-search').value);
    const group = $('#admin-media-group').value;
    const items = data.media.filter((item) => (group === 'all' || item.group === group) && normalized(item.name).includes(query));
    const grid = $('[data-media-grid]');
    grid.replaceChildren();
    for (const item of items) {
      const card = element('article', 'admin-media-item');
      const imageWrap = element('a', 'admin-media-image');
      imageWrap.href = item.path;
      imageWrap.target = '_blank';
      imageWrap.rel = 'noopener';
      imageWrap.setAttribute('aria-label', `${item.name} görselini aç`);
      const img = element('img');
      img.src = item.path;
      img.alt = item.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 180;
      img.height = 160;
      imageWrap.append(img);
      const info = element('div', 'admin-media-info');
      const fileName = element('h3', '', item.name);
      fileName.title = item.name;
      info.append(fileName, element('p', '', `${item.format} · ${(item.bytes / 1024).toFixed(1)} KB${item.width ? ` · ${item.width}×${item.height}` : ''}`), button('Dosya yolunu kopyala', 'admin-button', async () => {
        try { await navigator.clipboard.writeText(item.path); toast('Dosya yolu kopyalandı.'); }
        catch { window.prompt('Bu dosya yolunu kopyala:', item.path); }
      }));
      card.append(imageWrap, info);
      grid.append(card);
    }
    if (!items.length) {
      const empty = element('div', 'admin-empty');
      empty.append(element('h3', '', 'Eşleşen görsel bulunamadı.'), element('p', '', 'Başka bir dosya adı ara veya grubu değiştir.'));
      grid.append(empty);
    }
  }
  function renderSeo() {
    const issues = (article) => Object.entries(article.checks).filter(([, passed]) => !passed).map(([name]) => checkNames[name]);
    const passed = data.articles.filter((article) => !issues(article).length).length;
    const summary = $('[data-seo-summary]');
    summary.replaceChildren();
    for (const [count, label] of [[data.articles.length, 'Kontrol edilen sayfa'], [passed, 'Eksik bulunmadı'], [data.articles.length - passed, 'Kontrol gerekiyor']]) {
      const item = element('div');
      item.append(element('strong', '', count), element('span', '', label));
      summary.append(item);
    }
    $('[data-seo-count]').textContent = `${Object.keys(checkNames).length} kontrol / sayfa`;
    const rows = $('[data-seo-rows]');
    rows.replaceChildren();
    const shown = data.articles.filter((article) => $('#admin-seo-filter').value === 'all' || issues(article).length);
    for (const article of shown) {
      const row = element('tr');
      const title = element('td');
      title.append(button(article.title, 'admin-article-link', () => openEditor(keyOf(article), 'seo')), element('span', 'admin-row-path', article.route));
      const state = element('td');
      const missing = issues(article);
      state.append(element('span', missing.length ? 'admin-seo-issues' : 'admin-tag admin-tag--success', missing.length ? missing.join(', ') : 'Kontroller tamam'));
      const visit = element('td');
      const link = element('a', 'admin-button', 'Aç');
      link.href = article.route;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', `${article.title} sayfasını aç`);
      visit.append(link);
      row.append(title, element('td', '', article.locale.toUpperCase()), state, visit);
      rows.append(row);
    }
    if (!shown.length) {
      const row = element('tr');
      const cell = element('td', '', 'Kontrol gerektiren bir sayfa bulunamadı.');
      cell.colSpan = 4;
      row.append(cell);
      rows.append(row);
    }
  }
  function renderDrafts() {
    updateCounts();
    const list = $('[data-draft-list]');
    list.replaceChildren();
    const saved = Object.entries(drafts).sort(([, a], [, b]) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    const media = { gallery: null, homepages: [] };
    document.dispatchEvent(new CustomEvent('sigara-admin-collect-media', { detail: media }));
    $('[data-drafts-empty]').hidden = Boolean(saved.length || media.gallery || media.homepages?.length);
    for (const [key, draft] of saved) {
      const row = element('div', 'admin-draft-row');
      const copy = element('div');
      const stale = draft.sourceHash !== articleMap.get(key).sourceHash;
      copy.append(element('h3', '', draft.title), element('p', '', `${localeNames.get(draft.locale)} · ${dateText(draft.updatedAt)}${stale ? ' · Kaynak içerik güncellenmiş' : ''}`));
      const actions = element('div', 'admin-draft-actions');
      actions.append(button('Düzenle', 'admin-button', () => openEditor(key)), button('Dışa aktar', 'admin-button', () => exportFile([draft])), button('Kaldır', 'admin-button', () => {
        if (!window.confirm('Bu tarayıcıdaki taslak kaldırılsın mı? Kaynak yazı korunur.')) return;
        const next = { ...drafts };
        delete next[key];
        if (persist(next)) { renderDrafts(); renderArticles(); toast('Yerel taslak kaldırıldı.'); }
      }));
      row.append(copy, actions);
      list.append(row);
    }
  }
  function makeField(labelText, name, value, rows = 1, maxLength = 50000) {
    const label = element('label', '', labelText);
    const control = element(rows > 1 ? 'textarea' : 'input');
    control.name = name;
    control.value = value || '';
    control.maxLength = maxLength;
    if (rows > 1) control.rows = rows;
    label.append(control);
    return label;
  }
  function readEditor() {
    const original = articleMap.get(currentKey);
    if (!original) return null;
    const value = (name) => form.elements.namedItem(name)?.value.trim() || '';
    return {
      id: original.id, locale: original.locale, route: original.route, sourceHash: original.sourceHash,
      title: value('title'), summary: value('summary'), intro: value('intro'),
      contentSections: original.contentSections.map((section, index) => ({ title: value(`sectionTitle${index}`), body: value(`sectionBody${index}`) || null, items: value(`sectionItems${index}`).split('\n').map((line) => line.trim()).filter(Boolean), numbered: section.numbered })),
      keyTakeaways: value('keyTakeaways').split('\n').map((line) => line.trim()).filter(Boolean),
      seoTitle: value('seoTitle'), seoDescription: value('seoDescription'),
    };
  }
  const dirty = () => currentKey && JSON.stringify(readEditor()) !== editorBaseline;
  function setEditorTab(tab) {
    $$('[data-editor-view]', dialog).forEach((view) => { view.hidden = view.dataset.editorView !== tab; });
    $$('[data-editor-tab]', dialog).forEach((button) => { const active = button.dataset.editorTab === tab; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
    if (tab === 'preview') renderPreview();
    if (tab === 'seo') updateSeoPreview();
    $('.admin-editor-scroll', dialog).scrollTop = 0;
  }
  function openEditor(key, tab = 'write') {
    const original = articleMap.get(key);
    if (!original) return;
    currentKey = key;
    returnFocus = document.activeElement;
    const article = drafts[key] || original;
    for (const name of ['title', 'summary', 'intro', 'seoTitle', 'seoDescription']) form.elements.namedItem(name).value = article[name] || '';
    form.elements.namedItem('keyTakeaways').value = article.keyTakeaways.join('\n');
    const sectionFields = $('[data-section-fields]');
    sectionFields.replaceChildren();
    article.contentSections.forEach((section, index) => {
      const box = element('div', 'admin-editor-section');
      box.append(element('p', 'admin-editor-section-number', `İçerik bölümü ${index + 1}`), makeField('Bölüm başlığı', `sectionTitle${index}`, section.title, 1, 500), makeField('Metin', `sectionBody${index}`, section.body, 6), makeField(section.numbered ? 'Numaralı maddeler · her satıra bir madde' : 'Maddeler · her satıra bir madde', `sectionItems${index}`, section.items.join('\n'), 4, 50000));
      sectionFields.append(box);
    });
    $('[data-editor-context]').textContent = `${localeNames.get(original.locale)} · ${original.sectionTitle}`;
    $('[data-editor-save-state]').textContent = drafts[key] ? `Yerel taslak · ${dateText(drafts[key].updatedAt)}` : 'Kaynak içerik · Değişiklik yapılmadı';
    editorBaseline = JSON.stringify(readEditor());
    setEditorTab(tab);
    dialog.showModal();
    document.body.classList.add('admin-dialog-open');
    if (tab === 'write') form.elements.namedItem('title').focus();
  }
  function closeEditor() {
    if (dirty() && !window.confirm('Kaydedilmemiş değişiklikler var. Kaydetmeden kapatılsın mı?')) return;
    dialog.close();
  }
  function updateSeoPreview() {
    const draft = readEditor();
    if (!draft) return;
    $('[data-seo-title-count]').textContent = `${draft.seoTitle.length} karakter`;
    $('[data-seo-description-count]').textContent = `${draft.seoDescription.length} karakter`;
    $('[data-preview-url]').textContent = `sigarasavar.com${draft.route}`;
    $('[data-preview-seo-title]').textContent = draft.seoTitle || draft.title;
    $('[data-preview-seo-description]').textContent = draft.seoDescription || draft.summary;
  }
  function renderPreview() {
    const article = readEditor();
    const preview = $('[data-editor-view="preview"]');
    preview.replaceChildren();
    preview.append(element('h2', '', article.title), element('p', '', article.summary));
    if (article.intro) preview.append(element('p', '', article.intro));
    for (const section of article.contentSections) {
      preview.append(element('h3', '', section.title));
      if (section.body) preview.append(element('p', '', section.body));
      if (section.items.length) { const list = element(section.numbered ? 'ol' : 'ul'); section.items.forEach((item) => list.append(element('li', '', item))); preview.append(list); }
    }
    if (article.keyTakeaways.length) {
      preview.append(element('h3', '', 'Akılda kalanlar'));
      const list = element('ul');
      article.keyTakeaways.forEach((item) => list.append(element('li', '', item)));
      preview.append(list);
    }
  }
  form.addEventListener('input', () => { $('[data-editor-save-state]').textContent = dirty() ? 'Kaydedilmemiş değişiklikler' : 'Değişiklik yok'; updateSeoPreview(); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const draft = { ...readEditor(), updatedAt: new Date().toISOString() };
    if (!draft.title || !draft.summary || !validDraft(currentKey, draft)) { setEditorTab('write'); form.elements.namedItem(!draft.title ? 'title' : 'summary').focus(); toast('Başlık, açıklama ve içerik alanlarını kontrol et.'); return; }
    if (persist({ ...drafts, [currentKey]: draft })) {
      editorBaseline = JSON.stringify(readEditor());
      $('[data-editor-save-state]').textContent = `Bu tarayıcıya kaydedildi · ${dateText(draft.updatedAt)}`;
      updateCounts(); renderArticles(); renderDrafts();
      toast('Taslak bu tarayıcıya kaydedildi.');
    }
  });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeEditor(); });
  dialog.addEventListener('close', () => {
    const closedKey = currentKey;
    currentKey = null;
    document.body.classList.remove('admin-dialog-open');
    const articleButton = $$('[data-edit-article]').find((node) => node.dataset.editArticle === closedKey);
    const target = returnFocus?.isConnected ? returnFocus : articleButton?.getClientRects().length ? articleButton : $('.admin-sidebar [aria-current]');
    target.focus({ preventScroll: true });
  });
  $('[data-close-editor]').addEventListener('click', closeEditor);
  $('[data-editor-export]').addEventListener('click', () => {
    const draft = { ...readEditor(), updatedAt: new Date().toISOString() };
    if (!draft.title || !draft.summary || !validDraft(currentKey, draft)) { toast('Dışa aktarmadan önce başlık ve açıklamayı tamamla.'); return; }
    exportFile([draft]);
  });
  $$('[data-editor-tab]').forEach((control) => control.addEventListener('click', () => setEditorTab(control.dataset.editorTab)));
  document.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-admin-tab]');
    if (tab) { event.preventDefault(); history.replaceState(null, '', `#${tab.dataset.adminTab}`); showView(tab.dataset.adminTab, true); }
  });
  window.addEventListener('hashchange', () => showView(location.hash.slice(1)));
  window.addEventListener('beforeunload', (event) => { if (dirty()) { event.preventDefault(); event.returnValue = ''; } });
  $$('[data-export-all]').forEach((control) => control.addEventListener('click', () => exportFile(Object.values(drafts), true)));
  $('#admin-search').addEventListener('input', renderArticles);
  $('#admin-locale').addEventListener('change', renderArticles);
  $('#admin-section').addEventListener('change', renderArticles);
  $('#admin-media-search').addEventListener('input', renderMedia);
  $('#admin-media-group').addEventListener('change', renderMedia);
  $('#admin-seo-filter').addEventListener('change', renderSeo);
  $('[data-reset-filters]').addEventListener('click', () => { $('#admin-search').value = ''; $('#admin-section').value = 'all'; renderArticles(); });
  updateCounts();
  renderArticles();
  showView(location.hash.slice(1));
  if (storageError) toast(storageError);
})();
