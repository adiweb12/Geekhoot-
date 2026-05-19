'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Users, Zap, LogOut, Menu, X, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) { router.replace('/auth/login'); return; }
    if (user.role !== 'ADMIN') { router.replace('/'); }
  }, [user]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)]">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-60 bg-[var(--bg)] border-r border-[var(--border)] flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display font-bold text-sm">Geekhoot</p>
            <p className="text-[10px] text-brand-500 font-medium">Admin Panel</p>
          </div>
        </div>

        {/* Warning banner */}
        <div className="mx-3 mt-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 text-center">
            ⚠️ FOR TESTING ONLY — CHANGE CREDENTIALS IN PRODUCTION
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-500 shadow-sm'
                    : 'text-[var(--fg-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--fg)]'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-xl bg-[var(--bg-secondary)]">
            <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{user.name}</p>
              <p className="text-[10px] text-[var(--fg-muted)] truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); router.push('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 min-w-0">
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-[var(--bg)] border-b border-[var(--border)] lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
