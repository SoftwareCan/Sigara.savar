import { html } from '../lib/html.mjs';

export function adminAccessPage(ctx, security = false) {
  return {
    path: security ? '/admin/security' : '/admin/',
    title: `${security ? 'Hesap güvenliği' : 'Yönetici girişi'} | Sigara Savar`,
    description: 'Sigara Savar web sitesi yönetici erişimi.',
    noindex: true, nofollow: true, bodyClass: 'admin-access-page',
    styles: ['/assets/css/admin-access.css'], scripts: ['/assets/js/admin-access.js'],
    main: html`<div class="admin-access">
      <aside class="admin-access__brand"><a href="/" class="admin-access__logo"><img src="${ctx.asset('/assets/brand/icon-96.png')}" width="44" height="44" alt=""><span>Sigara Savar</span></a><div><p class="admin-access__eyebrow">YÖNETİM ALANI</p><h2>İçeriğe özen.<br>Her dilde, her sayfada.</h2><p>Site içerikleri, görseller, çeviriler ve SEO için tek bir çalışma alanı.</p></div><small>© ${ctx.buildDate.slice(0, 4)} Sigara Savar®</small></aside>
      <section class="admin-access__form" aria-labelledby="access-title"><div class="admin-access__inner">
        <a class="admin-access__back" href="${security ? '/admin/' : '/'}">← ${security ? 'Panele dön' : 'Web sitesine dön'}</a>
        <h1 id="access-title">${security ? 'Hesap güvenliği' : 'Yönetici girişi'}</h1>
        <p>${security ? 'Şifreni değiştirdiğinde diğer açık oturumlar kapatılır.' : 'Çalışma alanına devam etmek için hesabınla giriş yap.'}</p>
        <form data-admin-access="${security ? 'password' : 'login'}">
          ${security ? html`<label>Mevcut şifre<input name="currentPassword" type="password" autocomplete="current-password" maxlength="128" required></label><label>Yeni şifre<input name="newPassword" type="password" autocomplete="new-password" minlength="16" maxlength="128" aria-describedby="password-help" required></label><p id="password-help" class="admin-access__help">En az 16 karakter. Uzun, benzersiz bir şifre kullan.</p><label>Yeni şifreyi tekrar gir<input name="confirmPassword" type="password" autocomplete="new-password" minlength="16" maxlength="128" required></label>` : html`<label>Kullanıcı adı<input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="64" required></label><label>Şifre<input name="password" type="password" autocomplete="current-password" maxlength="128" required></label>`}
          <p class="admin-access__message" data-access-message role="status" tabindex="-1">Giriş bağlantısı kontrol ediliyor…</p>
          <button class="btn btn--primary" type="submit" disabled>${security ? 'Şifreyi değiştir' : 'Giriş yap'}</button>
        </form>
        <noscript><p>Yönetici girişi için JavaScript’i etkinleştir.</p></noscript>
      </div></section>
    </div>`,
  };
}
