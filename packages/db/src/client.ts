import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prisma 7 reads process.env.DATABASE_URL automatically.
// Since Vercel provides POSTGRES_PRISMA_URL (or POSTGRES_PRISMA_DATABASE_URL), we map it here before instantiation.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
}

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
