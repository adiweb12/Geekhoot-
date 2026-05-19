import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  houseName?: string;
  street?: string;
  landmark?: string;
  district?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),

      login: async (identifier, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { identifier, password });
          if (data.accessToken) localStorage.setItem('access_token', data.accessToken);
          set({ user: data.user, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } finally {
          localStorage.removeItem('access_token');
          set({ user: null });
        }
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user });
        } catch {
          set({ user: null });
          localStorage.removeItem('access_token');
        }
      },
    }),
    { name: 'geekhoot-auth', partialize: (state) => ({ user: state.user }) }
  )
);
