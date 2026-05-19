'use client';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, ShoppingBag, Users } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/types';

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics');
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-40 rounded-xl" />
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    );
  }

  const statusBreakdown = Object.entries(data?.ordersByStatus || {}) as [OrderStatus, number][];
  const totalOrders = data?.totalOrders || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-[var(--fg-muted)]">Overview of your store performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatPrice(data?.revenue || 0), icon: TrendingUp, color: 'text-green-500' },
          { label: 'Total Orders', value: String(data?.totalOrders || 0), icon: ShoppingBag, color: 'text-blue-500' },
          { label: 'Total Users', value: String(data?.totalUsers || 0), icon: Users, color: 'text-purple-500' },
          { label: 'Total Products', value: String(data?.totalProducts || 0), icon: BarChart3, color: 'text-orange-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
            <Icon className={`w-6 h-6 mb-3 ${color}`} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-[var(--fg-muted)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Order Distribution */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
          <h2 className="font-semibold mb-5">Order Status Distribution</h2>
          <div className="space-y-4">
            {statusBreakdown.map(([status, count]) => (
              <div key={status} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', ORDER_STATUS_COLORS[status])}>
                    {ORDER_STATUS_LABELS[status]}
                  </span>
                  <span className="font-semibold">{count} <span className="text-[var(--fg-muted)] font-normal">({((count / totalOrders) * 100).toFixed(1)}%)</span></span>
                </div>
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-700"
                    style={{ width: `${(count / totalOrders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue summary */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
          <h2 className="font-semibold mb-5">Revenue Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <span className="text-sm text-green-700 dark:text-green-400 font-medium">Confirmed + Delivered</span>
              <span className="font-bold text-green-700 dark:text-green-400">{formatPrice(data?.revenue || 0)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-sm text-[var(--fg-muted)]">Avg. Order Value</span>
              <span className="font-bold">{data?.totalOrders ? formatPrice((data.revenue || 0) / data.totalOrders) : '₹0'}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <span className="text-sm text-[var(--fg-muted)]">Orders per User</span>
              <span className="font-bold">{data?.totalUsers ? (data.totalOrders / data.totalUsers).toFixed(1) : '0'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
