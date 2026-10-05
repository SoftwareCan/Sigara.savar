// Bilgi Merkezi: instant, Turkish-aware filtering across all articles.
(() => {
  const form = document.querySelector('[data-kc-search]');
  if (!form) return;
  const input = form.querySelector('input');
  const clear = form.querySelector('[data-kc-clear]');
  const status = form.querySelector('[data-kc-status]');
  const rows = [...document.querySelectorAll('.post-row[data-search]')];
  const sections = [...document.querySelectorAll('.kc-section')];
  const entries = document.querySelector('[data-kc-entries]');
  const empty = document.querySelector('[data-kc-empty]');
  const fold = { ç: 'c', ğ: 'g', ı: 'i', i̇: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
  const normalize = (s) => s.toLocaleLowerCase('tr').replace(/[çğıöşüâîû]|i̇/g, (c) => fold[c] || c).trim();
  const format = (n) => (n === 0 ? form.dataset.none : form.dataset.found.replace('{n}', n));

  let timer = 0;
  const apply = () => {
    const words = normalize(input.value).split(/\s+/).filter(Boolean);
    const searching = words.length > 0;
    let count = 0;
    rows.forEach((row) => {
      const match = !searching || words.every((w) => row.dataset.search.includes(w));
      row.hidden = !match;
      if (match) count += 1;
    });
    sections.forEach((section) => {
      section.hidden = searching && !section.querySelector('.post-row:not([hidden])');
    });
    if (entries) entries.hidden = searching;
    if (empty) empty.hidden = !searching || count > 0;
    clear.hidden = !searching;
    status.textContent = searching ? format(count) : '';
    const url = new URL(window.location.href);
    if (searching) url.searchParams.set('q', input.value.trim());
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
  };

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 120);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    apply();
  });
  clear.addEventListener('click', () => {
    input.value = '';
    apply();
    input.focus();
  });

  const initial = new URL(window.location.href).searchParams.get('q');
  if (initial) {
    input.value = initial;
    apply();
  }
})();
