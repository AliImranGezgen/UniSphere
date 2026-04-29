import { api } from './api';
import type { Club } from '../types/club';
import type { Event } from '../types/event';

export interface DiscoveryCategory {
  key: string;
  label: string;
}

export interface DiscoveryAnnouncement {
  id: number;
  message: string;
  type: string;
  createdAt: string;
}

type DiscoveryClub = {
  clubId: number;
  name: string;
  description: string;
  shortDescription: string;
  logo: string;
  memberCount: number;
  createdAt: string;
};

const mapClub = (club: DiscoveryClub): Club => ({
  id: club.clubId,
  name: club.name,
  description: club.description,
  shortDescription: club.shortDescription,
  logo: club.logo,
  memberCount: club.memberCount,
  createdAt: club.createdAt,
});

export const discoveryService = {
  getPopularEvents: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('discovery/popular-events');
    return response.data;
  },

  getNewEvents: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('discovery/new-events');
    return response.data;
  },

  getCategories: async (): Promise<DiscoveryCategory[]> => {
    const response = await api.get<DiscoveryCategory[]>('discovery/categories');
    return response.data;
  },

  getPopularClubs: async (): Promise<Club[]> => {
    const response = await api.get<DiscoveryClub[]>('discovery/popular-clubs');
    return response.data.map(mapClub);
  },

  getNewClubs: async (): Promise<Club[]> => {
    const response = await api.get<DiscoveryClub[]>('discovery/new-clubs');
    return response.data.map(mapClub);
  },

  getAnnouncements: async (): Promise<DiscoveryAnnouncement[]> => {
    const response = await api.get<DiscoveryAnnouncement[]>('discovery/announcements');
    return response.data;
  },
};
