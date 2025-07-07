import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { openai } from '~/server/openai';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { performSecurityCheck } from './security';

// 每日配额检查函数
const checkDailyQuota = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);
  const today = new Date().toDateString();
  const lastResetDate = user.publicMetadata.lastResetDate;
  const isPremium = !!user.publicMetadata.premiumExpireAt && new Date(user.publicMetadata.premiumExpireAt as string) > new Date();
  
  // 如果是新的一天，重置配额
  if (lastResetDate !== today) {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        lastResetDate: today,
        dailyUsage: 0,
        freeUsesDaily: 5, // 免费用户每日5次
        premiumUsesDaily: 20, // 会员每日20次
      },
    });
    return { canUse: true, remaining: isPremium ? 20 : 5 };
  }
  
  const dailyUsage = (user.publicMetadata.dailyUsage as number) || 0;
  const maxUsage = isPremium ? 20 : 5;
  
  if (dailyUsage >= maxUsage) {
    throw new Error('Daily quota exceeded');
  }
  
  return { canUse: true, remaining: maxUsage - dailyUsage };
};

// 增加使用次数
const incrementDailyUsage = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);
  const currentUsage = (user.publicMetadata.dailyUsage as number) || 0;
  
  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      dailyUsage: currentUsage + 1,
    },
  });
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