"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { api } from '@/trpc/react';
import { useLoginModal } from "@/components/LoginModalContext";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  features: {
    translation?: { daily: number; model: string };
    imageGeneration?: { daily: number };
    guides?: boolean;
    noAds?: boolean;
    exportQuality?: string;
    batchGeneration?: boolean;
    apiAccess?: boolean;
    commercialUse?: boolean;
    teamCollaboration?: boolean;
  };
  description: string;
  yearlyDiscount: number;
}

interface SubscriptionStatus {
  plan: string;
  expireAt: Date | null;
  isActive: boolean;
  usage: {
    translation: {
      used: number;
      limit: number;
      remaining: number;
    };
    imageGeneration: {
      used: number;
      limit: number;
      remaining: number;
    };
  };
}

// 默认价格数据，确保价格能立即显示
const defaultPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    billingCycle: 'monthly',
    features: {
      translation: { daily: 8, model: 'GPT-3.5' },
      imageGeneration: { daily: 0 },
      noAds: false,
      commercialUse: false
    },
    description: '适合试用',
    yearlyDiscount: 0
  },
  {
    id: 'starter',
    name: 'Basic Plan',
    price: 19.99,
    billingCycle: 'monthly',
    features: {
      translation: { daily: 15, model: 'GPT-4' },
      imageGeneration: { daily: 5 },
      noAds: true,
      commercialUse: false
    },
    description: '适合个人用户',
    yearlyDiscount: 20
  },
  {
    id: 'pro',
    name: 'Professional Plan',
    price: 39.99,
    billingCycle: 'monthly',
    features: {
      translation: { daily: 35, model: 'GPT-4' },
      imageGeneration: { daily: 12 },
      noAds: true,
      commercialUse: true,
      apiAccess: true
    },
    description: '适合专业用户',
    yearlyDiscount: 25
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 79.99,
    billingCycle: 'monthly',
    features: {
      translation: { daily: 70, model: 'GPT-4' },
      imageGeneration: { daily: 20 },
      noAds: true,
      commercialUse: true,
      apiAccess: true,
      teamCollaboration: true
    },
    description: '适合企业用户',
    yearlyDiscount: 30
  }
];

