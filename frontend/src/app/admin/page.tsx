'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, Clock } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/types';
import Link from 'next/link';

interface Analytics {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: {
    id: string;
    status: OrderStatus;
    totalPrice: number;
    createdAt: string;
    user: { name: string; email: string };
    product: { name: string; images: string[] };
  }[];
}

const statCards = (data: Analytics) => [
  { label: 'Total Users', value: data.totalUsers.toLocaleString(), icon: Users, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', change: '+12%' },
  { label: 'Total Products', value: data.totalProducts.toLocaleString(), icon: Package, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', change: '+3' },
  { label: 'Total Orders', value: data.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', change: '+8%' },
  { label: 'Total Revenue', value: formatPrice(data.revenue), icon: DollarSign, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400', change: '+15%' },
];

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics');
      return data.data as Analytics;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards(data).map(({ label, value, icon: Icon, color, change }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-xl sm:text-2xl font-bold">{value}</p>
            <p className="text-xs text-[var(--fg-muted)] mt-0.5">{label}</p>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {change} this month
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Status Breakdown */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {Object.entries(data.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', ORDER_STATUS_COLORS[status as OrderStatus])}>
                  {ORDER_STATUS_LABELS[status as OrderStatus] || status}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${(count / data.totalOrders) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-brand-500 hover:text-brand-600 font-medium">View all →</Link>
          </div>
          <div className="space-y-3">
            {data.recentOrders.slice(0, 6).map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders?id=${order.id}`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <img src={order.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{order.user.name}</p>
                  <p className="text-xs text-[var(--fg-muted)] truncate">{order.product.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', ORDER_STATUS_COLORS[order.status])}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <p className="text-xs text-[var(--fg-muted)] mt-1 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />{formatDate(order.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
