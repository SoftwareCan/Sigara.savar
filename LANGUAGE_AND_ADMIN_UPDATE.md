# Dil, galeri ve yönetici girişi — 11 Ekim 2026

## Tamamlananlar

- Mevcut Türkçe, İngilizce, Almanca, İspanyolca ve Fransızca yapısına Brezilya Portekizcesi eklendi. Fransızcanın eksik yasal belge çevirileri tamamlandı.
- Altı dilde ana sayfa, rehber, araçlar, indirme, Bilgi Merkezi ve 29 makale; toplam 174 makale dil sürümü.
- Gizlilik, hizmet şartları ve veri silme belgeleri artık altı dilde. Eski metinlerin tamamı korundu. Veri silmenin eksik Almanca ve İspanyolca sürümleri de eklendi. Ortak menü/alt bilgi, seçilen belge diliyle birlikte değişir.
- Galeri dört saniyede bir yumuşak geçiş yapar. İleri/geri, durdur/başlat ve sayaç kaldırıldı. Hareket azaltma tercihi, görünmeyen sekme ve ekran dışına çıkma otomatik geçişi durdurur. Görsel yüklenemezse mevcut sahne korunur.
- EN/DE/ES için gerçek yerelleştirilmiş mağaza görselleri kullanıldı; 84 optimize AVIF/WebP dosyası eklendi. Türkçe görseller korundu.
- Sunucuda doğrulanan yönetici hesabı, giriş/çıkış ve parola değiştirme eklendi. Özel panel HTML’i halka açık dosyadan ayrıldı. Ayrıntılar: [ADMIN_ACCESS.md](ADMIN_ACCESS.md).

## İçerik kaynağı

Flutter `Sigara_Savar/quitSmoke`, Portekizce kaynak sürümü `43530315`:

- `lib/features/explore/system_posts/data/knowledge_center_content_pt_br.dart`
- `lib/features/health/presentation/data/health_goals_l10n.dart` → `kHealthGoalsPtBr`
- `lib/features/games/presentation/data/breathing_exercise_l10n.dart` → `kBreathingTechniquesPtBr`
- `lib/features/progress/domain/growth_insights_l10n.dart` → `kJourneyMapMilestonesPtBr`
- `lib/l10n/app_pt_BR.arb`

29 yazı, 26 sağlık aşaması, 6 nefes tekniği, 12 yolculuk aşaması ve 50 uygulama metni uygulamadan alındı. Web sağlık çizelgesi mevcut doğrulanmış seçkiyi kullanmaya devam eder. Makale kimlikleri ve içerik alanları korundu; görünür adresler Portekizce okunabilir kelimelerden üretildi.

## Yeni yollar

- `/pt-br/`
- `/pt-br/central-de-conhecimento/`
- `/pt-br/central-de-conhecimento/<slug>/` — 29 makale
- `/pt-br/guia-para-parar/`
- `/pt-br/ferramentas/`
- `/pt-br/baixar/`
- `/admin/security` — yalnızca yönetici sunucusunda ve giriş yapıldıktan sonra

Fransızca `/fr/` yolları korundu. Yasal belgelerde `?lang=fr` ve `?lang=pt-BR` kullanılır.

## Dosyalar

Yeni kaynaklar: `_build/content/pt-BR/*.json`, `_build/i18n/pt-BR.mjs`, `_build/content/gallery-{en,de,es}.json`, `_build/lib/admin-auth.mjs`, `_build/setup-admin.mjs`, `_build/templates/admin-access.mjs`, `_build/verify-admin-auth.mjs`, `assets/js/admin-access.js`, `assets/css/admin-access.css`.

Güncellenen kaynaklar: site yapılandırması, dil sözlükleri, `slugs.json`, `SOURCE.json`, senkronizasyon ve görsel optimizasyon betikleri, sağlık metinleri, layout/legal/knowledge/admin/gallery şablonları, build/serve/verify betikleri, `lang.js`, galeri ve admin taslak betikleri, ana sayfa stili, `.gitignore`, README ve SEO raporu. Üretilen sayfalar, sitemap ve yayın geçmişi yenilendi.

