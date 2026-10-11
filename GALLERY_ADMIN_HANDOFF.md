# Galeri, yönetim alanı ve SEO — 11 Ekim 2026

## Kapsam

Mevcut tasarım korundu. Ana sayfanın yeşil alanına gönderilen yedi mağaza görseli, mevcut iki uygulama ekranıyla birlikte eklendi. Beş sahneli galeri 6,5 saniyelik aralıklarla, 0,9 saniyelik saydamlık geçişi kullanır. “Uygulamadan gerçek ekranlar” açıklaması beş dilden kaldırıldı. Tablet boyutlarında görseller ve mobilde kontrol alanı yeniden ölçülendirildi.

Galeri durdurulabilir ve elle ilerletilebilir. Klavye odağı otomatik geçişi durdurur; kullanıcı yeniden başlatana kadar devam etmez. Fare üzerinde, galeri ekran dışında veya sekme görünmezken zamanlayıcı durur. Azaltılmış hareket tercihinde otomatik geçiş kapalıdır; elle gezinme animasyonsuz çalışır. Bir görsel yüklenemezse mevcut sahne korunur. JavaScript olmadan ilk iki ekran görünür.

## Yönetim alanı

Yeni rota: `/admin/`. Mevcut statik projeye uygun, tarayıcıda çalışan içerik çalışma alanıdır.

- Gerçek Bilgi Merkezi envanteri: 29 yazı, beş dilde 145 sürüm.
- Yazı arama, dil/bölüm filtreleme, başlık/giriş/bölümler/özet maddelerini düzenleme, önizleme.
- SEO başlığı ve açıklaması için düzenleme ve arama sonucu önizlemesi.
- Kaynak sayfalarda başlık, açıklama, canonical, dil bağlantıları, Article verisi ve H1 kontrolleri.
- Gerçek medya kütüphanesi; gönderilen yedi görselin sırasını ve beş dilde alternatif metnini planlama.
- Ana sayfa metinleri ve SEO için dil bazında yerel taslaklar.
- Tarayıcıya kaydetme ve inceleme için JSON dışa aktarma.

**Bu sürüm canlı siteye yazmaz.** Yönetici hesabı, sunucu yetkilendirmesi, dosya yükleme veya yayın servisi eklenmedi. Taslaklar tarayıcıya/cihaza bağlıdır; tarayıcı verileri temizlenirse kaybolabilir. JSON dışa aktarma taşınabilir bir inceleme çıktısı sağlar; dosyalar otomatik olarak derlemeye uygulanmaz. Görsel sırası bir yayın planıdır; mevcut ana sayfa çiftlerini kendiliğinden değiştirmez.

Panel `noindex, nofollow` içerir; sitemap ve ziyaretçi menülerinde bulunmaz. Bunlar erişim kontrolü değildir. Panel yalnızca zaten kamusal olan içerikleri içerir. Üretimde yazma yetkisi için ayrıca sunucu tarafında yönetici kimlik doğrulaması, yetkilendirme ve yayın geçmişi gerekir.

## SEO

Makale başlıkları kısa marka eki kullanır. İçeriği hazırlayan kurum ve gerçek yayın/güncelleme tarihleri görünür hale getirildi; tarihlerin yapılandırılmış veri ve Open Graph ile eşleşmesi denetlenir. Temsili makale görseli olmayan başlık/logo kartları Article `image` alanından çıkarıldı; sosyal paylaşım görselleri korundu. İndekslenebilir sayfalara `max-image-preview:large` eklendi.

Canonical, karşılıklı hreflang, sitemap, robots, favicon, manifest, sosyal meta etiketleri ve makale kaynak metinleri korunuyor. Tam araştırma, canlı site bulguları ve öncelikli öneriler: [SEO_AUDIT_2026-10.md](SEO_AUDIT_2026-10.md).

