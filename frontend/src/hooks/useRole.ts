import { useAuth } from './useAuth';
export const useRole = () => {
  const { user } = useAuth();
  return { role: user?.role || 'guest' };
};
