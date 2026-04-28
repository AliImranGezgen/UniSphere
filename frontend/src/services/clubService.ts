// UniSphere notu: Club Service API cagrilarini tek noktadan yonetmek icin ayrildi.
import { api } from './api';
import type { Club, ClubRoleAssignment } from '../types/club';

export const getClubs = async (): Promise<Club[]> => {
  const response = await api.get('clubs');
  return response.data;
};

export const getClubById = async (clubId: number): Promise<Club> => {
  const response = await api.get(`clubs/${clubId}`);
  return response.data;
};

export interface CreateClubData {
  name: string;
  description: string;
  logo?: string;
  shortDescription?: string;
  aboutText?: string;
  foundedYear?: number;
  contactEmail?: string;
  socialLinks?: string;
  website?: string;
}

export const createClub = async (data: CreateClubData): Promise<{ message: string; clubId: number }> => {
  const response = await api.post('clubs', data);
  return response.data;
};

export const updateClub = async (clubId: number, data: CreateClubData): Promise<Club> => {
  const response = await api.put(`clubs/${clubId}`, data);
  return response.data;
};

export const assignPresident = async (clubId: number, userId: number): Promise<{ message: string }> => {
  const response = await api.post(`clubs/${clubId}/assign-president`, { userId });
  return response.data;
};

export interface AssignRoleData {
  userId: number;
  role: string;
}

export const assignClubRole = async (clubId: number, data: AssignRoleData): Promise<{ message: string }> => {
  const response = await api.post(`clubs/${clubId}/assign-role`, data);
  return response.data;
};

export const revokeClubRole = async (clubId: number, data: AssignRoleData): Promise<{ message: string }> => {
  const response = await api.delete(`clubs/${clubId}/revoke-role`, { data });
  return response.data;
};

export const getClubRoleAssignments = async (clubId: number): Promise<ClubRoleAssignment[]> => {
  const response = await api.get(`clubs/${clubId}/roles`);
  return response.data;
};
