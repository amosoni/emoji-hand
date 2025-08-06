import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { openai } from '~/server/openai';
import { prisma } from '~/server/db';

export const emojiPackRouter = createTRPCRouter({
  // 基于图片生成表情包
  generateEmojiPack: protectedProcedure
    .input(z.object({
      imageUrl: z.string(), // 用户上传的图片URL
      style: z.string().optional(),
      emotion: z.string().optional(), // 情感风格
      targetAudience: z.string().optional(),
      commercialUse: z.boolean().default(false),
      packCount: z.number().min(1).max(5).default(3) // 生成数量：1-5个
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');

      // 检查订阅状态和每日使用限制
      const user = await prisma.user.findUnique({ 
        where: { id: userId },
        select: {
          id: true,
          subscriptionPlan: true,
          imageGenerationUsesToday: true,
          lastUsageReset: true
        }
      });
      
      if (!user) throw new Error('User not found');
      
      // 检查是否需要重置每日使用量
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (!user.lastUsageReset || user.lastUsageReset < today) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            imageGenerationUsesToday: 0,
            lastUsageReset: today
          }
        });
        user.imageGenerationUsesToday = 0;
      }
      
      // 根据订阅计划获取每日限制
      const planLimits = {
        free: 0,
        starter: 5,
        pro: 10,
        enterprise: 25
      };
      
      const plan = user.subscriptionPlan || 'free';
      const dailyLimit = planLimits[plan as keyof typeof planLimits];
      const currentUsage = user.imageGenerationUsesToday;
      
      if (currentUsage + input.packCount > dailyLimit) {
        throw new Error(`Daily limit exceeded. You can generate ${dailyLimit - currentUsage} more packs today. Please upgrade your subscription for more daily usage.`);
      }

      // 使用Vision API分析图片内容
      const visionResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `分析这张图片中的主体内容，识别主要元素、表情、动作、风格等特征。请用中文详细描述图片内容，包括：
1. 主体对象（人物、动物、物品等）
2. 表情和情感状态
3. 动作和姿态
4. 视觉风格和色彩
5. 适合制作表情包的元素
                
分析结果将用于生成5个不同风格的表情包设计。`
              },
              {
                type: 'image_url',
                image_url: {
                  url: input.imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500
      }).catch((error: any) => {
        // 处理API错误并返回用户友好的错误信息
        console.error('Vision API error:', error);
        if (error?.message?.includes('deprecated')) {
          throw new Error('apiModelDeprecated');
        } else if (error?.message?.includes('rate limit')) {
          throw new Error('apiRateLimit');
        } else if (error?.message?.includes('quota')) {
          throw new Error('apiQuotaExceeded');
        } else {
          throw new Error('imageAnalysisFailed');
        }
      });

      const imageAnalysis = visionResponse.choices[0]?.message?.content ?? '';

      // 根据用户选择生成不同数量的表情包
      const allPrompts = [
        `${imageAnalysis} 可爱风格表情包, 卡通化, 大眼睛, 萌系, 适合社交媒体`,
        `${imageAnalysis} 搞笑风格表情包, 夸张表情, 幽默元素, 适合聊天`,
        `${imageAnalysis} 经典风格表情包, 简洁设计, 通用性强, 适合各种场景`,
        `${imageAnalysis} 酷炫风格表情包, 时尚感, 潮流元素, 适合年轻人`,
        `${imageAnalysis} 创意风格表情包, 独特设计, 艺术感, 适合特殊场合`
      ];
      
      const emojiPrompts = allPrompts.slice(0, input.packCount);

      // 生成5个表情包图片
      const emojiResults = await Promise.all(
        emojiPrompts.map(async (prompt, index) => {
          try {
            const response = await openai.images.generate({
              model: 'dall-e-3',
              prompt: `${prompt}, high quality, transparent background, emoji style, ${input.style ?? ''}`,
              n: 1,
              size: '1024x1024',
              quality: 'hd'
            });
                         return {
               url: response.data?.[0]?.url ?? null,
               style: ['可爱', '搞笑', '经典', '酷炫', '创意'][index],
               description: prompt
             };
          } catch (error) {
            console.error(`Emoji generation error ${index}:`, error);
            return {
              url: null,
              style: ['可爱', '搞笑', '酷炫', '经典', '创意'][index],
              description: prompt
            };
          }
        })
      );

      // 生成表情包描述和建议
      const descriptionResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一个表情包设计专家，需要为用户生成的表情包提供专业建议。'
          },
          {
            role: 'user',
            content: `基于以下图片分析：${imageAnalysis}

请提供：
1. 表情包设计理念
2. ${input.packCount}个表情包的使用场景建议
3. 商业价值评估（如果用户选择商业用途）
4. 优化建议`
          }
        ],
        max_tokens: 800
      });

      // 更新每日使用量
      await prisma.user.update({
        where: { id: userId },
        data: {
          imageGenerationUsesToday: { increment: input.packCount }
        }
      });

      // 记录使用历史
      await prisma.emojiPackUsage.create({
        data: {
          userId,
          packCount: input.packCount,
          style: input.style ?? 'mixed',
          cost: input.packCount * 0.04 // 估算成本
        }
      });

      return {
        imageAnalysis,
        emojiPacks: emojiResults.filter(result => result.url !== null),
        designAdvice: descriptionResponse.choices[0]?.message?.content ?? '',
        targetAudience: input.targetAudience,
        commercialUse: input.commercialUse,
        remainingCredits: dailyLimit - (currentUsage + input.packCount)
      };
    }),

  // 获取表情包生成历史
  getEmojiPackHistory: protectedProcedure
    .input(z.object({ 
      days: z.number().min(1).max(30).default(7) 
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');

      // 这里可以添加表情包生成历史记录的逻辑
      // 目前返回模拟数据
      const history = Array.from({ length: input.days }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        packs: Math.floor(Math.random() * 3) + 1,
        styles: ['可爱', '搞笑', '酷炫', '经典', '创意'].slice(0, Math.floor(Math.random() * 3) + 1)
      }));

      return history;
    })
}); 