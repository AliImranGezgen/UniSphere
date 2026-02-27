/**
 * AppRouter
 *
 * Bu dosya uygulamanın sayfa geçişlerini (routing) yönetir.
 *
 * "/"        → Login sayfası (root path)
 * "/events"  → Etkinlikler listesi
 * "/clubs"   → Kulüp listesi
 * "/dashboard" → Kullanıcı paneli
 *
 * Root ("/") nedir?
 * "/" web uygulamasının ana giriş noktasıdır.
 * Örneğin: http://localhost:5173/ yazıldığında Login sayfası açılır.
 *
 * React Router sayesinde sayfalar arasında
 * sayfa yenilenmeden geçiş yapılır (SPA mantığı).
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Events from "../pages/Events"
import Clubs from "../pages/Clubs"
import Dashboard from "../pages/Dashboard"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/events" element={<Events />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}