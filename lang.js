function setLang(lang) {
    // Some pages (e.g. userDataDeletion.html) only have TR/EN content. If the
    // stored/requested language has no matching elements on this page, fall
    // back to English instead of hiding everything.
    if (!['tr', 'en', 'es', 'de', 'fr'].includes(lang) || document.querySelectorAll('.lang.' + lang).length === 0) {
        lang = 'en';
    }

    document.documentElement.lang = lang;
    document.querySelectorAll('.lang').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.lang.' + lang).forEach(el => {
        el.style.display = el.tagName === 'SPAN' ? 'inline' : 'block';
    });

    document.querySelectorAll('.lang-switch button').forEach(btn => {
        const active = btn.dataset.lang === lang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
}

// Initialize language on page load (default TR)
document.addEventListener('DOMContentLoaded', () => {
    // If user has a preferred language stored, use it
    let stored;
    try { stored = localStorage.getItem('sigara-lang'); } catch {}
    const requested = new URLSearchParams(location.search).get('lang');
    const lang = requested || stored || 'tr';
    setLang(lang);
});

// Switch and persist language (delegated, so no inline handlers are needed under the CSP)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-switch button');
    if (btn && btn.dataset && btn.dataset.lang) {
        setLang(btn.dataset.lang);
        try {
            localStorage.setItem('sigara-lang', btn.dataset.lang);
        } catch (err) {
            // Storage can be unavailable (private mode); the switch still works for this visit.
        }
    }
});
