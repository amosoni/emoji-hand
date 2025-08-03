"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { api } from '@/trpc/react';

interface TierPlan {
  id: string;
  name: string;
  price: number;
  daily: number;
  monthly: number;
  features: string[];
  popular?: boolean;
  description: string;
}

export default function EmojiPackTiers() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedMonths, setSelectedMonths] = useState(1);

  // 暂时注释掉API调用
  // const { data: tier } = api.emojiPackTiers.getEmojiPackTier.useQuery(
  //   undefined,
  //   { enabled: !!session }
  // );

  // const upgradeMutation = api.emojiPackTiers.upgradeEmojiPackTier.useMutation({
  //   onSuccess: () => {
  //     alert('套餐升级成功！');
  //   },
  //   onError: (error) => {
  //     alert(`升级失败：${error.message}`);
  //   }
  // });

  const plans: TierPlan[] = [
    {
      id: 'free',
      name: '免费版',
      price: 0,
      daily: 3,
      monthly: 10,
      features: [
        '每日3次生成',
        '每月10次生成',
        '基础生成质量',
        '标准表情包风格'
      ],
      description: '适合初次体验'
    },
    {
      id: 'starter',
      name: '入门版',
      price: 9.99,
      daily: 20,
      monthly: 100,
      features: [
        '每日20次生成',
        '每月100次生成',
        '高清生成质量',
        '批量处理功能',
        '邮件客服支持'
      ],
      description: '适合个人用户',
      popular: true
    },
    {
      id: 'pro',
      name: '专业版',
      price: 29.99,
      daily: 100,
      monthly: 500,
      features: [
        '每日100次生成',
        '每月500次生成',
        '超高清生成质量',
        '无限批量处理',
        '优先客服支持',
        'API访问权限'
      ],
      description: '适合专业用户'
    },
    {
      id: 'enterprise',
      name: '企业版',
      price: 99.99,
      daily: 999,
      monthly: 9999,
      features: [
        '无限生成次数',
        '所有高级功能',
        '专属客服支持',
        '定制服务',
        '团队管理功能'
      ],
      description: '适合团队使用'
    }
  ];

  const handleUpgrade = () => {
    if (!selectedTier || selectedTier === 'free') {
      alert('请选择要升级的套餐');
      return;
    }

    // upgradeMutation.mutate({
    //   tier: selectedTier as 'starter' | 'pro' | 'enterprise',
    //   months: selectedMonths
    // });
  };

  if (!session) {
    return (
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">表情包生成器套餐</h3>
        <p className="mb-4">请先登录以查看套餐选项</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-4">表情包生成器套餐</h3>
      
      {/* 当前套餐状态 */}
      {/* {tier && (
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2">当前套餐状态</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-300">套餐：</span>
              <span className="font-semibold">{tier.tier}</span>
            </div>
            <div>
              <span className="text-gray-300">状态：</span>
              <span className={`font-semibold ${tier.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {tier.isActive ? '活跃' : '已过期'}
              </span>
            </div>
            <div>
              <span className="text-gray-300">今日剩余：</span>
              <span className="font-semibold">{tier.remainingToday}/{tier.limits.daily}</span>
            </div>
            <div>
              <span className="text-gray-300">本月剩余：</span>
              <span className="font-semibold">{tier.remainingThisMonth}/{tier.limits.monthly}</span>
            </div>
          </div>
          {tier.expireAt && (
            <div className="mt-2 text-sm">
              <span className="text-gray-300">到期时间：</span>
              <span className="font-semibold">
                {new Date(tier.expireAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )} */}

      {/* 套餐选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white/10 rounded-lg p-4 border-2 transition-all cursor-pointer ${
              selectedTier === plan.id
                ? 'border-purple-400 bg-white/20'
                : 'border-transparent hover:border-purple-300'
            } ${plan.popular ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => setSelectedTier(plan.id)}
          >
            {plan.popular && (
              <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">
                最受欢迎
              </div>
            )}
            <h4 className="text-lg font-bold mb-2">{plan.name}</h4>
            <div className="text-2xl font-bold mb-2">
              {plan.price === 0 ? '免费' : `¥${plan.price}/月`}
            </div>
            <div className="text-xs text-gray-300 mb-2">{plan.description}</div>
            <ul className="space-y-1 text-sm mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="text-xs text-gray-300">
              每日 {plan.daily} 次 / 每月 {plan.monthly} 次
            </div>
          </div>
        ))}
      </div>

      {/* 升级选项 */}
      {selectedTier && selectedTier !== 'free' && (
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-4">升级选项</h4>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm text-gray-300 mb-2">订阅时长</label>
              <select
                value={selectedMonths}
                onChange={(e) => setSelectedMonths(Number(e.target.value))}
                className="bg-white/20 text-white rounded px-3 py-2"
              >
                <option value={1}>1个月</option>
                <option value={3}>3个月 (9折)</option>
                <option value={6}>6个月 (8折)</option>
                <option value={12}>12个月 (7折)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">总价</label>
              <div className="text-xl font-bold">
                ¥{(plans.find(p => p.id === selectedTier)?.price ?? 0) * selectedMonths}
              </div>
            </div>
            <button
              onClick={handleUpgrade}
              // disabled={upgradeMutation.isPending}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {/* {upgradeMutation.isPending ? '处理中...' : '立即升级'} */}
              立即升级
            </button>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-white/10 rounded-lg p-4">
        <h4 className="font-semibold mb-2">使用说明</h4>
        <ul className="text-sm space-y-1 text-gray-300">
          <li>• 免费版每日可生成3个表情包</li>
          <li>• 付费套餐享受更多生成次数和功能</li>
          <li>• 生成次数每日和每月分别计算</li>
          <li>• 套餐到期后需要续费才能继续使用</li>
          <li>• 支持生成1-5个表情包</li>
        </ul>
      </div>
    </div>
  );
} 