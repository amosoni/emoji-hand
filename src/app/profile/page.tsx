"use client";
import PageContainer from "../components/PageContainer";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import { api } from '../../trpc/react';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useUser();

  // 会员与配额信息
  const premiumExpireAt = user?.publicMetadata?.premiumExpireAt;
  const isPremium = !!premiumExpireAt && new Date(premiumExpireAt as string) > new Date();
  const freeUsesDaily = user?.publicMetadata?.freeUsesDaily ?? 0;
  const premiumUsesDaily = user?.publicMetadata?.premiumUsesDaily ?? 0;
  const points = user?.publicMetadata?.points ?? 0;

  const productId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID!;

  const { mutate: createCheckout } = api.creem.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
  });

  return (
    <PageContainer>
      <NavBar />
      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow mt-8">
        <div className="flex items-center gap-4 mb-4">
          <img src={user?.imageUrl} alt="avatar" className="w-16 h-16 rounded-full border" />
          <div>
            <h1 className="text-2xl font-bold">{user?.fullName || t('profile.noName', '未设置昵称')}</h1>
            <div className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
        </div>
        <div className="mb-2">
          <span className="font-bold">{t('profile.status', '会员状态')}：</span>
          {isPremium
            ? t('profile.premium', '会员用户')
            : t('profile.free', '普通用户')}
        </div>
        {isPremium && (
          <div className="mb-2">
            <span className="font-bold">{t('profile.expire', '会员到期')}：</span>
            {new Date(premiumExpireAt as string).toLocaleDateString()}
          </div>
        )}
        <div className="mb-2">
          <span className="font-bold">{t('profile.quota', '今日剩余配额')}：</span>
          {isPremium
            ? `${premiumUsesDaily} / 20`
            : `${freeUsesDaily} / 5`}
        </div>
        <div className="mb-2">
          <span className="font-bold">{t('profile.points', '当前积分')}：</span>
          {String(points)}
        </div>
        <div className="mb-4 text-gray-500 text-sm">
          {t('profile.tips', '高级会员：每日20次，免费会员：每日5次。积分可用于兑换额外额度或会员资格。')}
        </div>
        <button
          className="bg-pink-500 text-white px-6 py-2 rounded-lg font-bold mb-2"
          onClick={() =>
            createCheckout({
              productId,
              successUrl: window.location.origin + '/pay/success',
              cancelUrl: window.location.origin + '/pay/cancel',
            })
          }
        >
          {t('profile.upgrade', '升级会员')}
        </button>
        <button
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-bold"
          onClick={() => window.location.href = '/sign-out'}
        >
          {t('signOut', '退出登录')}
        </button>
      </div>
      <Footer />
    </PageContainer>
  );
} 