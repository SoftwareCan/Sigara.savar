// Global behaviour: header state, mobile menu, platform store links, sharing.
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const desktop = window.matchMedia('(min-width: 1060px)');

  // Header: hairline once scrolled; on small screens hide while reading down.
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 4);
      const menuOpen = header.classList.contains('menu-open');
      const focusInside = header.contains(document.activeElement);
      if (!desktop.matches && !menuOpen && !focusInside) {
        if (y > lastY + 6 && y > 160) header.classList.add('is-hidden');
        else if (y < lastY - 6 || y < 80) header.classList.remove('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
    update();
  }

  // Mobile menu: disclosure that makes the rest of the page inert while open.
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.getElementById('menu-panel');
  if (toggle && panel && header) {
    const outside = [...document.body.children].filter((el) => el !== header && el.tagName !== 'SCRIPT');
    const label = toggle.querySelector('.menu-toggle__label');
    const setOpen = (open, { restoreFocus = true } = {}) => {
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? toggle.dataset.closeLabel : toggle.dataset.openLabel;
      panel.hidden = !open;
      panel.classList.toggle('is-open', open);
      header.classList.toggle('menu-open', open);
      header.classList.remove('is-hidden');
      outside.forEach((el) => { el.inert = open; });
      root.style.overflow = open ? 'hidden' : '';
      if (open) {
        const first = panel.querySelector('a, button');
        if (first) first.focus();
      } else if (restoreFocus) {
        toggle.focus();
      }
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
    panel.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false, { restoreFocus: false });
    });
    desktop.addEventListener('change', (event) => {
      if (event.matches && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, { restoreFocus: false });
    });
  }

  // Store links: send phones straight to their own store; desktops keep #indir.
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  if (isIOS || isAndroid) {
    document.querySelectorAll('[data-store-link]').forEach((link) => {
      const target = isIOS ? link.dataset.appStore : link.dataset.googlePlay;
      if (target) link.href = target;
    });
  }

  // Article sharing: native share sheet where available, clipboard otherwise.
  document.querySelectorAll('[data-share]').forEach((box) => {
    const status = box.querySelector('[data-share-status]');
    const shareBtn = box.querySelector('[data-share-native]');
    const copyBtn = box.querySelector('[data-share-copy]');
    const url = box.dataset.url || window.location.href;
    const title = box.dataset.title || document.title;
    const say = (text) => {
      if (!status) return;
      status.textContent = text;
      window.setTimeout(() => { status.textContent = ''; }, 3000);
    };
    if (shareBtn) {
      if (navigator.share) {
        shareBtn.hidden = false;
        shareBtn.addEventListener('click', () => {
          navigator.share({ title, url }).catch(() => {});
        });
      }
    }
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(url);
          say(copyBtn.dataset.done);
        } catch {
          window.prompt(copyBtn.textContent.trim(), url);
        }
      });
    }
  });
})();
