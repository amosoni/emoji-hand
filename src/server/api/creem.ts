import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

// Creem商品ID映射配置
export const CREEM_PRODUCT_IDS = {
  // 订阅套餐
  subscription: {
    starter: {
      monthly: 'prod_starter_monthly', // 请替换为实际的Creem商品ID
      yearly: 'prod_starter_yearly'    // 请替换为实际的Creem商品ID
    },
    pro: {
      monthly: 'prod_pro_monthly',     // 请替换为实际的Creem商品ID
      yearly: 'prod_pro_yearly'        // 请替换为实际的Creem商品ID
    },
    enterprise: {
      monthly: 'prod_enterprise_monthly', // 请替换为实际的Creem商品ID
      yearly: 'prod_enterprise_yearly'    // 请替换为实际的Creem商品ID
    }
  },
  // 积分包
  credits: {
    starter: 'prod_credits_starter',     // 请替换为实际的Creem商品ID
    popular: 'prod_credits_popular',     // 请替换为实际的Creem商品ID
    pro: 'prod_credits_pro',             // 请替换为实际的Creem商品ID
    enterprise: 'prod_credits_enterprise' // 请替换为实际的Creem商品ID
  }
} as const;

// 每日配额检查函数
const checkDailyQuota = async (userId: string) => {
  // 用户配额等用占位符或注释替换
  return { canUse: true, remaining: 5 }; // 示例：免费用户每日5次
};

// 增加使用次数
const incrementDailyUsage = async (userId: string) => {
  // 用户配额等用占位符或注释替换
};

export const creemRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.input(z.object({
    productId: z.string(),
    successUrl: z.string(),
    cancelUrl: z.string(),
  })).mutation(async ({ ctx, input }) => {
    let email: string | undefined;
    if ('user' in (ctx.session ?? {})) {
      email = (ctx.session as any).user?.email;
    } else if ('sessionClaims' in (ctx.session ?? {})) {
      email = (ctx.session as any).sessionClaims?.email;
    }
    if (!email) throw new Error('No email in session');
    console.log('createCheckoutSession input:', input);
    const proxy = process.env.CREEM_API_PROXY;
    const agent = proxy ? new HttpsProxyAgent(proxy) : undefined;
    try {
      const res = await axios.post('https://api.creem.io/v1/checkout/session', {
        product_id: input.productId,
        customer_email: email,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      }, {
        headers: { Authorization: `Bearer ${process.env.CREEM_API_KEY}` },
        httpsAgent: agent,
      });
      console.log('creem response:', res.data);
      return { checkoutUrl: res.data.checkout_url };
    } catch (err) {
      console.error('creem error:', err);
      throw new Error('Creem API error');
    }
  }),

  // 新增：支付成功后自动开通/续费会员
  creemPaymentSuccess: protectedProcedure.input(z.object({ days: z.number().default(30) })).mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.userId;
    if (!userId) throw new Error('No userId in session');
    // 用户配额等用占位符或注释替换
    return { premiumExpireAt: new Date(Date.now() + input.days * 24 * 60 * 60 * 1000).toISOString(), premiumUsesDaily: 20 };
  }),

  // 每日定时重置配额（可由定时任务或管理员调用）
  resetDailyQuota: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) throw new Error('No userId in session');
    // 用户配额等用占位符或注释替换
    return { freeUsesDaily: 3, premiumUsesDaily: 20 };
  }),

  // 消耗配额（每次使用时调用，优先扣 premiumUsesDaily）
  consumeQuota: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) throw new Error('No userId in session');
    // 用户配额等用占位符或注释替换
    return { premiumUsesDaily: 0, freeUsesDaily: 0 };
  }),
}); 