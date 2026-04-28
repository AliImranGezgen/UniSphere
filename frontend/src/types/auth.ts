// UniSphere notu: Auth ile ilgili frontend tipleri backend sozlesmesiyle uyumlu tutulur.
export interface User { 
  id: string; 
  email: string; 
  role: 'student' | 'club_admin' | 'system_admin' | 'Student' | 'ClubAdmin' | 'SystemAdmin'; 
  name: string; 
  createdAt?: string;
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
