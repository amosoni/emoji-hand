import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { openai } from '~/server/openai';
import { prisma } from '~/server/db';

export const lovartEnhancedRouter = createTRPCRouter({
  // 生成表情包设计
  generateEmojiPack: protectedProcedure
    .input(z.object({
      imageUrl: z.string(), // 用户上传的图片URL
      style: z.string().optional(), // 设计类型
      emotion: z.string().optional(), // 情感风格或文本提示
      targetAudience: z.string().optional(),
      commercialUse: z.boolean().default(false)
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');

      // 检查用户配额
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');
      
      const isPremium = user.subscriptionExpireAt && new Date(user.subscriptionExpireAt) > new Date() && user.subscriptionPlan !== 'free';
      // 额度判断 - 暂时跳过
      // if (!isPremium && (user.translationUsesToday ?? 0) >= 8) {
      //   throw new Error('每日免费额度已用完');
      // }

      // 简化设计概念生成
      const conceptResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Briefly describe the design requirements in 30 words or less."
          },
          {
            role: "user",
            content: `Design type: ${input.style ?? 'emoji'}\nTarget audience: ${input.targetAudience ?? 'General'}\nStyle requirements: ${input.emotion ?? 'Modern and simple'}`
          }
        ],
        max_tokens: 100,
        temperature: 0.8
      });

      const concept = conceptResponse.choices[0]?.message?.content ?? '';

      // 直接生成视觉设计，简化提示词
      const visualPrompts = [
        `${concept}, professional, high quality, detailed`,
        `${concept}, creative, artistic, unique style`,
        `${concept}, minimalist, clean, elegant`,
        `${concept}, modern, trendy, contemporary`,
        `${concept}, innovative, cutting-edge, futuristic`
      ];

      const visualResults = await Promise.all(
        visualPrompts.map(async (prompt, index) => {
          try {
            const response = await openai.images.generate({
              model: "dall-e-3",
              prompt,
              n: 1,
              size: "1024x1024",
              quality: "hd",
              style: "vivid"
            });
            return {
              id: `design-${index + 1}`,
              style: ['Professional', 'Creative', 'Minimalist', 'Modern', 'Innovative'][index],
              image: response.data?.[0]?.url ?? null,
              prompt
            };
          } catch (error) {
            console.error('DALL-E generation error:', error);
            return {
              id: `design-${index + 1}`,
              style: ['Professional', 'Creative', 'Minimalist', 'Modern', 'Innovative'][index],
              image: null,
              prompt
            };
          }
        })
      );

      // 移除商业建议生成
      const businessAdvice = '';

      // 消耗配额 - 暂时跳过
      // await prisma.user.update({
      //   where: { id: userId },
      //   data: { translationUsesToday: { increment: 1 } }
      // });

      return {
        designType: input.style ?? 'emoji',
        concepts: concept,
        businessAdvice,
        visualDesigns: visualResults,
        analysis: `Design type: ${input.style ?? 'emoji'}\nTarget audience: ${input.targetAudience ?? 'General'}\nCommercial use: ${input.commercialUse ? 'Yes' : 'No'}`
      };
    }),

  // 生成品牌设计
  generateBrandDesign: protectedProcedure
    .input(z.object({
      brandName: z.string(),
      industry: z.string(),
      targetAudience: z.string(),
      brandValues: z.array(z.string()),
      colorPreferences: z.array(z.string()).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');
      
      const isPremium = user.subscriptionExpireAt && new Date(user.subscriptionExpireAt) > new Date() && user.subscriptionPlan !== 'free';
      // 额度判断 - 暂时跳过
      // if (!isPremium && (user.freeUsesDaily ?? 0) < 1) {
      //   throw new Error('每日免费额度已用完');
      // }

      const systemPrompt = `You are a professional brand design agent, and you need to provide a complete visual identity system for the brand:

Brand Name: ${input.brandName}
Industry: ${input.industry}
Target Audience: ${input.targetAudience}
Brand Values: ${input.brandValues.join(', ')}
Color Preferences: ${input.colorPreferences?.join(', ') || 'No specific requirements'}

Please provide:
1. Brand positioning analysis
2. Visual identity system (Logo, color, font)
3. Brand application scenarios
4. Brand guidelines suggestions
5. Business value assessment`;

      const brandResponse = await openai.chat.completions.create({
        model: isPremium ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please create a complete brand design plan for brand "${input.brandName}"` }
        ],
        max_tokens: 2000
      });

      // 生成Logo设计 - 一次性生成5个Logo
      const logoPrompts = [
        `${input.brandName} logo, ${input.industry} industry, modern, professional, clean design, high quality`,
        `${input.brandName} logo, ${input.industry} industry, creative, unique, memorable, artistic`,
        `${input.brandName} logo, ${input.industry} industry, minimalist, elegant, sophisticated`,
        `${input.brandName} logo, ${input.industry} industry, bold, dynamic, contemporary`,
        `${input.brandName} logo, ${input.industry} industry, classic, timeless, refined`
      ];

      const logoResults = await Promise.all(
        logoPrompts.map(async (prompt) => {
          try {
            const response = await openai.images.generate({
              model: 'dall-e-3',
              prompt,
              n: 1,
              size: '1024x1024',
              quality: 'hd'
            });
            return response.data?.[0]?.url ?? null;
          } catch (error) {
            console.error('Logo generation error:', error);
            return null;
          }
        })
      );

      // 消耗配额 - 暂时跳过
      // await prisma.user.update({
      //   where: { id: userId },
      //   data: { translationUsesToday: { increment: 1 } }
      // });

      return {
        brandStrategy: brandResponse.choices[0]?.message?.content,
        logoDesigns: logoResults.filter(Boolean),
        brandName: input.brandName,
        industry: input.industry,
        remainingQuota: 0 // 暂时设为0
      };
    }),

  // 生成3D设计
  generate3DDesign: protectedProcedure
    .input(z.object({
      prompt: z.string(),
      objectType: z.enum(['product', 'character', 'environment', 'architecture']),
      style: z.string().optional(),
      perspective: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');
      
      const isPremium = user.subscriptionExpireAt && new Date(user.subscriptionExpireAt) > new Date() && user.subscriptionPlan !== 'free';
      // 额度判断 - 暂时跳过
      // if (!isPremium && (user.freeUsesDaily ?? 0) < 1) {
      //   throw new Error('每日免费额度已用完');
      // }

      const systemPrompt = `You are a professional 3D design agent, and you need to provide a 3D design solution for the user:

Object Type: ${input.objectType}
Design Style: ${input.style ?? 'Modern'}
Perspective Requirements: ${input.perspective ?? 'Multiple angles'}

Please provide:
1. 3D design concept analysis
2. Technical specifications suggestions
3. Material and lighting solutions
4. Rendering suggestions
5. Application scenario analysis`;

      const designResponse = await openai.chat.completions.create({
        model: isPremium ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please create a 3D design plan for "${input.prompt}"` }
        ],
        max_tokens: 1500
      });

      // 生成3D渲染图 - 一次性生成5张渲染图
      const renderPrompts = [
        `${input.prompt}, 3D render, ${input.style ?? 'modern'}, professional lighting, high quality, detailed`,
        `${input.prompt}, 3D render, ${input.style ?? 'modern'}, different angle, detailed, realistic`,
        `${input.prompt}, 3D render, ${input.style ?? 'modern'}, wireframe view, technical, blueprint`,
        `${input.prompt}, 3D render, ${input.style ?? 'modern'}, close-up view, texture detail`,
        `${input.prompt}, 3D render, ${input.style ?? 'modern'}, dramatic lighting, cinematic`
      ];

      const renderResults = await Promise.all(
        renderPrompts.map(async (prompt) => {
          try {
            const response = await openai.images.generate({
              model: 'dall-e-3',
              prompt,
              n: 1,
              size: '1024x1024',
              quality: 'hd'
            });
            return response.data?.[0]?.url ?? null;
          } catch (error) {
            console.error('3D render generation error:', error);
            return null;
          }
        })
      );

      // 消耗配额 - 暂时跳过
      // await prisma.user.update({
      //   where: { id: userId },
      //   data: { translationUsesToday: { increment: 1 } }
      // });

      return {
        designConcept: designResponse.choices[0]?.message?.content,
        renderImages: renderResults.filter(Boolean),
        objectType: input.objectType,
        style: input.style,
        remainingQuota: 0 // 暂时设为0
      };
    }),

  // 获取设计历史
  getDesignHistory: protectedProcedure
    .input(z.object({ 
      days: z.number().min(1).max(30).default(7) 
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.userId;
      if (!userId) throw new Error('No userId in session');

      // 这里可以添加设计历史记录的逻辑
      // 目前返回模拟数据
      const history = Array.from({ length: input.days }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        designs: Math.floor(Math.random() * 5) + 1,
        types: ['emoji', 'logo', 'poster', '3d'].slice(0, Math.floor(Math.random() * 3) + 1)
      }));

      return history;
    })
}); 