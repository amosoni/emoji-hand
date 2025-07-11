import { api } from '@/trpc/react';
import { useTranslation } from 'react-i18next';

export function RechargeButton() {
  const { t } = useTranslation();
  const { mutate: createCheckout, isPending } = api.creem.createCheckoutSession.useMutation({
    onSuccess: (data: any) => {
      // 兼容 url 或 checkoutUrl 字段
      const url = data?.url || data?.checkoutUrl;
      if (url) {
        window.location.href = url;
      } else {
        alert(t('profile.paymentFailed'));
      }
    }
  })

  return (
    <button
      onClick={() =>
        createCheckout({
          productId: 'prod_3M7LPqQ8RoK6bcS3qkbrUQ',
          successUrl: window.location.origin + '/pay/success',
          cancelUrl: window.location.origin + '/pay/cancel',
        })
      }
      disabled={isPending}
      className="px-4 py-1 rounded-lg bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold shadow hover:scale-105 transition"
    >
      {isPending ? t('profile.upgrading') : t('profile.upgrade')}
    </button>
  )
} 