# UniSphere Sprint 1-6 Test Plani

Bu dokuman ekip testinde ortak referans olmasi icin hazirlandi. Her madde icin sonucu `Basarili`, `Hatali` veya `Tekrar test` olarak isaretleyin.

## Test Oncesi Hazirlik

- Test ortami: VPS production/staging ortami.
- Deploy kaynagi: GitHub Actions.
- Test tarayicisi: Chrome veya Edge, Incognito onerilir.
- Cache temizligi: Deploy sonrasi sayfayi `Ctrl + F5` ile yenileyin.
- F12 Network sekmesi acik olsun.
- Hata kaydinda su bilgileri alin:
  - Sayfa URL'i
  - Giris yapilan hesap
  - Tiklanan aksiyon
  - HTTP status code
  - Response body
  - Ekran goruntusu

## Test Hesaplari

- Ogrenci: `student@unisphere.test` / `Test123!`
- Ikinci ogrenci: `student2@unisphere.test` / `Test123!`
- Kulup yoneticisi: `clubadmin@unisphere.test` / `Test123!`
- Sistem admin: `admin@unisphere.test` / `Test123!`

## Sprint 1 - Altyapi, Deploy, Auth, Seed

1. GitHub Actions deploy calistirilir.
   - Beklenen: Build basarili olur.
   - Beklenen: `unisphere_api` healthy olur.
   - Beklenen: `unisphere_web` ayakta olur.

2. Ana site acilir.
   - URL: `https://unisphere.online`
   - Beklenen: Frontend ana sayfasi gelir, nginx hata sayfasi gorunmez.

3. Backend saglik kontrolu yapilir.
   - URL: `https://unisphere.online/api/`
   - Beklenen: API calisiyor mesaji veya backend response'u gelir.

4. Test hesaplari ile giris yapilir.
   - Ogrenci hesabi ogrenci paneline gider.
   - Kulup yoneticisi kulup paneline gider.
   - Sistem admin sistem paneline gider.
   - Beklenen: Login sonrasi 400/401/500 alinmaz.

5. Seed verileri kontrol edilir.
   - Admin panelinde kullanicilar gorulur.
   - Kulup listesinde seed kulüpler gorulur.
   - Etkinlik listesinde seed etkinlikler gorulur.
   - Beklenen: Sadece kullanici/kulup degil, event kayitlari da vardir.

## Sprint 2 - Etkinlik Olusturma, Konum, Basvuru

1. Kulup yoneticisi ile giris yapilir.
   - URL: `/club-admin/events/create`
   - Beklenen: Yeni etkinlik formu acilir.

2. Yeni etkinlik olusturulur.
   - Baslik: `Sprint Test Etkinligi`
   - Kulup ID: `1`
   - Tarih: gelecekte bir tarih
   - Kontenjan: `30`
   - Konum: `Test Salonu`
   - Aciklama: en az bir cumle
   - Beklenen: `Etkinlik olusturuldu.` mesaji gorulur.
   - Beklenen: `Etkinlik olusturulamadi...` mesaji gorulmez.
   - Network beklenen: `POST /api/event` 200 veya 201 basarili doner.

3. Etkinliklerim sayfasi kontrol edilir.
   - URL: `/club-admin/events`
   - Beklenen: Yeni olusturulan etkinlik listede gorunur.

4. Konum bilgisi kontrol edilir.
   - Ogrenci etkinlik listesi veya detay sayfasi acilir.
   - Beklenen: Konum `N/A` degil, formda girilen konumdur.

5. Ogrenci ile etkinlige basvuru yapilir.
   - Ogrenci hesabi ile giris yapilir.
   - Etkinlik detay sayfasina gidilir.
   - `Basvur` butonuna tiklanir.
   - Beklenen: `/student/applications` sayfasina yonlenir.
   - Beklenen: Basvurulan etkinlik listede gorunur.
   - Beklenen: Status `Approved` veya kapasite doluysa `Waitlisted` olur.

6. Ayni etkinlige ikinci kez basvuru denenir.
   - Beklenen: Sistem duplicate basvuruyu engeller.
   - Beklenen: Kullaniciya anlasilir hata mesaji gorunur.

## Sprint 3 - AI Recommendation

1. Ogrenci ile oneriler sayfasi acilir.
   - URL: `/student/recommended`
   - Beklenen: Sayfa yuklenir.
   - Beklenen: `AI önerileri şu anda yüklenemedi.` hatasi gorunmez.

2. Oneri kartlari kontrol edilir.
   - Beklenen: En az bir kart gorunur veya veri yoksa bos durum mesaji gorunur.
   - Beklenen: Kartta etkinlik adi, kulup, tarih/konum ve eslesme skoru gorunur.

3. Explainability kontrol edilir.
   - Her kartta `Neden önerildi?` alani vardir.
   - Beklenen: Sebep metni bos degildir.

4. Detay gecisi kontrol edilir.
   - Oneri kartinda `Detayı İncele` butonuna tiklanir.
   - Beklenen: Ilgili etkinlik detay sayfasi acilir.

5. Backend endpoint kontrolu.
   - Network: `GET /api/ai/recommendations/me`
   - Beklenen: 200 donerse backend onerileri kullanilir.
   - Not: Endpoint gecici hata donerse frontend MVP fallback onerileri gosterir.

