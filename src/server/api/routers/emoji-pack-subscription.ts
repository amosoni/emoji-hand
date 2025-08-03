import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { prisma } from '~/server/db';

export const emojiPackSubscriptionRouter = createTRPCRouter({
  getSubscriptionPlans: publicProcedure.query(() => {
    return {
      plans: [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          billingCycle: 'monthly',
          features: {
            translation: { daily: 8, model: 'gpt-3.5-turbo' },
            imageGeneration: { daily: 0 },
            guides: true,
            noAds: false,
            exportQuality: 'standard',
            batchGeneration: false,
            apiAccess: false,
            commercialUse: false,
            teamCollaboration: false
          },
          description: '기본 번역 기능, 하루 8회 사용',
          yearlyDiscount: 0
        },
        {
          id: 'starter',
          name: 'Starter',
          price: 9.99,
          billingCycle: 'monthly',
          features: {
            translation: { daily: 15, model: 'gpt-4' },
            imageGeneration: { daily: 2 },
            guides: true,
            noAds: true,
            exportQuality: 'hd',
            batchGeneration: false,
            apiAccess: false,
            commercialUse: false,
            teamCollaboration: false
          },
          description: '하루 15회 번역, 2회 이미지 생성',
          yearlyDiscount: 17
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 19.99,
          billingCycle: 'monthly',
          features: {
            translation: { daily: 35, model: 'gpt-4' },
            imageGeneration: { daily: 5 },
            guides: true,
            noAds: true,
            exportQuality: 'ultra-hd',
            batchGeneration: true,
            apiAccess: true,
            commercialUse: false,
            teamCollaboration: false
          },
          description: '하루 35회 번역, 5회 이미지 생성',
          yearlyDiscount: 17
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 39.99,
          billingCycle: 'monthly',
          features: {
            translation: { daily: 70, model: 'gpt-4' },
            imageGeneration: { daily: 10 },
            guides: true,
            noAds: true,
            exportQuality: 'highest',
            batchGeneration: true,
            apiAccess: true,
            commercialUse: true,
            teamCollaboration: true
          },
          description: '하루 70회 번역, 10회 이미지 생성',
          yearlyDiscount: 17
        }
      ]
    };
  }),

  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
        subscriptionExpireAt: true,
        translationUsesToday: true,
        imageGenerationUsesToday: true,
        lastUsageReset: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // 检查是否需要重置每日使用量
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!user.lastUsageReset || user.lastUsageReset < today) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          translationUsesToday: 0,
          imageGenerationUsesToday: 0,
          lastUsageReset: today
        }
      });
      user.translationUsesToday = 0;
      user.imageGenerationUsesToday = 0;
    }

    const plans = {
      free: { translation: 8, imageGeneration: 0 },
      starter: { translation: 15, imageGeneration: 5 },
      pro: { translation: 35, imageGeneration: 12 },
      enterprise: { translation: 70, imageGeneration: 20 }
    };

    const plan = user.subscriptionPlan || 'free';
    const limits = plans[plan as keyof typeof plans];

    return {
      plan: user.subscriptionPlan || 'free',
      expireAt: user.subscriptionExpireAt,
      isActive: !user.subscriptionExpireAt || user.subscriptionExpireAt > new Date(),
      usage: {
        translation: {
          used: user.translationUsesToday,
          limit: limits.translation,
          remaining: limits.translation - user.translationUsesToday
        },
        imageGeneration: {
          used: user.imageGenerationUsesToday,
          limit: limits.imageGeneration,
          remaining: limits.imageGeneration - user.imageGenerationUsesToday
        }
      }
    };
  }),

  checkUsageLimit: protectedProcedure
    .input(z.object({
      service: z.enum(['translation', 'imageGeneration'])
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          subscriptionPlan: true,
          translationUsesToday: true,
          imageGenerationUsesToday: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const plans = {
        free: { translation: 8, imageGeneration: 0 },
        starter: { translation: 15, imageGeneration: 2 },
        pro: { translation: 35, imageGeneration: 5 },
        enterprise: { translation: 70, imageGeneration: 10 }
      };

      const plan = user.subscriptionPlan || 'free';
      const limits = plans[plan as keyof typeof plans];
      const currentUsage = input.service === 'translation' 
        ? user.translationUsesToday 
        : user.imageGenerationUsesToday;
      const dailyLimit = limits[input.service as keyof typeof limits];

      return {
        canUse: currentUsage < dailyLimit,
        currentUsage,
        dailyLimit,
        remaining: dailyLimit - currentUsage
      };
    }),

  recordUsage: protectedProcedure
    .input(z.object({
      service: z.enum(['translation', 'imageGeneration'])
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const updateData = input.service === 'translation' 
        ? { translationUsesToday: { increment: 1 } }
        : { imageGenerationUsesToday: { increment: 1 } };

      await prisma.user.update({
        where: { id: userId },
        data: updateData
      });

      return { success: true };
    }),

  upgradeSubscription: protectedProcedure
    .input(z.object({
      plan: z.enum(['starter', 'pro', 'enterprise']),
      billingCycle: z.enum(['monthly', 'yearly'])
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const prices = {
        starter: { monthly: 9.99, yearly: 99.99 },
        pro: { monthly: 19.99, yearly: 199.99 },
        enterprise: { monthly: 39.99, yearly: 399.99 }
      };

      const price = prices[input.plan][input.billingCycle];
      const months = input.billingCycle === 'yearly' ? 12 : 1;
      
      const expireAt = new Date();
      expireAt.setMonth(expireAt.getMonth() + months);

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: input.plan,
          subscriptionExpireAt: expireAt
        }
      });

      return { success: true, price, expireAt };
    })
}); 