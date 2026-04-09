# 🌐 UniSphere

UniSphere, modern ve dinamik bir kampüs etkinlik ve topluluk yönetim sistemidir. Öğrencilerin, kulüp yöneticilerinin ve sistem yöneticilerinin kampüs hayatını tek bir platform üzerinden yönetmesini ve takip etmesini sağlar.

## 🚀 Proje Mimarisi

Projemiz, modern web standartlarına uygun olarak **Monorepo** mantığıyla geliştirilmektedir ve üç ana bileşenden oluşur:

- **Frontend:** React (Vite) kullanılarak geliştirilmiş, hızlı ve reaktif kullanıcı arayüzü.
- **Backend:** C# .NET Core ile inşa edilmiş, JWT kimlik doğrulamalı güçlü ve güvenli REST API.
- **Database:** PostgreSQL veritabanı.

> **Mimari Detaylar ve Sunucu Yapılandırması:** Sistemin canlı sunucudaki port akışları ve Docker network mimarisi için lütfen [Deployment Topolojisi](./DEPLOYMENT.md) belgesini inceleyiniz.

## 🛠️ Hızlı Kurulum (Docker ile)

Sistemi tek bir komutla ayağa kaldırmak için bilgisayarınızda Docker'ın kurulu olması yeterlidir.

1.  Projeyi bilgisayarınıza klonlayın.
2.  Gerekli `.env` dosyalarını oluşturun (Secret keyler ve DB şifreleri için).
3.  Terminalde ana dizindeyken şu komutu çalıştırın:

```bash
docker-compose up -d --build
```

- **Frontend Arayüzü:** `http://localhost:3000`
- **Backend API:** `http://localhost:8085`

## 👨‍💻 Geliştirici Ekibi

- **Frontend & DevOps:** Ali, Emir
- **Backend:** Yusuf, Kadir
- **Dokümantasyon & Frontend:** Ömer
