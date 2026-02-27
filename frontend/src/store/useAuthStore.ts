/**
 * useAuthStore (Zustand Global State)
 *
 * Bu store uygulama genelinde kullanıcı bilgisini tutar.
 *
 * Neden global state?
 * Kullanıcı giriş yaptıktan sonra bu bilgi
 * farklı sayfalarda (Dashboard, Events vb.) kullanılmalıdır.
 *
 * Memory tabanlıdır.
 * Sayfa yenilenirse state sıfırlanır.
 *
 * İleride persist middleware eklenerek
 * localStorage'da saklanabilir.
 */

import { create } from "zustand"

interface AuthState {
  userId: string | null
  role: "Student" | "ClubAdmin" | null
  setUser: (userId: string, role: "Student" | "ClubAdmin") => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  role: null,
  setUser: (userId, role) => set({ userId, role }),
  logout: () => set({ userId: null, role: null })
}))