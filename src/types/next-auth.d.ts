import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      points?: number;
      premiumExpireAt?: string | null;
      createdAt?: string | null;
      username?: string | null;
      quotaResetAt?: string | null;
      premiumUsesWeekly?: number | null;
      freeUsesDaily?: number | null;
      freeUsesWeekly?: number | null;
      // 其它你需要的字段
    } & DefaultSession["user"];
  }
} 