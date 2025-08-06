const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    // 查找所有用户
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        subscriptionPlan: true,
        subscriptionExpireAt: true,
        subscriptionStatus: true,
        createdAt: true
      }
    });

    console.log('所有用户:');
    users.forEach(user => {
      console.log({
        id: user.id,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpireAt: user.subscriptionExpireAt,
        subscriptionStatus: user.subscriptionStatus,
        createdAt: user.createdAt
      });
    });

    // 查找Enterprise用户
    const enterpriseUsers = users.filter(u => u.subscriptionPlan === 'enterprise');
    console.log('\nEnterprise用户:', enterpriseUsers.length);
    enterpriseUsers.forEach(user => {
      console.log('Enterprise用户:', user.email);
    });

  } catch (error) {
    console.error('错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser(); 