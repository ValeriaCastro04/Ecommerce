import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';
import { hash } from '../lib/encrypt';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🌱 Starting database seed...');
    
    // Delete existing data in correct order (respecting foreign key constraints)
    console.log('🗑️  Cleaning existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('✅ Existing data cleaned');

    // Create products
    console.log('📦 Creating products...');
    await prisma.product.createMany({ data: sampleData.products });
    console.log(`✅ Created ${sampleData.products.length} products`);

    // Create users with hashed passwords
    console.log('👥 Creating users...');
    const users = [];
    for (let i = 0; i < sampleData.users.length; i++) {
      const hashedPassword = await hash(sampleData.users[i].password);
      users.push({
        ...sampleData.users[i],
        password: hashedPassword,
      });
      console.log(`   User: ${sampleData.users[i].email} - Password hashed`);
    }
    
    await prisma.user.createMany({ data: users });
    console.log(`✅ Created ${users.length} users`);

    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  });
