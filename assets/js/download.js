// Device-aware hand-off to the correct app store, with a visible manual fallback.
(() => {
  const page = document.querySelector('[data-download-page]');
  if (!page) return;

  const status = page.querySelector('[data-download-status]');
  const cancel = page.querySelector('[data-download-cancel]');
  const qr = page.querySelector('[data-download-qr]');
  const links = [...page.querySelectorAll('.store-badges a')];
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isMobile = isIOS || isAndroid || /Mobile/i.test(ua);
  const target = isIOS ? page.dataset.appStore : isAndroid ? page.dataset.googlePlay : '';
  const strings = {
    ios: page.dataset.statusIos,
    android: page.dataset.statusAndroid,
    desktop: page.dataset.statusDesktop,
    other: page.dataset.statusOther,
    cancelled: page.dataset.statusCancelled,
  };

  page.dataset.platform = isIOS ? 'ios' : isAndroid ? 'android' : isMobile ? 'mobile' : 'desktop';
  if (status) status.textContent = isIOS ? strings.ios : isAndroid ? strings.android : isMobile ? strings.other : strings.desktop;
  if (qr) qr.hidden = isMobile;

  const detectedLink = links.find((link) => link.href === target);
  if (detectedLink) detectedLink.classList.add('is-detected');

  if (!target) return;

  let timer = window.setTimeout(() => {
    timer = 0;
    window.location.replace(target);
  }, 1400);

  if (cancel) {
    cancel.hidden = false;
    cancel.addEventListener('click', () => {
      if (timer) window.clearTimeout(timer);
      timer = 0;
      cancel.hidden = true;
      page.classList.add('is-cancelled');
      if (status) status.textContent = strings.cancelled;
    });
  }
})();
