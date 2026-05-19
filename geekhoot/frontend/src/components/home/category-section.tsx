'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Keyboard, Mouse, Monitor, Headphones, Cpu, Package } from 'lucide-react';

const categories = [
  { name: 'Keyboards', icon: Keyboard, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { name: 'Mice', icon: Mouse, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { name: 'Monitors', icon: Monitor, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { name: 'Audio', icon: Headphones, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  { name: 'Components', icon: Cpu, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  { name: 'Accessories', icon: Package, color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
];

export function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {categories.map(({ name, icon: Icon, color }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={`/products?category=${name}`}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:border-brand-300 hover:shadow-sm transition-all group text-center"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-medium">{name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
