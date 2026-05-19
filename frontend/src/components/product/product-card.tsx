'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Package, Zap } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getDeliveryEstimate, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to add to cart');
      router.push('/auth/login');
      return;
    }
    await addItem(product.id);
  };

  const inStock = product.stock > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
    >
      <Link href={`/products/${product.slug}`} className="block group">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-[var(--bg-secondary)]">
            <Image
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {!inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
              </div>
            )}
            <button
              onClick={(e) => { e.preventDefault(); }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-black/60 shadow hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 space-y-2">
            <p className="text-xs text-brand-500 font-medium uppercase tracking-wide">{product.category}</p>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn('w-3 h-3', star <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-700')}
                  />
                ))}
              </div>
              <span className="text-xs text-[var(--fg-muted)]">({product.bookings})</span>
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Package className="w-3 h-3" />
              <span>{getDeliveryEstimate()}</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-lg">{formatPrice(product.price)}</span>
              <span className="text-xs text-[var(--fg-muted)]">{product.stock} left</span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1" onClick={(e) => e.preventDefault()}>
              <Button
                size="sm"
                variant="secondary"
                disabled={!inStock}
                onClick={handleAddToCart}
                className="text-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Cart
              </Button>
              <Button
                size="sm"
                disabled={!inStock}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/products/${product.slug}`);
                }}
                className="text-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
