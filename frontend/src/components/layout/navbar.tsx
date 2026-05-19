'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, User, Search, Menu, X, LogOut,
  Package, Settings, LayoutDashboard, ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/',         label: 'Home',     exact: true },
  { href: '/products', label: 'Products'             },
  { href: '/orders',   label: 'My Orders'             },
];

export function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const [isOpen,    setIsOpen]    = useState(false);
  const [search,    setSearch]    = useState('');
  const [scrolled,  setScrolled]  = useState(false);
  const [showUser,  setShowUser]  = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (user) fetchCart(); }, [user]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?q=${encodeURIComponent(search.trim())}`);
  };

  const cartCount = items.length;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-[#ff5200]/95 backdrop-blur-md shadow-lg shadow-orange-900/20'
          : 'bg-[#ff5200]'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none shrink-0 group">
            <span className="text-2xl font-black italic tracking-tighter text-white group-hover:scale-105 transition-transform">
              Geekhoot
            </span>
            <span className="text-[9px] font-bold text-white/70 tracking-[0.15em]">
              by WEBSINARO
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5 ml-2">
            {NAV_LINKS.map(({ href, label, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors relative',
                    active
                      ? 'text-white bg-white/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-white/15"
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden sm:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search custom merch…"
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white border-none shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-900 placeholder:text-gray-400 transition-all"
              />
            </div>
          </form>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {mounted && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUser(!showUser)}
                  className="flex items-center gap-2 text-white font-semibold text-sm hover:bg-white/10 px-3 py-2 rounded-xl transition-colors focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-white text-[#ff5200] font-black text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showUser && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {showUser && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onMouseLeave={() => setShowUser(false)}
                      className="absolute right-0 top-full mt-1 w-52 bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden z-50 p-1.5"
                    >
                      <div className="px-3 py-2 mb-1">
                        <p className="text-xs font-bold text-[var(--fg)] truncate">{user.name}</p>
                        <p className="text-[11px] text-[var(--fg-muted)] truncate">{user.email}</p>
                      </div>
                      <div className="border-t border-[var(--border)] my-1" />
                      {[
                        { icon: User,           label: 'Profile',   href: '/profile' },
                        { icon: Package,        label: 'My Orders', href: '/orders'  },
                      ].map(({ icon: Icon, label, href }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setShowUser(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--fg)] hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                          <Icon className="w-4 h-4 text-[var(--fg-muted)]" /> {label}
                        </Link>
                      ))}
                      {user.role === 'ADMIN' && (
                        <>
                          <div className="border-t border-[var(--border)] my-1" />
                          <Link
                            href="/admin"
                            onClick={() => setShowUser(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-[#ff5200] hover:bg-orange-50 transition-colors"
                          >
                            <Settings className="w-4 h-4" /> Admin Panel
                          </Link>
                        </>
                      )}
                      <div className="border-t border-[var(--border)] my-1" />
                      <button
                        onClick={async () => { setShowUser(false); await logout(); router.push('/'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : mounted ? (
              <Link
                href="/auth/login"
                className="px-6 py-2 rounded-xl bg-white text-[#ff5200] font-bold text-sm hover:bg-orange-50 active:scale-95 transition-all shadow-md"
              >
                Login
              </Link>
            ) : null}

            <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-xl transition-colors text-white">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-white text-[#ff5200] rounded-full text-[10px] font-black flex items-center justify-center border-2 border-[#ff5200]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile right */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <Link href="/cart" className="relative p-2 text-white">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-white text-[#ff5200] rounded-full text-[9px] font-black flex items-center justify-center min-w-[18px] min-h-[18px]">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[300px] bg-[var(--bg)] flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="bg-[#ff5200] p-5 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-black text-[#ff5200]">G</span>
                  </div>
                  <div>
                    <p className="font-black text-base leading-tight">
                      {user ? `Hey, ${user.name.split(' ')[0]}!` : 'Welcome!'}
                    </p>
                    <p className="text-xs text-white/70 font-medium">Premium Custom Merch</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search mobile */}
              <div className="px-4 pt-4">
                <form onSubmit={(e) => { handleSearch(e); setIsOpen(false); }} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search merch…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-orange-300 text-[var(--fg)]"
                  />
                </form>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
                {[
                  { href: '/',         icon: LayoutDashboard, label: 'Home' },
                  { href: '/products', icon: Search,          label: 'Shop All' },
                  ...(user ? [
                    { href: '/profile', icon: User,    label: 'My Profile' },
                    { href: '/orders',  icon: Package, label: 'My Orders'  },
                  ] : []),
                  ...(user?.role === 'ADMIN' ? [
                    { href: '/admin', icon: Settings, label: 'Admin Panel' },
                  ] : []),
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors',
                      pathname === href
                        ? 'bg-orange-50 text-[#ff5200] dark:bg-orange-900/20'
                        : 'text-[var(--fg)] hover:bg-[var(--bg-secondary)]'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      pathname === href ? 'bg-orange-100 text-[#ff5200]' : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)]'
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Bottom auth actions */}
              <div className="p-4 border-t border-[var(--border)]">
                {user ? (
                  <button
                    onClick={async () => { setIsOpen(false); await logout(); router.push('/'); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-200"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-bold bg-[#ff5200] text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-bold border-2 border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
