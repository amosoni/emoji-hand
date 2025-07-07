import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { z } from 'zod'
import axios from 'axios'
import { clerkClient } from '@clerk/clerk-sdk-node';
import { HttpsProxyAgent } from 'https-proxy-agent';

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
  
  const dailyUsage = Number(user.publicMetadata.dailyUsage) || 0;
  const maxUsage = isPremium ? 20 : 5;
  
  if (dailyUsage >= maxUsage) {
    throw new Error('Daily quota exceeded');
  }
  
  return { canUse: true, remaining: maxUsage - dailyUsage };
};

// 增加使用次数
const incrementDailyUsage = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);
  const currentUsage = Number(user.publicMetadata.dailyUsage) || 0;
  
  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      dailyUsage: currentUsage + 1,
    },
  });
};

export const creemRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.input(z.object({
    productId: z.string(),
    successUrl: z.string(),
    cancelUrl: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const email = ctx.session?.sessionClaims?.email;
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
    const user = await clerkClient.users.getUser(userId);
    const now = new Date();
    // 取当前会员到期时间，若已过期则从现在算起
    const oldExpire = user.publicMetadata.premiumExpireAt ? new Date(user.publicMetadata.premiumExpireAt as string) : now;
    const base = oldExpire > now ? oldExpire : now;
    const newExpire = new Date(base.getTime() + input.days * 24 * 60 * 60 * 1000);
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        premiumExpireAt: newExpire.toISOString(),
        premiumUsesDaily: 20, // 会员每日额度
      },
    });
    return { premiumExpireAt: newExpire.toISOString(), premiumUsesDaily: 20 };
  }),

  // 每日定时重置配额（可由定时任务或管理员调用）
  resetDailyQuota: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) throw new Error('No userId in session');
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        freeUsesDaily: 3,
        premiumUsesDaily: 20,
      },
    });
    return { freeUsesDaily: 3, premiumUsesDaily: 20 };
  }),

  // 消耗配额（每次使用时调用，优先扣 premiumUsesDaily）
  consumeQuota: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session?.userId;
    if (!userId) throw new Error('No userId in session');
    const user = await clerkClient.users.getUser(userId);
    let { freeUsesDaily = 0, premiumUsesDaily = 0, premiumExpireAt } = user.publicMetadata as any;
    freeUsesDaily = Number(freeUsesDaily) || 0;
    premiumUsesDaily = Number(premiumUsesDaily) || 0;
    const now = new Date();
    const isPremium = !!premiumExpireAt && new Date(premiumExpireAt) > now;
    if (isPremium && premiumUsesDaily > 0) {
      premiumUsesDaily -= 1;
      await clerkClient.users.updateUser(userId, { publicMetadata: { premiumUsesDaily } });
      return { premiumUsesDaily, freeUsesDaily };
    } else if (freeUsesDaily > 0) {
      freeUsesDaily -= 1;
      await clerkClient.users.updateUser(userId, { publicMetadata: { freeUsesDaily } });
      return { premiumUsesDaily, freeUsesDaily };
    } else {
      throw new Error('No quota left');
    }
  }),
}); 