import Link from 'next/link';
import { Zap, Twitter, Instagram, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-lg">Geekhoot</span>
            </Link>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
              Premium tech gear delivered to your door. Quality products, WhatsApp-simple ordering.
            </p>
            <div className="flex gap-3 mt-4">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-[var(--bg)] hover:bg-brand-50 dark:hover:bg-brand-900/20 text-[var(--fg-muted)] hover:text-brand-500 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              {['All Products', 'Keyboards', 'Mice', 'Monitors', 'Audio', 'Accessories'].map((item) => (
                <li key={item}>
                  <Link href={`/products?category=${item}`} className="hover:text-brand-500 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              {[['My Profile', '/profile'], ['My Orders', '/orders'], ['Cart', '/cart'], ['Wishlist', '/profile/wishlist']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-brand-500 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-[var(--fg-muted)]">
              <li>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-500 transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
              <li><span>Order Tracking</span></li>
              <li><span>Returns Policy</span></li>
              <li><span>Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--fg-muted)]">
          <p>© {new Date().getFullYear()} Geekhoot. All rights reserved.</p>
          <p>Orders via WhatsApp · Fast delivery across India</p>
        </div>
      </div>
    </footer>
  );
}