export default function EmojiPackSubscription() {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();
  const { show } = useLoginModal();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  // 调试信息
  console.log('EmojiPackSubscription session:', session);
  console.log('EmojiPackSubscription session user:', session?.user);
  console.log('Current language:', i18n.language);
  console.log('Available languages:', i18n.languages);
  console.log('Translation test:', t('subscription.title', 'Emoji Pack Subscription System'));

  // 获取订阅状态
  const { data: subscriptionStatus } = api.emojiPackSubscription.getSubscription.useQuery();
  
  // 获取套餐信息
  const { data: subscriptionPlans } = api.emojiPackSubscription.getSubscriptionPlans.useQuery();
  
  // 使用API数据或默认数据，确保价格始终显示
  const plans = subscriptionPlans?.plans ?? defaultPlans;
  
  // 升级订阅
  const upgradeMutation = api.emojiPackSubscription.upgradeSubscription.useMutation({
    onSuccess: () => {
      alert(t('subscription.upgradeSuccess', 'Subscription upgraded successfully!'));
    },
    onError: (error) => {
      alert(t('subscription.upgradeFailed', 'Upgrade failed:') + (error.message ?? 'Unknown error'));
    }
  });

  // Creem支付
  const { mutate: createCheckout, isPending: isCheckoutPending } = api.creem.createCheckoutSession.useMutation({
    onSuccess: (data: any) => {
      const url = data?.url || data?.checkoutUrl;
      if (url) {
        window.location.href = url;
      } else {
        alert(t('subscription.paymentFailed', 'Payment failed'));
      }
    },
    onError: (error) => {
      alert(t('subscription.paymentError', 'Payment error:') + error.message);
    }
  });

  // 根据套餐ID和计费周期获取商品ID
  const getProductId = (planId: string, cycle: 'monthly' | 'yearly') => {
    const productIds = {
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
    };
    
    return productIds[planId as keyof typeof productIds]?.[cycle];
  };

  const handleUpgrade = (planId: string) => {
    if (!selectedPlan) {
      alert(t('subscription.selectPlan', 'Please select a plan'));
      return;
    }
    
    // 使用Creem支付
    const productId = getProductId(planId, billingCycle);
    if (productId) {
      createCheckout({
        productId,
        successUrl: window.location.origin + '/pay/success',
        cancelUrl: window.location.origin + '/pay/cancel',
      });
    } else {
      // 如果没有配置商品ID，使用原来的升级逻辑
      upgradeMutation.mutate({
        plan: planId as 'starter' | 'pro' | 'enterprise',
        billingCycle
      });
    }
  };

  // 根据套餐ID获取翻译后的名称
  const getPlanName = (planId: string) => {
    switch (planId) {
      case 'free':
        return t('subscription.freePlan', 'Free Plan');
      case 'starter':
        return t('subscription.basicPlan', 'Basic Plan');
      case 'pro':
        return t('subscription.proPlan', 'Professional Plan');
      case 'enterprise':
        return t('subscription.enterprisePlan', 'Enterprise Plan');
      default:
        return planId;
    }
  };

  // 未登录时也显示价格，但提示需要登录才能购买
  const isLoggedIn = !!session;

  return (
    <div className="bg-gradient-to-br from-yellow-600/60 via-orange-500/60 to-pink-600/60 backdrop-blur-md rounded-lg p-6 text-white border border-white/30 shadow-xl">
      <h3 className="text-xl font-bold mb-4 text-white drop-shadow-lg">{t('subscription.title', 'Emoji Pack Subscription System')}</h3>
      
      {/* 未登录提示 */}
      {!isLoggedIn && (
        <div className="bg-yellow-500/20 backdrop-blur-md rounded-lg p-4 mb-6 border border-yellow-400/30 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h4 className="font-semibold text-yellow-400 drop-shadow-md">{t('subscription.loginToPurchase', 'Login to Purchase')}</h4>
          </div>
          <p className="text-yellow-200 drop-shadow-sm">{t('subscription.loginToPurchaseDesc', 'Please log in to view your subscription status and purchase plans')}</p>
        </div>
      )}

      {/* 当前订阅状态 - 仅登录用户显示 */}
      {isLoggedIn && subscriptionStatus && (
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 mb-6 border border-white/30 shadow-lg">
          <h4 className="font-semibold mb-2 text-white drop-shadow-md">{t('subscription.currentStatus', 'Current Subscription Status')}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-white/90 drop-shadow-sm">{t('subscription.plan', 'Plan')}</p>
              <p className="font-semibold text-white drop-shadow-md">{getPlanName(subscriptionStatus.plan)}</p>
            </div>
            <div>
              <p className="text-white/90 drop-shadow-sm">{t('subscription.translationUsage', 'Translation Usage')}</p>
              <p className="font-semibold text-white drop-shadow-md">{subscriptionStatus.usage.translation.used}/{subscriptionStatus.usage.translation.limit}</p>
            </div>
            <div>
              <p className="text-white/90 drop-shadow-sm">{t('subscription.imageGenerationUsage', 'Image Generation Usage')}</p>
              <p className="font-semibold text-white drop-shadow-md">{subscriptionStatus.usage.imageGeneration.used}/{subscriptionStatus.usage.imageGeneration.limit}</p>
            </div>
            <div>
              <p className="text-white/90 drop-shadow-sm">{t('subscription.status', 'Status')}</p>
              <p className="font-semibold text-white drop-shadow-md">{subscriptionStatus.isActive ? t('subscription.active', 'Active') : t('subscription.inactive', 'Inactive')}</p>
            </div>
          </div>
          {subscriptionStatus.expireAt && (
            <div className="mt-2">
              <p className="text-white/90 drop-shadow-sm">{t('subscription.expireAt', 'Expire At')}</p>
              <p className="font-semibold text-white drop-shadow-md">{subscriptionStatus.expireAt ? new Date(subscriptionStatus.expireAt as unknown as string).toLocaleDateString() : 'N/A'}</p>
            </div>
          )}
        </div>
      )}

      {/* 套餐选择 */}
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-1 border border-white/30 shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md transition-colors font-medium ${
                billingCycle === 'monthly' ? 'bg-white text-orange-600 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              {t('subscription.monthly', 'Monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md transition-colors font-medium ${
                billingCycle === 'yearly' ? 'bg-white text-orange-600 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              {t('subscription.yearly', 'Yearly (Discount)')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan: SubscriptionPlan) => (
            <div
              key={plan.id}
              className={`bg-black/30 backdrop-blur-md rounded-lg p-4 border-2 transition-colors shadow-lg hover:shadow-xl ${
                selectedPlan === plan.id ? 'border-yellow-400 shadow-yellow-400/20' : 'border-white/30 hover:border-white/40'
              }`}
            >
              <div className="text-center mb-4">
                <h4 className="font-bold text-lg text-white drop-shadow-md">{getPlanName(plan.id)}</h4>
                <div className="text-2xl font-bold text-white drop-shadow-lg">
                  ¥{plan.price}
                  <span className="text-sm font-normal text-white/95 drop-shadow-sm">/{billingCycle === 'monthly' ? t('subscription.month', 'month') : t('subscription.year', 'year')}</span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-yellow-200 drop-shadow-md font-medium">{t('subscription.yearlyDiscount', 'Yearly Discount')}</p>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-white/95 drop-shadow-sm">• {t('subscription.dailyLimit', 'Daily Limit')}：{plan.features.translation?.daily ?? 0} {t('subscription.translations', 'translations')}</p>
                <p className="text-white/95 drop-shadow-sm">• {t('subscription.imageGeneration', 'Image Generation')}：{plan.features.imageGeneration?.daily ?? 0} {t('subscription.images', 'images')}</p>
                <p className="text-white/95 drop-shadow-sm">• {t('subscription.noAds', 'No Ads')}：{plan.features.noAds ? t('subscription.supported', 'Supported') : t('subscription.notSupported', 'Not Supported')}</p>
                <p className="text-white/95 drop-shadow-sm">• {t('subscription.commercialUse', 'Commercial Use')}：{plan.features.commercialUse ? t('subscription.supported', 'Supported') : t('subscription.notSupported', 'Not Supported')}</p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-2 rounded-lg transition-colors font-medium shadow-md ${
                    selectedPlan === plan.id
                      ? 'bg-yellow-400 text-purple-600 shadow-yellow-400/30'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  {subscriptionStatus?.plan === plan.id ? t('subscription.currentPlan', 'Current Plan') : t('subscription.selectPlan', 'Select Plan')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 升级按钮 */}
      {selectedPlan && (
        <div className="text-center">
          {isLoggedIn && selectedPlan !== subscriptionStatus?.plan ? (
            <button
              onClick={() => handleUpgrade(selectedPlan)}
              disabled={upgradeMutation.isPending || isCheckoutPending}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:bg-gray-500 px-8 py-3 rounded-lg font-semibold transition-colors text-white shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {upgradeMutation.isPending || isCheckoutPending ? t('subscription.processing', 'Processing...') : t('subscription.upgrade', 'Upgrade Subscription')}
            </button>
          ) : !isLoggedIn ? (
            <div className="bg-yellow-500/20 backdrop-blur-md rounded-lg p-4 border border-yellow-400/30 shadow-lg">
              <p className="text-yellow-200 drop-shadow-sm mb-3">{t('subscription.loginToUpgrade', 'Please log in to upgrade your subscription')}</p>
              <button
                onClick={show}
                className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg font-semibold transition-colors text-white shadow-md hover:shadow-lg"
              >
                {t('subscription.login', 'Login')}
              </button>
            </div>
          ) : (
            <div className="bg-green-500/20 backdrop-blur-md rounded-lg p-4 border border-green-400/30 shadow-lg">
              <p className="text-green-200 drop-shadow-sm">{t('subscription.currentPlanSelected', 'This is your current plan')}</p>
            </div>
          )}
        </div>
      )}

      {/* 使用说明 */}
      <div className="mt-6 bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/30 shadow-lg">
        <h4 className="font-semibold mb-2 text-white drop-shadow-md">{t('subscription.usageInstructions', 'Usage Instructions')}</h4>
        <ul className="text-sm space-y-1 text-white/95">
          <li className="drop-shadow-sm">• {t('subscription.freePlan', 'Free Plan')}：{t('subscription.freePlanDesc', '8 translations per day, suitable for trial')}</li>
          <li className="drop-shadow-sm">• {t('subscription.basicPlan', 'Basic Plan')}：{t('subscription.basicPlanDesc', '15 translations + 5 images per day, suitable for individual users')}</li>
          <li className="drop-shadow-sm">• {t('subscription.proPlan', 'Professional Plan')}：{t('subscription.proPlanDesc', '35 translations + 12 images per day, suitable for professional users')}</li>
          <li className="drop-shadow-sm">• {t('subscription.enterprisePlan', 'Enterprise Plan')}：{t('subscription.enterprisePlanDesc', '70 translations + 20 images per day, suitable for enterprise users')}</li>
          <li className="drop-shadow-sm">• {t('subscription.yearlyDiscountNote', 'Yearly payment enjoys discounted prices')}</li>
          <li className="drop-shadow-sm">• {t('subscription.commercialAuth', 'Supports commercial authorization (paid plans)')}</li>
        </ul>
      </div>
    </div>
  );
} 