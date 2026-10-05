// Home page: scroll-linked recovery timeline and the app story screenshot stage.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Recovery timeline — the line fills as the reader moves through time.
  const timeline = document.querySelector('[data-timeline]');
  if (timeline && !reduce && 'IntersectionObserver' in window) {
    const items = [...timeline.querySelectorAll('.timeline__item')];
    const head = timeline.querySelector('.timeline__head');
    const nodeY = parseFloat(getComputedStyle(timeline).getPropertyValue('--node-y')) || 16;
    let firstY = 0;
    let span = 1;
    let nodes = [];
    let active = false;
    let ticking = false;

    // Layout is read only here (load, fonts, resize); scrolling reuses the cache.
    const measure = () => {
      nodes = items.map((item) => item.offsetTop + nodeY);
      firstY = nodes[0];
      span = Math.max(1, nodes[nodes.length - 1] - firstY);
      timeline.style.setProperty('--first-y', `${firstY}px`);
      timeline.style.setProperty('--span', `${span}px`);
    };

    const update = () => {
      ticking = false;
      const anchor = window.innerHeight * 0.58 - timeline.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (anchor - firstY) / span));
      timeline.style.setProperty('--progress', p.toFixed(4));
      if (head) timeline.style.setProperty('--head-y', `${(firstY + span * p).toFixed(1)}px`);
      items.forEach((item, i) => item.classList.toggle('is-reached', nodes[i] <= anchor + 1));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    timeline.classList.add('is-live');
    measure();
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !active) {
        active = true;
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        onResize();
      } else if (!entry.isIntersecting && active) {
        active = false;
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        update();
      }
    }, { rootMargin: '20% 0px 20% 0px' }).observe(timeline);
    if (document.fonts) document.fonts.ready.then(onResize);
    update();
  }

  // The screenshot rail scrolls sideways on phones: make it reachable by keyboard then.
  const rail = document.querySelector('.app-rail');
  if (rail) {
    const sync = () => {
      if (rail.scrollWidth > rail.clientWidth + 1) rail.setAttribute('tabindex', '0');
      else rail.removeAttribute('tabindex');
    };
    sync();
    window.addEventListener('resize', sync, { passive: true });
  }

  // App story — on wide screens the sticky screen follows the feature in view.
  const stage = document.querySelector('[data-stage]');
  const features = [...document.querySelectorAll('[data-feature]')];
  if (stage && features.length && 'IntersectionObserver' in window) {
    const screens = [...stage.querySelectorAll('[data-stage-screen]')];
    const activate = (id) => {
      screens.forEach((s) => s.classList.toggle('is-active', s.dataset.stageScreen === id));
      features.forEach((f) => f.classList.toggle('is-active', f.dataset.feature === id));
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activate(entry.target.dataset.feature);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    features.forEach((f) => observer.observe(f));
    // Screens stay lazy until the stage is close, then the rest are fetched.
    new IntersectionObserver(([entry], obs) => {
      if (!entry.isIntersecting) return;
      stage.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
      obs.disconnect();
    }, { rootMargin: '400px 0px' }).observe(stage);
  }
})();
