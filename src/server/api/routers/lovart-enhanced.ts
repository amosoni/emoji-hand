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
      
      const isPremium = user.premiumExpireAt && new Date(user.premiumExpireAt) > new Date();
      // 额度判断 - 暂时跳过
      // if (!isPremium && (user.translationUsesToday ?? 0) >= 8) {
      //   throw new Error('每日免费额度已用完');
      // }

      // 构建设计代理提示词
      const systemPrompt = `你是一个专业的AI设计代理，像Lovart AI一样工作。你需要：

1. 分析用户需求
2. 制定设计策略
3. 生成创意概念
4. 提供商业建议

设计类型：${input.style || 'emoji'}
目标受众：${input.targetAudience || '通用'}
风格要求：${input.emotion || '现代简约'}
商业用途：${input.commercialUse ? '是' : '否'}

请提供：
- 设计概念分析
- 3个创意方向
- 色彩和字体建议
- 商业价值评估
- 实施建议`;

      const userPrompt = `用户需求：${input.emotion || '生成表情包设计'}

请像专业设计师一样，为这个需求提供完整的设计解决方案。`;

      // 生成设计概念
      const conceptResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8
      });

      const concept = conceptResponse.choices[0]?.message?.content ?? '';

      // 生成视觉设计
      const visualPrompts = [
        `${userPrompt}, professional, high quality, detailed`,
        `${userPrompt}, creative, artistic, unique style`,
        `${userPrompt}, minimalist, clean, elegant`,
        `${userPrompt}, modern, trendy, contemporary`,
        `${userPrompt}, innovative, cutting-edge, futuristic`
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

      // 生成商业建议
      const businessResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "你是一个商业策略专家，请为设计项目提供专业的商业建议。"
          },
          {
            role: "user",
            content: `基于以下设计概念：${concept}

请提供：
1. 商业价值评估
2. 目标市场分析
3. 营销策略建议
4. 实施路线图
5. 风险控制建议`
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      const businessAdvice = businessResponse.choices[0]?.message?.content ?? '';

      // 消耗配额 - 暂时跳过
      // await prisma.user.update({
      //   where: { id: userId },
      //   data: { translationUsesToday: { increment: 1 } }
      // });

      return {
        designType: input.style || 'emoji',
        concepts: concept,
        businessAdvice,
        visualDesigns: visualResults,
        analysis: `设计类型：${input.style || 'emoji'}\n目标受众：${input.targetAudience || '通用'}\n商业用途：${input.commercialUse ? '是' : '否'}`
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
      
      const isPremium = user.premiumExpireAt && new Date(user.premiumExpireAt) > new Date();
      // 额度判断 - 暂时跳过
      // if (!isPremium && (user.freeUsesDaily ?? 0) < 1) {
      //   throw new Error('每日免费额度已用完');
      // }

      const systemPrompt = `你是一个专业的品牌设计代理，需要为品牌提供完整的视觉识别系统：

品牌名称：${input.brandName}
行业：${input.industry}
目标受众：${input.targetAudience}
品牌价值观：${input.brandValues.join(', ')}
色彩偏好：${input.colorPreferences?.join(', ') || '无特殊要求'}

请提供：
1. 品牌定位分析
2. 视觉识别系统（Logo、色彩、字体）
3. 品牌应用场景
4. 品牌指南建议
5. 商业价值评估`;

      const brandResponse = await openai.chat.completions.create({
        model: isPremium ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `请为品牌"${input.brandName}"创建完整的品牌设计方案` }
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
      
      const isPremium = user.premiumExpireAt && new Date(user.premiumExpireAt) > new Date();
      // 额度判断 - 暂时跳过
      // if (!isPremium && (user.freeUsesDaily ?? 0) < 1) {
      //   throw new Error('每日免费额度已用完');
      // }

      const systemPrompt = `你是一个专业的3D设计代理，需要为用户提供3D设计解决方案：

对象类型：${input.objectType}
设计风格：${input.style || '现代'}
视角要求：${input.perspective || '多角度'}

请提供：
1. 3D设计概念分析
2. 技术规格建议
3. 材质和光照方案
4. 渲染建议
5. 应用场景分析`;

      const designResponse = await openai.chat.completions.create({
        model: isPremium ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `请为"${input.prompt}"创建3D设计方案` }
        ],
        max_tokens: 1500
      });

      // 生成3D渲染图 - 一次性生成5张渲染图
      const renderPrompts = [
        `${input.prompt}, 3D render, ${input.style || 'modern'}, professional lighting, high quality, detailed`,
        `${input.prompt}, 3D render, ${input.style || 'modern'}, different angle, detailed, realistic`,
        `${input.prompt}, 3D render, ${input.style || 'modern'}, wireframe view, technical, blueprint`,
        `${input.prompt}, 3D render, ${input.style || 'modern'}, close-up view, texture detail`,
        `${input.prompt}, 3D render, ${input.style || 'modern'}, dramatic lighting, cinematic`
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