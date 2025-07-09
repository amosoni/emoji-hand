import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { openai } from '~/server/openai';
// 删除 import { clerkClient } from '@clerk/clerk-sdk-node';
import { performSecurityCheck } from './security';

// 每日配额检查函数
const checkDailyQuota = async (userId: string) => {
  // 用户配额等用占位符或注释替换
  return { canUse: true, remaining: 10 }; // 示例：假设每日配额为10次
};

// 增加使用次数
const incrementDailyUsage = async (userId: string) => {
  // 用户配额等用占位符或注释替换
  console.log(`Incrementing usage for user: ${userId}`); // 示例：增加使用次数的逻辑
};

export const emojiRouter = createTRPCRouter({
  translate: protectedProcedure
    .input(z.object({ text: z.string(), mode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');
      
      // 获取客户端信息
      const ip = ctx.req?.headers.get('x-forwarded-for') || 
                 ctx.req?.headers.get('x-real-ip') || 
                 'unknown';
      const userAgent = ctx.req?.headers.get('user-agent') || 'unknown';
      
      // 执行综合安全检查
      await performSecurityCheck(userId, ip, userAgent);
      
      // 检查每日配额
      await checkDailyQuota(userId);
      
      // 执行翻译
      const result = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是一个表情翻译器，根据用户输入和风格生成带有丰富表情的回复。' },
          { role: 'user', content: input.text }
        ]
      });
      
      // 增加使用次数
      await incrementDailyUsage(userId);
      
      return { result: result.choices[0]?.message?.content || '' };
    }),
}); 