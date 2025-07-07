import { api } from '~/trpc/react';

export function RechargeButton() {
  const { mutate: createCheckout, isPending } = api.creem.createCheckoutSession.useMutation({
    onSuccess: (data: any) => {
      // 兼容 url 或 checkoutUrl 字段
      const url = data?.url || data?.checkoutUrl;
      if (url) {
        window.location.href = url;
      } else {
        alert('支付链接获取失败');
      }
    }
  })

  return (
    <button
      onClick={() =>
        createCheckout({
          productId: 'your_creem_product_id',
          successUrl: window.location.origin + '/pay/success',
          cancelUrl: window.location.origin + '/pay/cancel',
        })
      }
      disabled={isPending}
    >
      {isPending ? '跳转中...' : '充值100积分'}
    </button>
  )
} 