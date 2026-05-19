import { HeroSection } from '@/components/home/hero-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CategorySection } from '@/components/home/category-section';
import { WhyGeekhoot } from '@/components/home/why-geekhoot';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Geekhoot — Tech Gear You Love',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <WhyGeekhoot />
    </>
  );
}
