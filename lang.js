function setLang(lang) {
    document.querySelectorAll('.lang').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.lang.' + lang).forEach(el => el.style.display = 'block');

    document.querySelectorAll('.lang-switch button')
        .forEach(btn => btn.classList.remove('active'));

    document.querySelector(`.lang-switch button[data-lang="${lang}"]`)
        .classList.add('active');
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
