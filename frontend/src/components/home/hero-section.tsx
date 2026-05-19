'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 pt-10 pb-16 sm:pt-16 sm:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-200/40 dark:bg-brand-900/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-amber-200/40 dark:bg-amber-900/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              WhatsApp-simple ordering
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance mb-6">
              Tech gear{' '}
              <span className="text-brand-500 relative">
                you love
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 0 100 6 Q150 12 200 6" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
                </svg>
              </span>
              , delivered.
            </h1>

            <p className="text-[var(--fg-muted)] text-lg mb-8 max-w-md mx-auto lg:mx-0">
              Shop premium keyboards, mice, monitors, and accessories. Order in seconds via WhatsApp. No complicated checkout.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all active:scale-95 shadow-lg shadow-brand-500/25"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=Keyboards"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] font-medium transition-all"
              >
                Explore Keyboards
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start text-sm text-[var(--fg-muted)]">
              {[
                { icon: Shield, text: 'Secure payments' },
                { icon: Truck, text: 'Pan-India delivery' },
                { icon: Zap, text: 'WhatsApp support' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-brand-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating product cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {[
              { title: 'Mechanical Keyboard', price: '₹4,999', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', rating: '4.5' },
              { title: 'Gaming Mouse', price: '₹2,499', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', rating: '4.3' },
              { title: 'USB-C Hub', price: '₹3,499', img: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400', rating: '4.4' },
              { title: 'Headphones', price: '₹8,999', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', rating: '4.6' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`rounded-2xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden shadow-sm hover:shadow-md transition-shadow ${i === 1 ? 'mt-6' : ''}`}
              >
                <img src={item.img} alt={item.title} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <p className="text-xs font-medium line-clamp-1">{item.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-sm text-brand-500">{item.price}</span>
                    <span className="text-xs text-amber-500">★ {item.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
