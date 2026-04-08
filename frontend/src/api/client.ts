import axios from 'axios';
import { config as appConfig } from '../config';

const api = axios.create({
  baseURL: appConfig.apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
