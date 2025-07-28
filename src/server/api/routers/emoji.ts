import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { openai } from '~/server/openai';
import { prisma } from '~/server/db';
import { performSecurityCheck } from '@/server/api/security';

export const emojiRouter = createTRPCRouter({
  translate: protectedProcedure
    .input(z.object({ text: z.string(), mode: z.string(), model: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      console.error('==== emoji.translate mutation called ====');
      const userId = ctx.session?.userId;
      console.error('emoji.translate userId from session:', userId);
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
      
      // 根据模式生成不同的系统提示
      const getSystemPrompt = (mode: string) => {
        switch (mode) {
          case 'normal':
            return '你是一个表情翻译器，根据用户输入生成带有丰富表情的回复。自然地添加相关表情符号来增强文本的表达力。';
          case 'savage':
            return '你是一个毒舌表情翻译器，将用户输入转换为带有讽刺、机智和态度的表情表达。使用尖锐、幽默的表情符号。';
          case 'genz':
            return '你是一个GenZ俚语表情翻译器，将用户输入转换为Z世代流行的网络用语和潮流表情符号。使用现代、时尚的表达方式。';
          case 'tiktok':
            return '你是一个TikTok风格表情翻译器，将用户输入转换为类似TikTok视频中常见的表情表达。使用夸张、有趣、富有感染力的表情符号，模仿TikTok创作者的表达风格。优先使用抖音官方隐藏表情如[smile]、[happy]、[loveface]等，以及抖音特有的表情组合如👁👄👁、🥺👉👈等。';
          default:
            return '你是一个表情翻译器，根据用户输入和风格生成带有丰富表情的回复。';
        }
      };
      
      // 执行翻译
      const result = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: getSystemPrompt(input.mode) },
          { role: 'user', content: input.text }
        ]
      });
      // 扣减额度
      if (isPremium) {
        await prisma.user.update({ where: { id: userId }, data: { freeUsesDaily: { decrement: 1 } } });
      } else {
        await prisma.user.update({ where: { id: userId }, data: { freeUsesDaily: { decrement: 1 } } });
      }
      return { result: result.choices[0]?.message?.content ?? '' };
    }),
}); 