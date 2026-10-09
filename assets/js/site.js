// Global behaviour: header state, mobile menu and sharing.
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
      const menuOpen = header.classList.contains('menu-open') || Boolean(header.querySelector('[data-language-picker][open]'));
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
    desktop.addEventListener('change', update);
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
    document.addEventListener('click', (event) => {
      if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setOpen(false);
    });
    panel.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false, { restoreFocus: false });
    });
    desktop.addEventListener('change', (event) => {
      if (event.matches && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, { restoreFocus: false });
    });
  }

  // Language links are ordinary server-rendered routes. Remember an explicit
  // choice for the existing legal pages, without redirecting bookmarked URLs.
  const languagePickers = [...document.querySelectorAll('[data-language-picker]')];
  const closeLanguages = (except = null) => languagePickers.forEach((picker) => {
    if (picker !== except) picker.open = false;
  });
  languagePickers.forEach((picker) => {
    picker.addEventListener('toggle', () => {
      if (picker.open) {
        closeLanguages(picker);
        header?.classList.remove('is-hidden');
      }
    });
  });
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-site-language]');
    if (link) {
      try { localStorage.setItem('sigara-lang', link.dataset.siteLanguage); } catch {}
      closeLanguages();
    } else if (!event.target.closest('[data-language-picker]')) closeLanguages();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openPicker = languagePickers.find((picker) => picker.open);
    if (openPicker) {
      openPicker.open = false;
      openPicker.querySelector('summary')?.focus();
    }
  });

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
