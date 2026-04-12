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

## 🛠️ Kurulum Seçenekleri

### 1. Docker ile Kurulum (Önerilen)

Sistemi tek bir komutla ayağa kaldırmak için bilgisayarınızda Docker'ın kurulu olması yeterlidir.

1.  Projeyi bilgisayarınıza klonlayın.
2.  Gerekli `.env` dosyalarını oluşturun.
3.  Terminalde ana dizindeyken şu komutu çalıştırın:
    ```bash
    docker-compose up -d --build
    ```
- **Frontend:** `http://localhost:3000`
- **Backend:** `http://localhost:8085`

### 2. Yerel Geliştirme Ortamı (Docker Olmadan)

Docker kullanmadan, projeyi doğrudan kendi makinenizde (Windows/MacOS/Linux) çalıştırmak için aşağıdaki adımları izleyin.

#### Adım 1: Uzak Veritabanı Bağlantısı (SSH Tunnel)
Veritabanı uzak sunucuda olduğu için bir SSH tüneli açmanız gerekir:
```powershell
ssh -L 5432:localhost:5432 root@157.180.82.142
# Şifre: yenice
```
*Not: Bu terminal penceresini çalışma boyunca açık tutun.*

#### Adım 2: Backend (API) Başlatma
1. `backend` dizinine gidin.
2. HTTP profili ile projeyi çalıştırın:
   ```powershell
   dotnet run --launch-profile http
   ```
- **API Adresi:** `http://localhost:5182`
- **Swagger:** `http://localhost:5182/swagger`

#### Adım 3: Frontend (React) Başlatma
1. `frontend` dizinine gidin.
2. Bağımlılıkları yükleyin (ilk seferde): `npm install`
3. Projeyi başlatın:
   ```powershell
   # Windows PowerShell yetki sorunu yaşayanlar için:
   npm.cmd run dev
   ```
- **Frontend Adresi:** `http://localhost:5173` (veya 5174)

---

## 👨‍💻 Geliştirici Ekibi

- **Frontend & DevOps:** Ali, Emir
- **Backend:** Yusuf, Kadir
- **Dokümantasyon & Frontend:** Ömer

