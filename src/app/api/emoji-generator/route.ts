import { NextRequest, NextResponse } from 'next/server';
import { openai } from '~/server/openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { prisma } from '~/server/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const style = formData.get('style') as string;
    const prompt = formData.get('prompt') as string;
    const batchSize = parseInt(formData.get('batchSize') as string) || 1;
    const includeText = formData.get('includeText') === 'true';
    const customText = formData.get('customText') as string;
    const language = formData.get('language') as string || 'en';

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
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
        { error: 'Active subscription required for image generation' },
        { status: 403 }
      );
    }

    // 定义各计划的图片生成限制
    const plans = {
      free: { imageGeneration: 3 },
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

    // 计算本次使用的积分（根据batchSize）
    const creditsToUse = batchSize * 2; // 每个图片消耗2积分
    const remainingAfterUse = dailyLimit - currentUsage - batchSize;

    if (remainingAfterUse < 0) {
      return NextResponse.json(
        { error: `Insufficient credits for batch generation. Available: ${dailyLimit - currentUsage}, Required: ${batchSize}` },
        { status: 403 }
      );
    }

    // 将图片转换为base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 第一步：使用Vision API进行深度分析
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `你是一个专业的创意设计师和图像分析师。请深入分析用户上传的图片，识别以下要素：
          1. 主要人物或物体的特征、表情、姿态
          2. 情感色彩和情绪表达
          3. 适合制作表情包的核心元素和亮点
          4. 图片的风格、色调、构图特点
          5. 可以提取的创意元素和设计灵感
          6. 潜在的商业应用场景
          7. 目标受众群体分析
          
          请用专业且富有创意的语言描述分析结果，为后续的表情包生成提供详细指导。`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "请深入分析这张图片，识别适合制作表情包的特征、元素和创意潜力。"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 800,
      temperature: 0.8
    });

    const imageAnalysis = analysisResponse.choices[0]?.message?.content ?? '';

    // 第二步：根据风格生成更丰富的提示词系统
    const getStylePrompts = (lang: string) => {
      if (lang === 'zh') {
        return {
          cute: {
            primary: `基于图片生成可爱风格的表情包，使用粉色系、圆润线条、温暖色彩，突出可爱和温馨的感觉。`,
            variations: [
              `可爱风格变体1：使用柔和的粉色和蓝色，添加小星星和爱心元素`,
              `可爱风格变体2：采用卡通化处理，增加大眼睛和圆润轮廓`,
              `可爱风格变体3：使用温暖的黄色和橙色，营造温馨氛围`
            ]
          },
          funny: {
            primary: `基于图片生成搞笑风格的表情包，使用夸张表情、幽默元素、生动色彩，突出趣味性和娱乐性。`,
            variations: [
              `搞笑风格变体1：使用夸张的表情和动作，增加喜剧效果`,
              `搞笑风格变体2：采用漫画风格，添加幽默文字和符号`,
              `搞笑风格变体3：使用明亮的对比色，突出幽默感`
            ]
          },
          cool: {
            primary: `基于图片生成酷炫风格的表情包，使用深色系、时尚元素、现代设计，突出潮流感和个性。`,
            variations: [
              `酷炫风格变体1：使用深蓝和紫色，添加科技感元素`,
              `酷炫风格变体2：采用赛博朋克风格，增加霓虹效果`,
              `酷炫风格变体3：使用黑白对比，营造高级感`
            ]
          },
          savage: {
            primary: `基于图片生成毒舌风格的表情包，使用犀利表情、讽刺元素、强烈对比，突出态度和个性。`,
            variations: [
              `毒舌风格变体1：使用尖锐的线条和对比色，突出犀利感`,
              `毒舌风格变体2：采用讽刺性表情，增加态度元素`,
              `毒舌风格变体3：使用强烈的色彩对比，营造冲击感`
            ]
          },
          genz: {
            primary: `基于图片生成GenZ风格的表情包，使用潮流元素、年轻化表达、现代色彩，突出青春活力和时尚感。`,
            variations: [
              `GenZ风格变体1：使用流行的渐变色彩，添加现代元素`,
              `GenZ风格变体2：采用社交媒体风格，增加潮流符号`,
              `GenZ风格变体3：使用鲜艳的色彩组合，突出年轻活力`
            ]
          },
          tiktok: {
            primary: `基于图片生成TikTok风格的表情包，使用流行元素、短视频风格、现代设计，突出社交媒体的表达方式。`,
            variations: [
              `TikTok风格变体1：使用流行的滤镜效果，增加短视频感`,
              `TikTok风格变体2：采用社交媒体元素，添加流行符号`,
              `TikTok风格变体3：使用现代设计语言，突出分享性`
            ]
          },
          vintage: {
            primary: `基于图片生成复古风格的表情包，使用怀旧色彩、经典元素、复古设计，突出年代感和怀旧情怀。`,
            variations: [
              `复古风格变体1：使用70-80年代色彩，添加复古元素`,
              `复古风格变体2：采用经典设计风格，增加怀旧感`,
              `复古风格变体3：使用复古滤镜效果，营造年代感`
            ]
          },
          minimalist: {
            primary: `基于图片生成极简风格的表情包，使用简洁线条、单一色彩、简约设计，突出简洁美和现代感。`,
            variations: [
              `极简风格变体1：使用黑白线条，突出简洁美`,
              `极简风格变体2：采用单一色彩，增加现代感`,
              `极简风格变体3：使用几何元素，营造简约风格`
            ]
          }
        };
      } else {
        return {
          cute: {
            primary: `Generate cute style emoji pack based on the image, using pink tones, rounded lines, warm colors, emphasizing cuteness and warmth.`,
            variations: [
              `Cute style variant 1: Use soft pink and blue, add stars and heart elements`,
              `Cute style variant 2: Apply cartoon treatment, increase big eyes and rounded contours`,
              `Cute style variant 3: Use warm yellow and orange, create cozy atmosphere`
            ]
          },
          funny: {
            primary: `Generate funny style emoji pack based on the image, using exaggerated expressions, humorous elements, vivid colors, emphasizing fun and entertainment.`,
            variations: [
              `Funny style variant 1: Use exaggerated expressions and actions, increase comedic effect`,
              `Funny style variant 2: Adopt comic style, add humorous text and symbols`,
              `Funny style variant 3: Use bright contrasting colors, emphasize humor`
            ]
          },
          cool: {
            primary: `Generate cool style emoji pack based on the image, using dark tones, fashion elements, modern design, emphasizing trendiness and personality.`,
            variations: [
              `Cool style variant 1: Use deep blue and purple, add tech elements`,
              `Cool style variant 2: Adopt cyberpunk style, add neon effects`,
              `Cool style variant 3: Use black and white contrast, create premium feel`
            ]
          },
          savage: {
            primary: `Generate savage style emoji pack based on the image, using sharp expressions, sarcastic elements, strong contrast, emphasizing attitude and personality.`,
            variations: [
              `Savage style variant 1: Use sharp lines and contrasting colors, emphasize sharpness`,
              `Savage style variant 2: Adopt sarcastic expressions, add attitude elements`,
              `Savage style variant 3: Use strong color contrast, create impact`
            ]
          },
          genz: {
            primary: `Generate GenZ style emoji pack based on the image, using trendy elements, youthful expression, modern colors, emphasizing youth vitality and fashion.`,
            variations: [
              `GenZ style variant 1: Use popular gradient colors, add modern elements`,
              `GenZ style variant 2: Adopt social media style, add trendy symbols`,
              `GenZ style variant 3: Use vibrant color combinations, emphasize youth energy`
            ]
          },
          tiktok: {
            primary: `Generate TikTok style emoji pack based on the image, using popular elements, short video style, modern design, emphasizing social media expression.`,
            variations: [
              `TikTok style variant 1: Use popular filter effects, increase short video feel`,
              `TikTok style variant 2: Adopt social media elements, add popular symbols`,
              `TikTok style variant 3: Use modern design language, emphasize shareability`
            ]
          },
          vintage: {
            primary: `Generate vintage style emoji pack based on the image, using nostalgic colors, classic elements, retro design, emphasizing era feel and nostalgia.`,
            variations: [
              `Vintage style variant 1: Use 70s-80s colors, add retro elements`,
              `Vintage style variant 2: Adopt classic design style, increase nostalgic feel`,
              `Vintage style variant 3: Use retro filter effects, create era atmosphere`
            ]
          },
          minimalist: {
            primary: `Generate minimalist style emoji pack based on the image, using clean lines, single colors, simple design, emphasizing clean beauty and modern feel.`,
            variations: [
              `Minimalist style variant 1: Use black and white lines, emphasize clean beauty`,
              `Minimalist style variant 2: Adopt single colors, increase modern feel`,
              `Minimalist style variant 3: Use geometric elements, create simple style`
            ]
          }
        };
      }
    };

    const stylePrompts = getStylePrompts(language);

    const selectedStyle = stylePrompts[style as keyof typeof stylePrompts] ?? stylePrompts.cute;
    const customPrompt = prompt ? `用户自定义要求：${prompt}` : '';
    
    // 处理文字选项
    const getTextPrompt = (lang: string) => {
      if (!includeText) {
        const noTextPrompts = {
          'zh': '不添加任何文字，只生成图像表情包',
          'en': 'No text, generate image-only emoji pack',
          'es': 'Sin texto, generar paquete de emojis solo con imagen',
          'fr': 'Pas de texte, générer un pack d\'emojis avec image uniquement',
          'ja': 'テキストなし、画像のみの絵文字パックを生成',
          'ko': '텍스트 없이 이미지만 있는 이모티콘 팩 생성',
          'pt': 'Sem texto, gerar pacote de emojis apenas com imagem',
          'de': 'Kein Text, nur Bild-Emoji-Paket generieren',
          'it': 'Nessun testo, genera pacchetto emoji solo con immagine',
          'ru': 'Без текста, генерировать пакет эмодзи только с изображением'
        };
        return noTextPrompts[lang as keyof typeof noTextPrompts] || noTextPrompts['en'];
      }
      
      if (customText) {
        const customTextPrompts = {
          'zh': `添加文字："${customText}"`,
          'en': `Add text: "${customText}"`,
          'es': `Agregar texto: "${customText}"`,
          'fr': `Ajouter du texte: "${customText}"`,
          'ja': `テキストを追加: "${customText}"`,
          'ko': `텍스트 추가: "${customText}"`,
          'pt': `Adicionar texto: "${customText}"`,
          'de': `Text hinzufügen: "${customText}"`,
          'it': `Aggiungi testo: "${customText}"`,
          'ru': `Добавить текст: "${customText}"`
        };
        return customTextPrompts[lang as keyof typeof customTextPrompts] || customTextPrompts['en'];
      }
      
      // AI自动生成文字
      const autoTextPrompts = {
        'zh': '在表情包中添加合适的文字，文字要清晰、有趣、符合风格特点，使用中文',
        'en': 'Add appropriate text to the emoji pack, text should be clear, fun, and match the style characteristics, use English',
        'es': 'Agregar texto apropiado al paquete de emojis, el texto debe ser claro, divertido y coincidir con las características del estilo, usar español',
        'fr': 'Ajouter du texte approprié au pack d\'emojis, le texte doit être clair, amusant et correspondre aux caractéristiques du style, utiliser le français',
        'ja': '絵文字パックに適切なテキストを追加し、テキストは明確で、面白く、スタイルの特徴に合致し、日本語を使用',
        'ko': '이모티콘 팩에 적절한 텍스트를 추가하고, 텍스트는 명확하고 재미있으며 스타일 특성에 맞고 한국어를 사용',
        'pt': 'Adicionar texto apropriado ao pacote de emojis, o texto deve ser claro, divertido e corresponder às características do estilo, usar português',
        'de': 'Passenden Text zum Emoji-Paket hinzufügen, der Text sollte klar, lustig und dem Stil entsprechend sein, Deutsch verwenden',
        'it': 'Aggiungi testo appropriato al pacchetto emoji, il testo deve essere chiaro, divertente e corrispondere alle caratteristiche dello stile, usa l\'italiano',
        'ru': 'Добавить подходящий текст в пакет эмодзи, текст должен быть четким, веселым и соответствовать характеристикам стиля, использовать русский язык'
      };
      return autoTextPrompts[lang as keyof typeof autoTextPrompts] || autoTextPrompts['en'];
    };
    
    const textPrompt = getTextPrompt(language);
    
    // 第三步：批量生成表情包
    const generatedPacks = [];
    
    for (let i = 0; i < batchSize; i++) {
      // 选择提示词变体
      const promptVariation = i === 0 ? selectedStyle.primary : 
        selectedStyle.variations[i % selectedStyle.variations.length];
      
      // 添加语言特定的输出要求
      const languageOutputRequirement = {
        'zh': '输出语言：中文。文字内容使用中文。',
        'en': 'Output language: English. Text content in English.',
        'ja': '出力言語：日本語。テキスト内容は日本語で。',
        'ko': '출력 언어: 한국어. 텍스트 내용은 한국어로.',
        'es': 'Idioma de salida: Español. Contenido de texto en español.',
        'fr': 'Langue de sortie: Français. Contenu textuel en français.',
        'pt': 'Idioma de saída: Português. Conteúdo de texto em português.',
        'de': 'Ausgabesprache: Deutsch. Textinhalt auf Deutsch.',
        'it': 'Lingua di output: Italiano. Contenuto testuale in italiano.',
        'ru': 'Язык вывода: Русский. Текстовое содержимое на русском языке.'
      };
      
      const langRequirement = languageOutputRequirement[language as keyof typeof languageOutputRequirement] || languageOutputRequirement.en;
      
      const finalPrompt = `${promptVariation}。${textPrompt}。分析：${imageAnalysis}。${customPrompt}。${langRequirement}。要求：高质量、清晰、适合作为表情包使用，背景简洁，主体突出，具有商业价值。`;

      // 使用DALL-E 3生成表情包
      const imageGenerationResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "vivid"
      });

      const generatedImageUrl = imageGenerationResponse.data?.[0]?.url;

      if (!generatedImageUrl) {
        throw new Error('Failed to generate image');
      }

      // 第四步：为每个生成的表情包创建详细描述
      const descriptionResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "你是一个专业的表情包营销专家。请为生成的表情包提供详细的商业分析和营销建议。"
          },
          {
            role: "user",
            content: (() => {
              const descriptions = {
                'zh': `请为这个${style}风格的表情包（变体${i + 1}）${includeText ? '（包含文字）' : '（纯图像）'}提供：
                1. 简洁的描述（30字以内）
                2. 5-8个相关标签
                3. 目标使用场景
                4. 潜在商业价值
                5. 营销建议`,
                'en': `Please provide for this ${style} style emoji pack (variant ${i + 1}) ${includeText ? '(with text)' : '(image only)'}:
                1. Brief description (within 30 words)
                2. 5-8 relevant tags
                3. Target usage scenarios
                4. Potential commercial value
                5. Marketing suggestions`,
                'es': `Por favor proporciona para este paquete de emojis de estilo ${style} (variante ${i + 1}) ${includeText ? '(con texto)' : '(solo imagen)'}:
                1. Descripción breve (dentro de 30 palabras)
                2. 5-8 etiquetas relevantes
                3. Escenarios de uso objetivo
                4. Valor comercial potencial
                5. Sugerencias de marketing`,
                'fr': `Veuillez fournir pour ce pack d'emojis de style ${style} (variante ${i + 1}) ${includeText ? '(avec texte)' : '(image uniquement)'}:
                1. Description brève (en 30 mots maximum)
                2. 5-8 étiquettes pertinentes
                3. Scénarios d'utilisation cible
                4. Valeur commerciale potentielle
                5. Suggestions de marketing`,
                'ja': `この${style}スタイルの絵文字パック（バリアント${i + 1}）${includeText ? '（テキスト付き）' : '（画像のみ）'}について提供してください：
                1. 簡潔な説明（30字以内）
                2. 5-8個の関連タグ
                3. ターゲット使用シナリオ
                4. 潜在的な商業価値
                5. マーケティング提案`,
                'ko': `이 ${style} 스타일 이모티콘 팩(변형 ${i + 1})${includeText ? '(텍스트 포함)' : '(이미지만)'}에 대해 제공해 주세요:
                1. 간결한 설명(30단어 이내)
                2. 5-8개 관련 태그
                3. 목표 사용 시나리오
                4. 잠재적 상업적 가치
                5. 마케팅 제안`,
                'pt': `Por favor, forneça para este pacote de emojis de estilo ${style} (variante ${i + 1}) ${includeText ? '(com texto)' : '(apenas imagem)'}:
                1. Descrição breve (dentro de 30 palavras)
                2. 5-8 tags relevantes
                3. Cenários de uso alvo
                4. Valor comercial potencial
                5. Sugestões de marketing`,
                'de': `Bitte geben Sie für dieses ${style} Style Emoji-Paket (Variante ${i + 1}) ${includeText ? '(mit Text)' : '(nur Bild)'} an:
                1. Kurze Beschreibung (innerhalb von 30 Wörtern)
                2. 5-8 relevante Tags
                3. Zielverwendungsszenarien
                4. Potentieller kommerzieller Wert
                5. Marketingvorschläge`,
                'it': `Si prega di fornire per questo pacchetto emoji di stile ${style} (variante ${i + 1}) ${includeText ? '(con testo)' : '(solo immagine)'}:
                1. Descrizione breve (entro 30 parole)
                2. 5-8 tag rilevanti
                3. Scenari di utilizzo target
                4. Valore commerciale potenziale
                5. Suggerimenti di marketing`,
                'ru': `Пожалуйста, предоставьте для этого пакета эмодзи в стиле ${style} (вариант ${i + 1}) ${includeText ? '(с текстом)' : '(только изображение)'}:
                1. Краткое описание (в пределах 30 слов)
                2. 5-8 релевантных тегов
                3. Целевые сценарии использования
                4. Потенциальная коммерческая ценность
                5. Маркетинговые предложения`
              };
              return descriptions[language as keyof typeof descriptions] || descriptions.en;
            })()
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      const description = descriptionResponse.choices[0]?.message?.content ?? '';

      // 解析描述中的标签
      const tagPatterns = {
        'zh': /标签[：:]\s*([^。\n]+)/,
        'en': /tags?[：:]\s*([^。\n]+)/i,
        'es': /etiquetas?[：:]\s*([^。\n]+)/i,
        'fr': /étiquettes?[：:]\s*([^。\n]+)/i,
        'ja': /タグ[：:]\s*([^。\n]+)/,
        'ko': /태그[：:]\s*([^。\n]+)/,
        'pt': /etiquetas?[：:]\s*([^。\n]+)/i,
        'de': /tags?[：:]\s*([^。\n]+)/i,
        'it': /tag[：:]\s*([^。\n]+)/i,
        'ru': /теги?[：:]\s*([^。\n]+)/i
      };
      
      const tagPattern = tagPatterns[language as keyof typeof tagPatterns] || tagPatterns.en;
      const tagsMatch = tagPattern.exec(description);
      
      const defaultTags = {
        'zh': ['表情包', style, 'AI生成'],
        'en': ['emoji', style, 'AI generated'],
        'es': ['emojis', style, 'IA generado'],
        'fr': ['emojis', style, 'IA généré'],
        'ja': ['絵文字', style, 'AI生成'],
        'ko': ['이모티콘', style, 'AI 생성'],
        'pt': ['emojis', style, 'IA gerado'],
        'de': ['Emojis', style, 'KI generiert'],
        'it': ['emoji', style, 'IA generato'],
        'ru': ['эмодзи', style, 'ИИ сгенерировано']
      };
      
      const tags = tagsMatch?.[1] ? 
        tagsMatch[1].split(/[,，、]/).map(tag => tag.trim()).filter(tag => tag) :
        defaultTags[language as keyof typeof defaultTags] || defaultTags.en;

      generatedPacks.push({
        id: `${Date.now()}-${i}`,
        image: generatedImageUrl,
        style: style,
        variation: i + 1,
        prompt: finalPrompt,
        analysis: imageAnalysis,
        description: description,
        tags: tags,
        createdAt: new Date().toISOString(),
        commercialValue: (() => {
          const commercialValuePatterns = {
            'zh': /商业价值|商业潜力/,
            'en': /commercial value|commercial potential/i,
            'es': /valor comercial|potencial comercial/i,
            'fr': /valeur commerciale|potentiel commercial/i,
            'ja': /商業価値|商業的価値/,
            'ko': /상업적 가치|상업적 잠재력/,
            'pt': /valor comercial|potencial comercial/i,
            'de': /kommerzieller wert|kommerzielles potential/i,
            'it': /valore commerciale|potenziale commerciale/i,
            'ru': /коммерческая ценность|коммерческий потенциал/i
          };
          
          const valueLabels = {
            'zh': { high: '高', medium: '中' },
            'en': { high: 'High', medium: 'Medium' },
            'es': { high: 'Alto', medium: 'Medio' },
            'fr': { high: 'Élevé', medium: 'Moyen' },
            'ja': { high: '高', medium: '中' },
            'ko': { high: '높음', medium: '보통' },
            'pt': { high: 'Alto', medium: 'Médio' },
            'de': { high: 'Hoch', medium: 'Mittel' },
            'it': { high: 'Alto', medium: 'Medio' },
            'ru': { high: 'Высокий', medium: 'Средний' }
          };
          
          const pattern = commercialValuePatterns[language as keyof typeof commercialValuePatterns] || commercialValuePatterns.en;
          const labels = valueLabels[language as keyof typeof valueLabels] || valueLabels.en;
          
          return description.match(pattern) ? labels.high : labels.medium;
        })()
      });
    }

    // 返回生成结果
    const successMessages = {
      'zh': `成功生成 ${generatedPacks.length} 个表情包`,
      'en': `Successfully generated ${generatedPacks.length} emoji packs`,
      'es': `Se generaron exitosamente ${generatedPacks.length} paquetes de emojis`,
      'fr': `${generatedPacks.length} packs d'emojis générés avec succès`,
      'ja': `${generatedPacks.length}個の絵文字パックを正常に生成しました`,
      'ko': `${generatedPacks.length}개의 이모지 팩을 성공적으로 생성했습니다`,
      'pt': `${generatedPacks.length} pacotes de emojis gerados com sucesso`,
      'de': `${generatedPacks.length} Emoji-Packs erfolgreich generiert`,
      'it': `${generatedPacks.length} pacchetti emoji generati con successo`,
      'ru': `Успешно сгенерировано ${generatedPacks.length} пакетов эмодзи`
    };

    const errorMessages = {
      'zh': '表情包生成失败，请稍后重试',
      'en': 'Emoji pack generation failed, please try again later',
      'es': 'La generación del paquete de emojis falló, por favor inténtalo más tarde',
      'fr': 'La génération du pack d\'emojis a échoué, veuillez réessayer plus tard',
      'ja': '絵文字パックの生成に失敗しました。後で再試行してください',
      'ko': '이모지 팩 생성에 실패했습니다. 나중에 다시 시도해 주세요',
      'pt': 'A geração do pacote de emojis falhou, tente novamente mais tarde',
      'de': 'Emoji-Pack-Generierung fehlgeschlagen, bitte versuchen Sie es später erneut',
      'it': 'Generazione del pacchetto emoji fallita, riprova più tardi',
      'ru': 'Создание пакета эмодзи не удалось, попробуйте позже'
    };

    // 记录使用量
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        imageGenerationUsesToday: {
          increment: batchSize
        }
      }
    });

    return NextResponse.json({
      success: true,
      packs: generatedPacks,
      totalGenerated: generatedPacks.length,
      analysis: imageAnalysis,
      message: successMessages[language as keyof typeof successMessages] || successMessages.en
    });

  } catch (error) {
    console.error('表情包生成失败:', error);
    
    // 根据错误类型提供不同的错误信息
    let errorMessage = 'Emoji pack generation failed, please try again later';
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('APIConnectionTimeoutError')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (error.message.includes('rate limit') || error.message.includes('RateLimitError')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      } else if (error.message.includes('invalid') || error.message.includes('InvalidRequestError')) {
        errorMessage = 'Invalid request. Please check your input and try again.';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 