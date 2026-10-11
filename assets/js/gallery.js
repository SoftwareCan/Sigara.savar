/* Progressive enhancement: the first scene remains available without JavaScript. */
(() => {
  const gallery = document.querySelector('[data-hero-gallery]');
  if (!gallery) return;
  const scenes = [...gallery.querySelectorAll('[data-gallery-scene]')];
  const labels = JSON.parse(gallery.dataset.labels);
  const toggle = gallery.querySelector('[data-gallery-toggle]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let paused = motion.matches;
  let hovering = false;
  let visible = true;
  let timer;
  let request = 0;
  let cleanup;
  let pointerPaused;

  function syncControl() {
    const label = paused ? labels.play : labels.pause;
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    toggle.querySelector('[data-pause-icon]').toggleAttribute('hidden', paused);
    toggle.querySelector('[data-play-icon]').toggleAttribute('hidden', !paused);
  }
  function schedule() {
    clearTimeout(timer);
    if (!paused && !hovering && visible && !document.hidden) {
      timer = setTimeout(() => show(index + 1), 6500);
    }
  }
  function pause() {
    paused = true;
    request += 1;
    syncControl();
    schedule();
  }
  async function show(next, manual = false) {
    if (manual) pause();
    clearTimeout(timer);
    const token = ++request;
    next = (next + scenes.length) % scenes.length;
    const incoming = scenes[next];
    try {
      await Promise.all([...incoming.querySelectorAll('img')].map(async (img) => {
        // Hidden, lazy scenes are fetched only when they are requested.
        img.loading = 'eager';
        await img.decode();
      }));
    } catch {
      if (token === request) schedule();
      return;
    }
    if (token !== request) return;
    cleanup?.();
    const outgoing = scenes[index];
    if (outgoing === incoming) { schedule(); return; }
    incoming.hidden = false;
    incoming.removeAttribute('aria-hidden');
    outgoing.setAttribute('aria-hidden', 'true');
    incoming.getBoundingClientRect(); // Establish the opacity start before crossfading.
    incoming.classList.add('is-active');
    outgoing.classList.remove('is-active');
    index = next;
    gallery.querySelector('[data-gallery-current]').textContent = String(index + 1);
    let finishTimer;
    cleanup = () => {
      clearTimeout(finishTimer);
      outgoing.hidden = true;
      cleanup = null;
    };
    finishTimer = setTimeout(cleanup, motion.matches ? 0 : 950);
    if (manual) {
      gallery.querySelector('[data-gallery-status]').textContent = labels.announcement
        .replace('{current}', String(index + 1)).replace('{total}', String(scenes.length));
    }
    schedule();
  }

  toggle.addEventListener('pointerdown', () => { pointerPaused = paused; });
  toggle.addEventListener('pointercancel', () => { pointerPaused = undefined; });
  toggle.addEventListener('click', () => {
    paused = !(pointerPaused ?? paused);
    pointerPaused = undefined;
    syncControl();
    schedule();
  });
  gallery.querySelector('[data-gallery-previous]').addEventListener('click', () => show(index - 1, true));
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show(index + 1, true));
  gallery.addEventListener('mouseenter', () => { hovering = true; request += 1; schedule(); });
  gallery.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  gallery.addEventListener('focusin', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) request += 1; schedule(); });
  motion.addEventListener('change', () => { if (motion.matches) pause(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) request += 1; schedule(); }, { threshold: 0.1 }).observe(gallery);
  }
  gallery.querySelector('[data-gallery-controls]').hidden = false;
  syncControl();
  schedule();
})();
