'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, MessageCircle, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { openWhatsAppOrder, getShippingCharge } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, total, fetchCart, updateItem, removeItem, isLoading } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => { fetchCart(); }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-[var(--fg-muted)] mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is waiting</h2>
        <p className="text-[var(--fg-muted)] mb-6">Sign in to view and manage your cart</p>
        <Link href="/auth/login">
          <Button size="lg">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-[var(--fg-muted)] mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-[var(--fg-muted)] mb-6">Add some amazing tech gear to get started!</p>
        <Link href="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const shippingCharge = getShippingCharge(user.state);
  const orderTotal = total + shippingCharge;

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    // Create a combined order message for all items
    const itemsList = items
      .map((item) => `${item.product.name} × ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`)
      .join('\n');

    const message = `
🛒 *Cart Order — Geekhoot*

👤 *Customer:* ${user.name}
📱 *Phone:* ${user.phone}
📧 *Email:* ${user.email}
📍 *Address:* ${[user.houseName, user.street, user.landmark, user.district, user.state, user.pincode].filter(Boolean).join(', ')}

📦 *Order Items:*
${itemsList}

💰 *Subtotal:* ${formatPrice(total)}
🚚 *Shipping:* ${shippingCharge === 0 ? 'FREE' : formatPrice(shippingCharge)}
✅ *Total: ${formatPrice(orderTotal)}*

Please confirm all items and provide delivery timeline.
    `.trim();

    const adminNumber = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER || '919876543210';
    window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/products" className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl font-bold">Shopping Cart</h1>
        <span className="px-2 py-0.5 bg-brand-100 text-brand-600 text-sm font-medium rounded-full">{items.length} items</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                className="flex gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] hover:border-brand-200 dark:hover:border-brand-800 transition-colors"
              >
                <Link href={`/products/${item.product.slug}`} className="shrink-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[var(--bg-secondary)]">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-medium text-sm leading-snug hover:text-brand-500 transition-colors line-clamp-2">{item.product.name}</h3>
                  </Link>
                  <p className="font-bold text-lg mt-1">{formatPrice(item.product.price)}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 border border-[var(--border)] rounded-lg">
                      <button
                        onClick={() => updateItem(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-l-lg transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-r-lg transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-brand-500">{formatPrice(item.product.price * item.quantity)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-[var(--fg-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--fg-muted)]">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--fg-muted)]">Shipping</span>
                <span className={shippingCharge === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {shippingCharge === 0 ? 'FREE' : formatPrice(shippingCharge)}
                </span>
              </div>
              {user?.state && (
                <p className="text-xs text-[var(--fg-muted)]">
                  {user.state.toLowerCase().includes('kerala') ? '✅ Free delivery in Kerala' : '📦 Flat rate shipping'}
                </p>
              )}
            </div>
            <div className="border-t border-[var(--border)] pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-brand-500">{formatPrice(orderTotal)}</span>
            </div>
            <Button size="lg" onClick={handleWhatsAppOrder} className="w-full bg-green-500 hover:bg-green-600">
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </Button>
            <p className="text-xs text-center text-[var(--fg-muted)]">
              Tapping will open WhatsApp with your order pre-filled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
