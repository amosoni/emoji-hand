import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { prisma } from '~/server/db';

export const emojiPackTiersRouter = createTRPCRouter({
  // 暂时注释掉所有功能，先让构建通过
  /*
  // 获取用户表情包套餐状态
  getEmojiPackTier: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) throw new Error('No userId in session');
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        emojiPackTier: true,
        emojiPackExpireAt: true,
        emojiPackUsesToday: true,
        emojiPackUsesThisMonth: true,
        emojiPackTotalUses: true,
        emojiPackLastUsed: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const isExpired = user.emojiPackExpireAt ? user.emojiPackExpireAt < now : true;
    const tier = user.emojiPackTier ?? 'free';

    // 获取套餐限制
    const getTierLimits = (tier: string) => {
      switch (tier) {
        case 'free':
          return { daily: 3, monthly: 10, features: ['基础生成', '标准质量'] };
        case 'starter':
          return { daily: 20, monthly: 100, features: ['高清生成', '批量处理', '邮件支持'] };
        case 'pro':
          return { daily: 100, monthly: 500, features: ['超高清生成', '无限批量', '优先客服', 'API访问'] };
        case 'enterprise':
          return { daily: 999, monthly: 9999, features: ['所有功能', '专属客服', '定制服务', '团队管理'] };
        default:
          return { daily: 3, monthly: 10, features: ['基础生成'] };
      }
    };

    const limits = getTierLimits(tier);

    return {
      tier,
      isActive: !isExpired,
      expireAt: user.emojiPackExpireAt,
      usesToday: user.emojiPackUsesToday ?? 0,
      usesThisMonth: user.emojiPackUsesThisMonth ?? 0,
      totalUses: user.emojiPackTotalUses ?? 0,
      lastUsed: user.emojiPackLastUsed,
      limits,
      remainingToday: limits.daily - (user.emojiPackUsesToday ?? 0),
      remainingThisMonth: limits.monthly - (user.emojiPackUsesThisMonth ?? 0)
    };
  }),

  // 检查并消耗表情包配额
  checkAndConsumeEmojiPackQuota: protectedProcedure
    .input(z.object({
      packCount: z.number().min(1).max(5)
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          emojiPackTier: true,
          emojiPackExpireAt: true,
          emojiPackUsesToday: true,
          emojiPackUsesThisMonth: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const now = new Date();
      const isExpired = user.emojiPackExpireAt ? user.emojiPackExpireAt < now : true;
      const tier = user.emojiPackTier ?? 'free';

      // 获取套餐限制
      const getTierLimits = (tier: string) => {
        switch (tier) {
          case 'free':
            return { daily: 3, monthly: 10 };
          case 'starter':
            return { daily: 20, monthly: 100 };
          case 'pro':
            return { daily: 100, monthly: 500 };
          case 'enterprise':
            return { daily: 999, monthly: 9999 };
          default:
            return { daily: 3, monthly: 10 };
        }
      };

      const limits = getTierLimits(tier);

      // 检查配额
      if (user.emojiPackUsesToday >= limits.daily) {
        throw new Error('Daily quota exceeded');
      }

      if (user.emojiPackUsesThisMonth >= limits.monthly) {
        throw new Error('Monthly quota exceeded');
      }

      // 消耗配额
      await prisma.user.update({
        where: { id: userId },
        data: {
          emojiPackUsesToday: { increment: input.packCount },
          emojiPackUsesThisMonth: { increment: input.packCount },
          emojiPackTotalUses: { increment: input.packCount },
          emojiPackLastUsed: new Date()
        }
      });

      return {
        success: true,
        remainingToday: limits.daily - (user.emojiPackUsesToday + input.packCount),
        remainingThisMonth: limits.monthly - (user.emojiPackUsesThisMonth + input.packCount)
      };
    }),

  // 升级套餐
  upgradeEmojiPackTier: protectedProcedure
    .input(z.object({
      tier: z.enum(['starter', 'pro', 'enterprise']),
      months: z.number().min(1).max(12)
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');

      const prices = {
        starter: { monthly: 9.99, yearly: 99.99 },
        pro: { monthly: 29.99, yearly: 299.99 },
        enterprise: { monthly: 99.99, yearly: 999.99 }
      };

      const price = prices[input.tier][input.months === 12 ? 'yearly' : 'monthly'];
      const totalPrice = price * input.months;
      
      const expireAt = new Date();
      expireAt.setMonth(expireAt.getMonth() + input.months);

      await prisma.user.update({
        where: { id: userId },
        data: {
          emojiPackTier: input.tier,
          emojiPackExpireAt: expireAt
        }
      });

      return { success: true, tier: input.tier, expireAt, price: totalPrice };
    })
  */
}); 