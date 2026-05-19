'use client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, X, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export function BestSellersFloat() {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'best-sellers-float'],
    queryFn: async () => {
      // Sort by bookings desc to get most-sold items
      const { data } = await api.get('/products?limit=6&sort=bookings&order=desc');
      return data.data as Product[];
    },
    enabled: open, // only load when panel opens
  });

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 bg-[#ff5200] text-white px-4 py-3 rounded-2xl shadow-xl shadow-orange-500/30 hover:bg-orange-600 active:scale-95 transition-all font-bold text-sm"
        aria-label="View best sellers"
      >
        <Flame className="w-4 h-4 animate-pulse" />
        Best Sellers
      </motion.button>

      {/* Floating panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg)] rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] sticky top-0 bg-[var(--bg)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-[#ff5200]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Best Sellers</h3>
                    <p className="text-[11px] text-[var(--fg-muted)]">Most ordered products</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid */}
              <div className="p-4">
                {isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-2xl bg-[var(--bg-secondary)] animate-pulse aspect-[3/4]" />
                    ))}
                  </div>
                ) : data && data.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {data.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={() => setOpen(false)}
                          className="group block rounded-2xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                        >
                          {/* Image */}
                          <div className="relative aspect-square bg-[var(--bg-secondary)]">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-[var(--fg-muted)]" />
                              </div>
                            )}
                            {/* Rank badge */}
                            {i < 3 && (
                              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#ff5200] flex items-center justify-center shadow">
                                <span className="text-white text-[10px] font-black">#{i + 1}</span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="p-2.5">
                            <p className="text-xs font-semibold line-clamp-2 leading-tight mb-1">{product.name}</p>
                            <p className="text-xs font-bold text-[#ff5200]">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-[var(--fg-muted)] py-8">No products yet</p>
                )}

                {/* View all link */}
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 mt-4 py-3 rounded-2xl bg-[var(--bg-secondary)] text-sm font-semibold hover:bg-orange-50 hover:text-[#ff5200] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  View All Products
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
