import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { openai } from '~/server/openai';
import { prisma } from '~/server/db';
import { performSecurityCheck } from '@/server/api/security';

export const emojiRouter = createTRPCRouter({
  translate: protectedProcedure
    .input(z.object({ text: z.string(), mode: z.string(), model: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      console.log('==== emoji.translate mutation called ====');
      const userId = ctx.session?.userId;
      console.log('emoji.translate userId from session:', userId);
      if (!userId) throw new Error('No userId in session');
      // 获取用户信息
      const user = await prisma.user.findUnique({ where: { id: userId } });
      console.log('user from db:', user);
      if (!user) throw new Error('User not found');
      const isPremium = user.premiumExpireAt && new Date(user.premiumExpireAt) > new Date();
      // 额度判断
      if (isPremium) {
        if ((user.freeUsesDaily ?? 0) < 1) throw new Error('Daily quota exceeded.');
      } else {
        if ((user.freeUsesDaily ?? 0) < 1) throw new Error('每日免费额度已用完');
        // 免费用户只能用normal风格和gpt-3.5
        if (input.mode !== 'normal') throw new Error('免费用户仅可用默认风格');
        if (input.model && input.model !== 'gpt-3.5-turbo') throw new Error('免费用户仅可用GPT-3.5');
      }
      // 获取客户端信息
      const req = ctx.req as { headers?: { get?: (key: string) => string | null } } | undefined;
      const ip = String(req?.headers?.get?.('x-forwarded-for') ?? req?.headers?.get?.('x-real-ip') ?? 'unknown');
      const userAgent = String(req?.headers?.get?.('user-agent') ?? 'unknown');
      // 执行综合安全检查
      await performSecurityCheck(userId, ip, userAgent);
      // 选择模型
      const model = isPremium ? 'gpt-4' : 'gpt-3.5-turbo';
      // 执行翻译
      const result = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: '你是一个表情翻译器，根据用户输入和风格生成带有丰富表情的回复。' },
          { role: 'user', content: input.text }
        ]
      });
      // 扣减额度
      if (isPremium) {
        await prisma.user.update({ where: { id: userId }, data: { freeUsesDaily: { decrement: 1 } } });
      } else {
        await prisma.user.update({ where: { id: userId }, data: { freeUsesDaily: { decrement: 1 } } });
      }
      return { result: result.choices[0]?.message?.content || '' };
    }),
}); 