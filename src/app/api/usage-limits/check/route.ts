import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { prisma } from '~/server/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { canUse: false, message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { service } = await request.json();

    if (!service || !['translation', 'imageGeneration'].includes(service)) {
      return NextResponse.json(
        { canUse: false, message: '유효하지 않은 서비스입니다.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionPlan: true,
        subscriptionExpireAt: true,
        translationUsesToday: true,
        imageGenerationUsesToday: true,
        lastUsageReset: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { canUse: false, message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 检查是否需要重置每日使用量
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!user.lastUsageReset || user.lastUsageReset < today) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          translationUsesToday: 0,
          imageGenerationUsesToday: 0,
          lastUsageReset: today
        }
      });
      user.translationUsesToday = 0;
      user.imageGenerationUsesToday = 0;
    }

    // 检查订阅状态
    const isSubscriptionActive = user.subscriptionExpireAt && user.subscriptionExpireAt > new Date();
    
    if (!isSubscriptionActive) {
      return NextResponse.json({
        canUse: false,
        reason: 'subscription_expired',
        message: '구독이 만료되었습니다. 구독을 갱신해주세요.'
      });
    }

    const plans = {
      free: { translation: 8, imageGeneration: 0 },
      starter: { translation: 15, imageGeneration: 5 },
      pro: { translation: 35, imageGeneration: 12 },
      enterprise: { translation: 70, imageGeneration: 20 }
    };

    const plan = user.subscriptionPlan || 'free';
    const limits = plans[plan as keyof typeof plans];
    const currentUsage = service === 'translation' 
      ? user.translationUsesToday 
      : user.imageGenerationUsesToday;
    const dailyLimit = limits[service as keyof typeof limits];

    if (dailyLimit === 0) {
      return NextResponse.json({
        canUse: false,
        reason: 'service_not_available',
        message: '현재 플랜에서 이 서비스를 사용할 수 없습니다.'
      });
    }

    if (currentUsage >= dailyLimit) {
      return NextResponse.json({
        canUse: false,
        reason: 'daily_limit_reached',
        message: `오늘의 사용 한도에 도달했습니다. 내일 다시 시도하거나 플랜을 업그레이드하세요.`
      });
    }

    return NextResponse.json({
      canUse: true,
      currentUsage,
      dailyLimit,
      remaining: dailyLimit - currentUsage,
      plan
    });

  } catch (error) {
    console.error('Usage limit check error:', error);
    return NextResponse.json(
      { canUse: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 