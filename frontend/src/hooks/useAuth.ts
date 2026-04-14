// UniSphere notu: Use Auth hook'u ortak kullanilan durum ve yetki kontrolunu sadelestirir.
import { useState } from 'react';
import type { User } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  
  const login = (role: User['role']) => setUser({ id: '1', email: 'test@test.com', name: 'Test User', role });
  const logout = () => setUser(null);

  return { user, isAuthenticated, login, logout };
};
