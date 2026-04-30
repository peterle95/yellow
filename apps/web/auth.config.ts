import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET || "dummy_secret_for_build",
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      return true;
    },
  },
  providers: [
    Credentials({
      credentials: {},
      authorize: async () => null,
    }),
  ],
} satisfies NextAuthConfig;
