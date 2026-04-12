import { api } from './api';
import type { Club } from '../types/club';

export const getClubs = async (): Promise<Club[]> => {
  const response = await api.get('clubs');
  return response.data;
};
