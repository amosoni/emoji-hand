import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { logSecurityEvent, SecurityEventType } from '@/server/api/monitoring';

// 简单的数学验证码生成
const generateMathCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let answer: number;
  switch (operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
    default:
      answer = num1 + num2;
  }
  
  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer: answer.toString(),
  };
};

// 验证码存储（生产环境建议用 Redis）
const captchaStore = new Map<string, { answer: string; expires: number }>();

// 安全获取 headers 工具
type HeadersLike = { get: (key: string) => unknown };
function hasHeaders(obj: unknown): obj is { headers: HeadersLike } {
  return !!obj && typeof obj === 'object' && 'headers' in obj && typeof (obj as { headers?: unknown }).headers === 'object' && typeof (obj as { headers: HeadersLike }).headers.get === 'function';
}
function getHeader(ctx: unknown, key: string): string | null {
  if (hasHeaders(ctx) && ctx.headers) {
    const value = ctx.headers.get(key);
    return typeof value === 'string' ? value : null;
  }
  if (
    ctx && typeof ctx === 'object' && 'req' in ctx && hasHeaders((ctx as { req?: unknown }).req)
  ) {
    const req = (ctx as { req: { headers: HeadersLike } }).req;
    const value = req.headers.get(key);
    return typeof value === 'string' ? value : null;
  }
  return null;
}

export const captchaRouter = createTRPCRouter({
  // 生成验证码
  generate: protectedProcedure
    .mutation(async ({ ctx }) => {
      const captcha = generateMathCaptcha();
      const captchaId = Math.random().toString(36).substring(2, 15);
      
      // 存储验证码，5分钟过期
      captchaStore.set(captchaId, {
        answer: captcha.answer,
        expires: Date.now() + 5 * 60 * 1000,
      });
      
      // 记录验证码生成事件
      await logSecurityEvent({
        type: SecurityEventType.CAPTCHA_REQUIRED,
        userId: typeof ctx.session?.userId === 'string' ? ctx.session.userId : undefined,
        ip: getHeader(ctx, 'x-forwarded-for'),
        userAgent: getHeader(ctx, 'user-agent'),
        details: { captchaId, question: captcha.question },
      });
      
      return {
        captchaId,
        question: captcha.question,
      };
    }),
  
  // 验证验证码
  verify: protectedProcedure
    .input(z.object({ 
      captchaId: z.string(), 
      answer: z.string() 
    }))
    .mutation(async ({ input, ctx }) => {
      const stored = captchaStore.get(input.captchaId);
      
      if (!stored) {
        await logSecurityEvent({
          type: SecurityEventType.CAPTCHA_FAILED,
          userId: typeof ctx.session?.userId === 'string' ? ctx.session.userId : undefined,
          ip: getHeader(ctx, 'x-forwarded-for'),
          userAgent: getHeader(ctx, 'user-agent'),
          details: { captchaId: input.captchaId, reason: 'Captcha not found or expired' },
        });
        throw new Error('Captcha not found or expired');
      }
      
      if (Date.now() > stored.expires) {
        captchaStore.delete(input.captchaId);
        await logSecurityEvent({
          type: SecurityEventType.CAPTCHA_FAILED,
          userId: typeof ctx.session?.userId === 'string' ? ctx.session.userId : undefined,
          ip: getHeader(ctx, 'x-forwarded-for'),
          userAgent: getHeader(ctx, 'user-agent'),
          details: { captchaId: input.captchaId, reason: 'Captcha expired' },
        });
        throw new Error('Captcha expired');
      }
      
      if (stored.answer !== input.answer) {
        await logSecurityEvent({
          type: SecurityEventType.CAPTCHA_FAILED,
          userId: typeof ctx.session?.userId === 'string' ? ctx.session.userId : undefined,
          ip: getHeader(ctx, 'x-forwarded-for'),
          userAgent: getHeader(ctx, 'user-agent'),
          details: { captchaId: input.captchaId, reason: 'Incorrect answer', providedAnswer: input.answer },
        });
        throw new Error('Incorrect answer');
      }
      
      // 验证成功后删除验证码
      captchaStore.delete(input.captchaId);
      
      // 记录验证成功事件
      await logSecurityEvent({
        type: SecurityEventType.CAPTCHA_SUCCESS,
        userId: typeof ctx.session?.userId === 'string' ? ctx.session.userId : undefined,
        ip: getHeader(ctx, 'x-forwarded-for'),
        userAgent: getHeader(ctx, 'user-agent'),
        details: { captchaId: input.captchaId },
      });
      
      return { success: true };
    }),
}); 