import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';

export const usageLimitsRouter = createTRPCRouter({
  // 获取用户使用统计（暂时静态化）
  getUserUsageStats: protectedProcedure.query(async () => {
    return {
      usage: {
        translation: { used: 0, limit: 8, remaining: 8 },
        imageGeneration: { used: 0, limit: 0, remaining: 0 }
      }
    };
  }),

  // 记录服务使用（暂时静态化）
  recordServiceUsage: protectedProcedure
    .input(z.object({
      service: z.enum(['translation', 'imageGeneration'])
    }))
    .mutation(async () => {
      return { success: true };
    })
}); 