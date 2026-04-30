import { PrismaClient } from '@prisma/client';

// Initialize the Prisma Client
// We pass the datasourceUrl explicitly since it's required for Prisma 7
const prisma = new PrismaClient({
  datasourceUrl: process.env.POSTGRES_PRISMA_DATABASE_URL,
});

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create a dummy user
  // We use `upsert` so that if we run the seed command multiple times,
  // it won't crash trying to create a user with an email that already exists.
  const dummyUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {}, // Do nothing if the user already exists
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      // If you are setting up accounts (like GitHub), you could also nest a create here,
      // but a base User is enough to start.
    },
  });

  console.log(`✅ Created dummy user: ${dummyUser.name} (${dummyUser.email})`);
  console.log('🎉 Seeding finished.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Always disconnect the Prisma client when done to avoid connection leaks
    await prisma.$disconnect();
  });
