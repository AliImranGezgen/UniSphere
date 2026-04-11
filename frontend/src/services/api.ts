import axios from 'axios';
import { API_URL } from '../utils/constants';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});
