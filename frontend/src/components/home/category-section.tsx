'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Custom T-Shirts', emoji: '👕', color: 'bg-orange-100 text-orange-700' },
  { name: 'Name Slips',      emoji: '🏷️', color: 'bg-blue-100 text-blue-700' },
  { name: 'Printed Bottles', emoji: '🍼', color: 'bg-green-100 text-green-700' },
  { name: 'Custom Cups',     emoji: '☕', color: 'bg-amber-100 text-amber-700' },
  { name: 'Photo Frames',    emoji: '🖼️', color: 'bg-purple-100 text-purple-700' },
  { name: 'Keychain',        emoji: '🔑', color: 'bg-pink-100 text-pink-700' },
  { name: 'Stationery',      emoji: '✏️', color: 'bg-teal-100 text-teal-700' },
  { name: 'Tech Gadgets',    emoji: '⌚', color: 'bg-indigo-100 text-indigo-700' },
];

export function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Shop by Category</h2>
          <p className="text-[var(--fg-muted)] text-sm mt-1">Find exactly what you&apos;re looking for</p>
        </div>
        <Link href="/products" className="text-sm font-medium text-[color:var(--brand)] hover:underline hidden sm:block">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {categories.map(({ name, emoji, color }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.055, type: 'spring', stiffness: 200, damping: 18 }}
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href={`/products?category=${encodeURIComponent(name)}`}
              className="flex flex-col items-center gap-2.5 p-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:border-[color:var(--brand)] hover:shadow-md transition-all group text-center"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color} group-hover:scale-110 transition-transform duration-200`}
              >
                {emoji}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[var(--fg)] leading-tight">{name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
