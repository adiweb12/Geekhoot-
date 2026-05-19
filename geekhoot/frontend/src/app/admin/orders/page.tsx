'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';
import api from '@/lib/api';
import { Order, OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

interface AdminOrder extends Order {
  user: { id: string; name: string; email: string; phone: string; district?: string; state?: string };
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updateForm, setUpdateForm] = useState({ status: '', trackingId: '', courier: '', notes: '' });
  const [updating, setUpdating] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', { search, statusFilter, page }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20', ...(search && { search }), ...(statusFilter && { status: statusFilter }) });
      const { data } = await api.get(`/admin/orders?${params}`);
      return data as { data: AdminOrder[]; pagination: { total: number } };
    },
  });

  const openOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
    setUpdateForm({ status: order.status, trackingId: order.trackingId || '', courier: order.courier || '', notes: '' });
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await api.patch(`/admin/orders/${selectedOrder.id}/status`, updateForm);
      toast.success('Order updated!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      setSelectedOrder(null);
    } catch {
      toast.error('Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <p className="text-sm text-[var(--fg-muted)]">{data?.pagination.total ?? 0} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, order ID…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Status</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide hidden sm:table-cell">Customer</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {[...Array(6)].map((__, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded-lg" /></td>)}
                  </tr>
                ))
                : data?.data.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={order.product?.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div>
                          <p className="font-medium line-clamp-1 max-w-[120px]">{order.product?.name}</p>
                          <p className="text-xs text-[var(--fg-muted)]">Qty: {order.quantity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="font-medium">{order.user?.name}</p>
                      <p className="text-xs text-[var(--fg-muted)]">{order.user?.phone}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(order.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', ORDER_STATUS_COLORS[order.status])}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-[var(--fg-muted)]">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-500 text-xs font-medium hover:bg-brand-100 transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setSelectedOrder(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[var(--bg)] rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
                <h2 className="font-semibold">Update Order</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-5 space-y-4">
                {/* Customer info */}
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm space-y-1">
                  <p><span className="text-[var(--fg-muted)]">Customer:</span> <strong>{selectedOrder.user?.name}</strong></p>
                  <p><span className="text-[var(--fg-muted)]">Phone:</span> {selectedOrder.user?.phone}</p>
                  <p><span className="text-[var(--fg-muted)]">Email:</span> {selectedOrder.user?.email}</p>
                  <p><span className="text-[var(--fg-muted)]">Location:</span> {[selectedOrder.user?.district, selectedOrder.user?.state].filter(Boolean).join(', ')}</p>
                  <p><span className="text-[var(--fg-muted)]">Product:</span> {selectedOrder.product?.name} × {selectedOrder.quantity}</p>
                  <p><span className="text-[var(--fg-muted)]">Total:</span> <strong>{formatPrice(selectedOrder.totalPrice)}</strong></p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Order Status</label>
                  <select
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {ALL_STATUSES.map((s) => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
                  </select>
                </div>

                <Input
                  label="Tracking ID"
                  placeholder="EK1234567890IN"
                  value={updateForm.trackingId}
                  onChange={(e) => setUpdateForm({ ...updateForm, trackingId: e.target.value })}
                />

                <Input
                  label="Courier Partner"
                  placeholder="Ekart Logistics, DTDC, etc."
                  value={updateForm.courier}
                  onChange={(e) => setUpdateForm({ ...updateForm, courier: e.target.value })}
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Update Notes</label>
                  <textarea
                    rows={2}
                    value={updateForm.notes}
                    onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                    placeholder="e.g. Package dispatched from Kochi warehouse"
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  <Button variant="secondary" onClick={() => setSelectedOrder(null)}>Cancel</Button>
                  <Button onClick={handleUpdate} isLoading={updating}>Update Order</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
