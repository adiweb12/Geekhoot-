'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle, ArrowLeft, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { Order, ORDER_STATUS_LABELS } from '@/types';
import { formatDate, formatPrice, cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'] as const;

const STEP_ICONS = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PACKED: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
};

export default function TrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['tracking', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/tracking/${orderId}`);
      return data.data as Order & { trackingUpdates: { id: string; status: string; description: string; location?: string; createdAt: string }[] };
    },
    enabled: !!user,
    refetchInterval: 60_000, // auto-refresh every minute
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 mx-auto text-[var(--fg-muted)] mb-4" />
        <p className="font-semibold mb-4">Sign in to track your order</p>
        <Link href="/auth/login" className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-medium text-sm">Sign In</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="skeleton h-40 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <XCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <p className="text-[var(--fg-muted)] mb-6">This order doesn't exist or doesn't belong to your account.</p>
        <Link href="/orders" className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-medium text-sm">My Orders</Link>
      </div>
    );
  }

  const isCancelled = data.status === 'CANCELLED';
  const currentStepIdx = isCancelled ? -1 : STATUS_STEPS.indexOf(data.status as typeof STATUS_STEPS[number]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      <h1 className="font-display text-2xl font-bold mb-1">Order Tracking</h1>
      <p className="text-sm text-[var(--fg-muted)] mb-6">Order ID: <span className="font-mono text-[var(--fg)]">{data.id.slice(0, 12)}…</span></p>

      {/* Product Summary */}
      <div className="flex gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] mb-6">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
          <Image src={data.product.images[0]} alt={data.product.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm line-clamp-2">{data.product.name}</h2>
          <p className="text-xs text-[var(--fg-muted)] mt-0.5">Qty: {data.quantity}</p>
          <p className="font-bold text-brand-500 mt-1">{formatPrice(data.totalPrice)}</p>
        </div>
        <div className={cn(
          'self-start text-xs font-semibold px-2.5 py-1 rounded-full shrink-0',
          isCancelled
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            : data.status === 'DELIVERED'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
        )}>
          {ORDER_STATUS_LABELS[data.status]}
        </div>
      </div>

      {/* Tracking ID */}
      {data.trackingId && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] mb-6">
          <Truck className="w-5 h-5 text-brand-500 shrink-0" />
          <div>
            <p className="text-xs text-[var(--fg-muted)]">Tracking ID</p>
            <p className="font-mono font-semibold">{data.trackingId}</p>
            {data.courier && <p className="text-xs text-[var(--fg-muted)] mt-0.5">via {data.courier}</p>}
          </div>
        </div>
      )}

      {/* Progress Stepper */}
      {!isCancelled && (
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] mb-6">
          <h3 className="font-semibold mb-5">Delivery Progress</h3>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[var(--border)]" />
            <div
              className="absolute left-4 top-4 w-0.5 bg-brand-500 transition-all duration-700"
              style={{ height: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
            />

            <div className="space-y-6 relative">
              {STATUS_STEPS.map((step, idx) => {
                const Icon = STEP_ICONS[step];
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-center gap-4"
                  >
                    <div className={cn(
                      'relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                      isCompleted
                        ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/30'
                        : 'bg-[var(--bg)] border-[var(--border)] text-[var(--fg-muted)]'
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={cn('font-medium text-sm', isCurrent ? 'text-brand-500' : isCompleted ? 'text-[var(--fg)]' : 'text-[var(--fg-muted)]')}>
                        {ORDER_STATUS_LABELS[step]}
                        {isCurrent && <span className="ml-2 text-xs bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 px-2 py-0.5 rounded-full">Current</span>}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 mb-6 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-500 shrink-0" />
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">Order Cancelled</p>
            <p className="text-sm text-red-600 dark:text-red-500 mt-0.5">This order has been cancelled. Contact us on WhatsApp if you need help.</p>
          </div>
        </div>
      )}

      {/* Timeline */}
      {data.trackingUpdates && data.trackingUpdates.length > 0 && (
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
          <h3 className="font-semibold mb-4">Activity Timeline</h3>
          <div className="space-y-4">
            {data.trackingUpdates.map((update, i) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-3"
              >
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                  {i < data.trackingUpdates.length - 1 && <div className="w-px flex-1 bg-[var(--border)] mt-1" />}
                </div>
                <div className="pb-4 flex-1 min-w-0">
                  <p className="text-sm font-medium">{update.description}</p>
                  {update.location && (
                    <p className="text-xs text-[var(--fg-muted)] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{update.location}
                    </p>
                  )}
                  <p className="text-xs text-[var(--fg-muted)] mt-1">{formatDate(update.createdAt)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
