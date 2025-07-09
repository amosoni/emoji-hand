import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function resetDailyQuota() {
  // 免费用户每日额度重置为5
  await prisma.user.updateMany({ data: { freeUsesDaily: 5 } });
  // 会员用户每日额度重置为20
  await prisma.user.updateMany({
    where: { premiumExpireAt: { gt: new Date() } },
    data: { premiumUsesWeekly: 20 }
  });
  console.log('Daily quota reset complete.');
}

resetDailyQuota().then(() => prisma.$disconnect()); 