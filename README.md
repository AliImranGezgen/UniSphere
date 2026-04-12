![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![.NET](https://img.shields.io/badge/.NET-Backend-purple?logo=dotnet)
![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)

# 🌐 UniSphere

UniSphere, modern ve dinamik bir kampüs etkinlik ve topluluk yönetim sistemidir. Öğrencilerin, kulüp yöneticilerinin ve sistem yöneticilerinin kampüs hayatını tek bir platform üzerinden yönetmesini ve takip etmesini sağlar.

## 🚀 Proje Mimarisi

Projemiz, modern web standartlarına uygun olarak **Monorepo** mantığıyla geliştirilmektedir ve üç ana bileşenden oluşur:

- **Frontend:** React (Vite) kullanılarak geliştirilmiş, hızlı ve reaktif kullanıcı arayüzü.
- **Backend:** C# .NET Core ile inşa edilmiş, JWT kimlik doğrulamalı güçlü ve güvenli REST API.
- **Database:** PostgreSQL veritabanı.

> **Mimari Detaylar ve Sunucu Yapılandırması:** Sistemin canlı sunucudaki port akışları ve Docker network mimarisi için lütfen [Deployment Topolojisi](./DEPLOYMENT.md) belgesini inceleyiniz.

---

## 📁 Proje Yapısı

```text
unisphere/
│
├── backend/              # .NET API
│   ├── UniSphere.API
│   ├── UniSphere.Core
│   ├── UniSphere.Infrastructure
│   └── UniSphere.Tests
│
├── frontend/             # React (Vite)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docker-compose.yml    # Tüm servisleri ayağa kaldırır
├── DEPLOYMENT.md         # Deployment topolojisi
└── README.md             # Ana dokümantasyon
```

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
