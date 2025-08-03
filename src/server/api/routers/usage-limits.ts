import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { db } from '~/server/db';

export const usageLimitsRouter = createTRPCRouter({
  // 获取用户使用统计（支持未登录用户）
  getUserUsageStats: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    
    if (!userId) {
      // 未登录用户返回默认限制
      return {
        usage: {
          translation: { used: 0, limit: 8, remaining: 8 },
          imageGeneration: { used: 0, limit: 0, remaining: 0 }
        }
      };
    }
    
    // 登录用户从数据库获取真实统计
    try {
      // 获取用户信息
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          subscriptionPlan: true,
          subscriptionExpireAt: true,
          translationUsesToday: true,
          imageGenerationUsesToday: true,
          lastUsageReset: true
        }
      });
      
      if (!user) {
        return {
          usage: {
            translation: { used: 0, limit: 8, remaining: 8 },
            imageGeneration: { used: 0, limit: 0, remaining: 0 }
          }
        };
      }
      
      // 检查是否需要重置每日使用量
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (!user.lastUsageReset || user.lastUsageReset < today) {
        await db.user.update({
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
      
      // 判断订阅状态
      const isSubscriptionActive = user.subscriptionExpireAt && user.subscriptionExpireAt > new Date();
      
      // 定义各计划的限制
      const plans = {
        free: { translation: 8, imageGeneration: 0 },
        starter: { translation: 15, imageGeneration: 5 },
        pro: { translation: 35, imageGeneration: 12 },
        enterprise: { translation: 70, imageGeneration: 20 }
      };
      
      const plan = user.subscriptionPlan || 'free';
      const limits = plans[plan as keyof typeof plans];
      
      return {
        usage: {
          translation: { 
            used: user.translationUsesToday, 
            limit: limits.translation, 
            remaining: Math.max(0, limits.translation - user.translationUsesToday) 
          },
          imageGeneration: { 
            used: user.imageGenerationUsesToday, 
            limit: limits.imageGeneration, 
            remaining: Math.max(0, limits.imageGeneration - user.imageGenerationUsesToday) 
          }
        }
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return {
        usage: {
          translation: { used: 0, limit: 8, remaining: 8 },
          imageGeneration: { used: 0, limit: 0, remaining: 0 }
        }
      };
    }
  }),

  // 记录服务使用（支持未登录用户）
  recordServiceUsage: publicProcedure
    .input(z.object({
      service: z.enum(['translation', 'imageGeneration'])
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      
      if (!userId) {
        // 未登录用户不记录使用量，但返回成功
        return { success: true };
      }
      
      try {
        // 更新用户的使用统计
        const updateData = input.service === 'translation' 
          ? { translationUsesToday: { increment: 1 } }
          : { imageGenerationUsesToday: { increment: 1 } };
        
        await db.user.update({
          where: { id: userId },
          data: updateData
        });
        
        return { success: true };
      } catch (error) {
        console.error('Error recording service usage:', error);
        return { success: false, error: 'Failed to record usage' };
      }
    })
}); 