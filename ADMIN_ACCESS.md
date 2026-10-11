# Sigara Savar yönetici erişimi

Yerel adres: http://127.0.0.1:4174/admin/

Kullanıcı adı: `sigarasavar.admin`. İlk şifre, yalnızca bu bilgisayardaki `.local/admin-access.txt` dosyasındadır. Şifreyi burada veya web sayfalarında yayınlamıyoruz. Bu dosya ve parola özeti Git dışında tutulur. Hesap güvenliği sayfasından şifre değiştirilebilir.

## Çalıştırma

```powershell
node --preserve-symlinks --preserve-symlinks-main _build/setup-admin.mjs
node --preserve-symlinks --preserve-symlinks-main _build/build.mjs
node --preserve-symlinks --preserve-symlinks-main _build/serve.mjs
```

Kurulum mevcut hesabın şifresini değiştirmez. Varsayılan adres yalnızca `127.0.0.1:4174` üzerinden bu bilgisayardan erişilebilir. `localhost` yerine gösterilen adresi kullan: yönetici istekleri tam sunucu adresiyle doğrulanır.

## Erişim modeli

- Parola: benzersiz rastgele ilk parola; scrypt özeti, rastgele salt, sabit maliyet parametreleri. Parola tarayıcı kodunda veya localStorage içinde tutulmaz.
- Oturum: sunucuda rastgele kimlik; HttpOnly + SameSite=Strict çerezi. HTTPS üzerinde ayrıca Secure ve `__Host-` öneki.
- Süre: 30 dakika hareketsizlik veya toplam 8 saat; sunucu yeniden başlarsa açık oturumlar kapanır.
- Giriş ve parola değişikliği: aynı origin + oturuma bağlı CSRF değeri; sınırlı deneme sayısı. Ters proxy arkasında istemci adresi başlıklarına güvenilmez; aynı proxy üzerinden gelen istekler aynı sınırı paylaşır.
- Parola değişince önceki oturumlar iptal edilir. Çıkış, sunucudaki oturumu siler.
- Panel HTML’i `_build/private/` içindedir. Sunucu doğrudan bu klasöre ve `.local/` dosyalarına erişimi reddeder. Açık `admin/index.html` yalnızca giriş formudur.

## Canlı siteye bağlama

Bu çalışma canlı siteye dağıtılmadı. GitHub Pages gibi yalnızca statik hosting, sunucu tarafında parola doğrulaması yapamaz. Mevcut web sitesini koruyarak yönetici sunucusunu desteklenen bir Node.js LTS çalışma ortamına bağlamak gerekir.

Sunucuda `setup-admin.mjs` ile **ayrı** bir üretim hesabı oluştur; yerel ilk şifre dosyasını sunucuya yükleme. Ardından build çalıştır. Bir TLS ters proxy arkasında şu ayarları kullan:

- `NODE_ENV=production`
- `ADMIN_ORIGIN=https://www.sigarasavar.com` (panelin gerçek origin’i)
- `ADMIN_CREDENTIAL_FILE` = sunucudaki parola özeti dosyasının mutlak yolu; kamuya açık dizinin dışında.
- `HOST=127.0.0.1` ve uygun `PORT`; yalnızca güvenilir ters proxy bu porta erişmeli.

Ters proxy doğru Host başlığını korumalı, `/admin/*` ve yönetici varlıklarını bu sunucuya yönlendirmeli, HTTP’yi HTTPS’e yönlendirmeli ve yönetici yanıtlarını önbelleğe almamalı. Çalışma alanının özel HTML dosyalarını doğrudan statik hosting’e kopyalama. Panel tek süreçli sunucu için hazırlanmıştır; birden çok sunucu örneğinde ortak oturum ve deneme sınırı deposu gerekir.

## Kapsam

Panel içerik, görsel, çeviri ve SEO taslaklarını tarayıcıda saklar; JSON olarak dışa aktarır. Bu sürümde canlı yayınlama API’si yoktur. Mevcut uygulama kullanıcılarının Firebase girişine dokunulmadı. Yönetici arayüzü Türkçedir; içerik düzenleme altı dilde çalışır.

## Doğrulama ve kaynaklar

`_build/verify-admin-auth.mjs` ayrı bir geçici hesapla doğru/yanlış parola, CSRF, oturum yenileme/sonlandırma/süre aşımı, parola değişimi, deneme sınırları ve özel dosya engellerini test eder; gerçek yönetici parolasını okumaz.

Uygulama kararları için [OWASP parola saklama](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [OWASP kimlik doğrulama](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) ve [Node.js crypto](https://nodejs.org/api/crypto.html) belgeleri incelendi. Statik hosting kapsamı: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
