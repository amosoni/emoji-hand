"use client";
import UnifiedNavBar from '../../components/UnifiedNavBar';
import Footer from '../../components/Footer';
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
// import { api } from "~/trpc/react";
import { RechargeButton } from '../../components/RechargeButton';

// 在顶部添加 User 类型定义
interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  premiumExpireAt?: string | null;
  username?: string | null;
  points?: number | null;
  createdAt?: string | null;
  freeUsesDaily?: number | null;
  // 订阅相关字段
  subscriptionPlan?: string | null;
  subscriptionStatus?: string | null;
  subscriptionExpireAt?: string | null;
  translationUsesToday?: number | null;
  imageGenerationUsesToday?: number | null;
  lastUsageReset?: string | null;
  // 可根据需要补充其它字段
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  // 在获取 user 时加类型断言
  const user = session?.user as User | undefined;
  // const { data: profile } = api.profile.getProfile.useQuery(undefined, { enabled: !!user });

  // 订阅套餐限制配置
  const subscriptionLimits = {
    free: { translation: 3, imageGeneration: 0 },
    starter: { translation: 10, imageGeneration: 5 },
    pro: { translation: 20, imageGeneration: 10 },
    enterprise: { translation: 50, imageGeneration: 25 }
  };

  // 获取当前套餐的限制
  const getCurrentPlanLimits = () => {
    const plan = user?.subscriptionPlan ?? 'free';
    return subscriptionLimits[plan as keyof typeof subscriptionLimits] ?? subscriptionLimits.free;
  };

  const currentLimits = getCurrentPlanLimits();
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500">
      <UnifiedNavBar />
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white/20 rounded-2xl shadow-xl p-8 flex flex-col items-center min-w-[320px] max-w-[400px] w-full relative">
          <h1 className="text-3xl font-bold mb-6 text-white drop-shadow flex items-center gap-2">
            {t('profileTitle', 'Profile')}
            {/* 会员徽章 */}
            {user?.subscriptionPlan && user.subscriptionPlan !== 'free' ? (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 text-white shadow">🌟 {user.subscriptionPlan.toUpperCase()}</span>
            ) : (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-400 text-white">{t('profile.free', 'Free')}</span>
            )}
          </h1>
          {/* 升级按钮 - 只在免费套餐时显示 */}
          {(!user?.subscriptionPlan || user.subscriptionPlan === 'free') && (
            <div className="flex gap-3 mb-4">
              <RechargeButton />
            </div>
          )}
          {user ? (
            <>
              {user.image && <img src={user.image} alt="avatar" className="w-24 h-24 rounded-full border-4 border-white shadow mb-4" />}
              <div className="font-bold text-2xl mb-1 text-white flex items-center gap-2">
                {user.name ?? user.username ?? t('profile.noName', 'No nickname')}
                {/* 会员徽章（昵称旁） */}
                {user.subscriptionPlan && user.subscriptionPlan !== 'free' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 text-white shadow">🌟</span>
                ) : null}
              </div>
              <div className="text-white/80 mb-4">{user.email}</div>
              <div className="w-full flex flex-col gap-2 text-white/90 text-base">
                {user.subscriptionPlan && (
                  <div className="flex justify-between"><span>{t('profile.subscriptionPlan', 'Subscription Plan')}</span><span className="capitalize">{user.subscriptionPlan}</span></div>
                )}
                {user.subscriptionExpireAt && (
                  <div className="flex justify-between"><span>{t('profile.subscriptionExpireAt', 'Subscription until')}</span><span>{new Date(user.subscriptionExpireAt).toLocaleDateString()}</span></div>
                )}
                {/* 翻译使用情况 */}
                {user.translationUsesToday !== undefined && (
                  <>
                    <div className="flex justify-between">
                      <span>{t('profile.translationUsesToday', 'Translation uses today')}</span>
                      <span className="text-yellow-300 font-semibold">{user.translationUsesToday} / {currentLimits.translation}</span>
                    </div>
                    {/* 翻译使用进度条 */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, ((user.translationUsesToday ?? 0) / currentLimits.translation) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('profile.remainingTranslation', 'Remaining translations')}</span>
                      <span className="text-green-300 font-semibold">{Math.max(0, currentLimits.translation - (user.translationUsesToday ?? 0))}</span>
                    </div>
                  </>
                )}
                {/* 图片生成使用情况 */}
                {user.imageGenerationUsesToday !== undefined && (
                  <>
                    <div className="flex justify-between">
                      <span>{t('profile.imageGenerationUsesToday', 'Image generation uses today')}</span>
                      <span className="text-yellow-300 font-semibold">{user.imageGenerationUsesToday} / {currentLimits.imageGeneration}</span>
                    </div>
                    {currentLimits.imageGeneration > 0 && (
                      <>
                        {/* 图片生成使用进度条 */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, ((user.imageGenerationUsesToday ?? 0) / currentLimits.imageGeneration) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('profile.remainingImageGeneration', 'Remaining image generations')}</span>
                          <span className="text-green-300 font-semibold">{Math.max(0, currentLimits.imageGeneration - (user.imageGenerationUsesToday ?? 0))}</span>
                        </div>
                      </>
                    )}
                  </>
                )}

                {user.createdAt && (
                  <div className="flex justify-between"><span>{t('profile.createdAt', 'Registered at')}</span><span>{new Date(user.createdAt).toLocaleDateString()}</span></div>
                )}
                {user.freeUsesDaily !== undefined && (
                  <div className="flex justify-between"><span>{t('profile.freeUsesDaily', 'Free daily quota')}</span><span>{user.freeUsesDaily}</span></div>
                )}
              </div>
            </>
          ) : (
            <p className="mb-4 text-white/90">{t('profile.notLoggedIn', 'You are not logged in.')}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 