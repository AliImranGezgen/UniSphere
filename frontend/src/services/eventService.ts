// UniSphere notu: Event Service API cagrilarini tek noktadan yonetmek icin ayrildi.
import { api } from './api';
import type { Event } from '../types/event';

export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get('event');
  return response.data;
};

export const getEventById = async (id: number): Promise<Event> => {
  const response = await api.get(`event/${id}`);
  return response.data;
};

export const createEvent = async (data: Partial<Event>) => {
  const response = await api.post('event', data);
  return response.data;
};

export const createEventForm = async (data: FormData): Promise<Event> => {
  const response = await api.post<Event>('event', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateEventForm = async (id: number, data: FormData): Promise<Event> => {
  const response = await api.put<Event>(`event/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteEvent = async (id: number) => {
  await api.delete('event/' + id);
};
