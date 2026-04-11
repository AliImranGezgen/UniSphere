import { api } from './api';
import type { Event } from '../types/event';

export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get('/events');
  return response.data;
};

export const createEvent = async (data: Partial<Event>) => {
  const response = await api.post('/events', data);
  return response.data;
};

export const deleteEvent = async (id: number) => {
  await api.delete('/events/' + id);
};
