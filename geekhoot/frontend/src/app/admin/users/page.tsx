'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users, Mail, Phone, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  district?: string;
  state?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', { search, page }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20', ...(search && { search }) });
      const { data } = await api.get(`/admin/users?${params}`);
      return data as { data: AdminUser[]; pagination: { total: number } };
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Users</h1>
        <p className="text-sm text-[var(--fg-muted)]">{data?.pagination.total ?? 0} registered users</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, email, or phone…"
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide hidden sm:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide hidden md:table-cell">Location</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {[...Array(5)].map((__, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded-lg" /></td>)}
                  </tr>
                ))
                : data?.data.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center text-sm font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-[var(--fg-muted)] sm:hidden">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1 text-xs"><Mail className="w-3 h-3 text-[var(--fg-muted)]" />{user.email}</p>
                        <p className="flex items-center gap-1 text-xs"><Phone className="w-3 h-3 text-[var(--fg-muted)]" />{user.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {(user.district || user.state) && (
                        <p className="flex items-center gap-1 text-xs text-[var(--fg-muted)]">
                          <MapPin className="w-3 h-3" />
                          {[user.district, user.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        user.role === 'ADMIN'
                          ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--fg-muted)]">{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.pagination.total > 20 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm disabled:opacity-50">← Prev</button>
          <span className="text-sm text-[var(--fg-muted)]">Page {page}</span>
          <button onClick={() => setPage(page + 1)} disabled={data.data.length < 20} className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm disabled:opacity-50">Next →</button>
        </div>
      )}
    </div>
  );
}
