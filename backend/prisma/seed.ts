import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user — FOR TESTING ONLY — CHANGE IN PRODUCTION
  const adminPassword = await bcrypt.hash('asdfghjkl', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@geekhoot.com' },
    update: {},
    create: {
      name: 'Geekhoot Admin',
      phone: '9999999999',
      email: 'admin@geekhoot.com',
      password: adminPassword,
      role: Role.ADMIN,
      houseName: 'Geekhoot HQ',
      district: 'Ernakulam',
      state: 'Kerala',
      pincode: '682001',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Seed sample products
  const products = [
    {
      name: 'Wireless Mechanical Keyboard',
      slug: 'wireless-mechanical-keyboard',
      description: 'Professional wireless mechanical keyboard with RGB backlighting and hot-swappable switches. Perfect for gamers and developers.',
      features: ['Hot-swappable switches', 'RGB backlight', 'Bluetooth 5.0', '3000mAh battery', 'PBT keycaps'],
      price: 4999,
      images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'],
      stock: 50,
      rating: 4.5,
      bookings: 128,
      category: 'Keyboards',
      tags: ['keyboard', 'mechanical', 'wireless', 'gaming'],
    },
    {
      name: 'Gaming Mouse Pro',
      slug: 'gaming-mouse-pro',
      description: 'High-precision gaming mouse with 16000 DPI sensor, 7 programmable buttons, and ultra-lightweight design.',
      features: ['16000 DPI sensor', '7 programmable buttons', '70g ultra-light', 'USB-C charging', 'RGB lighting'],
      price: 2499,
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],
      stock: 80,
      rating: 4.3,
      bookings: 256,
      category: 'Mice',
      tags: ['mouse', 'gaming', 'wireless'],
    },
    {
      name: '27" 4K Gaming Monitor',
      slug: '27-4k-gaming-monitor',
      description: '27-inch 4K IPS gaming monitor with 144Hz refresh rate, 1ms response time, and HDR support.',
      features: ['4K UHD resolution', '144Hz refresh rate', '1ms response time', 'HDR400', 'G-Sync compatible'],
      price: 32999,
      images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'],
      stock: 20,
      rating: 4.7,
      bookings: 89,
      category: 'Monitors',
      tags: ['monitor', '4k', 'gaming', 'IPS'],
    },
    {
      name: 'USB-C Hub 10-in-1',
      slug: 'usb-c-hub-10-in-1',
      description: 'Premium 10-in-1 USB-C hub with 4K HDMI, 100W PD, SD card reader, and USB 3.0 ports.',
      features: ['4K HDMI output', '100W Power Delivery', 'SD/MicroSD reader', '3x USB 3.0', 'Gigabit Ethernet'],
      price: 3499,
      images: ['https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=800'],
      stock: 120,
      rating: 4.4,
      bookings: 312,
      category: 'Accessories',
      tags: ['hub', 'usb-c', 'accessories'],
    },
    {
      name: 'Noise Cancelling Headphones',
      slug: 'noise-cancelling-headphones',
      description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery, and hi-fi sound.',
      features: ['Active noise cancellation', '30h battery', 'Hi-Res Audio', 'Quick charge', 'Foldable design'],
      price: 8999,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      stock: 45,
      rating: 4.6,
      bookings: 175,
      category: 'Audio',
      tags: ['headphones', 'ANC', 'wireless', 'audio'],
    },
    {
      name: 'Mechanical Numpad',
      slug: 'mechanical-numpad',
      description: 'Compact mechanical numpad with programmable keys, RGB lighting, and dual USB connection.',
      features: ['Programmable keys', 'RGB lighting', 'USB-C connection', 'Aluminum case', 'Hot-swappable'],
      price: 1799,
      images: ['https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800'],
      stock: 60,
      rating: 4.2,
      bookings: 95,
      category: 'Keyboards',
      tags: ['numpad', 'mechanical', 'keyboard'],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('✅ Sample products seeded');
  console.log('\n⚠️  TEST CREDENTIALS (CHANGE IN PRODUCTION):');
  console.log('   Email: admin@geekhoot.com');
  console.log('   Password: asdfghjkl');
  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
