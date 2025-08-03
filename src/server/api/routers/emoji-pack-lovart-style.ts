import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { prisma } from '~/server/db';

export const emojiPackLovartStyleRouter = createTRPCRouter({
  // 暂时注释掉所有功能，先让构建通过
  /*
  // 获取用户积分状态
  getEmojiPackCredits: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) throw new Error('No userId in session');
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        credits: true,
        totalCreditsEarned: true,
        lastCheckIn: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      credits: user.credits ?? 0,
      totalGenerated: user.totalCreditsEarned ?? 0,
      lastUsed: user.lastCheckIn,
      registrationBonus: false // 暂时设为false
    };
  }),

  // 领取注册奖励
  claimRegistrationBonus: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) throw new Error('No userId in session');

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
        emojiPackRegistrationBonus: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emojiPackRegistrationBonus) {
      throw new Error('Registration bonus already claimed');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: 10
        },
        emojiPackRegistrationBonus: true
      }
    });

    return {
      success: true,
      creditsAdded: 10,
      totalCredits: (user.credits ?? 0) + 10
    };
  }),

  // 购买积分
  purchaseEmojiPackCredits: protectedProcedure
    .input(z.object({
      amount: z.number().min(1).max(1000)
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');

      const totalCredits = input.amount;

      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: totalCredits
          }
        }
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          credits: true
        }
      });

      return {
        success: true,
        creditsAdded: totalCredits,
        totalCredits: user?.credits ?? 0
      };
    }),

  // 生成表情包
  generateEmojiPack: protectedProcedure
    .input(z.object({
      imageUrl: z.string(),
      packCount: z.number().min(1).max(5).default(3),
      style: z.string().optional(),
      emotion: z.string().optional(),
      targetAudience: z.string().optional(),
      commercialUse: z.boolean().default(false)
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          credits: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const costPerPack = 1;
      const requiredCredits = input.packCount;
      const currentCredits = user.credits ?? 0;

      if (currentCredits < requiredCredits) {
        throw new Error(`积分不足，需要${requiredCredits}积分，当前有${currentCredits}积分，请购买积分`);
      }

      // 这里应该调用AI生成表情包的逻辑
      // 暂时返回模拟数据
      const mockResults = Array.from({ length: input.packCount }, (_, i) => ({
        id: `pack-${i + 1}`,
        url: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Mock+Emoji+Pack',
        style: input.style || 'cute',
        description: `Generated emoji pack ${i + 1}`
      }));

      // 扣减积分
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: requiredCredits
          },
          totalCreditsEarned: {
            increment: input.packCount
          },
          lastCheckIn: new Date()
        }
      });

      return {
        success: true,
        packs: mockResults,
        creditsUsed: requiredCredits,
        remainingCredits: currentCredits - requiredCredits
      };
    })
  */
}); 