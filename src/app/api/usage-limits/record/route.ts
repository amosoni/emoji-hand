import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { prisma } from '~/server/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { service } = await request.json();

    if (!service || !['translation', 'imageGeneration'].includes(service)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 서비스입니다.' },
        { status: 400 }
      );
    }

    // 记录使用量
    const updateData = service === 'translation' 
      ? { translationUsesToday: { increment: 1 } }
      : { imageGenerationUsesToday: { increment: 1 } };

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Usage record error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 