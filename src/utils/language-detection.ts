// 语言检测工具函数

export interface LanguageInfo {
  code: string;
  name: string;
  confidence: number;
}

/**
 * 检测文本语言
 * @param text 要检测的文本
 * @returns 语言信息
 */
export function detectLanguage(text: string): LanguageInfo {
  // 语言特征正则表达式
  const languagePatterns = {
    zh: {
      pattern: /[\u4e00-\u9fff]/g,
      name: '中文',
      weight: 1.0
    },
    ja: {
      pattern: /[\u3040-\u309f\u30a0-\u30ff]/g,
      name: '日本語',
      weight: 1.0
    },
    ko: {
      pattern: /[\uac00-\ud7af]/g,
      name: '한국어',
      weight: 1.0
    },
    ru: {
      pattern: /[\u0400-\u04ff]/g,
      name: 'Русский',
      weight: 1.0
    },
    ar: {
      pattern: /[\u0600-\u06ff]/g,
      name: 'العربية',
      weight: 1.0
    },
    th: {
      pattern: /[\u0e00-\u0e7f]/g,
      name: 'ไทย',
      weight: 1.0
    },
    hi: {
      pattern: /[\u0900-\u097f]/g,
      name: 'हिन्दी',
      weight: 1.0
    }
  };

  // 计算每种语言的匹配度
  const scores: Record<string, number> = {};
  const totalChars = text.length;

  for (const [code, lang] of Object.entries(languagePatterns)) {
    const matches = text.match(lang.pattern);
    const matchCount = matches ? matches.length : 0;
    const score = (matchCount / totalChars) * lang.weight;
    scores[code] = score;
  }

  // 如果没有检测到特定语言，默认为英文
  if (Object.values(scores).every(score => score === 0)) {
    return {
      code: 'en',
      name: 'English',
      confidence: 0.8
    };
  }

  // 找到得分最高的语言
  const bestLanguage = Object.entries(scores).reduce((best, [code, score]) => {
    return score > best.score ? { code, score } : best;
  }, { code: 'en', score: 0 });

  const languageNames: Record<string, string> = {
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    ru: 'Русский',
    ar: 'العربية',
    th: 'ไทย',
    hi: 'हिन्दी',
    en: 'English'
  };

  return {
    code: bestLanguage.code,
    name: languageNames[bestLanguage.code] || 'English',
    confidence: Math.min(bestLanguage.score * 2, 1.0) // 将分数转换为0-1的置信度
  };
}

/**
 * 获取语言特定的提示词
 * @param language 语言代码
 * @param promptType 提示词类型
 * @returns 语言特定的提示词
 */
export function getLanguageSpecificPrompt(language: string, promptType: string): string {
  const prompts: Record<string, Record<string, string>> = {
    emoji: {
      zh: '请使用中文回复，保持自然流畅的表达',
      en: 'Please respond in English, maintain natural and fluent expression',
      ja: '日本語で返信してください。自然で流暢な表現を保ってください',
      ko: '한국어로 답변해 주세요. 자연스럽고 유창한 표현을 유지하세요',
      es: 'Por favor responde en español, mantén una expresión natural y fluida',
      fr: 'Veuillez répondre en français, maintenez une expression naturelle et fluide',
      pt: 'Por favor responda em português, mantenha uma expressão natural e fluida',
      de: 'Bitte antworten Sie auf Deutsch, behalten Sie einen natürlichen und flüssigen Ausdruck bei',
      it: 'Per favore rispondi in italiano, mantieni un\'espressione naturale e fluida',
      ru: 'Пожалуйста, отвечайте на русском языке, сохраняйте естественное и плавное выражение'
    },
    design: {
      zh: '请使用中文进行设计分析和建议',
      en: 'Please provide design analysis and suggestions in English',
      ja: '日本語でデザイン分析と提案を行ってください',
      ko: '한국어로 디자인 분석과 제안을 제공해 주세요',
      es: 'Por favor proporcione análisis de diseño y sugerencias en español',
      fr: 'Veuillez fournir une analyse de conception et des suggestions en français',
      pt: 'Por favor forneça análise de design e sugestões em português',
      de: 'Bitte geben Sie Designanalyse und Vorschläge auf Deutsch',
      it: 'Per favore fornisci analisi di design e suggerimenti in italiano',
      ru: 'Пожалуйста, предоставьте анализ дизайна и предложения на русском языке'
    }
  };

  return prompts[promptType]?.[language] || prompts[promptType]?.en || 'Please respond in English';
}

/**
 * 获取支持的语言列表
 */
export function getSupportedLanguages() {
  return [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];
} 