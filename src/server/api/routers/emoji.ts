import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { openai } from '~/server/openai';
import { prisma } from '~/server/db';
import { performSecurityCheck } from '@/server/api/security';

// 语言检测函数
const detectLanguage = (text: string): string => {
  // 简单的语言检测逻辑
  const chineseRegex = /[\u4e00-\u9fff]/;
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
  const koreanRegex = /[\uac00-\ud7af]/;
  const russianRegex = /[\u0400-\u04ff]/;
  
  if (chineseRegex.test(text)) return 'zh';
  if (japaneseRegex.test(text)) return 'ja';
  if (koreanRegex.test(text)) return 'ko';
  if (russianRegex.test(text)) return 'ru';
  
  // 其他语言默认为英文
  return 'en';
};

// 获取语言特定的提示词
const getLanguageSpecificPrompt = (language: string, mode: string) => {
  const languageInstructions = {
    'zh': '请使用中文回复，保持自然流畅的表达',
    'en': 'Please respond in English, maintain natural and fluent expression',
    'ja': '日本語で返信してください。自然で流暢な表現を保ってください',
    'ko': '한국어로 답변해 주세요. 자연스럽고 유창한 표현을 유지하세요',
    'es': 'Por favor responde en español, mantén una expresión natural y fluida',
    'fr': 'Veuillez répondre en français, maintenez une expression naturelle et fluide',
    'pt': 'Por favor responda em português, mantenha uma expressão natural e fluida',
    'de': 'Bitte antworten Sie auf Deutsch, behalten Sie einen natürlichen und flüssigen Ausdruck bei',
    'it': 'Per favore rispondi in italiano, mantieni un\'espressione naturale e fluida',
    'ru': 'Пожалуйста, отвечайте на русском языке, сохраняйте естественное и плавное выражение'
  };
  
  const modePrompts = {
    'normal': {
      'zh': '你是一个表情翻译器，根据用户输入生成带有丰富表情的回复。自然地添加相关表情符号来增强文本的表达力。',
      'en': 'You are an emoji translator that generates responses with rich emojis based on user input. Naturally add relevant emoji symbols to enhance the expressiveness of the text.',
      'ja': 'あなたは絵文字翻訳者で、ユーザーの入力に基づいて豊富な絵文字を含む返信を生成します。テキストの表現力を高めるために、関連する絵文字を自然に追加してください。',
      'ko': '당신은 이모지 번역기로, 사용자 입력을 기반으로 풍부한 이모지가 포함된 응답을 생성합니다. 텍스트의 표현력을 향상시키기 위해 관련 이모지를 자연스럽게 추가하세요.',
      'es': 'Eres un traductor de emojis que genera respuestas con emojis ricos basados en la entrada del usuario. Agrega naturalmente símbolos de emoji relevantes para mejorar la expresividad del texto.',
      'fr': 'Vous êtes un traducteur d\'emoji qui génère des réponses avec des emojis riches basées sur l\'entrée de l\'utilisateur. Ajoutez naturellement des symboles emoji pertinents pour améliorer l\'expressivité du texte.',
      'pt': 'Você é um tradutor de emoji que gera respostas com emojis ricos baseados na entrada do usuário. Adicione naturalmente símbolos de emoji relevantes para melhorar a expressividade do texto.',
      'de': 'Sie sind ein Emoji-Übersetzer, der Antworten mit reichen Emojis basierend auf der Benutzereingabe generiert. Fügen Sie natürlich relevante Emoji-Symbole hinzu, um die Ausdruckskraft des Textes zu verbessern.',
      'it': 'Sei un traduttore di emoji che genera risposte con emoji ricche basate sull\'input dell\'utente. Aggiungi naturalmente simboli emoji rilevanti per migliorare l\'espressività del testo.',
      'ru': 'Вы - переводчик эмодзи, который генерирует ответы с богатыми эмодзи на основе ввода пользователя. Естественно добавляйте соответствующие символы эмодзи для улучшения выразительности текста.'
    },
    'savage': {
      'zh': '你是一个毒舌表情翻译器，将用户输入转换为带有讽刺、机智和态度的表情表达。使用尖锐、幽默的表情符号。',
      'en': 'You are a savage emoji translator that converts user input into emoji expressions with sarcasm, wit, and attitude. Use sharp, humorous emoji symbols.',
      'ja': 'あなたは毒舌絵文字翻訳者で、ユーザーの入力を皮肉、機知、態度を含む絵文字表現に変換します。鋭く、ユーモラスな絵文字を使用してください。',
      'ko': '당신은 독설 이모지 번역기로, 사용자 입력을 풍자, 재치, 태도를 포함한 이모지 표현으로 변환합니다. 날카롭고 유머러스한 이모지를 사용하세요.',
      'es': 'Eres un traductor de emojis salvaje que convierte la entrada del usuario en expresiones de emoji con sarcasmo, ingenio y actitud. Usa símbolos de emoji agudos y humorísticos.',
      'fr': 'Vous êtes un traducteur d\'emoji sauvage qui convertit l\'entrée de l\'utilisateur en expressions emoji avec sarcasme, esprit et attitude. Utilisez des symboles emoji tranchants et humoristiques.',
      'pt': 'Você é um tradutor de emoji selvagem que converte a entrada do usuário em expressões de emoji com sarcasmo, sagacidade e atitude. Use símbolos de emoji afiados e humorísticos.',
      'de': 'Sie sind ein wilder Emoji-Übersetzer, der die Benutzereingabe in Emoji-Ausdrücke mit Sarkasmus, Witz und Haltung umwandelt. Verwenden Sie scharfe, humorvolle Emoji-Symbole.',
      'it': 'Sei un traduttore di emoji selvaggio che converte l\'input dell\'utente in espressioni emoji con sarcasmo, arguzia e atteggiamento. Usa simboli emoji taglienti e umoristici.',
      'ru': 'Вы - дикий переводчик эмодзи, который преобразует ввод пользователя в выражения эмодзи с сарказмом, остроумием и отношением. Используйте острые, юмористические символы эмодзи.'
    },
    'genz': {
      'zh': '你是一个GenZ俚语表情翻译器，将用户输入转换为Z世代流行的网络用语和潮流表情符号。使用现代、时尚的表达方式。',
      'en': 'You are a GenZ slang emoji translator that converts user input into Z-generation popular internet slang and trendy emoji symbols. Use modern, fashionable expressions.',
      'ja': 'あなたはGenZスラング絵文字翻訳者で、ユーザーの入力をZ世代の人気インターネットスラングとトレンディな絵文字に変換します。現代的でファッショナブルな表現を使用してください。',
      'ko': '당신은 GenZ 슬랭 이모지 번역기로, 사용자 입력을 Z세대 인기 인터넷 슬랭과 트렌디한 이모지로 변환합니다. 현대적이고 패셔너블한 표현을 사용하세요.',
      'es': 'Eres un traductor de emoji de jerga GenZ que convierte la entrada del usuario en jerga de internet popular de la generación Z y símbolos de emoji de moda. Usa expresiones modernas y de moda.',
      'fr': 'Vous êtes un traducteur d\'emoji d\'argot GenZ qui convertit l\'entrée de l\'utilisateur en argot Internet populaire de la génération Z et symboles emoji tendance. Utilisez des expressions modernes et à la mode.',
      'pt': 'Você é um tradutor de emoji de gíria GenZ que converte a entrada do usuário em gíria da internet popular da geração Z e símbolos de emoji da moda. Use expressões modernas e da moda.',
      'de': 'Sie sind ein GenZ-Slang-Emoji-Übersetzer, der die Benutzereingabe in beliebte Internet-Slang der Z-Generation und trendige Emoji-Symbole umwandelt. Verwenden Sie moderne, modische Ausdrücke.',
      'it': 'Sei un traduttore di emoji slang GenZ che converte l\'input dell\'utente in slang Internet popolare della generazione Z e simboli emoji di tendenza. Usa espressioni moderne e alla moda.',
      'ru': 'Вы - переводчик эмодзи сленга GenZ, который преобразует ввод пользователя в популярный интернет-сленг поколения Z и модные символы эмодзи. Используйте современные, модные выражения.'
    },
    'tiktok': {
      'zh': '你是一个TikTok风格表情翻译器，将用户输入转换为类似TikTok视频中常见的表情表达。使用流行的Unicode emoji表情符号，如😱、💯、🔥、✨、🎉、🥳、🍻、😵‍💫、🤯、💀、👏、💖、🤐、😶、💭、💃、🕺、🎊等。模仿TikTok创作者的表达风格，使用夸张、有趣、富有感染力的表情组合，让文本充满活力和时尚感。',
      'en': 'You are a TikTok-style emoji translator that converts user input into emoji expressions similar to those commonly found in TikTok videos. Use popular Unicode emoji symbols such as 😱, 💯, 🔥, ✨, 🎉, 🥳, 🍻, 😵‍💫, 🤯, 💀, 👏, 💖, 🤐, 😶, 💭, 💃, 🕺, 🎊, etc. Mimic TikTok creators\' expression style, using exaggerated, fun, and infectious emoji combinations that make text vibrant and trendy.',
      'ja': 'あなたはTikTokスタイルの絵文字翻訳者で、ユーザーの入力をTikTok動画でよく見られる絵文字表現に変換します。TikTokプラットフォーム固有のカスタム絵文字シンボルを使用してください。',
      'ko': '당신은 TikTok 스타일 이모지 번역기로, 사용자 입력을 TikTok 비디오에서 흔히 볼 수 있는 이모지 표현으로 변환합니다. TikTok 플랫폼 특유의 커스텀 이모지 기호를 사용하세요.',
      'es': 'Eres un traductor de emoji estilo TikTok que convierte la entrada del usuario en expresiones de emoji similares a las que se encuentran comúnmente en videos de TikTok. Usa símbolos de emoji personalizados específicos de la plataforma TikTok.',
      'fr': 'Vous êtes un traducteur d\'emoji style TikTok qui convertit l\'entrée de l\'utilisateur en expressions emoji similaires à celles couramment trouvées dans les vidéos TikTok. Utilisez des symboles emoji personnalisés spécifiques à la plateforme TikTok.',
      'pt': 'Você é um tradutor de emoji estilo TikTok que converte a entrada do usuário em expressões de emoji semelhantes às encontradas comumente em vídeos do TikTok. Use símbolos de emoji personalizados específicos da plataforma TikTok.',
      'de': 'Sie sind ein TikTok-Stil-Emoji-Übersetzer, der die Benutzereingabe in Emoji-Ausdrücke umwandelt, ähnlich denen, die häufig in TikTok-Videos zu finden sind. Verwenden Sie TikTok-plattformspezifische benutzerdefinierte Emoji-Symbole.',
      'it': 'Sei un traduttore di emoji stile TikTok che converte l\'input dell\'utente in espressioni emoji simili a quelle comunemente trovate nei video TikTok. Usa simboli emoji personalizzati specifici della piattaforma TikTok.',
      'ru': 'Вы - переводчик эмодзи в стиле TikTok, который преобразует ввод пользователя в выражения эмодзи, аналогичные тем, которые часто встречаются в видео TikTok. Используйте пользовательские символы эмодзи, специфичные для платформы TikTok.'
    }
  };
  
  const modePrompt = modePrompts[mode as keyof typeof modePrompts]?.[language as keyof typeof modePrompts.normal] || modePrompts[mode as keyof typeof modePrompts]?.en || modePrompts.normal.en;
  const languageInstruction = languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en;
  
  return `${modePrompt} ${languageInstruction}`;
};

