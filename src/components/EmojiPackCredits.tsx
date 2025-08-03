"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { api } from '@/trpc/react';
import { useLoginModal } from "@/components/LoginModalContext";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonus: number;
  popular?: boolean;
  description: string;
}

// 默认积分包数据，确保价格能立即显示
const defaultPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: '入门包',
    credits: 10,
    price: 9.99,
    bonus: 0,
    description: '适合初次体验'
  },
  {
    id: 'popular',
    name: '热门包',
    credits: 50,
    price: 39.99,
    bonus: 5,
    description: '最受欢迎的选择',
    popular: true
  },
  {
    id: 'pro',
    name: '专业包',
    credits: 100,
    price: 69.99,
    bonus: 15,
    description: '适合专业用户'
  },
  {
    id: 'enterprise',
    name: '企业包',
    credits: 200,
    price: 119.99,
    bonus: 40,
    description: '适合团队使用'
  }
];

export default function EmojiPackCredits() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { show } = useLoginModal();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const { data: credits } = api.emojiPackCredits.getEmojiPackCredits.useQuery(
    undefined,
    { enabled: !!session }
  );

  const purchaseMutation = api.emojiPackCredits.purchaseEmojiPackCredits.useMutation({
    onSuccess: () => {
      alert('积分购买成功！');
    },
    onError: (error) => {
      alert(`购买失败：${error.message ?? '未知错误'}`);
    }
  });

  // Creem支付
  const { mutate: createCheckout, isPending: isCheckoutPending } = api.creem.createCheckoutSession.useMutation({
    onSuccess: (data: any) => {
      const url = data?.url ?? data?.checkoutUrl;
      if (url) {
        window.location.href = url;
      } else {
        alert('支付失败');
      }
    },
    onError: (error) => {
      alert(`支付错误：${error.message}`);
    }
  });

  // 根据积分包ID获取商品ID
  const getCreditProductId = (packageId: string) => {
    const productIds = {
      starter: 'prod_credits_starter',     // 请替换为实际的Creem商品ID
      popular: 'prod_credits_popular',     // 请替换为实际的Creem商品ID
      pro: 'prod_credits_pro',             // 请替换为实际的Creem商品ID
      enterprise: 'prod_credits_enterprise' // 请替换为实际的Creem商品ID
    };
    
    return productIds[packageId as keyof typeof productIds];
  };

  // 使用默认积分包数据，确保价格始终显示
  const packages = defaultPackages;

  const handlePurchase = () => {
    if (!selectedPackage) {
      alert('请选择积分包');
      return;
    }

    // 使用Creem支付
    const productId = getCreditProductId(selectedPackage);
    if (productId) {
      createCheckout({
        productId,
        successUrl: window.location.origin + '/pay/success',
        cancelUrl: window.location.origin + '/pay/cancel',
      });
    } else {
      // 如果没有配置商品ID，使用原来的购买逻辑
      purchaseMutation.mutate({
        packageId: selectedPackage as 'starter' | 'popular' | 'pro' | 'enterprise'
      });
    }
  };

  // 未登录时也显示价格，但提示需要登录才能购买
  const isLoggedIn = !!session;

  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-4">表情包积分系统</h3>
      
      {/* 未登录提示 */}
      {!isLoggedIn && (
        <div className="bg-yellow-500/20 backdrop-blur-md rounded-lg p-4 mb-6 border border-yellow-400/30 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h4 className="font-semibold text-yellow-400 drop-shadow-md">登录购买</h4>
          </div>
          <p className="text-yellow-200 drop-shadow-sm">请登录以查看您的积分状态和购买积分包</p>
        </div>
      )}
      
      {/* 当前积分状态 - 仅登录用户显示 */}
      {isLoggedIn && credits && (
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2">当前积分状态</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-300">可用积分：</span>
              <span className="font-semibold text-2xl text-yellow-400">{credits.credits}</span>
            </div>
            <div>
              <span className="text-gray-300">已生成表情包：</span>
              <span className="font-semibold">{credits.totalEarned ?? 0}个</span>
            </div>
            <div>
              <span className="text-gray-300">最后使用：</span>
              <span className="font-semibold">
                {credits.subscription?.expireAt ? new Date(credits.subscription.expireAt as unknown as string).toLocaleDateString() : '从未使用'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 积分包选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white/10 rounded-lg p-4 border-2 transition-all cursor-pointer ${
              selectedPackage === pkg.id
                ? 'border-purple-400 bg-white/20'
                : 'border-transparent hover:border-purple-300'
            } ${pkg.popular ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {pkg.popular && (
              <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">
                最受欢迎
              </div>
            )}
            <h4 className="text-lg font-bold mb-2">{pkg.name}</h4>
            <div className="text-2xl font-bold mb-2">{pkg.credits}积分</div>
            {pkg.bonus > 0 && (
              <div className="text-green-400 text-sm mb-2">+{pkg.bonus}积分赠送</div>
            )}
            <div className="text-xl font-bold mb-2">¥{pkg.price}</div>
            <div className="text-xs text-gray-300 mb-2">{pkg.description}</div>
            <div className="text-xs text-gray-300">
              单价：¥{(pkg.price / pkg.credits).toFixed(2)}/积分
            </div>
          </div>
        ))}
      </div>

      {/* 购买选项 */}
      {selectedPackage && (
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-4">购买选项</h4>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm text-gray-300 mb-2">购买数量</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-white/20 text-white rounded px-3 py-2"
              >
                {[1, 2, 3, 5, 10].map(num => (
                  <option key={num} value={num}>{num}个</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">总积分</label>
              <div className="text-xl font-bold text-yellow-400">
                {(packages.find(p => p.id === selectedPackage)?.credits ?? 0) * quantity}
                {packages.find(p => p.id === selectedPackage)?.bonus ? 
                  ` + ${(packages.find(p => p.id === selectedPackage)?.bonus ?? 0) * quantity}` : ''}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">总价</label>
              <div className="text-xl font-bold">
                ¥{(packages.find(p => p.id === selectedPackage)?.price ?? 0) * quantity}
              </div>
            </div>
            {isLoggedIn ? (
              <button
                onClick={handlePurchase}
                disabled={purchaseMutation.isPending || isCheckoutPending}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {purchaseMutation.isPending || isCheckoutPending ? '处理中...' : '立即购买'}
              </button>
            ) : (
              <div className="bg-yellow-500/20 backdrop-blur-md rounded-lg p-3 border border-yellow-400/30">
                <p className="text-yellow-200 text-sm mb-2">请登录以购买积分包</p>
                <button
                  onClick={show}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold transition-colors text-white text-sm"
                >
                  登录
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-white/10 rounded-lg p-4">
        <h4 className="font-semibold mb-2">使用说明</h4>
        <ul className="text-sm space-y-1 text-gray-300">
          <li>• 1个表情包 = 1积分</li>
          <li>• 积分永久有效，无过期时间</li>
          <li>• 购买越多，单价越优惠</li>
          <li>• 支持生成1-5个表情包</li>
          <li>• 积分不足时无法生成表情包</li>
        </ul>
      </div>
    </div>
  );
} 