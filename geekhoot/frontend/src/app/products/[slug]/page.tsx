'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, MessageCircle, Truck, Shield, Package, ChevronLeft, Plus, Minus, Check } from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/types';
import { formatPrice, getDeliveryEstimate, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { openWhatsAppOrder, getShippingCharge } from '@/lib/whatsapp';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data.data as Product & { similar: Product[] };
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className={`skeleton h-${4 + i} rounded-xl`} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-center py-20 text-[var(--fg-muted)]">Product not found</div>;

  const inStock = data.stock > 0;
  const shippingCharge = getShippingCharge(user?.state);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please sign in first'); router.push('/auth/login'); return; }
    await addItem(data.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    if (!user) { toast.error('Please sign in first'); router.push('/auth/login'); return; }
    openWhatsAppOrder({ user, product: data, quantity, shippingCharge });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div className="space-y-3">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)]"
          >
            <Image
              src={data.images[selectedImage] || '/placeholder.jpg'}
              alt={data.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          {data.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {data.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0',
                    i === selectedImage ? 'border-brand-500' : 'border-[var(--border)] hover:border-brand-300'
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-brand-500 mb-1">{data.category}</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight">{data.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn('w-4 h-4', s <= Math.round(data.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                ))}
              </div>
              <span className="text-sm text-[var(--fg-muted)]">{data.rating.toFixed(1)} · {data.bookings} orders</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(data.price)}</span>
            <span className={cn('text-sm font-medium px-2 py-0.5 rounded-full', inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
              {inStock ? `In Stock (${data.stock})` : 'Out of Stock'}
            </span>
          </div>

          {/* Shipping */}
          <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <Truck className="w-4 h-4 text-green-500 shrink-0" />
            <div>
              <span className="font-medium">{shippingCharge === 0 ? 'Free Delivery' : `₹${shippingCharge} Delivery`}</span>
              <span className="text-[var(--fg-muted)] ml-1">· {getDeliveryEstimate(user?.state)}</span>
            </div>
          </div>

          {/* Quantity */}
          {inStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center gap-2 border border-[var(--border)] rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-l-xl transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(data.stock, quantity + 1))}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-r-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-[var(--fg-muted)]">Total: {formatPrice(data.price * quantity)}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              disabled={!inStock}
              onClick={handleAddToCart}
              className="flex-1"
            >
              {addedToCart ? <Check className="w-5 h-5 text-green-500" /> : <ShoppingCart className="w-5 h-5" />}
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </Button>
            <Button
              size="lg"
              disabled={!inStock}
              onClick={handleBuyNow}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              <MessageCircle className="w-5 h-5" />
              Buy via WhatsApp
            </Button>
          </div>

          {/* Features */}
          {data.features.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {data.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{data.description}</p>
          </div>

          {/* Trust */}
          <div className="flex gap-4 text-xs text-[var(--fg-muted)] pt-2 border-t border-[var(--border)]">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-brand-500" /> Secure ordering</span>
            <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5 text-brand-500" /> Easy returns</span>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {data.similar && data.similar.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold mb-5">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.similar.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