Google ve W3C birincil kaynakları esas alındı: [Article verisi](https://developers.google.com/search/docs/appearance/structured-data/article), [görünür tarihler](https://developers.google.com/search/docs/appearance/publication-dates), [başlık bağlantıları](https://developers.google.com/search/docs/appearance/title-link), [erişilebilir galeriler](https://www.w3.org/WAI/tutorials/carousels/).

## Dosyalar

Yeni:

- `_build/templates/gallery.mjs`, `_build/i18n/gallery.mjs`
- `_build/optimize-gallery.py`, `_build/content/gallery.json`
- `_build/templates/admin.mjs`, `_build/lib/admin.mjs`
- `_build/templates/admin-home.mjs`, `_build/lib/admin-home.mjs`
- `assets/js/gallery.js`, `assets/js/admin.js`, `assets/js/admin-media.js`, `assets/js/admin-home.js`
- `assets/css/admin.css`, `admin/index.html`
- `assets/gallery/`: yedi görselin 360 ve 720 piksel AVIF/WebP sürümleri, toplam 28 dosya
- `_build/verify-gallery.mjs`, `SEO_AUDIT_2026-10.md`, bu rapor

Değiştirilen kaynaklar:

- `_build/build.mjs`
- `_build/templates/home.mjs`, `_build/i18n/home.mjs`
- `_build/templates/knowledge.mjs`, `_build/templates/layout.mjs`
- `_build/verify.mjs`, `assets/css/home.css`, `README.md`
- Üretilen beş dildeki HTML sayfaları, sitemap ve sayfa değişim geçmişi

Yasal sayfalardaki değişiklik yalnızca ortak meta etiketlerindedir; yasal `<main>` içeriği korunmuştur.

## İçerik ve görsel kaynakları

Mevcut `_build/content/{tr,en,de,es,fr}/knowledge.json` dosyaları kullanıldı; bu turda makale metinleri yeniden yazılmadı. Kaynak kaydı `_build/content/SOURCE.json` içinde:

- `Sigara_Savar/quitSmoke/lib/features/explore/system_posts/data/knowledge_center_content*.dart`
- Son aktarım: 9 Ekim 2026; kayıtlı revizyon: `eb0c59ae`.

Görseller kullanıcı tarafından verilen `HazırTR/1.png`–`7.png` dosyalarıdır. Tam kompozisyon korunmuş, orijinaller değiştirilmemiştir. Dosya adları, SHA-256 kaynak özetleri ve üretilen boyutlar `gallery.json` içinde saklanır.

## Performans ve bağımlılıklar

Yeni çalışma zamanı veya paket bağımlılığı yok. Görseller hazır Pillow araçlarıyla dönüştürüldü; siteye görsel işlem kütüphanesi eklenmedi. 360 pikselde yedi AVIF toplam yaklaşık 153 KiB, 720 pikselde 366 KiB. WebP yedekleri vardır. Tarayıcı ekran yoğunluğuna göre uygun boyutu seçer.

İlk görünen iki ekran öncelikli yüklenir. Sonraki sahneler gerektiğinde yüklenir ve görüntü çözümleme tamamlanınca değiştirilir. Boyutlar önceden ayrılmıştır. Galeri betiği yaklaşık 4 KB; animasyon kütüphanesi yok. Yönetim betikleri yalnızca `/admin/` üzerinde yüklenir.

## Korunanlar ve sonraki adım

Marka renkleri, ana sayfa akışı, mağaza URL'leri, beş dilde içerikler, makale adresleri, footer marka işareti, yasal metinler ve duraklatılmış kullanıcı giriş altyapısı korundu. Yeni sağlık iddiası, puan veya sahte kullanıcı istatistiği eklenmedi. Canlı yayın yapılmadı.

Canlı denetimde HTTP ana sayfanın HTTPS'e yönlenmediği görüldü. Bir sonraki hosting düzenlemesinde kalıcı HTTPS yönlendirmesi eklenmeli. Yayından sonra Search Console ve gerçek kullanıcı performans verileriyle izleme yapılmalı. Bunlar bu yerel uygulama çalışmasında tamamlanmış gibi gösterilmedi.

## Doğrulama

11 Ekim 2026 tarihinde tamamlandı:

- Derleme başarılı; 174 kamusal sayfa ve sitemap dışında bir yönetim alanı doğrulandı.
- 12.975 yerel bağlantı/kaynak, 1.180 kaynak içerik kontrolü ve 850 dil rotası kontrolü geçti.
- Makale başlıkları, gerçek tarihler, canonical, sitemap, auth/admin dışlamaları ve yasal metinlerin korunması doğrulandı.
- Galeri davranış testleri: otomatik geçiş, manuel gezinme, fare/klavye durdurma, azaltılmış hareket, görünmez sekme/ekran dışı durumu ve başarısız görsel yükleme.
- Ana sayfa ve panel 360, 390, 430, 768, 1024, 1280 ve 1440 piksel genişliklerinde kontrol edildi; yatay taşma bulunmadı.
- Beş dilde ana sayfa/mobil menü, tüm galeri sahneleri ve mobil makale görünümü kontrol edildi.
- Panel yazı önizleme, kayıt/yeniden yükleme, dil geçişinde korunma, görsel sıralama ve beş dilde alt metin düzenleme denendi.
- JSON indirme çıktısı diskte okunup doğrulandı: bir yazı taslağı, yedi görsel/35 alt metin, bir ana sayfa taslağı. Kontrol sonunda örnek taslak içerikleri kaynak metinle eşit bırakıldı; canlı içerik değiştirilmedi.
- 14 kaynak dosyasında sözdizimi ve Git boşluk denetimi geçti. Kontrol edilen tarayıcı oturumlarında konsol hatası bulunmadı.

Gerçek cihaz laboratuvarı, ekran okuyucu donanımı, canlı Search Console veya saha Core Web Vitals ölçümü yapılmadı. Tarayıcı ekran boyutu kontrolleri fiziksel cihaz testi olarak sunulmuyor.
