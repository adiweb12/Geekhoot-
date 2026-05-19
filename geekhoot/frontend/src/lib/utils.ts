import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));

export const getDeliveryEstimate = (state?: string): string => {
  if (!state) return '4–7 business days';
  if (state.toLowerCase().includes('kerala')) return '1–2 business days';
  if (['tamil', 'karnataka', 'andhra', 'telangana'].some((s) => state.toLowerCase().includes(s))) {
    return '2–4 business days';
  }
  return '4–7 business days';
};

export const truncate = (str: string, length: number): string =>
  str.length > length ? `${str.slice(0, length)}…` : str;
