import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { prisma } from '~/server/db';

export const adminRouter = createTRPCRouter({
  // 重置用户的使用次数（仅用于测试）
  resetUserUsage: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      translationUsesToday: z.number().default(0),
      imageGenerationUsesToday: z.number().default(0)
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');

      // 查找用户
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: { id: true, email: true, subscriptionPlan: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // 更新用户的使用次数
      await prisma.user.update({
        where: { id: user.id },
        data: {
          translationUsesToday: input.translationUsesToday,
          imageGenerationUsesToday: input.imageGenerationUsesToday,
          lastUsageReset: new Date()
        }
      });

      return {
        success: true,
        message: `User ${input.email} usage reset successfully`,
        user: {
          id: user.id,
          email: user.email,
          subscriptionPlan: user.subscriptionPlan,
          translationUsesToday: input.translationUsesToday,
          imageGenerationUsesToday: input.imageGenerationUsesToday
        }
      };
    }),

  // 获取用户信息
  getUserInfo: protectedProcedure
    .input(z.object({
      email: z.string().email()
    }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: {
          id: true,
          email: true,
          subscriptionPlan: true,
          translationUsesToday: true,
          imageGenerationUsesToday: true,
          lastUsageReset: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    })
}); 