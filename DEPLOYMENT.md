# UniSphere Deployment Topolojisi

Bu belge, UniSphere projesinin canlı sunucu (Production) üzerindeki Docker tabanlı ağ mimarisini, port yönlendirmelerini ve istek akışını açıklar. Sistem, güvenlik amacıyla izole edilmiş container'lar halinde çalışmaktadır.

![Sistem Mimarisi](./mimari_2.png)

## 1. Port Yapılandırması

### Dışarıya Açık Portlar (Public Ports)

Sunucuya dış dünyadan (tarayıcıdan veya dış sistemlerden) gelen HTTP isteklerini karşılayan portlardır:

- **Port 3000:** Frontend web arayüzüne erişim portu. (İstekler container içindeki Port 80'e yönlendirilir).
- **Port 8085:** Backend (C# API) servisine erişim portu. (İstekler container içindeki Port 8080'e yönlendirilir).

### Container İçi Portlar (Internal/Docker Network)

Güvenlik gereği dış dünyaya kapalı olan ve sadece Docker'ın kendi iç ağında (default bridge network) birbiriyle konuşan servisler:

- **Port 5432 (PostgreSQL):** `db` servisi. Dışarıdan erişime tamamen kapalıdır (Public port mapping iptal edilmiştir). Sadece `unisphere_api` container'ı bu veritabanına erişebilir.
- **Port 8080:** Backend API'nin container içindeki çalışma portu.
- **Port 80:** Frontend'in container içindeki çalışma portu.

## 2. İstek Akışı (Frontend → Backend → DB)

1. **İstemci (Client) Erişimi:** Kullanıcı tarayıcı üzerinden `http://[Sunucu_IP]:3000` adresine girerek React arayüzüne ulaşır.
2. **Frontend → Backend İletişimi:** Tarayıcıda çalışan Frontend uygulaması, veri okuma/yazma işlemleri için Backend'in dışarıya açık olan `http://[Sunucu_IP]:8085` (API) adresine istek atar.
3. # **Backend → Veritabanı İletişimi:** Backend (`unisphere_api`), dışarıdan gelen isteği alır, işler ve Docker internal network üzerinden `db` isimli veritabanı container'ına (gizli `.env` değişkenlerindeki connection string ile) bağlanarak veri işlemini tamamlar.

# 🗺️ UniSphere Deployment Topolojisi

![UniSphere Sistem Mimarisi](./mimari_2.png)

Bu belge, UniSphere projesinin canlı sunucu (Production) üzerindeki ağ mimarisini, port yapılandırmalarını ve veri akışını açıklamaktadır. Proje Docker konteynerleri üzerinden çalışmaktadır.

---

## 1. Port Haritası (Public ve Container İçi Portlar)

Sistemdeki servislerin dış dünyaya açık olan (Public) ve Docker iç ağına özel portları aşağıdaki gibidir:

### Frontend (unisphere_web)

- **Public Port:** `3000`
- **Container Port:** `80` (Nginx static file server)

### Backend API (unisphere_api)

- **Public Port:** `8080`
- **Container Port:** `8080` (.NET Kestrel server)

### Database (unisphere_db)

- **Public Port:** `5432` ⚠️ (şu an dışarı açık)
- **Container Port:** `5432` (PostgreSQL)

> ⚠️ Production ortamında güvenlik için database portunun dışarıya kapatılması önerilir.

---

## 2. İstek Akışı (Frontend → Backend → Database)

Kullanıcının tarayıcısından başlayan veri akışı şu şekildedir:

1. **Kullanıcı Girişi** Kullanıcı `http://<sunucu_ip>:3000` adresine erişir.

2. **Frontend Sunumu** İstek, frontend container içindeki Nginx’e (port 80) ulaşır ve React uygulaması yüklenir.

3. **API İsteği** Frontend uygulaması backend’e doğrudan HTTP isteği gönderir:  
   `http://<sunucu_ip>:8080/api/...`

4. **Backend İşlemi** Backend isteği işler ve veritabanına bağlanır.

5. **Database Erişimi** Backend, Docker internal network üzerinden şu bağlantıyı kullanır:

```text
Host=db
Port=5432
```

---

## 3. Docker Network Yapısı

Tüm servisler aynı Docker ağı üzerinde çalışmaktadır.
Servisler birbirine container adı ile erişir:

- **Backend** → `db:5432`
- **Frontend** → backend’e public URL üzerinden erişir

Bu yapı sayesinde servisler IP yerine servis adıyla haberleşir.

---

## 4. Nginx ve Reverse Proxy Durumu

Sistemde host seviyesinde merkezi bir reverse proxy (Nginx) bulunmamaktadır.
Trafik doğrudan container portlarına yönlenmektedir:

- **Frontend** → `:3000`
- **Backend** → `:8080`

**Container içi Nginx:** Frontend container içinde bir Nginx bulunmaktadır. Bu Nginx:

- React build dosyalarını sunar
- SPA routing için `try_files` kullanır

> **Önemli:** `/api` routing için merkezi proxy yoktur. Frontend backend’e doğrudan istek atar.

---

## 5. Genel Sistem Akışı

```text
[Browser]
   |
   | :3000
   v
[Frontend (Nginx)]
   |
   | HTTP
   v
[Backend (.NET API)]
   |
   | TCP (Docker Network)
   v
[PostgreSQL]
```

> > > > > > > 0cb596d0d413d0c042cdb2174793f8af6af22593
