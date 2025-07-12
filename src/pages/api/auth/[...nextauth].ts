import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '~/server/db';
import bcrypt from 'bcryptjs';
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions = {
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
        // 支持用邮箱或用户名登录
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { username: credentials.email }
            ]
          }
        }) as {
          id: string;
          name?: string;
          username?: string;
          email?: string;
          image?: string;
          passwordHash?: string;
        } | null;
        if (!user || !user.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user.id,
          name: user.name ?? user.username ?? user.email,
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
  // 只自定义 sessionToken 的 domain，保证 tRPC 路由和 next-auth 路由一致，兼容 signOut
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        domain: "emojihand.com",
      },
    },
  },
  // cookies 字段已回退，恢复默认策略，保证 signOut 正常
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      const user = await prisma.user.findUnique({ where: { id: token.sub } });
      if (!session.user || !token?.sub) return session;
      // 查数据库补全 profile 字段
      if (user) {
        session.user.id = user.id;
        session.user.points = user.points;
        session.user.premiumExpireAt = user.premiumExpireAt ? user.premiumExpireAt.toISOString() : null;
        session.user.createdAt = user.createdAt ? user.createdAt.toISOString() : null;
        session.user.username = user.username;
        session.user.quotaResetAt = user.quotaResetAt ? user.quotaResetAt.toISOString() : null;
        session.user.premiumUsesWeekly = user.premiumUsesWeekly;
        session.user.freeUsesWeekly = user.freeUsesWeekly;
        session.user.freeUsesDaily = user.freeUsesDaily;
        // 其它字段可按需补充
      }
      return session;
    },
  },
};

export default NextAuth(authOptions); 