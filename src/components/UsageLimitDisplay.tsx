import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export const UsageLimitDisplay = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user;
  
  const { data: usageStats, refetch } = api.usageLimits.getUserUsageStats.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: subscription } = api.emojiPackSubscription.getSubscription.useQuery(
    undefined,
    { enabled: !!user }
  );

  if (!usageStats) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('usageStatus', 'Usage Status')}</h3>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {t('freePlan', 'Free Plan')}
        </span>
      </div>

      <div className="space-y-3">
        {/* 번역 사용량 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{t('translationUsage', 'Translation Usage')}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-900">
              {usageStats.usage.translation.used} / {usageStats.usage.translation.limit}
            </span>
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (usageStats.usage.translation.used / usageStats.usage.translation.limit) * 100)}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* 이미지 생성 사용량 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{t('imageGenerationUsage', 'Image Generation Usage')}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-900">
              {usageStats.usage.imageGeneration.used} / {usageStats.usage.imageGeneration.limit}
            </span>
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (usageStats.usage.imageGeneration.used / usageStats.usage.imageGeneration.limit) * 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 구독 상태 */}
      {subscription && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t('subscriptionStatus', 'Subscription Status')}</span>
            <span className={`text-sm font-medium ${subscription.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {subscription.isActive ? t('active', 'Active') : t('expired', 'Expired')}
            </span>
          </div>
          {subscription.expireAt && (
            <div className="mt-1">
              <span className="text-xs text-gray-500">
                {t('expiryDate', 'Expiry Date')}: {new Date(subscription.expireAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 업그레이드 버튼 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button 
          onClick={() => window.location.href = '/subscription'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {t('upgradePlan', 'Upgrade Plan')}
        </button>
      </div>
    </div>
  );
}; 