'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { Product } from '@/types';
import { ArrowRight } from 'lucide-react';

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
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Trending Products</h2>
          <p className="text-[var(--fg-muted)] text-sm mt-1">Most popular gear this week</p>
        </div>
        <Link href="/products" className="flex items-center gap-1 text-brand-500 text-sm font-medium hover:gap-2 transition-all">
          See all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : data?.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)
        }
      </div>
    </section>
  );
}
