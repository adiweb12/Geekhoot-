import Link from 'next/link';
import { Instagram, Twitter, MessageCircle } from 'lucide-react';

const SHOP_LINKS = [
  'Custom T-Shirts', 'Name Slips', 'Printed Bottles',
  'Custom Cups', 'Photo Frames', 'Keychain',
];

const ACCOUNT_LINKS = [
  { label: 'My Profile', href: '/profile' },
  { label: 'My Orders',  href: '/orders' },
  { label: 'Login',      href: '/auth/login' },
  { label: 'Sign Up',    href: '/auth/signup' },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#ff5200] flex items-center justify-center shadow-md">
                <span className="text-white font-black text-lg">G</span>
              </div>
              <div>
                <p className="font-black text-base leading-none text-[var(--fg)]">Geekhoot</p>
                <p className="text-[10px] text-[#ff5200] font-semibold">by WEBSINARO</p>
              </div>
            </Link>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
              Premium custom merch crafted with passion. T-shirts, bottles, cups & more — delivered across India.
            </p>
            <div className="flex gap-2 mt-4">
              {[
                { Icon: Instagram,     href: '#' },
                { Icon: Twitter,       href: '#' },
                { Icon: MessageCircle, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="p-2 rounded-xl bg-[var(--bg)] hover:bg-orange-50 dark:hover:bg-orange-900/20 text-[var(--fg-muted)] hover:text-[#ff5200] border border-[var(--border)] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-[var(--fg)]">Shop</h3>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              {SHOP_LINKS.map((item) => (
                <li key={item}>
                  <Link
                    href={`/products?category=${encodeURIComponent(item)}`}
                    className="hover:text-[#ff5200] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-[var(--fg)]">Account</h3>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              {ACCOUNT_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#ff5200] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-[var(--fg)]">Info</h3>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              {['About Us', 'Contact', 'Shipping Policy', 'Return Policy', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-[#ff5200] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--fg-muted)]">
          <p>&copy; {new Date().getFullYear()} Geekhoot. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with ❤️ by{' '}
            <span className="font-bold text-[#ff5200]">WEBSINARO WB</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
