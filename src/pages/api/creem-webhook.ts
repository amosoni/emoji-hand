import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/server/db'
import { CREEM_PRODUCT_IDS } from '@/config/creem-products'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const event = req.body

  // 这里只做简单处理，实际应校验签名
  if (event.type === 'checkout.session.completed') {
    const email = event.data.customer_email
    const productId = event.data.product_id
    
    // 查询用户
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.error('User not found:', email)
      return res.status(200).json({ received: true })
    }

    // 处理订阅套餐
    if (isSubscriptionProduct(productId)) {
      await handleSubscriptionPayment(user.id, productId)
    }
  }
  
  res.status(200).json({ received: true })
}

// 判断是否为订阅商品
function isSubscriptionProduct(productId: string): boolean {
  const subscriptionIds = Object.values(CREEM_PRODUCT_IDS.subscription).flatMap(plan => 
    Object.values(plan)
  ) as string[];
  return subscriptionIds.includes(productId)
}

// 处理订阅支付
async function handleSubscriptionPayment(userId: string, productId: string) {
  // 根据商品ID确定套餐和计费周期
  const subscriptionConfig = getSubscriptionConfig(productId)
  if (!subscriptionConfig) return

  const { plan, billingCycle } = subscriptionConfig
  
  // 计算到期时间
  let newExpireAt = new Date()
  if (billingCycle === 'yearly') {
    newExpireAt.setFullYear(newExpireAt.getFullYear() + 1)
  } else {
    newExpireAt.setMonth(newExpireAt.getMonth() + 1)
  }

  // 更新用户订阅
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionPlan: plan,
      subscriptionExpireAt: newExpireAt,
      subscriptionStatus: 'active'
    }
  })

  console.log(`Subscription updated for user ${userId}: ${plan} ${billingCycle}`)
}

// 根据商品ID获取订阅配置
function getSubscriptionConfig(productId: string) {
  for (const [plan, cycles] of Object.entries(CREEM_PRODUCT_IDS.subscription)) {
    for (const [cycle, id] of Object.entries(cycles)) {
      if (id === productId) {
        return { plan, billingCycle: cycle as 'monthly' | 'yearly' }
      }
    }
  }
  return null
} 