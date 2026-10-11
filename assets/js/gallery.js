/* A quiet, automatic showcase. The first scene works without JavaScript. */
(() => {
  const gallery = document.querySelector('[data-hero-gallery]');
  if (!gallery) return;
  const scenes = [...gallery.querySelectorAll('[data-gallery-scene]')];
  if (scenes.length < 2) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let visible = true;
  let timer;
  let request = 0;
  let cleanup;

  function schedule() {
    clearTimeout(timer);
    if (!motion.matches && visible && !document.hidden) timer = setTimeout(advance, 4000);
  }
  async function advance() {
    const token = ++request;
    const next = (index + 1) % scenes.length;
    const incoming = scenes[next];
    try {
      await Promise.all([...incoming.querySelectorAll('img')].map(async (img) => {
        img.loading = 'eager';
        await img.decode();
      }));
    } catch {
      if (token === request) schedule();
      return; // Keep the visible scene if a download fails.
    }
    if (token !== request) return;
    cleanup?.();
    const outgoing = scenes[index];
    incoming.hidden = false;
    incoming.removeAttribute('aria-hidden');
    outgoing.setAttribute('aria-hidden', 'true');
    incoming.getBoundingClientRect();
    incoming.classList.add('is-active');
    outgoing.classList.remove('is-active');
    index = next;
    let finishTimer;
    cleanup = () => {
      clearTimeout(finishTimer);
      outgoing.hidden = true;
      cleanup = null;
    };
    finishTimer = setTimeout(cleanup, 950);
    schedule();
  }
  const refresh = () => {
    request += 1;
    if (motion.matches) cleanup?.();
    schedule();
  };
  document.addEventListener('visibilitychange', refresh);
  motion.addEventListener('change', refresh);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    }, { threshold: 0.1 }).observe(gallery);
  }
  schedule();
})();
