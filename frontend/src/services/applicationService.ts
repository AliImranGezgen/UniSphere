// UniSphere notu: Application Service API cagrilarini tek noktadan yonetmek icin ayrildi.
import { api } from './api';
import type { Application, ApplyToEventResponse } from '../types/application';

export const applicationService = {
  applyToEvent: async (eventId: number): Promise<ApplyToEventResponse> => {
    const response = await api.post<ApplyToEventResponse>(`applications/events/${eventId}/apply`);
    return response.data;
  },

  getMyApplications: async (): Promise<Application[]> => {
    const response = await api.get<Application[]>('applications/me');
    return response.data;
  },
};
