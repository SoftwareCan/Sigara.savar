function setLang(lang) {
    // Some pages (e.g. userDataDeletion.html) only have TR/EN content. If the
    // stored/requested language has no matching elements on this page, fall
    // back to English instead of hiding everything.
    if (document.querySelectorAll('.lang.' + lang).length === 0) {
        lang = 'en';
    }

    document.documentElement.lang = lang;
    document.querySelectorAll('.lang').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.lang.' + lang).forEach(el => {
        el.style.display = el.tagName === 'SPAN' ? 'inline' : 'block';
    });

    document.querySelectorAll('.lang-switch button')
        .forEach(btn => btn.classList.remove('active'));

    const activeButton = document.querySelector(`.lang-switch button[data-lang="${lang}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Initialize language on page load (default TR)
document.addEventListener('DOMContentLoaded', () => {
    // If user has a preferred language stored, use it
    const stored = localStorage.getItem('sigara-lang');
    const lang = stored || 'tr';
    setLang(lang);
});

// Persist language choice
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-switch button');
    if (btn && btn.dataset && btn.dataset.lang) {
        localStorage.setItem('sigara-lang', btn.dataset.lang);
    }
});
