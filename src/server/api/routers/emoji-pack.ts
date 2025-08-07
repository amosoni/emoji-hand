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
      packCount: z.number().min(1).max(5).default(3), // 生成数量：1-5个
      customPrompt: z.string().optional()
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

      // 简化图片分析，只提取关键信息
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Analyze the main elements in the image, describe briefly in 50 words or less."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please briefly analyze the main elements in this image:"
              },
              {
                type: "image_url",
                image_url: {
                  url: input.imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 100,
        temperature: 0.8
      });

      const imageAnalysis = visionResponse.choices[0]?.message?.content ?? '';

      // 根据用户选择的风格对原图进行转换
      const getStylePrompt = (style: string) => {
        const stylePrompts = {
          'cute': `${imageAnalysis} transform to cute style, soft colors, gentle expressions, maintain original characters`,
          'funny': `${imageAnalysis} transform to funny style, playful expressions, keep original characters`,
          'cool': `${imageAnalysis} transform to cool style, modern aesthetic, maintain original composition`,
          'savage': `${imageAnalysis} transform to savage style, edgy look, keep original characters`,
          'genz': `${imageAnalysis} transform to GenZ style, contemporary colors, maintain original composition`,
          'tiktok': `${imageAnalysis} transform to TikTok style, trendy look, keep original characters`,
          'vintage': `${imageAnalysis} transform to vintage style, retro colors, classic aesthetic`,
          'minimalist': `${imageAnalysis} transform to minimalist style, clean design, simplified colors`
        };
        return stylePrompts[style as keyof typeof stylePrompts] ?? stylePrompts.cute;
      };

      // 合并用户自定义提示词
      const userPrompt = input.customPrompt ? `, ${input.customPrompt}` : '';
      const basePrompt = getStylePrompt(input.style ?? 'cute') + userPrompt;
      
      // 生成多个变体
      const emojiResults = await Promise.all(
        Array.from({ length: input.packCount }, async (_, index) => {
          try {
            // 为每个变体添加不同的修饰词，确保明显的视觉差异
            const variations = [
              'version 1, original design, front view, centered composition',
              'version 2, side profile, dynamic pose, action shot',
              'version 3, close-up portrait, detailed facial expression',
              'version 4, wide angle, full body, environmental context',
              'version 5, artistic angle, creative lighting, unique perspective'
            ];
            
            // 基于原图进行风格转换，保持原图主体不变
            const customText = input.emotion ? `, subtly incorporate the text "${input.emotion}" into the design if requested, but prioritize maintaining the original image composition and characters` : '';
            // 合并自定义提示词
            const userPrompt = input.customPrompt ? `, ${input.customPrompt}` : '';
            const variationPrompt = `${basePrompt}, ${variations[index] ?? `version ${index + 1}`}, based on the original image, maintain the original characters and composition, apply ${input.style ?? 'cute'} style transformation, high quality, clean background${customText}${userPrompt}`;
            
            const response = await openai.images.generate({
              model: 'dall-e-3',
              prompt: variationPrompt,
              n: 1,
              size: '1024x1024',
              quality: 'hd'
            });
            
            return {
              url: response.data?.[0]?.url ?? null,
              style: input.style ?? 'cute',
              description: `${input.style ?? 'cute'}风格表情包 - 变体${index + 1}`
            };
          } catch (error) {
            console.error(`Emoji generation error ${index}:`, error);
            return {
              url: null,
              style: input.style ?? 'cute',
              description: `${input.style ?? 'cute'}风格表情包 - 变体${index + 1}`
            };
          }
        })
      );

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
        imageAnalysis: imageAnalysis, // 简化的分析
        emojiPacks: emojiResults.filter(result => result.url !== null),
        designAdvice: null, // 移除啰嗦的设计建议
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