`.local/` içindeki yönetici bilgileri ve `_build/private/` içindeki panel çıktıları Git dışında tutulur. Beş dilde önceden kaydedilen galeri/ana sayfa taslakları korunur; eksik Portekizce alternatif metinleri kaynak veriden tamamlanır.

## SEO ve performans

Altı dil arasında karşılıklı hreflang ve x-default; Portekizce başlık, meta açıklama, canonical, OpenGraph, Article/Breadcrumb verileri. Sitemap 207 adres içerir; 404 ve yönetici ekranları indekslenmez. Makalelerin gerçek yayın tarihleri korunur, yeni dil sürümleri oluşturuldukları tarihi alır.

Yeni çalışma zamanı bağımlılığı eklenmedi. Galeri opacity geçişi kullanır; ilk sahne öncelikli, sonraki sahneler ihtiyaç oldukça yüklenir. EN/DE/ES yedi görselin 360px AVIF toplamları dil başına yaklaşık 161/176/175 KiB. Yönetici betikleri ve içerik envanteri herkese açık sayfalara yüklenmez.

## Doğrulama

- Build başarılı; statik kontrol: 208 herkese açık sayfa + bir indekslenmeyen giriş sayfası, 16.116 yerel bağlantı, 1.416 kaynak içerik kontrolü, 1.224 dil yolu kontrolü.
- Galeri testleri: dört saniyelik otomatik geçiş, döngü, azaltılmış hareket, görünürlük, yükleme hatası ve geç tamamlanan görsellerin iptali.
- Yönetici testleri: doğru/yanlış şifre, CSRF/origin kontrolü, oturum kimliği yenileme, çıkış, süre aşımı, parola değişimi, eski oturumların iptali, deneme sınırları, özel dosyalar ve Windows NTFS yol takma adları. Anonim trafik mevcut yönetici oturumunu düşüremez.
- Tarayıcıda gerçek oluşturulan hesapla giriş/çıkış ve hesap ayarları görüldü. Portekizce envanterde 29 makale doğrulandı.
- Ana sayfa ve giriş için 360/390/430/768/1024/1280/1440 genişlikleri; altı ana sayfa için ayrıca mobil/masaüstü karşılaştırması. Yatay taşma görülmedi. Portekizce makale ile Fransızca/Portekizce yasal sayfa geçişi incelendi. Tarayıcıda konsol hatası görülmedi.

## Korunanlar ve kalan sınırlar

Mevcut görsel kimlik, mağaza bağlantıları, uygulama kullanıcılarının duraklatılmış Firebase giriş kodu ve eski yasal metinler korundu. Panel taslakları hâlâ tarayıcıda tutulur ve dışa aktarılır; canlı yayınlama hizmeti eklenmedi. Yönetici arayüzü Türkçe, içerik yönetimi altı dillidir.

Fransızca ve Portekizce mağaza görsellerinin kaynak dosyaları bulunmadı. Bu dillerde resim içine gömülü metinler Türkçe kalır; alternatif metinleri doğru dili belirtir. Mevcut Türkçe PDF ve eski uygulama ekran görüntüleri değiştirilmedi. Bunlar çevrilmiş web metni olarak sunulmaz. İspanyolca kaynak `1.png` içindeki “Cigarrillos fumados” etiketi ayrıca düzeltilmeli; özgün görsele müdahale edilmedi.

Canlıya dağıtım yapılmadı. Yönetici sunucusu yerelde `http://127.0.0.1:4174/` üzerinde çalışır; önceki 4173 önizlemesi korunmuştur. Üretim yöneticisi için HTTPS arkasında sunucu kurulumu ve ayrı üretim parolası gerekir. Gizli dosyalar statik hosting’e yüklenmemelidir.
