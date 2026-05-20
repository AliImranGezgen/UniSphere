# UniSphere Deployment Topolojisi

Bu proje production ortaminda Docker Compose ile VPS uzerinde calisir. GitHub Actions `main` branch'e push geldiginde VPS'e SSH ile baglanir, repoyu gunceller, `.env` dosyasini GitHub Secrets degerlerinden uretir ve container'lari yeniden ayaga kaldirir.

## Public Portlar

- Frontend: `http://<sunucu_ip>:3000`
- Backend API: `http://<sunucu_ip>:8085`
- PostgreSQL: host tarafinda yalnizca `127.0.0.1:5432` olarak publish edilir.

## Container Ici Servisler

- `frontend`: Nginx, container port `80`
- `unisphere_api`: ASP.NET Core API, container port `8080`
- `db`: PostgreSQL, container port `5432`

## Istek Akisi

Tarayici once frontend container'ina gider:

```text
Browser -> http://<sunucu_ip>:3000
```

React uygulamasinin API istekleri relative `/api` adresine gider. Bu istekleri frontend container icindeki Nginx backend container'a proxy eder:

```text
Browser
  -> frontend Nginx :3000
  -> /api proxy
  -> unisphere_api:8080
  -> db:5432
```

Bu nedenle tarayicida Nginx'in 50x HTML sayfasi gorulurse problem genelde frontend'in backend container'a ulasamamasidir. Ilk bakilacak yerler:

```bash
docker compose ps
docker compose logs --tail=120 unisphere_api
docker compose logs --tail=80 frontend
docker compose config
```

## GitHub Secrets

Deployment workflow icin zorunlu secret'lar:

- `SERVER_IP`
- `SERVER_USER`
- `SERVER_PASSWORD`

Asagidaki secret'lar opsiyoneldir. GitHub Secrets icinde yoksa workflow guvenli fallback degerlerle VPS uzerinde `.env` dosyasini uretir:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `JWT_KEY`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `JWT_EXPIRE_MINUTES`

`JWT_KEY` HS256 icin en az 16 karakter olmalidir. Ornek:

```text
BuCokGizliVeUzunBirSifreOlmali123456!
```

## Deploy Sirasinda Yapilan Kontroller

Workflow su sirayla calisir:

1. VPS'te repo `origin/main` ile senkronlanir.
2. GitHub Secrets degerlerinden VPS'te `.env` uretilir.
3. `docker compose config` ile compose dosyasi dogrulanir.
4. Image'lar build edilir.
5. Once `db`, sonra `unisphere_api`, sonra `frontend` ayaga kaldirilir.
6. Backend `healthy` olana kadar beklenir.
7. Frontend Nginx icinden `/api/Event` proxy kontrolu yapilir.

Bu akista backend saglikli degilse deploy fail olur ve workflow loglarinda backend/frontend loglari gorunur.
