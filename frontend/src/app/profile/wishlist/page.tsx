'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface WishlistItem {
  id: string;
  productId: string;
  product: { id: string; name: string; slug: string; price: number; images: string[]; stock: number };
}

export default function WishlistPage() {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/users/wishlist');
      return data.data as WishlistItem[];
    },
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => api.delete(`/users/wishlist/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 mx-auto text-[var(--fg-muted)] mb-4" />
        <h2 className="text-xl font-bold mb-4">Sign in to see your wishlist</h2>
        <Link href="/auth/login"><Button size="lg">Sign In</Button></Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="skeleton h-8 w-32 rounded-xl mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 mx-auto text-[var(--fg-muted)] mb-4" />
        <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-[var(--fg-muted)] mb-6">Save products you love and order them later.</p>
        <Link href="/products"><Button size="lg">Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-6 h-6 text-red-500" />
        <h1 className="font-display text-2xl font-bold">Wishlist</h1>
        <span className="text-sm text-[var(--fg-muted)]">({data.length} items)</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden group hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all">
            <Link href={`/products/${item.product.slug}`}>
              <div className="relative aspect-square bg-[var(--bg-secondary)]">
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            </Link>
            <div className="p-3 space-y-2">
              <Link href={`/products/${item.product.slug}`}>
                <h3 className="text-sm font-medium line-clamp-2 hover:text-brand-500 transition-colors">{item.product.name}</h3>
              </Link>
              <p className="font-bold text-brand-500">{formatPrice(item.product.price)}</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => addItem(item.product.id)}
                  disabled={item.product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-secondary)] hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-500 border border-[var(--border)] transition-colors disabled:opacity-50"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                </button>
                <button
                  onClick={() => removeMutation.mutate(item.productId)}
                  className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-[var(--border)] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
