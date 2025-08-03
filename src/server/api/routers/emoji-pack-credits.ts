import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { prisma } from '~/server/db';

export const emojiPackCreditsRouter = createTRPCRouter({
  // 获取用户积分信息
  getEmojiPackCredits: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
        totalCreditsEarned: true,
        totalCreditsSpent: true,
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

    return {
      credits: user.credits,
      totalEarned: user.totalCreditsEarned,
      totalSpent: user.totalCreditsSpent,
      subscription: {
        plan: user.subscriptionPlan || 'free',
        expireAt: user.subscriptionExpireAt,
        isActive: !user.subscriptionExpireAt || user.subscriptionExpireAt > new Date()
      },
      usage: {
        translation: user.translationUsesToday,
        imageGeneration: user.imageGenerationUsesToday
      }
    };
  }),

  // 积分套餐配置
  getCreditPackages: publicProcedure.query(() => {
    return {
      packages: [
        {
          id: 'starter',
          title: '스타터 패키지',
          description: '경미한 사용에 적합, 약 50회 기본 번역 또는 5회 이모지 생성',
          credits: 100,
          price: 9.99,
          bonus: 0
        },
        {
          id: 'popular',
          title: '인기 패키지',
          description: '개인 사용자에 적합, 약 25회 이모지 생성 또는 5회 Lovart 디자인',
          credits: 550,
          price: 39.99,
          bonus: 50
        },
        {
          id: 'pro',
          title: '프로 패키지',
          description: '전문 사용자에 적합, 약 10회 Lovart 디자인 또는 50회 고품질 번역',
          credits: 1150,
          price: 69.99,
          bonus: 150
        },
        {
          id: 'enterprise',
          title: '기업 패키지',
          description: '기업 사용자에 적합, 약 30회 Lovart 디자인 또는 125회 이모지 생성',
          credits: 3000,
          price: 149.99,
          bonus: 500
        }
      ]
    };
  }),

  // 购买积分
  purchaseEmojiPackCredits: protectedProcedure
    .input(z.object({
      packageId: z.enum(['starter', 'popular', 'pro', 'enterprise'])
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const packages = {
        starter: { credits: 100, price: 9.99, bonus: 0 },
        popular: { credits: 550, price: 39.99, bonus: 50 },
        pro: { credits: 1150, price: 69.99, bonus: 150 },
        enterprise: { credits: 3000, price: 149.99, bonus: 500 }
      };

      const selectedPackage = packages[input.packageId];
      const totalCredits = selectedPackage.credits + selectedPackage.bonus;

      // 这里应该集成支付系统
      // 暂时模拟支付成功

      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: { increment: totalCredits },
          totalCreditsEarned: { increment: totalCredits }
        }
      });

      // 记录购买记录
      await prisma.emojiPackPurchase.create({
        data: {
          userId,
          package: input.packageId,
          credits: totalCredits,
          price: selectedPackage.price,
          quantity: 1
        }
      });

      // 记录积分交易
      await prisma.creditTransaction.create({
        data: {
          userId,
          type: 'purchase',
          amount: totalCredits,
          description: `${input.packageId} 패키지 구매`
        }
      });

      return {
        success: true,
        creditsAdded: totalCredits,
        newBalance: (await prisma.user.findUnique({
          where: { id: userId },
          select: { credits: true }
        }))?.credits || 0
      };
    }),

  // 消费积分
  consumeEmojiPackCredits: protectedProcedure
    .input(z.object({
      service: z.enum(['translation', 'imageGeneration']),
      count: z.number().min(1).max(10)
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          credits: true,
          subscriptionPlan: true,
          subscriptionExpireAt: true,
          translationUsesToday: true,
          imageGenerationUsesToday: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // 检查订阅状态
      const isSubscriptionActive = user.subscriptionExpireAt && user.subscriptionExpireAt > new Date();
      
      if (isSubscriptionActive) {
        // 使用订阅系统
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

        if (currentUsage + input.count > dailyLimit) {
          throw new Error(`일일 사용 한도를 초과했습니다. 남은 사용량: ${dailyLimit - currentUsage}`);
        }

        // 记录使用量
        const updateData = input.service === 'translation' 
          ? { translationUsesToday: { increment: input.count } }
          : { imageGenerationUsesToday: { increment: input.count } };

        await prisma.user.update({
          where: { id: userId },
          data: updateData
        });

        return { success: true, usedCredits: 0, remaining: dailyLimit - currentUsage - input.count };
      } else {
        // 使用积分系统
        const creditCosts = {
          translation: 1,
          imageGeneration: 20
        };

        const costPerUse = creditCosts[input.service];
        const requiredCredits = input.count * costPerUse;

        if (user.credits < requiredCredits) {
          throw new Error(`적립이 부족합니다. 필요: ${requiredCredits}, 보유: ${user.credits}`);
        }

        // 扣除积分
        await prisma.user.update({
          where: { id: userId },
          data: {
            credits: { decrement: requiredCredits },
            totalCreditsSpent: { increment: requiredCredits }
          }
        });

        // 记录使用记录
        await prisma.usageRecord.create({
          data: {
            userId,
            serviceType: input.service,
            creditsUsed: requiredCredits,
            cost: requiredCredits * 0.01 // 假设1积分=0.01美元
          }
        });

        return { 
          success: true, 
          usedCredits: requiredCredits, 
          remaining: user.credits - requiredCredits 
        };
      }
    }),

  // 获取购买历史
  getPurchaseHistory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const purchases = await prisma.emojiPackPurchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return { purchases };
  }),

  // 获取使用统计
  getUsageStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const usageRecords = await prisma.usageRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const stats = {
      totalGenerated: usageRecords.length,
      totalSessions: new Set(usageRecords.map(r => r.createdAt.toDateString())).size,
      averagePerSession: usageRecords.length > 0 
        ? usageRecords.reduce((sum, r) => sum + r.creditsUsed, 0) / usageRecords.length 
        : 0
    };

    return { stats, recentUsage: usageRecords.slice(0, 10) };
  })
}); 