// No credential or authentication decision is stored in browser storage.
(() => {
  const form = document.querySelector('[data-admin-access]');
  const logout = document.querySelector('[data-admin-logout]');
  const message = document.querySelector('[data-access-message]');
  let csrf;
  const say = (text, error = false) => {
    if (!message) return;
    message.textContent = text;
    message.toggleAttribute('data-error', error);
  };
  async function api(route, input) {
    const response = await fetch(`/admin/${route}`, input ? {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, csrf }),
    } : { credentials: 'same-origin', cache: 'no-store' });
    if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Yönetici sunucusu bu adreste bağlı değil. Yerel yönetici adresini kullan.');
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'İşlem tamamlanamadı. Tekrar dene.');
    return result;
  }
  const ready = api('session').then((session) => {
    csrf = session.csrf;
    if (!session.configured) throw new Error('Yönetici hesabı henüz oluşturulmadı. Sunucu kurulumunu tamamla.');
    if (form?.dataset.adminAccess === 'password' && !session.authenticated) { location.replace('/admin/'); return; }
    if (form?.dataset.adminAccess === 'login' && session.authenticated) { location.replace('/admin/'); return; }
    if (!form && !session.authenticated) { location.replace('/admin/'); return; }
    say('');
    if (form) form.querySelector('button[type="submit"]').disabled = false;
    return session;
  }).catch((error) => { say(error.message, true); });
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const security = form.dataset.adminAccess === 'password';
    if (security && values.newPassword !== values.confirmPassword) {
      say('Yeni şifreler eşleşmiyor. İki alanı kontrol et.', true);
      form.elements.confirmPassword.focus();
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    say(security ? 'Şifre güncelleniyor…' : 'Giriş yapılıyor…');
    try {
      await ready;
      await api(security ? 'password' : 'login', values);
      form.reset();
      location.replace('/admin/');
    } catch (error) {
      say(error.message, true);
      message.focus();
      button.disabled = false;
    }
  });
  logout?.addEventListener('click', async () => {
    logout.disabled = true;
    try { await ready; await api('logout', {}); location.replace('/admin/'); }
    catch (error) { logout.disabled = false; logout.textContent = 'Çıkışı tekrar dene'; logout.title = error.message; }
  });
  // A page restored from back/forward cache must recheck its server session.
  window.addEventListener('pageshow', (event) => { if (event.persisted) location.reload(); });
})();
