import { User } from '@/store/auth.store';
import { Product } from '@/types';

interface WhatsAppOrderParams {
  user: User;
  product: Product;
  quantity: number;
  shippingCharge?: number;
  location?: { lat: number; lng: number } | null;
}

export const buildWhatsAppMessage = ({
  user,
  product,
  quantity,
  shippingCharge = 0,
  location,
}: WhatsAppOrderParams): string => {
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

  const locationLine = location
    ? `📍 *Live Location*: https://maps.google.com/?q=${location.lat},${location.lng}`
    : '';

  const message = `
🛒 *New Order Request — Geekhoot*

👤 *Customer Details*
Name: ${user.name}
Phone: ${user.phone}
Email: ${user.email}
Address: ${fullAddress || 'Address not provided'}
${locationLine ? `\n${locationLine}` : ''}

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

/** Attempt to get GPS coordinates; resolves null if denied or unavailable */
export const captureLocation = (): Promise<{ lat: number; lng: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 6000 }
    );
  });
};

// Admin WhatsApp number (country code + number, no + or spaces)
const ADMIN_NUMBER = '918138872364';

export const openWhatsAppOrder = async (
  params: Omit<WhatsAppOrderParams, 'location'>
): Promise<void> => {
  // Capture GPS location for accurate delivery
  const location = await captureLocation();
  const message = buildWhatsAppMessage({ ...params, location });
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${ADMIN_NUMBER}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const getShippingCharge = (state?: string): number => {
  if (!state) return 99;
  const keralaCities = ['kerala', 'kl'];
  const isKerala = keralaCities.some((k) => state.toLowerCase().includes(k));
  return isKerala ? 0 : 99;
};
