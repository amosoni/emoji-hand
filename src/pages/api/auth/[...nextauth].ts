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
          emailVerified?: Date | null;
        } | null;
        if (!user || !user.passwordHash) return null;
        // 移除邮箱验证检查，允许未验证用户登录
        // if (!user.emailVerified) {
        //   throw new Error('EMAIL_NOT_VERIFIED');
        // }
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
      console.log('=== NextAuth JWT callback start ===');
      console.log('JWT callback - user:', user);
      console.log('JWT callback - token before:', token);
      
      if (user?.id) {
        token.sub = user.id;
        console.log('Setting token.sub to user.id:', user.id);
      }
      
      console.log('JWT callback - token after:', token);
      console.log('=== NextAuth JWT callback end ===');
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('=== NextAuth session callback start ===');
      console.log('NextAuth session callback - token:', token);
      console.log('NextAuth session callback - session before:', session);
      console.log('Token sub:', token?.sub);
      
      if (!token?.sub) {
        console.log('No token.sub found, returning session as is');
        return session;
      }
      
      const user = await prisma.user.findUnique({ where: { id: token.sub } });
      console.log('NextAuth session callback - user from db:', user);
      
      if (!user) {
        console.log('No user found in db, returning session as is');
        return session;
      }
      
      // 查数据库补全 profile 字段
      (session.user as any).id = user.id;
      (session.user as any).points = user.points;
      (session.user as any).premiumExpireAt = user.premiumExpireAt ? user.premiumExpireAt.toISOString() : null;
      (session.user as any).emailVerified = user.emailVerified;
      (session.user as any).createdAt = user.createdAt ? user.createdAt.toISOString() : null;
      // 添加订阅相关字段
      (session.user as any).subscriptionPlan = user.subscriptionPlan;
      (session.user as any).subscriptionStatus = user.subscriptionStatus;
      (session.user as any).subscriptionExpireAt = user.subscriptionExpireAt ? user.subscriptionExpireAt.toISOString() : null;
      (session.user as any).translationUsesToday = user.translationUsesToday;
      (session.user as any).imageGenerationUsesToday = user.imageGenerationUsesToday;
      (session.user as any).lastUsageReset = user.lastUsageReset ? user.lastUsageReset.toISOString() : null;
      // 其它字段可按需补充
      
      console.log('NextAuth session callback - session after:', session);
      console.log('Session user id after setting:', (session.user as any).id);
      console.log('=== NextAuth session callback end ===');
      return session;
    },
  },
};

export default NextAuth(authOptions); 