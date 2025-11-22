@@ -1,24 +1,38 @@
import axios from 'axios';
import type { Event, Alert, Rule, User, LoginCredentials, AuthToken } from '../types';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors without auto-redirecting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on login errors - let the component handle it
    // Only redirect on 401 if we're not already on the login page
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthToken> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData: any): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
// Events API
export const eventsAPI = {
  getEvents: async (params?: any) => {
    const response = await api.get('/events', { params });
    return response.data;
  },
  getEvent: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  createEvent: async (event: any): Promise<Event> => {
    const response = await api.post('/events', event);
    return response.data;
  },
};
// Alerts API
export const alertsAPI = {
  getAlerts: async (params?: any) => {
    const response = await api.get('/alerts', { params });
    return response.data;
  },
  getAlert: async (id: string): Promise<Alert> => {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },
  acknowledgeAlert: async (id: string) => {
    const response = await api.patch(`/alerts/${id}/acknowledge`);
    return response.data;
  },
};
// Rules API
export const rulesAPI = {
  getRules: async (): Promise<Rule[]> => {
    const response = await api.get('/rules');
    return response.data;
  },
  getRule: async (id: string): Promise<Rule> => {
    const response = await api.get(`/rules/${id}`);
    return response.data;
  },
  createRule: async (rule: any): Promise<Rule> => {
    const response = await api.post('/rules', rule);
    return response.data;
  },
  updateRule: async (id: string, rule: any): Promise<Rule> => {
    const response = await api.put(`/rules/${id}`, rule);
    return response.data;
  },
  deleteRule: async (id: string) => {
    await api.delete(`/rules/${id}`);
  },
};
export default api;
