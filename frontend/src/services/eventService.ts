import { api } from './api';
import type { Event } from '../types/event';

export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get('/event');
  return response.data;
};

export const getEventById = async (id: number): Promise<Event> => {
  const response = await api.get(`/event/${id}`);
  return response.data;
};

export const createEvent = async (data: Partial<Event>) => {
  const response = await api.post('/event', data);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  await api.delete('/event/' + id);
};
