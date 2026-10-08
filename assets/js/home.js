(() => {
  'use strict';
  const showcase = document.querySelector('[data-product]');
  if (!showcase) return;
  const controls = showcase.querySelector('[data-product-tabs]');
  const tabs = [...showcase.querySelectorAll('[data-product-tab]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  if (!controls || !tabs.length || panels.some((panel) => !panel)) return;

  // All content is readable without JS. Only enhance after all panels resolve.
  controls.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
  });
  function select(index, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  }
  function selectHash() {
    const index = panels.findIndex((panel) => `#${panel.id}` === location.hash || [...panel.querySelectorAll('[id]')].some((el) => `#${el.id}` === location.hash));
    if (index < 0) return;
    select(index);
    // Support existing homepage links to #kriz and #iyilesme.
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });
  select(0);
  controls.hidden = false;
  showcase.classList.add('is-enhanced');
  selectHash();
  window.addEventListener('hashchange', selectHash);
})();
