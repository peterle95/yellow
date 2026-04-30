import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      // Define protected routes or paths here
      // For example, if all routes except /login are protected:
      // if (!isLoggedIn && !isOnLogin) return false;
      
      // We will just return true for now to allow viewing the landing page,
      // but you can lock down specific paths as needed.
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
