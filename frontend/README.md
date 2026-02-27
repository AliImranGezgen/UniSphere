# UniSphere Frontend

Bu klasör React + Vite + TypeScript kullanılarak oluşturulmuştur.

## Kullanılan Teknolojiler

- React (UI)
- React Router (Sayfa geçişleri)
- Zustand (Global State Management)
- Axios (API istekleri için)

---

## Klasör Yapısı

src/
- pages/ → Sayfa bileşenleri
- router/ → Routing yönetimi
- store/ → Global state (Zustand)
- services/ → Backend API bağlantıları

---

## Routing Mantığı

"/" → Root path (Ana giriş noktası)
"/events" → Etkinlik sayfası
"/clubs" → Kulüp sayfası
"/dashboard" → Kullanıcı paneli

Root ("/") nedir?
Web uygulamasının başlangıç adresidir.
Örn: http://localhost:5173/

---

## State Yönetimi

Zustand kullanılmıştır.
Kullanıcı bilgisi global olarak tutulur.

Not:
State şu an memory tabanlıdır.
Sayfa yenilenirse sıfırlanır.
İleride persist middleware eklenebilir.

---

## Backend Bağlantısı

API istekleri src/services/api.ts dosyasından yapılacaktır.
Şu an baseURL local backend adresidir.
Production ortamında VPS adresi ile değiştirilecektir.