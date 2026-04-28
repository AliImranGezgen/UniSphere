// UniSphere notu: Club ile ilgili frontend tipleri backend sozlesmesiyle uyumlu tutulur.
export interface Club {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  logo?: string;
  shortDescription?: string;
  aboutText?: string;
  foundedYear?: number | null;
  contactEmail?: string;
  socialLinks?: string;
  website?: string;
}

export interface ClubRoleAssignment {
  clubId: number;
  userId: number;
  userName: string;
  userEmail: string;
  role: string;
  assignedAt: string;
}
