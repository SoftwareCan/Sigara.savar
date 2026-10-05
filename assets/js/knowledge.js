// Bilgi Merkezi: search and topic filters enhance ordinary chapter links.
(() => {
  const form = document.querySelector('[data-kc-search]');
  if (!form) return;
  const input = form.querySelector('input[type="search"]');
  const categoryInput = form.querySelector('[data-kc-category-input]');
  const clear = form.querySelector('[data-kc-clear]');
  const status = form.querySelector('[data-kc-status]');
  const rows = [...document.querySelectorAll('.post-row[data-search]')];
  const sections = [...document.querySelectorAll('[data-kc-section]')];
  const categories = [...document.querySelectorAll('a[data-kc-category]')];
  const entries = document.querySelector('[data-kc-entries]');
  const empty = document.querySelector('[data-kc-empty]');
  const validCategories = new Set(sections.map((section) => section.dataset.kcSection));
  const fold = { ç: 'c', ğ: 'g', ı: 'i', i̇: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
  const normalize = (s) => s.toLocaleLowerCase('tr').replace(/[çğıöşüâîû]|i̇/g, (c) => fold[c] || c).trim();
  const format = (n) => (n === 0 ? form.dataset.none : form.dataset.found.replace('{n}', n));

  let activeCategory = '';
  let timer = 0;

  const readUrl = () => {
    const url = new URL(window.location.href);
    input.value = url.searchParams.get('q') || '';
    const requested = url.searchParams.get('bolum') || url.hash.slice(1);
    activeCategory = validCategories.has(requested) ? requested : '';
  };

  const writeUrl = (mode, categoryChanged) => {
    const url = new URL(window.location.href);
    const query = input.value.trim();
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    if (activeCategory) url.searchParams.set('bolum', activeCategory);
    else url.searchParams.delete('bolum');
    if (categoryChanged) url.hash = activeCategory || 'yazilar';
    if (url.href !== window.location.href) {
      history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url);
    }
  };

  const apply = (mode, categoryChanged = false) => {
    const words = normalize(input.value).split(/\s+/).filter(Boolean);
    const searching = words.length > 0;
    const filtering = searching || Boolean(activeCategory);
    let count = 0;
    rows.forEach((row) => {
      const matchCategory = !activeCategory || row.dataset.category === activeCategory;
      const matchQuery = !searching || words.every((word) => row.dataset.search.includes(word));
      row.hidden = !(matchCategory && matchQuery);
      if (!row.hidden) count += 1;
    });
    sections.forEach((section) => {
      section.hidden = !section.querySelector('.post-row:not([hidden])');
    });
    categories.forEach((link) => {
      if (link.dataset.kcCategory === activeCategory) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    categoryInput.value = activeCategory;
    categoryInput.disabled = !activeCategory;
    if (entries) entries.hidden = filtering;
    if (empty) empty.hidden = count > 0;
    clear.hidden = !input.value;
    status.textContent = filtering ? format(count) : '';
    if (mode) writeUrl(mode, categoryChanged);
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => apply('replace'), 120);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearTimeout(timer);
    apply('replace');
  });
  clear.addEventListener('click', () => {
    clearTimeout(timer);
    input.value = '';
    apply('replace');
    input.focus();
  });

  categories.forEach((link) => link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    clearTimeout(timer);
    activeCategory = link.dataset.kcCategory;
    apply('push', true);
  }));

  const restore = () => {
    clearTimeout(timer);
    readUrl();
    apply();
  };
  window.addEventListener('popstate', restore);
  window.addEventListener('hashchange', restore);
  restore();
})();
