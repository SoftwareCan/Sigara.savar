---
# Jekyll (GitHub Pages) bu dosyayı siteye yayınlamasın.
published: false
---

# Sigara Savar — Tasarım Yönü

Bu belge, sigarasavar.com'un "uygulama tanıtım sayfası"ndan içerik öncelikli bir sigara bırakma platformuna dönüşümünün tasarım kararlarını özetler. Uygulama koduna geçmeden önce yazıldı; uygulama sırasında değişen kararlar en alttaki "Revizyonlar" bölümüne işlenir.

## 1. Denetim özeti (mevcut site)

| Alan | Bulgu |
|---|---|
| Kimlik | Her yerde eski astronot logosu (favicon, header, footer). Yeni sonsuzluk/sigara işareti hiç kullanılmıyor. |
| Konumlandırma | Sayfa yalnızca uygulamayı anlatıyor. Bilgi Merkezi sadece bir cümlede geçiyor; tek içerik varlığı 2 sayfalık PDF. |
| Görseller | `assets/*.png` dosyaları gerçek ekran görüntüsü değil: içine başlık metni, eski logo, yapraklar ve sahte telefon çerçeveleri gömülü mağaza afişleri. Her biri 1,4–1,7 MB (toplam ≈10 MB), `srcset`/boyut bilgisi yok. |
| Renk | Doygun yeşil (#27B978 / #1FA86D) hero, bant ve CTA kartında tam blok olarak kullanılıyor; beyaz metin bu yeşil üzerinde ≈2,5:1 kontrastta (WCAG AA başarısız). |
| Tipografi | `Inter` tanımlı ama yüklenmiyor (platforma göre Segoe/SF'ye düşüyor). Her başlık 900–950 ağırlıkta, BÜYÜK HARF etiketler her bölümde, hero 82 px. |
| Sahte sosyal kanıt | Doğrulanmamış "★★★★★ App Store'da / Google Play'de" puanları (auth.html'de ayrıca "3K+ kullanıcı, 4.9★"). |
| Navigasyon | 1120 px altında menü tamamen kayboluyor, yerine mobil menü yok. 390 px'te header 15 px yatay taşma yapıyor. |
| Auth | `header-auth.js` her ziyaretçi için Firebase App/Auth/Firestore/App Check + reCAPTCHA yüklüyor; header, auth durumu çözülene kadar gizli kalıyor. "Giriş Yap" butonu herkese açık. |
| Hareket | Sonsuz döngüde yıldız parlaması ve "yüzen" telefon; her bölümde aynı fade-up. |
| SEO | Başlık "Sigaradan Kurtul" (marka yok), göreli `og:image`, canonical/yapılandırılmış veri/sitemap/robots yok. Yasal sayfa başlıkları İngilizce. |
| Güvenlik/console | `X-Frame-Options` meta etiketiyle verilmiş (tarayıcı yok sayıyor ve konsola hata yazıyor). |

Korunacaklar: yasal sayfaların metni (TR/EN/ES/DE) ve URL'leri, `userDataDeletion.html`, `app-ads.txt`, Google doğrulama dosyası, `CNAME`, Nikotin Krizi Rehberi PDF'i, auth/dashboard altyapısı (gizli olarak).

## 2. Konumlandırma

> Sigara bırakma sürecinde bilgi, takip, destek ve topluluk tek yerde.

Site, uygulamayı hiç indirmeyen biri için de işe yaramalı: Bilgi Merkezi'nin tamamı, sağlık zaman çizelgesi, 90 saniyelik kriz akışı, nefes egzersizleri ve kişisel kriz planı tarayıcıda ücretsiz çalışır. Uygulama, değer anlaşıldıktan sonra "takip, topluluk ve sürekliliğin" yeri olarak tanıtılır.

Ses: "sen" diliyle, sakin, net, abartısız. Ünlem ve vaat yok; tıbbi iddia yok. Uygulamadaki metinlerle aynı kelimeler kullanılır (Kriz Bekçisi, Bilgi Merkezi, Acil Alan, Yolculuk Haritası).

## 3. Görsel konsept: Döngü → Çizgi → Dalga

Konsept, logodan ve Bilgi Merkezi içeriğinden türetildi — süs için değil, bilgi taşımak için:

- **Döngü (∞):** Yeni logo, kırılmış bir sonsuzluk döngüsü. Bilgi Merkezi bağımlılığı "birbirini besleyen bir döngü" olarak anlatır. Hero'nun tek cesur unsuru bu işarettir (tek seferlik maske açılışı).
- **Çizgi (—):** Bırakmak, döngüyü ileri giden bir çizgiye çevirir. Sağlık zaman çizelgesi ve Yolculuk Haritası aynı ince çizgi diliyle çizilir; kaydırmayla dolar.
- **Dalga (∿):** "İstek bir dalga gibi yükselir ve azalır" (Bilgi Merkezi b3-02). Kriz bölümünde 90 saniyelik akış bu dalgayı çizer.

Tüm grafikler 1,5 px kontur dilindedir; dekoratif blob, gradyan, cam efekti, 3B şekil yok.

## 4. Renk

Uygulamanın gerçek yüzeylerinden örneklendi (Keşfet/Sağlık/Gelişim ekranları), böylece web ve uygulama aynı aileye ait görünür. Site yeşile boyanmaz: yeşil, bilinçli olarak az ve büyük yerlerde kullanılır.

| Token | Hex | Rol | Kontrast notu |
|---|---|---|---|
| `--paper` | #FCFBF8 | Sayfa zemini (uygulama: #FCFBF8) | — |
| `--sand` | #F4EFE6 | İkincil yüzey, editoryal bantlar | — |
| `--ink` | #102320 | Başlık ve metin (uygulama: #0D2025) | paper üzerinde 15,8:1 |
| `--ink-soft` | #4A5652 | İkincil metin | paper üzerinde ≈7,5:1 |
| `--forest` | #18704F | Bağlantı, birincil buton, odak halkası | paper 5,9:1 · beyaz metin 6,1:1 |
| `--forest-deep` | #0F3D32 | Kriz bölümü ve footer zemini | beyaz metin 11,8:1 |
| `--brand` | #43C682 | Logo, büyük marka alanı, koyu zeminde vurgu | Üzerinde yalnızca `--ink` metin (8,4:1); beyaz metin yasak (2,2:1) |
| `--filter` | #FDA227 | Sadece küçük grafik işaretler (şu an noktası) | Metin rengi olarak kullanılmaz |

Gölge neredeyse yok; derinlik yüzey tonu ve boşlukla verilir.

## 5. Tipografi

`ui-ux-pro-max` tipografi araması ve Türkçe başlıklarla render edilen yan yana numuneyle değerlendirildi:

| Aday | Sonuç |
|---|---|
| Source Sans 3 (tek aile) | Okunaklı ve uygulamayla tutarlı, ama başlıklarda editoryal ses taşımıyor. |
| **Newsreader + Source Sans 3** | **Seçildi.** Uzun okuma için tasarlanmış, optik boyutlu, olgun ve güven veren bir serif; Türkçe aksanlar temiz. |
| Fraunces + Source Sans 3 | Sıcak ama 2022–2024 "trend" şablon görünümüne çok yakın. |
| Source Serif 4 + Source Sans 3 | Uyumlu ama sıradan ve kitapsı. |
| Inter, Outfit/Work Sans, Lora/Raleway | Aracın genel önerileri; jenerik startup/wellness şablonu hissi. Elendi. |

- **Newsreader** (değişken wght 400–600, optik boyut 36'ya sabit): başlıklar, makale başlıkları, zaman etiketleri, alıntılar. Asla 600'den kalın değil.
- **Source Sans 3** (değişken, wght 400–700): gövde metni, arayüz, form. Uygulamanın Bilgi Merkezi okuma fontuyla aynı.
- Kendi sunucumuzda, TR/EN/ES/DE karakterlerini kapsayan tek WOFF2 alt kümesi; `font-display: swap`.
- Akışkan ölçek (clamp), oran ≈1,2 mobil → ≈1,3 masaüstü. Hero en fazla ≈4 rem; gövde 17–19 px, satır uzunluğu ≤ 68 karakter, `text-wrap: balance/pretty`.
- BÜYÜK HARF etiket, tek kelimeyi renklendirme, "→" ekli buton metni, "A · B · C" meta dizileri kullanılmaz.

## 6. Yerleşim

- 12 kolonlu ızgara, içerik genişliği 1240 px; metin blokları 6–7 kolon. Asimetri varsayılan, simetri istisna.
- Bölüm ritmi: kağıt → kum → koyu orman (tek kez, kriz anı) → kağıt. Her bölüm aynı kart ızgarası değildir: tam genişlik anlatım, editoryal liste, yapışkan sütun, ekran görüntüsü dizisi dönüşümlü kullanılır.
- Numara yalnızca içerik gerçekten bir sıraysa kullanılır (Bilgi Merkezi bölümleri, 4D adımları, Kriz Bekçisi adımları, yolculuk aşamaları).
- Mobil, masaüstünün yığılması değildir: hero sıralaması, zaman çizelgesi (tek sütun + sticky süre etiketi yok), uygulama ekranları (yatay kaydırma) ayrı kurgulanır.

```
Ana sayfa (masaüstü)
┌──────────────────────────────────────────────────────────────┐
│ ∞ Sigara Savar   Bilgi Merkezi  Bırakma Rehberi  Araçlar …  [Uygulamayı İndir] │
├───────────────────────────────────────┬──────────────────────┤
│ Sigarayı bırakmak tek bir karar       │      (yeşil alan)    │
│ değil. Her gün yeniden güçlenen       │         ∞            │
│ bir süreç.                            │                      │
│ kısa açıklama                         │  Bu döngü kırılabilir.│
│ [Bilgi Merkezini keşfet] Uygulamayı indir                    │
├────────────────┬─────────────────────────────────────────────┤
│ Son sigaradan  │ 20 dakika ── nabız…                         │
│ sonra…(sticky) │ 12 saat   ── karbonmonoksit…   (çizgi dolar)│
│                │ …         ── 15 yıl                         │
├────────────────┴─────────────────────────────────────────────┤
│ ███ Kriz geldiğinde (koyu orman) ∿ 90 sn dalga + 3 araç ███  │
├──────────────────────────────┬───────────────────────────────┤
│ Öne çıkan yazı (büyük)       │ Bölüm 1 · 2 · 3 listesi       │
├──────────────────────────────┴───────────────────────────────┤
│ Uygulama: yapışkan ekran görüntüsü + özellik anlatımı        │
│ Topluluk: ilkeler (uygulamanın kendi kuralları)              │
│ İndir: mağaza bağlantıları                                   │
│ Footer: 4 grup + tıbbi uyarı                                 │
└──────────────────────────────────────────────────────────────┘
```

## 7. Bilgi mimarisi

```
/                         Ana sayfa
/bilgi-merkezi/           3 bölüm, 29 yazı, arama, öne çıkan yazı
/bilgi-merkezi/<slug>/    Kalıcı, paylaşılabilir makale sayfaları (Article + Breadcrumb JSON-LD)
/birakma-rehberi/         Yolculuk Haritası (12 aşama), sağlık zaman çizelgesi (26 hedef), okuma yolu
/araclar/                 Kriz Bekçisi (90 sn), 6 nefes tekniği, 4D, kişisel kriz planı, PDF rehber
/indir/                   Cihaza göre App Store / Google Play yönlendirmesi + masaüstü QR
/#topluluk, /#uygulama    Ana sayfa bölümleri
/privacy.html, /terms.html, /userDataDeletion.html   Korunur (yalnız header/footer yenilenir)
/auth.html, /dashboard.html                          Korunur, noindex, hiçbir yerden bağlantı yok
/404.html, /sitemap.xml, /robots.txt, /site.webmanifest  Yeni
```

Navigasyon: Logo · Bilgi Merkezi · Bırakma Rehberi · Araçlar · Topluluk · Uygulama · [Uygulamayı İndir]. Giriş/Kayıt/Hesap yok.

## 8. İçerik kaynakları (uydurma içerik yok)

| İçerik | Kaynak (Flutter `quitSmoke`) |
|---|---|
| 29 makale, 3 bölüm (TR/EN/ES/DE) | `lib/features/explore/system_posts/data/knowledge_center_content*.dart` |
| Sağlık zaman çizelgesi (26 hedef) | `lib/features/health/presentation/data/health_goals_l10n.dart` |
| Yolculuk Haritası (12 aşama) | `lib/features/progress/domain/growth_insights.dart` — yalnız ilk iki aşama (Karar, Detoks) uygulamada ücretsiz; web'de de yalnız onların ayrıntısı gösterilir, diğerleri ad + zaman olarak listelenir. |
| Nefes teknikleri (6) | `lib/features/games/presentation/data/breathing_exercise_l10n.dart` |
| Kriz Bekçisi akışı, topluluk kuralları | `lib/l10n/app_tr.arb` |
| Ekran görüntüleri | Uygulamanın kendi golden/capture testlerinin ürettiği gerçek, çerçevesiz ekranlar |
| Mağaza bağlantıları | `lib/core/constants/app_constants.dart` (eski `/tt/` App Store bağlantısı, uygulamadaki kanonik `/tr/` bağlantısıyla değiştirildi) |

`_build/sync-flutter-content.mjs` bu Dart/ARB dosyalarını okuyup `_build/content/*.json` üretir; Flutter dosyalarına yazmaz. Makale URL'leri `_build/content/slugs.json` ile sabitlenir (başlık değişse de URL değişmez).

## 9. Hareket ilkeleri

Kütüphane yok (GSAP/Lenis gereksiz): CSS + küçük vanilla JS, yalnızca `transform`/`opacity`/SVG `stroke-dashoffset`.

1. Hero: logonun tek seferlik maske açılışı (≈900 ms). Logo sürekli animasyonlu değil.
2. Sağlık zaman çizelgesi: kaydırmayla dolan çizgi ve etkin kilometre taşı (kaydırma ele geçirilmez).
3. Kriz akışı: kullanıcı başlatınca 90 saniyelik dalganın çizilmesi + nefes ritmi.
4. Nefes egzersizi: nefes fazına bağlı ölçeklenen daire.
5. Uygulama bölümü: özellik metni ilerledikçe ekran görüntüsünün kırpma maskesiyle değişmesi.
6. Mikro etkileşimler: buton basınçları, bağlantı alt çizgisi.

`prefers-reduced-motion: reduce` → hepsi son durumunda statik; araçlar metin geri sayımıyla çalışır.

## 10. Auth (geçici olarak duraklatıldı)

- `_build/site.config.mjs` → `AUTH_UI_ENABLED: false`.
- `false` iken: header'da auth yuvası ve `header-auth.js` yok, CSP'de Firebase alan adları yok, sitemap'te auth sayfaları yok.
- `auth.html`, `dashboard.html`, `auth.js`, `dashboard.js`, `firebase.js`, `security.js`, `header-auth.js` silinmez. Auth sayfalarına `noindex` eklenir.
- `header-auth.js` yeni header'daki `[data-auth-slot]` alanına çalışacak şekilde uyarlanır; bayrak `true` yapılıp build alındığında geri gelir.

## 11. SEO, erişilebilirlik, performans

- Her sayfa: benzersiz title/description, canonical, OpenGraph/Twitter, mutlak `og:image` (1200×630, makale başına üretilen görsel), `hreflang`a hazır yapı.
- JSON-LD: Organization + WebSite (ana sayfa), Article + BreadcrumbList (makaleler), MobileApplication (uygulama bölümü, puan bilgisi olmadan).
- Erişilebilirlik: skip link, landmark'lar, tek h1, görünür odak (`--forest` 2 px + ofset), 44 px dokunma hedefleri, tüm etkileşimler klavyeyle, `aria-live` yalnız gerekli yerde, metin görsele gömülmez.
- Performans: CSS ≈ tek dosya, sayfa başına yalnız gereken JS (`defer`), AVIF/WebP + `srcset` + `width/height`, ekran altı görseller `loading="lazy"`, yalnız hero logosu ve bir font önceden yüklenir.

## 12. Brife karşı gözden geçirme (revize edilenler)

- İlk taslakta hero'da telefon ekran görüntüsü vardı → kaldırıldı; uygulama, değerini anlattığımız bölüme taşındı (brief: "uygulama kimliği domine etmesin").
- Yeşil tam ekran hero eğilimi → eski sitenin tekrarı olacağı için reddedildi; yeşil yalnız logo alanında.
- Bilgi Merkezi için 3 eşit kart ızgarası → editoryal liste + öne çıkan yazıya çevrildi.
- Koyu bölüm yalnız bir kez ve anlamla (kriz anı) kullanılır; rastgele koyu bant yok.
- Sosyal kanıt yerine uygulamanın kendi topluluk kuralları ve somut özellikleri kullanıldı; puan/kullanıcı sayısı yok.

## Revizyonlar

Uygulama sırasında ekran görüntüleri, skill denetimleri ve testlerle yapılan değişiklikler:

- **Tipografi:** Newsreader, opsz 24–72 (70 KB) ile opsz 36 (41 KB) yan yana render edilerek karşılaştırıldı; fark görülmediği için optik boyut 36'ya sabitlendi. Toplam font yükü ≈74 KB.
- **Hero (design-taste-frontend):** Düğmelerin altındaki küçük not kaldırıldı, giriş metni 20 kelimeye indirildi, başlık ölçeği küçültüldü (masaüstünde 4 → 3 satır). Mobilde düğmeler tam genişlik.
- **Yerleşim tekrarı:** Ana sayfada dört ardışık "yapışkan sol sütun + sağ liste" bölümü vardı. Bilgi Merkezi önizlemesi tam genişlikte "manşet yazı + 3 sütunlu bölüm dizini" düzenine çevrildi.
- **Tek etiket kuralı:** Aynı amaçlı CTA'lar birleştirildi: "Uygulamayı indir", "Bilgi Merkezini keşfet".
- **Köşe sistemi:** Etkileşimli öğeler 12 px, kapsayıcılar 24 px, marka panelleri 32 px, ekran görüntüleri cihaz köşesi (34 px).
- **high-end-visual-design:** Yüzen cam navigasyon, hap düğmeler, her öğede bulanık giriş animasyonu, BÜYÜK HARF hap etiketler ve gren dokusu brief ile çeliştiği için alınmadı. Yalnızca özel easing eğrileri ve mobil menüde ölçülü kademeli açılış alındı.
- **web-design-guidelines:** Düz kesme işaretleri → ’, marka adı ve "2 dk" gibi ifadelerde bölünmez boşluk, sayımlarda rakam, placeholder'da "…", marka adına `translate="no"`, `touch-action: manipulation`, kriz planında sayfadan çıkarken kaydetme, zaman çizelgesinde kaydırma sırasında düzen okumalarının önbelleğe alınması.
- **Erişilebilirlik (axe):** Yasal sayfalara politika çubuğunda h1 ve "içeriğe geç" hedefi eklendi; mobilde yatay kaydırılan ekran şeridi klavyeyle odaklanabilir yapıldı. Dil seçici satır içi `onclick` yerine CSP uyumlu olay delegasyonuna geçti.
- **Hata düzeltmesi:** Şablonda kaçışlanan `loading="lazy"` geçersiz değere dönüşüyordu (HTML doğrulayıcı yakaladı); tembel yükleme artık çalışıyor.

Son durum: axe-core (WCAG 2.2 AA + best practice) 12 sayfa × 2 genişlikte 0 ihlal; 75 URL'de 0 kırık bağlantı; 18/18 etkileşim testi; Lighthouse (mobil) 6 sayfada 100/100/100/100, LCP 1,5–1,8 sn, CLS 0, sayfa ağırlığı ≈100–126 KB (eski ana sayfa: Performans 75, LCP 24,3 sn, 7,2 MB).
