# 🗺️ UniSphere Deployment Topolojisi

![UniSphere Sistem Mimarisi](./mimari_2.png)

Bu belge, UniSphere projesinin canlı sunucu (Production) üzerindeki ağ mimarisini, port yapılandırmalarını ve veri akışını açıklamaktadır. Proje, Docker konteynerleri üzerinden ayağa kaldırılmaktadır.

## 1. Port Haritası (Public ve Container İçi Portlar)

Sistemdeki servislerin dış dünyaya açık olan (Public) ve sadece Docker'ın kendi iç ağında (Container içi) konuşan portları aşağıdaki gibidir:

- **Frontend (unisphere_web):**
  - **Public Port (Dış Kapı):** `3000`
  - **Container İçi Port:** `80` (Nginx tarafından dinlenir)
- **Backend API (unisphere_api):**
  - **Public Port (Dış Kapı):** `8085`
  - **Container İçi Port:** `8080` (Kestrel / C# .NET tarafından dinlenir)
- **Database (unisphere_db):**
  - **Public Port:** Kapalı (Dışarıya kapalıdır, güvenlik için izole edilmiştir).
  - **Container İçi Port:** `5432` (Sadece API konteyneri erişebilir).

---

## 2. İstek Akışı (Frontend → Backend)

Kullanıcının tarayıcısından çıkan bir isteğin veritabanına ulaşana kadar izlediği yol şu şekildedir:

1.  **Kullanıcı Girişi:** Kullanıcı tarayıcıdan `http://<sunucu_ip>:3000` adresine girer.
2.  **Arayüzün Yüklenmesi:** İstek, Frontend konteynerindeki Nginx'e (Port 80) ulaşır ve React dosyaları kullanıcının tarayıcısına gönderilir.
3.  **API İsteği:** Kullanıcı bir işlem yaptığında (örn. Giriş Yap), React uygulaması doğrudan Backend'in dışarıya açık olan adresine (`http://<sunucu_ip>:8085/api/...`) bir HTTP isteği atar.
4.  **Veritabanı İşlemi:** Backend API, bu isteği alır ve Docker iç ağı üzerinden (güvenli bir şekilde) PostgreSQL veritabanına (`unisphere_db:5432`) bağlanarak veriyi çeker/yazar.

---

## 3. Nginx ve Reverse Proxy Durumu

Sistem mimarimizde canlı sunucunun ana işletim sisteminde (Host) bağımsız bir merkezi Nginx / Reverse Proxy kurulu **değildir**. Trafik doğrudan Docker portlarına gelmektedir.

Ancak **konteynerize edilmiş (containerized)** bir Nginx yapısı mevcuttur:

- Frontend uygulamasını (React/Vite) canlıya almak için, Frontend Dockerfile'ı içinde bir Nginx imajı kullanılmıştır.
- Bu gömülü Nginx, sadece statik Frontend dosyalarını içeride Port 80 üzerinden yayınlama görevini üstlenir.
- Trafiği `/api` ve `/` olarak dağıtan merkezi bir "Trafik Polisi" yoktur; her iki servis de kendi dış portları üzerinden (3000 ve 8085) bağımsız olarak çalışır.

* **Trafiği Yönetimi:** Trafiği `/api` ve `/` olarak dağıtan merkezi bir "Trafik Polisi" yoktur; her iki servis de kendi dış portları üzerinden (3000 ve 8085) bağımsız olarak çalışır.
* **SPA Desteği:** Ayrıca React Router (SPA) yapısının bozulmaması ve sayfa yenilemelerinde 404 hatası alınmaması için Nginx üzerinde `try_files` yönlendirmesi yapılandırılmıştır.
