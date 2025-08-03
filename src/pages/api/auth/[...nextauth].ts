import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '~/server/db';
import bcrypt from 'bcryptjs';
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // 支持用邮箱登录
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email
          }
        }) as {
          id: string;
          name?: string;
          email?: string;
          image?: string;
          passwordHash?: string;
        } | null;
        if (!user || !user.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
          image: user.image,
        };
      },
    }),
    // 可添加更多第三方登录
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (!token?.sub) return session;
      
      const user = await prisma.user.findUnique({ where: { id: token.sub } });
      if (!user) return session;
      
      // 查数据库补全 profile 字段
      (session.user as any).id = user.id;
      (session.user as any).points = user.points;
      (session.user as any).premiumExpireAt = user.premiumExpireAt ? user.premiumExpireAt.toISOString() : null;
      (session.user as any).createdAt = user.createdAt ? user.createdAt.toISOString() : null;
      // 其它字段可按需补充
      
      return session;
    },
  },
};

export default NextAuth(authOptions); 