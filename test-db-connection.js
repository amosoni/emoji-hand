import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('📡 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  console.log('🌐 HTTP_PROXY:', process.env.HTTP_PROXY || 'Not set');
  console.log('🔒 HTTPS_PROXY:', process.env.HTTPS_PROXY || 'Not set');
  
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    // 测试连接
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // 测试简单查询
    const userCount = await prisma.user.count();
    console.log(`📊 User count: ${userCount}`);
    
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔍 Full error:', error);
  }
}

testConnection(); 