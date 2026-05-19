'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Search, Sun, Moon, Heart, Package, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/orders', label: 'Orders' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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
          ? 'border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md shadow-sm'
          : 'bg-[var(--bg)]'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-800 text-xl tracking-tight">Geekhoot</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-brand-500 bg-brand-50 dark:bg-brand-900/20'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-secondary)]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden sm:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 ml-auto">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {/* Wishlist */}
            {user && (
              <Link href="/profile/wishlist" className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors hidden sm:flex">
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors text-sm font-medium">
                  <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full pt-1 hidden group-hover:block">
                  <div className="w-48 rounded-xl border border-[var(--border)] bg-[var(--bg)] shadow-lg py-1 text-sm">
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-secondary)] transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-secondary)] transition-colors">
                      <Package className="w-4 h-4" /> Orders
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--bg-secondary)] transition-colors text-brand-500 font-medium">
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-[var(--border)]" />
                    <button
                      onClick={() => logout()}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex px-4 py-1.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="sm:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 space-y-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-brand-50 text-brand-500 dark:bg-brand-900/20'
                    : 'hover:bg-[var(--bg-secondary)]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[var(--border)] my-2" />
            {user ? (
              <>
                <Link href="/profile" className="block px-3 py-2.5 rounded-xl text-sm hover:bg-[var(--bg-secondary)]">Profile</Link>
                <Link href="/profile/wishlist" className="block px-3 py-2.5 rounded-xl text-sm hover:bg-[var(--bg-secondary)]">Wishlist</Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-brand-500 hover:bg-brand-50">Admin Panel</Link>
                )}
                <button
                  onClick={() => logout()}
                  className="w-full text-left block px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="block text-center px-3 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium">
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
