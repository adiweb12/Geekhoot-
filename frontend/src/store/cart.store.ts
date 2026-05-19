import { create } from 'zustand';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stock: number;
  };
}

interface CartStore {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      set({ items: data.data, total: data.total, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      await api.post('/cart', { productId, quantity });
      toast.success('Added to cart!');
      get().fetchCart();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to add to cart';
      toast.error(msg);
    }
  },

  updateItem: async (id, quantity) => {
    try {
      await api.patch(`/cart/${id}`, { quantity });
      get().fetchCart();
    } catch {
      toast.error('Failed to update cart');
    }
  },

  removeItem: async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      toast.success('Removed from cart');
      get().fetchCart();
    } catch {
      toast.error('Failed to remove item');
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ items: [], total: 0 });
    } catch {
      toast.error('Failed to clear cart');
    }
  },
}));
