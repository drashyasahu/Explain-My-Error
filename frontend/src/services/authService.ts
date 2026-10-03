import api from './api';
import { AuthUser, ApiResponse } from '../types';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const res = await api.post<ApiResponse<AuthUser>>('/auth/login', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Login failed');
    }
    const user = res.data.data;
    localStorage.setItem('eme_token', user.token);
    localStorage.setItem('eme_user', JSON.stringify(user));
    return user;
  },

  register: async (payload: RegisterPayload): Promise<AuthUser> => {
    const res = await api.post<ApiResponse<AuthUser>>('/auth/register', payload);
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Registration failed');
    }
    const user = res.data.data;
    localStorage.setItem('eme_token', user.token);
    localStorage.setItem('eme_user', JSON.stringify(user));
    return user;
  },

  getMe: async (): Promise<AuthUser> => {
    const res = await api.get<ApiResponse<AuthUser>>('/auth/me');
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to fetch user');
    }
    return res.data.data;
  },

  logout: () => {
    localStorage.removeItem('eme_token');
    localStorage.removeItem('eme_user');
  },

  getStoredUser: (): AuthUser | null => {
    const raw = localStorage.getItem('eme_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('eme_token');
  }
};
