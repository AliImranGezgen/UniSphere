-- ============================================================
-- UniSphere Seed Script v1.0
-- Kulüp ve Etkinlik verileri
-- Kullanım: docker exec -i unisphere_db psql -U postgres -d unisphere < seed_events.sql
-- ============================================================

-- Migration henüz çalışmadıysa PosterImagePath kolonunu manuel ekle
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Events' AND column_name = 'PosterImagePath'
    ) THEN
        ALTER TABLE "Events" ADD COLUMN "PosterImagePath" TEXT;
        RAISE NOTICE 'PosterImagePath kolonu eklendi.';
    ELSE
        RAISE NOTICE 'PosterImagePath kolonu zaten mevcut.';
    END IF;
END
$$;

-- ============================================================
-- KULÜPLER (yoksa ekle)
-- ============================================================
INSERT INTO "Clubs" ("ManagerId", "Name", "Description", "CreatedAt")
VALUES
  (1, 'Teknoloji ve Yazılım Kulübü',    'Yazılım geliştirme, yapay zeka ve siber güvenlik alanlarında etkinlikler düzenleyen öncü kulüp.', NOW()),
  (1, 'Kariyer ve Girişimcilik Kulübü', 'Öğrencileri iş dünyasına hazırlayan mentörlük programları ve networking etkinlikleri.', NOW()),
  (1, 'Müzik ve Sanat Kulübü',          'Kampüste kültürel zenginliği artırmak için konserler, sergiler ve atölyeler düzenler.', NOW()),
  (1, 'Spor ve Sağlık Kulübü',          'Fiziksel sağlık ve takım ruhunu destekleyen turnuvalar, antrenmanlar ve wellness etkinlikleri.', NOW()),
  (1, 'Bilim ve Araştırma Kulübü',      'Akademik çalışmalar, sempozyumlar ve laboratuvar projeleriyle bilimsel merakı destekler.', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- ETKİNLİKLER (15 adet)
-- ============================================================
DO $$
DECLARE
    tech_id    INT;
    kariyer_id INT;
    muzik_id   INT;
    spor_id    INT;
    bilim_id   INT;
BEGIN
    -- Kulüp ID'lerini al
    SELECT "Id" INTO tech_id    FROM "Clubs" WHERE "Name" = 'Teknoloji ve Yazılım Kulübü'    LIMIT 1;
    SELECT "Id" INTO kariyer_id FROM "Clubs" WHERE "Name" = 'Kariyer ve Girişimcilik Kulübü' LIMIT 1;
    SELECT "Id" INTO muzik_id   FROM "Clubs" WHERE "Name" = 'Müzik ve Sanat Kulübü'          LIMIT 1;
    SELECT "Id" INTO spor_id    FROM "Clubs" WHERE "Name" = 'Spor ve Sağlık Kulübü'          LIMIT 1;
    SELECT "Id" INTO bilim_id   FROM "Clubs" WHERE "Name" = 'Bilim ve Araştırma Kulübü'      LIMIT 1;

    -- Mevcut etkinlikleri kontrol et, çakışma olmasın diye temizle (opsiyonel, yorum kaldırılabilir)
    -- DELETE FROM "Events";

    INSERT INTO "Events" ("Title", "Description", "Capacity", "EventDate", "Location", "ClubId", "PosterImagePath")
    VALUES
    -- Teknoloji Kulübü etkinlikleri (5 adet)
    (
        'React ile Modern Frontend Geliştirme',
        'React 18 ve Next.js kullanarak modern, performanslı web uygulamaları geliştirmeyi öğreneceğiniz hands-on bir workshop. Hooks, Context API ve Server Components konuları ele alınacak.',
        80, '2026-05-10 14:00:00', 'Mühendislik Fakültesi - A101 Lab', tech_id, NULL
    ),
    (
        'Yapay Zeka ve Makine Öğrenmesine Giriş',
        'Python ile temel ML algoritmalarını keşfedin. Scikit-learn, TensorFlow ve gerçek dünya veri setleriyle uygulamalı çalışma fırsatı. Başlangıç seviyesi için uygundur.',
        60, '2026-05-17 10:00:00', 'Bilgisayar Mühendisliği - Lab 3', tech_id, NULL
    ),
    (
        'Siber Güvenlik CTF Yarışması',
        'Capture The Flag formatında gerçek güvenlik açıklarını keşfedip çözün. Web güvenliği, kriptografi ve tersine mühendislik kategorilerinde mücadele edin. Ödüllü!',
        120, '2026-05-24 09:00:00', 'Bilişim Merkezi - Konferans Salonu', tech_id, NULL
    ),
    (
        'Docker ve Kubernetes ile DevOps',
        'Container teknolojileri, CI/CD pipeline kurulumu ve Kubernetes orkestrasyon yönetimini öğreneceğiniz ileri seviye teknik seminer.',
        45, '2026-06-01 13:00:00', 'Teknoloji Binası - B204', tech_id, NULL
    ),
    (
        'Açık Kaynak Proje Hackathon',
        '48 saatlik hackathon! Takımlar halinde gerçek açık kaynak projelere katkı sağlayın. En iyi katkı yapan takım ödüllendirilecek. Yemek ve içecek sponsorlu.',
        200, '2026-06-14 09:00:00', 'Öğrenci Merkezi - Ana Salon', tech_id, NULL
    ),
    -- Kariyer Kulübü etkinlikleri (3 adet)
    (
        'Teknoloji Şirketleri Kariyer Günü',
        'Google, Microsoft, Trendyol, Getir gibi öncü şirketlerin İK temsilcileri ile birebir görüşme fırsatı. CV inceleme ve staj/iş fırsatları hakkında bilgi alın.',
        300, '2026-05-15 10:00:00', 'Kongre ve Kültür Merkezi', kariyer_id, NULL
    ),
    (
        'Mülakat Simülasyonu ve Koçluk',
        'Deneyimli yazılım mühendisleri ile bire bir teknik mülakat pratiği yapın. Whiteboard coding, sistem tasarımı ve davranışsal sorular üzerinde çalışın.',
        30, '2026-05-22 14:00:00', 'Kariyer Merkezi - Görüşme Odaları', kariyer_id, NULL
    ),
    (
        'Girişimcilik 101: Fikrinden Ürüne',
        'Başarılı startup kurucularından fikir validasyonu, MVP geliştirme ve yatırımcı sunumu hazırlama konularında pratik bilgiler edinin. Pitch competition ile bitecek!',
        150, '2026-06-05 13:00:00', 'İşletme Fakültesi - Amfi 1', kariyer_id, NULL
    ),
    -- Müzik Kulübü etkinlikleri (3 adet)
    (
        'Kampüs Bahar Konseri',
        'Kulüp müzisyenlerimizin sahne alacağı açık hava bahar konseri. Akustik gitar, keman ve piyano performansları. Yanınızda battaniye ve piknik minderi getirmeyi unutmayın!',
        500, '2026-05-20 19:00:00', 'Kampüs Merkez Amfitiyatro', muzik_id, NULL
    ),
    (
        'Ses Kaydı ve Prodüksiyon Atölyesi',
        'Profesyonel ses mühendisi rehberliğinde home studio kurulumu, DAW programları ve ses kaydı tekniklerini öğrenin. Ableton Live ve Logic Pro X ile uygulamalı deneyim.',
        20, '2026-05-28 15:00:00', 'Güzel Sanatlar - Stüdyo B', muzik_id, NULL
    ),
    (
        'Geleneksel Türk Müziği Dinletisi',
        'Üniversitemizin geleneksel müzik topluluğu ile birlikte Anadolu''nun zengin müzik kültürünü keşfedin. Canlı saz, kemençe ve ud performansları eşliğinde unutulmaz bir akşam.',
        200, '2026-06-10 18:30:00', 'Kültür Merkezi - Sergi Salonu', muzik_id, NULL
    ),
    -- Spor Kulübü etkinlikleri (2 adet)
    (
        'Kampüslararası Futbol Turnuvası',
        '8 üniversiteden 16 takımın katıldığı şampiyonluk turnuvası. Grup aşaması, çeyrek final, yarı final ve büyük final. Şampiyon takım kupa ve nakdi ödül kazanır.',
        400, '2026-05-18 09:00:00', 'Spor Kompleksi - Ana Saha', spor_id, NULL
    ),
    (
        'Mindfulness ve Yoga Buluşması',
        'Sınav döneminin stresini atmak için yoganın hem beden hem de zihin üzerindeki faydalarını deneyimleyeceğiniz sabah seansları. Tüm seviyeler için uygundur, mat getirebilirsiniz.',
        50, '2026-06-03 07:30:00', 'Spor Merkezi - Yoga Salonu', spor_id, NULL
    ),
    -- Bilim Kulübü etkinlikleri (2 adet)
    (
        'Kuantum Hesaplama: Geleceğe Bakış',
        'IBM ve Google''ın kuantum hesaplama çalışmaları üzerine bir akademisyen tarafından verilecek kapsamlı seminer. Kuantum üstünlüğü, qubit mimarisi ve pratik uygulamalar tartışılacak.',
        100, '2026-05-30 11:00:00', 'Fen Fakültesi - Fizik Amfisi', bilim_id, NULL
    ),
    (
        'Yapay Zeka Etiği Paneli',
        'Yapay zekanın toplumsal etkileri, önyargı sorunları ve etik kullanım üzerine akademisyenler, hukuk uzmanları ve sektör profesyonellerinin katılacağı çok disiplinli panel.',
        180, '2026-06-18 14:00:00', 'Sosyal Bilimler - Konferans Merkezi', bilim_id, NULL
    );

    RAISE NOTICE '15 etkinlik başarıyla eklendi!';
END
$$;

-- Sonuçları kontrol et
SELECT e."Id", e."Title", e."Capacity", e."EventDate", c."Name" AS "ClubName"
FROM "Events" e
JOIN "Clubs" c ON e."ClubId" = c."Id"
ORDER BY e."EventDate";
