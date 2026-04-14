# UniSphere notu: Frontend imaji build ve yayin adimlarini tek yerde tarif eder.
# 1. Aşama: Build (İnşa)
FROM node:20-alpine AS build
WORKDIR /app

# Sadece paket listelerini kopyalayıp install yapıyoruz (Cache avantajı için)
COPY package*.json ./
RUN npm install

# Tüm proje dosyalarını kopyala
COPY . .

# Vite projesini build et (Çıktı 'dist' klasörüne gider)
RUN npm run build

FROM nginx:stable-alpine
# Hazırladığımız özel Nginx konfigürasyonunu içeri aktarıyoruz
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Vite'ın ürettiği statik dosyaları Nginx'in yayın klasörüne taşıyoruz
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]