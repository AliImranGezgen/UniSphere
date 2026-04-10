// import { api } from './api';

export const authService = {
  login: async (credentials: Record<string, unknown>) => {
    // const response = await api.post('/auth/login', credentials);
    // return response.data;
    console.log('Login mock for', credentials);
  }
};
