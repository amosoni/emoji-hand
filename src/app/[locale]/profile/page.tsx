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
  // 可根据需要补充其它字段
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  // 在获取 user 时加类型断言
  const user = session?.user as User | undefined;
  // const { data: profile } = api.profile.getProfile.useQuery(undefined, { enabled: !!user });
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500">
      <UnifiedNavBar />
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white/20 rounded-2xl shadow-xl p-8 flex flex-col items-center min-w-[320px] max-w-[400px] w-full relative">
          <h1 className="text-3xl font-bold mb-6 text-white drop-shadow flex items-center gap-2">
            {t('profileTitle', 'Profile')}
            {/* 会员徽章 */}
            {user?.premiumExpireAt && new Date(user.premiumExpireAt) > new Date() ? (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 text-white shadow">🌟 {t('profile.premium', 'Premium')}</span>
            ) : (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-400 text-white">{t('profile.free', 'Free')}</span>
            )}
          </h1>
          {/* 编辑资料/充值按钮 */}
          <div className="flex gap-3 mb-4">
            <RechargeButton />
          </div>
          {user ? (
            <>
              {user.image && <img src={user.image} alt="avatar" className="w-24 h-24 rounded-full border-4 border-white shadow mb-4" />}
              <div className="font-bold text-2xl mb-1 text-white flex items-center gap-2">
                {user.name ?? user.username ?? t('profile.noName', 'No nickname')}
                {/* 会员徽章（昵称旁） */}
                {user.premiumExpireAt && new Date(user.premiumExpireAt) > new Date() ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 text-white shadow">🌟</span>
                ) : null}
              </div>
              <div className="text-white/80 mb-4">{user.email}</div>
              <div className="w-full flex flex-col gap-2 text-white/90 text-base">
                {user.premiumExpireAt && (
                  <div className="flex justify-between"><span>{t('profile.premiumExpireAt', 'Premium until')}</span><span>{new Date(user.premiumExpireAt).toLocaleDateString()}</span></div>
                )}
                {user.points !== undefined && (
                  <div className="flex justify-between"><span>{t('profile.points', 'Points')}</span><span>{user.points}</span></div>
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