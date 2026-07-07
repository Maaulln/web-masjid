import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import * as bcrypt from 'bcrypt';

import { prisma } from '@/lib/prisma';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { checkRateLimit, getRemainingTtl } from '@/lib/rate-limit';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        turnstileToken: { label: 'Turnstile', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Rate limit login by email address (5 attempts per 15 min)
        const key = `login:${credentials.email}`;
        if (!checkRateLimit(key, 5, 15 * 60 * 1000)) {
          const retryAfter = getRemainingTtl(key);
          throw new Error(`Terlalu banyak percobaan login. Coba lagi dalam ${retryAfter} detik.`);
        }
        
        const isTokenValid = await verifyTurnstileToken(credentials.turnstileToken);
        if (!isTokenValid) throw new Error('Verifikasi CAPTCHA gagal');

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { id?: string; role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { role?: string; id?: string }).id = token.id as string;
      }
      return session;
    }
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 } // 8 hours
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
