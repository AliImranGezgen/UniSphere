// UniSphere notu: Club Service API cagrilarini tek noktadan yonetmek icin ayrildi.
import { api } from './api';
import type { Club } from '../types/club';

export const getClubs = async (): Promise<Club[]> => {
  const response = await api.get('clubs');
  return response.data;
};
