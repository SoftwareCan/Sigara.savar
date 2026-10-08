# Ana sayfa sadeleştirmesi — 8 Ekim 2026

## Uygulama öncesi kısa denetim

1440 × 1000 tarayıcı ölçümünde ana sayfa 11.714 px, ana içerik 11.097 px ve görünür metin yaklaşık 958 kelimeydi. Dokuz büyük bölüm vardı. 390 px genişlikte sayfa 12.480 px, giriş bölümü 804 px idi. Beş ekranlı uygulama anlatımı tek başına yaklaşık 3.255 px tutuyordu. Bilgi Merkezi taksonomisi ve çalışan kriz aracı da ana sayfayı uzatıyordu.

Mevcut Newsreader / Source Sans 3 fontları, sıcak beyaz zemin, marka yeşili, gerçek ekran görüntüleri, menü ve altbilgi korunmaya değer. Tekrarlanan sloganlı yeşil afiş, büyük döngü şeması ve ana sayfadaki ayrıntılı araçlar hiyerarşiyi zayıflatıyor.

İncelenen siteler: [Sigara Savar](https://www.sigarasavar.com/), [QuitNow](https://www.quitnow.app/en), [Kwit](https://kwit.app/en). QuitNow'ın kısa açıklamaları ve ürün ekranları, Kwit'in uygulama ile derin içerik arasında kurduğu bağlantılar referans alındı. Renkleri, iddiaları, istatistikleri ve görsel kompozisyonları kopyalanmayacak. Referans sayfaların tarayıcıda ölçülen uzunlukları sırasıyla yaklaşık 3.711 ve 6.905 px idi; bunlar kalite puanı değil, yoğunluk karşılaştırmasıdır.

Bilgi Merkezi, rehber, araçlar ve indirme sayfası da incelendi. Mobilde yatay taşma görülmedi. Gerçek mağaza adresleri, yasal bağlantılar ve gizli kimlik doğrulama altyapısı korunacak.

## Düzenleme kararı

- Kaldır: yeşil logo afişi, yinelenen slogan, büyük döngü çizimi, ana sayfa logo animasyonu, uzun sabitlenen ekran anlatımı.
- İç sayfalarda bırak: tam sağlık çizelgesi (`/birakma-rehberi/#saglik`), 90 saniyelik akış ve nefes araçları (`/araclar/`), tüm 29 yazı ve kategoriler (`/bilgi-merkezi/`). Bu içerikler zaten mevcut; taşımak için kopyalanmayacak.
- Kısalt: dört fayda, iki ürün detayı (Gelişim girişte gösteriliyor), üç gerçek yazı, üç rehber başlangıcı, kısa topluluk anlatımı.
- Koru: tek ana slogan, mevcut fontlar ve renkler, navbar, footer, mağaza adresleri, indirme rotası, içerik ve yasal belgeler.
- Hedef: altı ana alan; gerçek uygulama ekranlı giriş, temel faydalar ve kısa döngü geçişi, ürün gösterimi, okuma ve rehber başlangıçları, topluluk, indirme.

Tasarım kararları mevcut projeyi iyileştirme becerisiyle ve elle yapılan görsel denetimle verildi. UI/UX araması dengeli başlık satırlarını destekledi; yeni font, bağımlılık veya animasyon kütüphanesi gerekmiyor.

## Uygulanan sonuç

Ana sayfa altı alana indirildi. Girişte tek slogan, kısa bir ürün açıklaması, birincil indirme bağlantısı ve daha sakin rehber bağlantısı var. Yeşil afişin yerini gerçek Gelişim ekranı aldı. Mobilde bu ekranın üst bölümü gösteriliyor; metin ve düğmelerin altında gereksiz uzun bir telefon görseli oluşmuyor.

Dört temel fayda açık bir satır düzeninde anlatılıyor. Döngü anlatımı iki kısa metin ve gerçek yazıya bir bağlantıdan oluşuyor. Ürün bölümünde Acil Alan ve Yolculuk Haritası arasında kullanıcı tarafından değiştirilen iki sekme var. Otomatik geçiş, kaydırmaya bağlı animasyon ve zamanlayıcı yok. Sekmeler ok tuşları, Home ve End ile kullanılabiliyor. JavaScript çalışmadığında iki bölüm de normal HTML olarak okunabilir.

Bilgi Merkezi üç gerçek yazıyla temsil ediliyor: `b1-01` (Bağımlılık nedir?), `b3-02` (İstek dalgası), `b3-08` (Kayma sonrası toparlanma). Metinler mevcut `_build/content/tr/` içeriğinden okunuyor; içerik dosyaları yeniden yazılmadı. Rehber için Hazırlanıyorum / İlk günlerdeyim / Yeniden başlıyorum bağlantıları kullanıldı. Toplulukta mevcut Keşfet ekranının yalnızca ilgili satırı gösteriliyor; kullanıcı adı veya uydurma mesaj yok.

Newsreader ana slogan ve kısa döngü cümlesinde korundu. Diğer ana sayfa başlıkları mevcut Source Sans 3 ile daha küçük ve tutarlı bir hiyerarşiye geçti. İç sayfaların tipografisi değişmedi. Masaüstünde kontrollü genişlik, daha kısa bölüm aralıkları ve iki sütun; mobilde metin → çağrı → ürün sırası kullanıldı. Güçlü yeşil yüzey yalnızca son indirme alanında öne çıkıyor.

Son sadeleştirme geçişinde giriş metni yeniden kısaltıldı, mobil giriş yüksekliği azaltıldı, ürün başlığı ve ekranı aynı satırda toplandı, topluluk görselindeki ilgisiz menü satırları kırpıldı.

## Ölçüm ve doğrulama

| Ölçüm | Önce | Sonra |
| --- | ---: | ---: |
| Ana sayfa uzunluğu, 1440 px | 11.714 px | 4.116 px (yaklaşık %65 daha kısa) |
| Ana sayfa uzunluğu, 390 px | 12.480 px | 5.281 px (yaklaşık %58 daha kısa) |
| Mobil giriş yüksekliği, 390 px | 804 px | 713 px |
| Büyük içerik alanları | 9 | 6 |
| Ana sayfa HTML | 44.065 bayt | 18.729 bayt |
| Ana sayfa JavaScript | 4.736 bayt | 2.128 bayt |
| Ana sayfa CSS | 6.820 bayt | 7.857 bayt |

CSS yaklaşık 1 KB arttı; bu, iç sayfaların ortak stillerine dokunmadan ana sayfayı ayrı düzenlemek için tercih edildi. HTML ve JavaScript küçüldü; `wave.js` ana sayfadan çıkarıldı. Görseller mevcut AVIF/WebP boyutlarını kullanıyor; giriş ekranı yüksek öncelikle, aşağıdaki ekranlar ve mağaza rozetleri tembel yükleniyor. Görsellerin boyutları önceden ayrılıyor. Yeni bağımlılık, harici font, üçüncü taraf script veya yeni animasyon eklenmedi. Bunlar dosya ve tarayıcı kontrolleridir; canlı kullanıcı hız ölçümü veya Lighthouse puanı değildir.

| Ekran genişliği | Sayfa yüksekliği | Yatay taşma |
| --- | ---: | --- |
| 360 | 5.324 px | Yok |
| 390 | 5.281 px | Yok |
| 430 | 5.113 px | Yok |
| 768 | 3.954 px | Yok |
| 1024 | 4.003 px | Yok |
| 1280 | 4.045 px | Yok |
| 1440 | 4.116 px | Yok |
| 1920 | 4.119 px | Yok |

Masaüstü, tablet ve telefon görselleri incelendi. Mobil menünün açılması, Escape ile kapanması ve uygulama alanına geçmesi; ürün sekmelerinin seçilmesi, ok tuşu ve Home davranışı; üç yazı, Bilgi Merkezi, üç rehber başlangıcı, rehber ana sayfası, sağlık bölümü, Araçlar ve indirme sayfasına geçişler tarayıcıda doğrulandı. Eski `#kriz` / `#iyilesme` bağlantıları için ilgili sekmeyi açma desteği korundu. JavaScript kapalı durum için statik içerik yapısı kontrol edildi; gerçek tarayıcıda JavaScript kapatma emülasyonu yapılmadı.

Son derleme başarılı. Statik doğrulama: **38 genel sayfa, 2.500 yerel referans ve 236 kaynak içerik kontrolü** geçti. Metadata, makale tarihleri, sitemap, auth bağlantılarının gizlenmesi ve yasal metinlerin korunması doğrulandı. JavaScript sözdizimi ve Git boşluk denetimi geçti. Tarayıcı konsolunda hata veya uyarı görülmedi.

## Dosyalar ve korunan kapsam

Oluşturuldu:

- `HOMEPAGE_REFINEMENT.md`: denetim, kararlar ve sonuçlar.

Değiştirildi:

- `_build/templates/home.mjs`: altı bölümlü ana sayfa; gerçek ekranlar, sade okuma/rehber önizlemesi.
- `_build/i18n/tr.mjs`: yalnızca ana sayfa metinleri ve açıklaması.
- `_build/templates/components.mjs`: girişteki gerçek ekran için yüksek görsel yükleme önceliği.
- `assets/css/home.css`: ana sayfaya özel tipografi, boşluklar, sekmeler ve mobil düzen.
- `assets/js/home.js`: eski kaydırma/timeline davranışları yerine küçük, erişilebilir ürün sekmeleri.
- `index.html`: üretilen ana sayfa.
- `_build/content/publication-history.json`: ana sayfanın içerik özeti otomatik güncellendi; mevcut tarih korundu.

Yeni rota yok. `/bilgi-merkezi/`, 29 makale, `/birakma-rehberi/`, `/araclar/` ve `/indir/` mevcut adresleriyle korunuyor. Mağaza adresleri, navbar, footer, yasal belgeler, çok dilli içerik kaynakları, Flutter uygulaması ve kimlik doğrulama altyapısı değişmedi. Ana sayfanın doğal Türkçe meta açıklaması ürün odağına göre güncellendi; başlık, canonical, OpenGraph, yapılandırılmış veriler ve favicon altyapısı korundu. Üretime yayınlama yapılmadı.

## Kalan öneriler

- Topluluk alanında mevcut, gizlilik açısından güvenli Keşfet menüsü kullanılıyor. İleride izinli ve anonimleştirilmiş gerçek bir topluluk ekranı sağlanırsa bu bölümü daha insani kılabilir; şu an kullanıcı mesajı üretilmedi.
- Yayından sonra gerçek telefon ve mobil ağ koşullarında yükleme süresi / yerleşim kayması ölçülebilir. Bu turdaki responsive kontroller masaüstü tarayıcısının ekran genişliği emülasyonuyla yapıldı.
- İncelenen düzenlerde kalan bir taşma veya örtüşme sorunu görülmedi.
