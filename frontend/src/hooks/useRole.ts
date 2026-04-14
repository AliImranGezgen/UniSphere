// UniSphere notu: Use Role hook'u ortak kullanilan durum ve yetki kontrolunu sadelestirir.
import { useAuth } from './useAuth';
export const useRole = () => {
  const { user } = useAuth();
  return { role: user?.role || 'guest' };
};
