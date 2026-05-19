import { HeroSection } from '@/components/home/hero-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CategorySection } from '@/components/home/category-section';
import { WhyGeekhoot } from '@/components/home/why-geekhoot';
import { AppSettingsStrip } from '@/components/home/app-settings-strip';
import { BestSellersFloat } from '@/components/home/best-sellers-float';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Geekhoot — Premium Custom Merch',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* 3-line orange settings strip: delivery, WhatsApp ordering, returns */}
      <AppSettingsStrip />
      <CategorySection />
      <FeaturedProducts />
      <WhyGeekhoot />
      {/* Floating best-sellers grid button */}
      <BestSellersFloat />
    </>
  );
}
