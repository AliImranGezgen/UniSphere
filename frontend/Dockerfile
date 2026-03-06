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

# 2. Aşama: Production (Yayın)
# Hafif ve hızlı Nginx Alpine sürümü
FROM nginx:stable-alpine

# Vite'ın ürettiği statik dosyaları Nginx'in yayın klasörüne taşıyoruz
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx için portu belirtiyoruz
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]