'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  LogOut, Menu, X, BarChart3,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin',            label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products',   label: 'Products',  icon: Package },
  { href: '/admin/orders',     label: 'Orders',    icon: ShoppingBag },
  { href: '/admin/users',      label: 'Users',     icon: Users },
  { href: '/admin/analytics',  label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, hydrated } = useAuthStore();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) { router.replace('/auth/login'); return; }
    if (user.role !== 'ADMIN') { router.replace('/'); }
  }, [user, hydrated, router]);

  // Wait for hydration before rendering
  if (!hydrated || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-[#ff5200] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)]">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-60 bg-[var(--bg)] border-r border-[var(--border)] flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
          <div className="w-9 h-9 rounded-xl bg-[#ff5200] flex items-center justify-center shrink-0 shadow-md">
            <span className="text-lg font-black text-white">G</span>
          </div>
          <div>
            <p className="font-black text-sm text-[var(--fg)]">Geekhoot</p>
            <p className="text-[10px] text-[#ff5200] font-semibold tracking-wide">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
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
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-[#ff5200] shadow-sm font-semibold'
                    : 'text-[var(--fg-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--fg)]'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="admin-nav-active"
                    className="absolute inset-0 rounded-xl bg-orange-50 dark:bg-orange-900/20 -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1 rounded-xl bg-[var(--bg-secondary)]">
            <div className="w-8 h-8 rounded-full bg-[#ff5200] text-white flex items-center justify-center text-xs font-black">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-[var(--fg)]">{user.name}</p>
              <p className="text-[10px] text-[var(--fg-muted)] truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); router.push('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-[var(--bg)] border-b border-[var(--border)] lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-[var(--fg)]">Admin Panel</span>
        </div>

        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
