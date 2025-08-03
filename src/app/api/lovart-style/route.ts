import { NextRequest, NextResponse } from 'next/server';
import { openai } from '~/server/openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { prisma } from '~/server/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const textPrompt = formData.get('textPrompt') as string;
    const designType = formData.get('designType') as string;
    const targetAudience = formData.get('targetAudience') as string;
    const commercialUse = formData.get('commercialUse') === 'true';
    const language = formData.get('language') as string || 'en';

    if (!image && !textPrompt) {
      return NextResponse.json(
        { error: 'No image or text prompt provided' },
        { status: 400 }
      );
    }

    // 检查用户会话和使用限制
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 获取用户信息并检查使用限制
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        subscriptionPlan: true,
        subscriptionExpireAt: true,
        imageGenerationUsesToday: true,
        lastUsageReset: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
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
          imageGenerationUsesToday: 0,
          lastUsageReset: today
        }
      });
      user.imageGenerationUsesToday = 0;
    }

    // 检查订阅状态和使用限制
    const isSubscriptionActive = user.subscriptionExpireAt && user.subscriptionExpireAt > new Date();
    
    if (!isSubscriptionActive) {
      return NextResponse.json(
        { error: 'Active subscription required for Lovart style generation' },
        { status: 403 }
      );
    }

    // 定义各计划的图片生成限制
    const plans = {
      free: { imageGeneration: 0 },
      starter: { imageGeneration: 5 },
      pro: { imageGeneration: 12 },
      enterprise: { imageGeneration: 20 }
    };

    const plan = user.subscriptionPlan || 'free';
    const limits = plans[plan as keyof typeof plans];
    const currentUsage = user.imageGenerationUsesToday || 0;
    const dailyLimit = limits.imageGeneration;

    if (currentUsage >= dailyLimit) {
      return NextResponse.json(
        { error: `Daily image generation limit exceeded (${currentUsage}/${dailyLimit})` },
        { status: 403 }
      );
    }

    // 根据语言和设计类型生成提示词
    const getDesignPrompt = (lang: string, type: string) => {
      const prompts: Record<string, Record<string, string>> = {
        'brand': {
          'zh': '创建完整的品牌策略，包括logo设计、色彩方案、字体选择、品牌指南',
          'en': 'Create complete brand strategy including logo design, color scheme, typography, brand guidelines',
          'fr': 'Créer une stratégie de marque complète incluant la conception de logo, la palette de couleurs, la typographie',
          'es': 'Crear estrategia de marca completa incluyendo diseño de logo, esquema de colores, tipografía',
          'ja': 'ロゴデザイン、カラースキーム、タイポグラフィ、ブランドガイドラインを含む完全なブランド戦略を作成',
          'ko': '로고 디자인, 색상 구성, 타이포그래피, 브랜드 가이드라인을 포함한 완전한 브랜드 전략 생성',
          'pt': 'Criar estratégia de marca completa incluindo design de logo, esquema de cores, tipografia',
          'de': 'Erstellen Sie eine vollständige Markenstrategie einschließlich Logo-Design, Farbschema, Typografie',
          'it': 'Crea una strategia di marca completa inclusi design del logo, schema colori, tipografia',
          'ru': 'Создать полную стратегию бренда, включая дизайн логотипа, цветовую схему, типографику'
        },
        'marketing': {
          'zh': '创建引人注目的营销视觉材料，包括海报、广告、宣传册、社交媒体内容',
          'en': 'Create eye-catching marketing visuals including posters, ads, brochures, social media content',
          'fr': 'Créer des visuels marketing accrocheurs incluant affiches, publicités, brochures',
          'es': 'Crear visuales de marketing llamativos incluyendo carteles, anuncios, folletos',
          'ja': 'ポスター、広告、パンフレット、ソーシャルメディアコンテンツを含む目を引くマーケティングビジュアルを作成',
          'ko': '포스터, 광고, 브로셔, 소셜미디어 콘텐츠를 포함한 눈에 띄는 마케팅 비주얼 생성',
          'pt': 'Criar visuais de marketing chamativos incluindo cartazes, anúncios, folhetos',
          'de': 'Erstellen Sie auffällige Marketing-Visuals einschließlich Poster, Anzeigen, Broschüren',
          'it': 'Crea visuali di marketing accattivanti inclusi poster, pubblicità, brochure',
          'ru': 'Создать привлекательные маркетинговые визуалы, включая плакаты, рекламу, брошюры'
        },
        'social': {
          'zh': '创建引人入胜的社交媒体内容，包括帖子、故事、短视频、互动元素',
          'en': 'Create engaging social media content including posts, stories, short videos, interactive elements',
          'fr': 'Créer du contenu de réseaux sociaux engageant incluant posts, stories, vidéos courtes',
          'es': 'Crear contenido de redes sociales atractivo incluyendo publicaciones, historias, videos cortos',
          'ja': '投稿、ストーリー、ショート動画、インタラクティブ要素を含む魅力的なソーシャルメディアコンテンツを作成',
          'ko': '게시물, 스토리, 숏 비디오, 인터랙티브 요소를 포함한 매력적인 소셜미디어 콘텐츠 생성',
          'pt': 'Criar conteúdo de redes sociais envolvente incluindo posts, stories, vídeos curtos',
          'de': 'Erstellen Sie fesselnde Social-Media-Inhalte einschließlich Posts, Stories, Kurzvideos',
          'it': 'Crea contenuti social media coinvolgenti inclusi post, storie, video brevi',
          'ru': 'Создать увлекательный контент для социальных сетей, включая посты, истории, короткие видео'
        },
        'product': {
          'zh': '设计产品模型和包装，包括3D渲染、产品展示、包装设计、用户体验',
          'en': 'Design product mockups and packaging including 3D renders, product displays, packaging design',
          'fr': 'Concevoir des maquettes de produits et des emballages incluant rendus 3D, présentations de produits',
          'es': 'Diseñar maquetas de productos y empaques incluyendo renders 3D, displays de productos',
          'ja': '3Dレンダリング、製品ディスプレイ、パッケージデザイン、ユーザーエクスペリエンスを含む製品モックアップとパッケージをデザイン',
          'ko': '3D 렌더링, 제품 디스플레이, 패키징 디자인, 사용자 경험을 포함한 제품 목업과 패키징 디자인',
          'pt': 'Projetar maquetes de produtos e embalagens incluindo renders 3D, displays de produtos',
          'de': 'Entwerfen Sie Produkt-Mockups und Verpackungen einschließlich 3D-Renderings, Produktdisplays',
          'it': 'Progettare mockup di prodotti e imballaggi inclusi rendering 3D, display di prodotti',
          'ru': 'Спроектировать макеты продуктов и упаковку, включая 3D-рендеринг, дисплеи продуктов'
        },
        'web': {
          'zh': '创建网站设计和用户界面，包括响应式设计、用户体验、交互设计、现代界面',
          'en': 'Create website designs and user interfaces including responsive design, user experience, interaction design',
          'fr': 'Créer des conceptions de sites web et interfaces utilisateur incluant design responsive, expérience utilisateur',
          'es': 'Crear diseños de sitios web e interfaces de usuario incluyendo diseño responsivo, experiencia de usuario',
          'ja': 'レスポンシブデザイン、ユーザーエクスペリエンス、インタラクションデザイン、モダンインターフェースを含むウェブサイトデザインとユーザーインターフェースを作成',
          'ko': '반응형 디자인, 사용자 경험, 인터랙션 디자인, 모던 인터페이스를 포함한 웹사이트 디자인과 사용자 인터페이스 생성',
          'pt': 'Criar designs de sites web e interfaces de usuário incluindo design responsivo, experiência do usuário',
          'de': 'Erstellen Sie Website-Designs und Benutzeroberflächen einschließlich responsives Design, Benutzererfahrung',
          'it': 'Crea design di siti web e interfacce utente inclusi design responsive, esperienza utente',
          'ru': 'Создать дизайны веб-сайтов и пользовательские интерфейсы, включая адаптивный дизайн, пользовательский опыт'
        },
        'video': {
          'zh': '生成视频、3D模型和动画，包括创意概念、视觉效果、动态图形、沉浸式体验',
          'en': 'Generate videos, 3D models and animations including creative concepts, visual effects, motion graphics',
          'fr': 'Générer des vidéos, modèles 3D et animations incluant concepts créatifs, effets visuels, graphiques animés',
          'es': 'Generar videos, modelos 3D y animaciones incluyendo conceptos creativos, efectos visuales, gráficos en movimiento',
          'ja': 'クリエイティブコンセプト、視覚効果、モーショングラフィックス、没入型体験を含む動画、3Dモデル、アニメーションを生成',
          'ko': '크리에이티브 컨셉트, 시각 효과, 모션 그래픽, 몰입형 경험을 포함한 비디오, 3D 모델, 애니메이션 생성',
          'pt': 'Gerar vídeos, modelos 3D e animações incluindo conceitos criativos, efeitos visuais, gráficos em movimento',
          'de': 'Generieren Sie Videos, 3D-Modelle und Animationen einschließlich kreativer Konzepte, visueller Effekte',
          'it': 'Genera video, modelli 3D e animazioni inclusi concetti creativi, effetti visivi, grafica in movimento',
          'ru': 'Создать видео, 3D-модели и анимации, включая креативные концепции, визуальные эффекты, движущуюся графику'
        }
      };
      
      return prompts[type]?.[lang] ?? prompts[type]?.en ?? 'Create professional design';
    };

    const designPrompt = getDesignPrompt(language, designType);
    
    // 构建完整的提示词
    let fullPrompt = `${designPrompt}`;
    
    if (textPrompt) {
      fullPrompt += `. User requirements: ${textPrompt}`;
    }
    
    if (targetAudience) {
      fullPrompt += `. Target audience: ${targetAudience}`;
    }
    
    if (commercialUse) {
      fullPrompt += `. Optimized for commercial use`;
    }

    // 生成设计概念
    const conceptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `你是一个专业的AI设计代理，像Lovart AI一样工作。请使用${language}语言回复，为以下设计需求提供：
1. 设计概念分析
2. 3个创意方向
3. 色彩和字体建议
4. 商业价值评估
5. 实施建议`
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.8
    });

    const concept = conceptResponse.choices[0]?.message?.content ?? '';

    // 生成视觉设计
    const visualPrompts = [
      `${fullPrompt}, professional, high quality, detailed`,
      `${fullPrompt}, creative, artistic, unique style`,
      `${fullPrompt}, minimalist, clean, elegant`,
      `${fullPrompt}, modern, trendy, contemporary`,
      `${fullPrompt}, innovative, cutting-edge, futuristic`
    ];

    const visualResults = await Promise.all(
      visualPrompts.map(async (prompt) => {
        try {
          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
            quality: "hd",
            style: "vivid"
          });
          return response.data?.[0]?.url ?? null;
        } catch (error) {
          console.error('DALL-E generation error:', error);
          return null;
        }
      })
    );

    // 记录使用量（每次生成5张图片）
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        imageGenerationUsesToday: {
          increment: 5
        }
      }
    });

    return NextResponse.json({
      success: true,
      designType: designType,
      concepts: concept,
      businessAdvice: concept,
      visualDesigns: visualResults.filter(Boolean).map((url, index) => ({
        id: `${Date.now()}-${index}`,
        style: `Style ${index + 1}`,
        image: url,
        prompt: visualPrompts[index]
      })),
      analysis: concept,
      message: 'Design generated successfully'
    });

  } catch (error) {
    console.error('Lovart Style generation failed:', error);
    return NextResponse.json(
      { error: 'Design generation failed, please try again later' },
      { status: 500 }
    );
  }
} 