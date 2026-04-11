export interface User { 
  id: string; 
  email: string; 
  role: 'student' | 'club_admin' | 'system_admin'; 
  name: string; 
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

