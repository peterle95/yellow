import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../../packages/db/src/client';
import { authConfig } from './auth.config';

// Import providers you want to use here
// import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || "dummy_secret_for_build",
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
});
