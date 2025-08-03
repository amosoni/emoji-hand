import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { id: 'dev-user-id' }
    });

    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // 创建测试用户
    const user = await prisma.user.create({
      data: {
        id: 'dev-user-id',
        email: 'dev@example.com',
        name: 'Dev User',
        passwordHash: '$2b$10$test.hash.for.dev.user', // 测试密码哈希
        subscriptionPlan: 'free',
        translationUsesToday: 0,
        imageGenerationUsesToday: 0,
        lastUsageReset: new Date(),
        credits: 100,
        totalCreditsEarned: 100,
        totalCreditsSpent: 0,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('Test user created successfully:', user);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 