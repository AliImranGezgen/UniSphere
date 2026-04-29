// UniSphere notu: Application ile ilgili frontend tipleri backend sozlesmesiyle uyumlu tutulur.
export type ApplicationStatus = 'Pending' | 'Approved' | 'Waitlisted' | 'Cancelled' | 'CheckedIn';

export interface Application {
  id: number;
  eventId: number;
  title: string;
  clubName: string;
  eventDate: string;
  status: ApplicationStatus;
}

export interface ApplyToEventResponse {
  eventId: number;
  status: ApplicationStatus;
  message: string;
}
