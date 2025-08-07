import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  try {
    // 查找所有用户
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true
      }
    });
    
    console.log('所有用户:', users);
    
    // 特别查找这个邮箱
    const specificUser = await prisma.user.findFirst({
      where: {
        email: '451502315@qq.com'
      }
    });
    
    console.log('查找 451502315@qq.com:', specificUser);
    
    // 检查是否有类似的邮箱
    const similarEmails = users.filter(user => 
      user.email && user.email.toLowerCase().includes('451502315')
    );
    console.log('包含451502315的邮箱:', similarEmails);
    
    // 检查所有qq.com邮箱
    const qqEmails = users.filter(user => 
      user.email && user.email.includes('@qq.com')
    );
    console.log('所有qq.com邮箱:', qqEmails);
    
  } catch (error) {
    console.error('查询错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser(); 