'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Package, ShoppingBag, IndianRupee, TrendingUp, Clock, PlusCircle } from 'lucide-react';
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

  const statCards = [
    { label: 'Total Users',    value: data.totalUsers.toLocaleString(),    icon: Users,        color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',   change: null },
    { label: 'Total Products', value: data.totalProducts.toLocaleString(), icon: Package,      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', change: null },
    { label: 'Total Orders',   value: data.totalOrders.toLocaleString(),   icon: ShoppingBag,  color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',  change: null },
    { label: 'Revenue',        value: formatPrice(data.revenue),           icon: IndianRupee,  color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', change: null },
  ];

  const isEmpty = data.totalProducts === 0 && data.totalOrders === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--fg)]">Dashboard</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-0.5">Welcome back, {data && 'Admin'}!</p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff5200] text-white text-sm font-bold hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-orange-200"
        >
          <PlusCircle className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[var(--fg)]">{value}</p>
            <p className="text-xs text-[var(--fg-muted)] mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {isEmpty ? (
        /* Empty state — no products or orders yet */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg)] text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-[#ff5200]" />
          </div>
          <h2 className="font-display text-lg font-bold mb-2 text-[var(--fg)]">Let&apos;s get started!</h2>
          <p className="text-sm text-[var(--fg-muted)] max-w-sm mx-auto mb-6">
            Your store is all set. Start by adding products so customers can browse and order.
          </p>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff5200] text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Add Your First Product
          </Link>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Status */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
            <h2 className="font-semibold mb-4 text-[var(--fg)]">Orders by Status</h2>
            <div className="space-y-3">
              {Object.entries(data.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', ORDER_STATUS_COLORS[status as OrderStatus])}>
                    {ORDER_STATUS_LABELS[status as OrderStatus] || status}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                      <div
                        className="h-full bg-[#ff5200] rounded-full"
                        style={{ width: `${data.totalOrders ? (count / data.totalOrders) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-6 text-right text-[var(--fg)]">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2 p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--fg)]">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-[#ff5200] hover:text-orange-600 font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {data.recentOrders.slice(0, 6).map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders?id=${order.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  {order.product.images[0] ? (
                    <img src={order.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-[#ff5200]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-[var(--fg)]">{order.user.name}</p>
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
      )}
    </div>
  );
}
