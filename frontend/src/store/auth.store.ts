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
  hydrated: boolean;
  setUser: (user: User | null) => void;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      hydrated: false,

      setUser: (user) => set({ user }),
      setHydrated: () => set({ hydrated: true }),

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

      // Called on app init to validate persisted user against server
      fetchMe: async () => {
        const token = localStorage.getItem('access_token');
        if (!token && !get().user) return;
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user });
        } catch {
          // Token expired but refresh cookie may be valid — api interceptor handles it
          // Only clear if we get a definitive 401 after refresh attempt
          const { user } = get();
          if (!user) {
            localStorage.removeItem('access_token');
          }
        }
      },
    }),
    {
      name: 'geekhoot-auth',
      // Persist full user object so refresh doesn't lose session
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
