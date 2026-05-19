export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  price: number;
  images: string[];
  stock: number;
  rating: number;
  bookings: number;
  category: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: OrderStatus;
  trackingId?: string;
  courier?: string;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  product: Pick<Product, 'id' | 'name' | 'images' | 'price' | 'slug'>;
  trackingUpdates?: TrackingUpdate[];
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface TrackingUpdate {
  id: string;
  orderId: string;
  status: string;
  description: string;
  location?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PACKED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  SHIPPED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};