export const emojiRouter = createTRPCRouter({
  translate: publicProcedure
    .input(z.object({ text: z.string(), mode: z.string(), model: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      console.log('==== emoji.translate mutation called ====');
      const userId = ctx.session?.userId;
      console.log('emoji.translate userId from session:', userId);
      
      // 在开发环境中，如果没有用户登录，使用默认设置
      let isPremium = false;
      let user = null;
      if (userId) {
        // 获取用户信息
        user = await prisma.user.findUnique({ 
          where: { id: userId },
          select: {
            id: true,
            subscriptionPlan: true,
            subscriptionExpireAt: true,
            translationUsesToday: true,
            lastUsageReset: true
          }
        });
        console.log('user from db:', user);
        if (user) {
          // 检查是否需要重置每日使用量
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (!user.lastUsageReset || user.lastUsageReset < today) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                translationUsesToday: 0,
                lastUsageReset: today
              }
            });
            user.translationUsesToday = 0;
          }
          
          isPremium = !!(user.subscriptionExpireAt && new Date(user.subscriptionExpireAt) > new Date());
        }
      }
      
      // 额度判断 - 启用检查
      if (user) {
        const plans = {
          free: { translation: 8, imageGeneration: 0 },
          starter: { translation: 15, imageGeneration: 5 },
          pro: { translation: 35, imageGeneration: 12 },
          enterprise: { translation: 70, imageGeneration: 20 }
        };
        
        const plan = user.subscriptionPlan ?? 'free';
        const limits = plans[plan as keyof typeof plans];
        const currentUsage = user.translationUsesToday ?? 0;
        const dailyLimit = limits.translation;
       
        if (currentUsage >= dailyLimit) {
          throw new Error(`每日使用额度已用完 (${currentUsage}/${dailyLimit})`);
        }
        
        // 免费用户限制
        if (plan === 'free') {
          if (input.mode !== 'normal') {
            throw new Error('免费用户仅可使用默认风格');
          }
          if (input.model && input.model !== 'gpt-3.5-turbo') {
            throw new Error('免费用户仅可使用GPT-3.5模型');
          }
        }
      }
      
      // 获取客户端信息
      const req = ctx.req as { headers?: { get?: (key: string) => string | null } } | undefined;
      const ip = String(req?.headers?.get?.('x-forwarded-for') ?? req?.headers?.get?.('x-real-ip') ?? 'unknown');
      const userAgent = String(req?.headers?.get?.('user-agent') ?? 'unknown');
      
      // 执行综合安全检查
      if (userId) {
        await performSecurityCheck(userId, ip, userAgent);
      }
      
      // 选择模型 - 免费用户强制使用GPT-3.5
      const model = isPremium ? 'gpt-4' : 'gpt-3.5-turbo';
      
      // 检测用户输入语言
      const detectedLanguage = detectLanguage(input.text);
      console.log('Detected language:', detectedLanguage);
      
      // 根据模式生成不同的系统提示
      const getSystemPrompt = (mode: string, language: string) => {
        const languageInstruction = {
          'zh': '请使用中文回复',
          'en': 'Please respond in English',
          'ja': '日本語で返信してください',
          'ko': '한국어로 답변해 주세요',
          'es': 'Por favor responde en español',
          'fr': 'Veuillez répondre en français',
          'pt': 'Por favor responda em português',
          'de': 'Bitte antworten Sie auf Deutsch',
          'it': 'Per favore rispondi in italiano',
          'ru': 'Пожалуйста, отвечайте на русском языке'
        };
        
        const langInstruction = languageInstruction[language as keyof typeof languageInstruction] || languageInstruction.en;
        
        switch (mode) {
          case 'normal':
            return `你是一个表情翻译器，根据用户输入生成带有丰富表情的回复。${langInstruction}。自然地添加相关表情符号来增强文本的表达力。`;
          case 'savage':
            return `你是一个毒舌表情翻译器，将用户输入转换为带有讽刺、机智和态度的表情表达。${langInstruction}。使用尖锐、幽默的表情符号。`;
          case 'genz':
            return `你是一个GenZ俚语表情翻译器，将用户输入转换为Z世代流行的网络用语和潮流表情符号。${langInstruction}。使用现代、时尚的表达方式。`;
          case 'tiktok':
            return `你是一个TikTok风格表情翻译器，将用户输入转换为类似TikTok视频中常见的表情表达。${langInstruction}。使用流行的Unicode emoji表情符号，如😱、💯、🔥、✨、🎉、🥳、🍻、😵‍💫、🤯、💀、👏、💖、🤐、😶、💭、💃、🕺、🎊等。模仿TikTok创作者的表达风格，使用夸张、有趣、富有感染力的表情组合，让文本充满活力和时尚感。`;
          default:
            return `你是一个表情翻译器，根据用户输入和风格生成带有丰富表情的回复。${langInstruction}。`;
        }
      };
      
      // 执行翻译
      const result = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: getSystemPrompt(input.mode, detectedLanguage) },
          { role: 'user', content: input.text }
        ]
      });
      // 扣减额度 - 暂时跳过
      // if (isPremium) {
      //   await prisma.user.update({ where: { id: userId }, data: { translationUsesToday: { increment: 1 } } });
      // } else {
      //   await prisma.user.update({ where: { id: userId }, data: { translationUsesToday: { increment: 1 } } });
      // }
      return { result: result.choices[0]?.message?.content ?? '' };
    }),
}); 