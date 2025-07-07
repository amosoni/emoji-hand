import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/server/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const event = req.body

  // 这里只做简单处理，实际应校验签名
  if (event.type === 'checkout.session.completed') {
    const email = event.data.customer_email
    // 查询当前用户会员到期时间
    const user = await prisma.user.findUnique({ where: { email } })
    let newExpireAt = new Date()
    if (user?.premiumExpireAt && user.premiumExpireAt > new Date()) {
      // 会员未过期，顺延30天
      newExpireAt = new Date(user.premiumExpireAt.getTime() + 30 * 24 * 60 * 60 * 1000)
    } else {
      // 会员已过期或未开通，从现在起30天
      newExpireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
    await prisma.user.update({
      where: { email },
      data: {
        premiumExpireAt: newExpireAt,
        points: { increment: 100 },
      }
    })
  }
  res.status(200).json({ received: true })
} 