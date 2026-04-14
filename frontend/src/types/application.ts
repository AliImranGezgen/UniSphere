// UniSphere notu: Application ile ilgili frontend tipleri backend sozlesmesiyle uyumlu tutulur.
export interface Application { id: string; eventId: string; studentId: string; status: 'pending'|'approved'|'rejected'; }