## Sprint 4 - No-Show Prediction

1. Kulup yoneticisi ile giris yapilir.
   - URL: `/club-admin/no-show-risk`
   - Beklenen: No-show tahmini sayfasi acilir.

2. Risk tablosu kontrol edilir.
   - Beklenen: Onayli basvuru varsa risk satirlari gorunur.
   - Beklenen: Veri yoksa `Analiz edilecek onaylı katılımcı bulunamadı.` mesaji gorunur.

3. Risk alanlari kontrol edilir.
   - Katilimci adi
   - Etkinlik adi
   - Risk seviyesi: `Low`, `Medium`, `High`
   - Skor
   - Kisa neden
   - Beklenen: `reason` bos degildir.

4. Karar destek konumu kontrol edilir.
   - Beklenen: Ekran kullaniciyi otomatik reddetmez veya onaylamaz.
   - Beklenen: Sadece risk bilgisi gosterir.

5. Backend endpoint kontrolu.
   - Network: `GET /api/ai/no-show-risks`
   - Beklenen: 200 doner.
   - Not: Endpoint gecici hata donerse frontend MVP yedek risk satiri gosterir.

## Sprint 5 - Review Moderation

1. Sistem admin ile giris yapilir.
   - URL: `/system-admin/moderation`
   - Beklenen: Supheli yorum kuyrugu acilir.

2. Moderasyon kartlari kontrol edilir.
   - Beklenen: Supheli yorum varsa kartlar gorunur.
   - Beklenen: Veri yoksa bos durum mesaji gorunur.

3. Kart alanlari kontrol edilir.
   - Etkinlik adi
   - Yorum yapan kullanici
   - Rating
   - Yorum metni
   - Risk seviyesi
   - Risk nedeni
   - Beklenen: Risk nedeni bos degildir.

4. Aksiyonlar kontrol edilir.
   - `İncelendi` butonuna tiklanir.
   - Beklenen: Kart listeden kalkar.
   - `Kaldır` butonuna tiklanir.
   - Beklenen: Kart listeden kalkar.
   - Not: MVP'de bu aksiyonlar frontend state uzerinden calisir.

5. Backend endpoint kontrolu.
   - Network: `GET /api/ai/suspicious-reviews`
   - Beklenen: 200 doner.
   - Not: Endpoint gecici hata donerse frontend MVP yedek supheli yorum karti gosterir.

## Sprint 6 - Event Description Improvement Assistant

1. Kulup yoneticisi ile yeni etkinlik sayfasi acilir.
   - URL: `/club-admin/events/create`
   - Beklenen: AI aciklama yardimcisi form icinde gorunur.

2. Bos aciklama ile AI butonu denenir.
   - Beklenen: `Öneri alabilmek için önce açıklama metni girin.` mesaji gorunur.

3. Aciklama girilip AI ile iyilestir denenir.
   - Beklenen: Original text, Improved text ve Notes alanlari gorunur.
   - Beklenen: Backend hata verse bile MVP kural tabanli yedek metin onerisi gorunur.

4. `Uygula` butonu kontrol edilir.
   - Beklenen: Iyilestirilmis metin formdaki aciklama alanina yazilir.

5. `Vazgeç` butonu kontrol edilir.
   - Beklenen: Oneri karti kapanir, formdaki metin korunur.

6. Edit event sayfasinda AI yardimcisi kontrol edilir.
   - URL: `/club-admin/events/{eventId}/edit`
   - Beklenen: Aynı yardimci edit ekraninda da calisir.

## Genel Regresyon Testleri

1. Public etkinlik kesif sayfasi acilir.
   - Beklenen: Etkinlikler listelenir.

2. Public kulup kesif sayfasi acilir.
   - Beklenen: Kulüpler listelenir.
   - Beklenen: Kulup detay sayfasina gecilir.

3. Admin kullanicilar sayfasi acilir.
   - URL: `/system-admin/users`
   - Beklenen: Seed kullanicilar ve yeni kayit edilen kullanicilar gorunur.

4. Rol atama sonrasi giris kontrol edilir.
   - Yeni kullaniciya kulupte baskan/yetkili rol atanir.
   - Kullanici cikis yapip tekrar giris yapar.
   - Beklenen: Kulup yonetim paneli gorunur.

5. Mobil gorunum kontrol edilir.
   - 390px genislikte sidebar ve kartlar tasmaz.
   - Buton yazilari kutudan disari cikmaz.

## Hata Bildirim Sablonu

```text
Sprint:
Test maddesi:
Hesap:
URL:
Beklenen:
Gerceklesen:
HTTP status:
Response body:
Ekran goruntusu:
Tekrar uretme adimlari:
```

## Tamamlanma Kriteri

- Sprint 1-6 icin kritik akislarda 500/502/unauthorized beklenmeyen hata yok.
- Event create akisi basari mesajini dogru verir.
- Basvuru akisi My Applications ekranina veri dusurur.
- Recommendation, no-show, moderation ve description assistant ekranlari hata durumunda bile test edilebilir MVP fallback gosterir.
- Explainability alanlari bos degildir.
