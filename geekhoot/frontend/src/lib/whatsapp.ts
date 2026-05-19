import { User } from '@/store/auth.store';
import { Product } from '@/types';

interface WhatsAppOrderParams {
  user: User;
  product: Product;
  quantity: number;
  shippingCharge?: number;
}

export const buildWhatsAppMessage = ({ user, product, quantity, shippingCharge = 0 }: WhatsAppOrderParams): string => {
  const fullAddress = [
    user.houseName,
    user.street,
    user.landmark,
    user.district,
    user.state,
    user.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  const subtotal = product.price * quantity;
  const total = subtotal + shippingCharge;

  const message = `
🛒 *New Order Request — Geekhoot*

👤 *Customer Details*
Name: ${user.name}
Phone: ${user.phone}
Email: ${user.email}
Address: ${fullAddress || 'Address not provided'}

📦 *Order Details*
Product: ${product.name}
Quantity: ${quantity}
Unit Price: ₹${product.price.toLocaleString('en-IN')}
Subtotal: ₹${subtotal.toLocaleString('en-IN')}
${shippingCharge > 0 ? `Shipping: ₹${shippingCharge}\n` : 'Shipping: FREE\n'}*Total: ₹${total.toLocaleString('en-IN')}*

Please confirm the order and provide tracking details.
  `.trim();

  return message;
};

export const openWhatsAppOrder = (params: WhatsAppOrderParams): void => {
  const adminNumber = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER || '919876543210';
  const message = buildWhatsAppMessage(params);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${adminNumber}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const getShippingCharge = (state?: string): number => {
  if (!state) return 99;
  const keralaCities = ['kerala', 'kl'];
  const isKerala = keralaCities.some((k) => state.toLowerCase().includes(k));
  return isKerala ? 0 : 99;
};
