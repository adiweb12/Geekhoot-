'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, Truck } from 'lucide-react';
import api from '@/lib/api';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data.data as Order[];
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 mx-auto text-[var(--fg-muted)] mb-4" />
        <h2 className="text-xl font-bold mb-2">Sign in to view orders</h2>
        <Link href="/auth/login"><Button size="lg">Sign In</Button></Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold mb-6">My Orders</h1>
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl mb-3" />)}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 mx-auto text-[var(--fg-muted)] mb-4" />
        <h2 className="text-xl font-bold mb-2">No orders yet</h2>
        <p className="text-[var(--fg-muted)] mb-6">Your order history will appear here after you place an order via WhatsApp.</p>
        <Link href="/products"><Button size="lg">Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-3">
        {data.map((order) => (
          <div key={order.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                <Image src={order.product.images[0]} alt={order.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm line-clamp-1">{order.product.name}</h3>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full shrink-0', ORDER_STATUS_COLORS[order.status])}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <p className="text-xs text-[var(--fg-muted)] mt-0.5">Qty: {order.quantity} · {formatDate(order.createdAt)}</p>
                <p className="font-semibold text-sm mt-1 text-brand-500">{formatPrice(order.totalPrice)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)]">
                <Truck className="w-3.5 h-3.5" />
                {order.trackingId ? (
                  <span>Tracking: <span className="font-medium text-[var(--fg)]">{order.trackingId}</span></span>
                ) : (
                  <span>Tracking not yet available</span>
                )}
              </div>
              <Link
                href={`/tracking/${order.id}`}
                className="flex items-center gap-1 text-xs text-brand-500 font-medium hover:gap-1.5 transition-all"
              >
                Track Order <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
