'use client';
import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Keyboards', 'Mice', 'Monitors', 'Audio', 'Accessories', 'Components'];
const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'bookings-desc', label: 'Most Popular' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('createdAt-desc');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const q = searchParams.get('q') || '';

  const [sortField, sortOrder] = sort.split('-');

  const { data, isLoading } = useQuery({
    queryKey: ['products', { category, sort, page, q }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
        sort: sortField,
        order: sortOrder,
        ...(category !== 'All' && { category }),
        ...(q && { q }),
      });
      const endpoint = q ? `/products/search?${params}&q=${encodeURIComponent(q)}` : `/products?${params}`;
      const { data } = await api.get(endpoint);
      return data as { data: Product[]; pagination: { total: number; pages: number } };
    },
  });

  const handleCategory = useCallback((cat: string) => {
    setCategory(cat);
    setPage(1);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            {q ? `Results for "${q}"` : category === 'All' ? 'All Products' : category}
          </h1>
          {data && (
            <p className="text-sm text-[var(--fg-muted)] mt-1">{data.pagination.total} products</p>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Active search indicator */}
      {q && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-[var(--fg-muted)]">Searching for:</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-brand-100 text-brand-600 text-sm">
            {q}
            <button onClick={() => router.push('/products')}><X className="w-3 h-3" /></button>
          </span>
        </div>
      )}

      {/* Categories */}
      <div className={cn('mb-6', showFilters ? 'block' : 'hidden sm:block')}>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                category === cat
                  ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-brand-300 text-[var(--fg-muted)] hover:text-[var(--fg)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-[var(--fg-muted)] hidden sm:block">Sort by:</span>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : data?.data.length === 0
          ? (
            <div className="col-span-full text-center py-20">
              <p className="text-[var(--fg-muted)] text-lg mb-2">No products found</p>
              <p className="text-sm text-[var(--fg-muted)]">Try a different category or search term</p>
              <Button variant="secondary" className="mt-4" onClick={() => { setCategory('All'); router.push('/products'); }}>
                Clear filters
              </Button>
            </div>
          )
          : data?.data.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)
        }
      </div>

      {/* Pagination */}
      {data && data.pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          {Array.from({ length: Math.min(data.pagination.pages, 5) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                p === page ? 'bg-brand-500 text-white' : 'bg-[var(--bg-secondary)] hover:bg-[var(--border)]'
              )}
            >
              {p}
            </button>
          ))}
          <Button variant="secondary" size="sm" disabled={page === data.pagination.pages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
