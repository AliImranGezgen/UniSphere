// UniSphere notu: Auth Service API cagrilarini tek noktadan yonetmek icin ayrildi.
import { api } from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

export const authService = {
  // Kullanıcı girişi: Credentials alır, başarılıysa token döner ve localStorage'a kaydeder.
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('Auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token); // Token'ı sonraki isteklerde kullanmak üzere sakla
    }
    return response.data;
  },

  // Yeni kullanıcı kaydı: Kullanıcı bilgilerini backend'e gönderir.
  register: async (data: RegisterData): Promise<string> => {
    const response = await api.post<string>('Auth/register', data);
    return response.data;
  },

  // Çıkış yapma: Kayıtlı token'ı temizler.
  logout: () => {
    localStorage.removeItem('token');
  },

  // Kayıtlı token'ı getirir.
  getToken: () => {
    return localStorage.getItem('token');
  },

  getProfile: async (): Promise<User & { createdAt: string }> => {
    const response = await api.get<User & { createdAt: string }>('Auth/profile');
    return response.data;
  },

  // Kullanıcının oturum açıp açmadığını kontrol eder.
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
