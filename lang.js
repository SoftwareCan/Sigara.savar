let legalChrome = {};
try {
    legalChrome = JSON.parse(document.getElementById('legal-chrome-translations')?.textContent || '{}');
} catch {}

function translateLegalChrome(lang) {
    if (!Object.hasOwn(legalChrome, lang)) return;
    const copy = legalChrome[lang];
    const bind = (selector, text, attributes = {}) => document.querySelectorAll(selector).forEach(node => {
        if (text !== undefined) node.textContent = text;
        Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
    });
    const links = (selector, items) => document.querySelectorAll(selector).forEach((node, index) => {
        const item = items[index];
        if (!item) return;
        node.textContent = item.text;
        node.setAttribute('href', item.href);
    });
    document.title = copy.title;
    bind('.skip-link', copy.skip);
    bind('.site-header .brand, .site-footer .brand', undefined, { href: copy.home });
    bind('.site-header .nav', undefined, { 'aria-label': copy.mainNav });
    bind('.menu-panel nav', undefined, { 'aria-label': copy.mobileNav });
    links('.nav__list a', copy.nav);
    links('.menu-panel__list a', copy.nav);
    bind('.header-cta, .menu-panel__download', copy.download.text, { href: copy.download.href });
    bind('.menu-toggle', undefined, { 'data-open-label': copy.menu, 'data-close-label': copy.close });
    const menuOpen = document.querySelector('.menu-toggle')?.getAttribute('aria-expanded') === 'true';
    bind('.menu-toggle__label', menuOpen ? copy.close : copy.menu);
    bind('.footer-top nav', undefined, { 'aria-label': copy.footerNav });
    links('.footer-top .footer-links a', copy.footer);
    bind('.footer-meta nav', undefined, { 'aria-label': copy.legalLabel });
    links('.footer-links--legal a', copy.legal);
    bind('.footer-copyright', copy.copyright);
    bind('.footer-disclaimer', copy.disclaimer);
    bind('.language-picker__code', lang.toUpperCase());
    bind('.language-picker summary', undefined, { 'aria-label': `${copy.language.label}: ${copy.name}` });
    bind('.language-picker__panel, .footer-languages, .lang-switch', undefined, { 'aria-label': copy.language.choose });
    bind('.footer-languages__label', copy.language.label);
    bind('.policy-footnote', undefined, { 'aria-label': copy.language.note });
    document.querySelectorAll('[data-site-language]').forEach(link => {
        const code = link.dataset.siteLanguage;
        if (!Object.hasOwn(legalChrome, code)) return;
        link.textContent = legalChrome[code].name;
        link.setAttribute('href', legalChrome[code].page);
        link.removeAttribute('aria-current');
        if (code === lang) {
            link.setAttribute('aria-current', 'true');
            const check = document.createElement('span');
            check.textContent = '✓';
            check.setAttribute('aria-hidden', 'true');
            link.append(check);
        }
    });
    document.querySelectorAll('.policy-bar__links a, .policy-content a').forEach(link => {
        if (link.getAttribute('href')?.startsWith('#')) return;
        const target = new URL(link.href, location.href);
        if (target.origin === location.origin && copy.legal.some(item => new URL(item.href, location.href).pathname === target.pathname)) {
            target.searchParams.set('lang', lang);
            link.setAttribute('href', `${target.pathname}${target.search}${target.hash}`);
        }
    });
}

function setLang(lang) {
    // A stale preference or unsupported code must never hide the whole page.
    if (!['tr', 'en', 'es', 'de', 'fr', 'pt-BR', 'it'].includes(lang) || document.querySelectorAll('.lang.' + lang).length === 0) {
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
    translateLegalChrome(lang);
    return lang;
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
    const control = e.target.closest('.lang-switch button, [data-site-language]');
    const code = control?.dataset.lang || control?.dataset.siteLanguage;
    if (code && Object.hasOwn(legalChrome, code)) {
        e.preventDefault();
        const lang = setLang(code);
        try {
            localStorage.setItem('sigara-lang', lang);
        } catch (err) {
            // Storage can be unavailable (private mode); the switch still works for this visit.
        }
        const address = new URL(location.href);
        address.searchParams.set('lang', lang);
        address.hash = '';
        history.replaceState(null, '', `${address.pathname}${address.search}`);
        document.querySelectorAll('[data-language-picker]').forEach(picker => { picker.open = false; });
        control.closest('[data-language-picker]')?.querySelector('summary')?.focus();
    }
});
