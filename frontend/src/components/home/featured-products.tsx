'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { Product } from '@/types';
import { ArrowRight, Package } from 'lucide-react';

export function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=8&sort=bookings&order=desc');
      return data.data as Product[];
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">New Arrivals</h2>
          <p className="text-[var(--fg-muted)] text-sm mt-1">Fresh custom merch added by our team</p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm font-semibold text-[color:var(--brand)] hover:gap-2 transition-all"
        >
          See all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-24 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mb-5">
            <Package className="w-9 h-9 text-[color:var(--brand)]" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">Products Coming Soon</h3>
          <p className="text-[var(--fg-muted)] text-sm max-w-xs">
            Our admin is busy crafting amazing products. Check back shortly!
          </p>
        </motion.div>
      )}
    </section>
  );
}
