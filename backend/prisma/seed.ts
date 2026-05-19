import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
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

  console.log('\n🔐 ADMIN CREDENTIALS:');
  console.log('   Email:    admin@geekhoot.com');
  console.log('   Password: asdfghjkl');
  console.log('\n📦 No sample products seeded — admin can add real products via the dashboard.');
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
