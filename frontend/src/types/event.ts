// UniSphere notu: Event ile ilgili frontend tipleri backend sozlesmesiyle uyumlu tutulur.
export interface Event {
  eventId: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  capacity: number;
  clubId: number;
  clubName: string;
  posterImageUrl?: string | null;
}
