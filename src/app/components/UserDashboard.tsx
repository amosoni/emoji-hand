"use client";

import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { RechargeButton } from './RechargeButton';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  premiumExpireAt?: string | null;
  username?: string | null;
  points?: number | null;
  createdAt?: string | null;
  freeUsesDaily?: number | null;
  freeUsesWeekly?: number | null;
  premiumUsesWeekly?: number | null;
}

export default function UserDashboard() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  if (!user) return null;

  const isPremium = !!user.premiumExpireAt && new Date(user.premiumExpireAt) > new Date();
  const premiumExpireDate = user.premiumExpireAt ? new Date(user.premiumExpireAt) : null;
  const daysUntilExpiry = premiumExpireDate ? Math.ceil((premiumExpireDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.image ?? '/images/beanhead (1).svg'}
          alt={user.name ?? 'User'}
          className="w-16 h-16 rounded-full border-2 border-white shadow"
        />
        <div>
          <h2 className="text-xl font-bold text-white">
            {user.name ?? user.username ?? user.email ?? t('profile.noName', 'No nickname set')}
          </h2>
          <div className="flex items-center gap-2">
            {isPremium ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 text-white">
                🌟 {t('profile.premium', 'Premium')}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-400 text-white">
                {t('profile.free', 'Free')}
              </span>
            )}
            {isPremium && daysUntilExpiry > 0 && (
              <span className="text-xs text-gray-300">
                {t('profile.expire', 'Expires in')} {daysUntilExpiry} {t('profile.days', 'days')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 配额信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">
            {t('profile.quota', 'Daily Quota Left')}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                style={{ 
                  width: `${Math.max(0, Math.min(100, ((user.freeUsesDaily ?? 0) / (isPremium ? 20 : 5)) * 100))}%` 
                }}
              ></div>
            </div>
            <span className="text-sm font-bold text-white">
              {user.freeUsesDaily ?? 0} / {isPremium ? 20 : 5}
            </span>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">
            {t('profile.points', 'Points')}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span className="text-lg font-bold text-white">
              {user.points ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* 会员信息 */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-pink-500/20 rounded-lg p-4 mb-6 border border-yellow-500/30">
          <h3 className="text-lg font-semibold text-white mb-2">
            {t('profile.upgrade', 'Upgrade to Premium')}
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            {t('profile.tips', 'Premium: 20/day, Free: 5/day. Points can be used for extra quota or membership.')}
          </p>
          <RechargeButton />
        </div>
      )}

      {/* 使用统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-sm text-gray-300">{t('profile.freeUsesDaily', 'Free daily quota')}</div>
          <div className="text-lg font-bold text-white">{user.freeUsesDaily ?? 0}</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">📈</div>
          <div className="text-sm text-gray-300">{t('profile.freeUsesWeekly', 'Free weekly quota')}</div>
          <div className="text-lg font-bold text-white">{user.freeUsesWeekly ?? 0}</div>
        </div>
        
        {isPremium && (
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-sm text-gray-300">{t('profile.premiumUsesWeekly', 'Premium weekly quota')}</div>
            <div className="text-lg font-bold text-white">{user.premiumUsesWeekly ?? 0}</div>
          </div>
        )}
      </div>

      {/* 账户信息 */}
      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">
          {t('profile.accountInfo', 'Account Information')}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">{t('profile.createdAt', 'Registered at')}</span>
            <span className="text-white">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{t('profile.email', 'Email')}</span>
            <span className="text-white">{user.email ?? 'N/A'}</span>
          </div>
          {user.username && (
            <div className="flex justify-between">
              <span className="text-gray-400">{t('profile.username', 'Username')}</span>
              <span className="text-white">{user.username}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 