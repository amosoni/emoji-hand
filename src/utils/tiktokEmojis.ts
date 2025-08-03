// 抖音官方隐藏表情短代码映射 - 基于alltiktokemojis.com的46个官方表情
// 注意：这些是抖音平台特有的自定义表情符号，不是Unicode emoji
export const DOUYIN_SHORTCODES = {
  // 基础表情 - 使用自定义表情符号
  '[smile]': '●',           // 粉色圆形笑脸
  '[happy]': '●',           // 桃色脸，眯眼大笑
  '[angry]': '●',           // 红色愤怒脸
  '[cry]': '●',             // 蓝色哭泣脸
  '[embarrassed]': '●',     // 害羞脸红脸
  '[surprised]': '●',       // 惊讶脸
  '[wronged]': '●',         // 委屈脸
  '[shout]': '●',           // 喊叫脸
  '[flushed]': '●',         // 脸红脸
  '[yummy]': '●',           // 舔嘴唇脸
  '[complacent]': '●',      // 自满脸
  '[drool]': '●',           // 流口水脸
  '[scream]': '●',          // 尖叫脸
  '[weep]': '●',            // 哭泣脸
  '[speechless]': '●',      // 无语脸
  '[funnyface]': '●',       // 搞笑脸
  '[laughwithtears]': '●',  // 笑出眼泪脸
  '[wicked]': '●',          // 邪恶脸
  '[facewithrollingeyes]': '●', // 翻白眼脸
  '[sulk]': '●',            // 生闷气脸
  '[thinking]': '●',        // 思考脸
  
  // 高级表情
  '[lovely]': '●',          // 可爱脸
  '[greedy]': '●',          // 贪婪脸
  '[wow]': '●',             // 哇脸
  '[joyful]': '●',          // 开心脸
  '[hehe]': '●',            // 嘿嘿脸
  '[slap]': '●',            // 拍手脸
  '[tears]': '●',           // 眼泪
  '[stun]': '●',            // 眩晕脸
  '[cute]': '●',            // 可爱脸
  '[blink]': '●',           // 眨眼脸
  '[disdain]': '●',         // 不屑脸
  '[astonish]': '●',        // 震惊脸
  '[rage]': '●',            // 愤怒脸
  '[cool]': '●',            // 酷脸
  '[excited]': '●',         // 兴奋脸
  '[proud]': '●',           // 骄傲脸
  '[smileface]': '●',       // 笑脸
  '[evil]': '●',            // 恶魔脸
  '[angel]': '●',           // 天使脸
  '[laugh]': '●',           // 大笑脸
  '[pride]': '●',           // 自豪脸
  '[nap]': '●',             // 睡觉脸
  '[loveface]': '●',        // 爱心脸
  '[awkward]': '●',         // 尴尬脸
  '[shock]': '●'            // 震惊脸
};

// 抖音特有的表情组合 - 使用自定义表情符号
export const DOUYIN_COMBINATIONS = {
  '[smile][happy][smile]': {
    en: 'I am observing and somewhat engrossed in this content',
    ja: '私は観察していて、このコンテンツに少し没頭しています',
    ko: '나는 관찰하고 있고 이 콘텐츠에 약간 몰입하고 있습니다'
  },
  '[cute][surprised][cute]': {
    en: 'Shy or bashful',
    ja: '内気または恥ずかしがり',
    ko: '수줍거나 부끄러워함'
  },
  '[scream][cool][rage][excited]': {
    en: 'OMG this is amazing!',
    ja: 'OMG これは素晴らしい！',
    ko: 'OMG 이것은 놀라워요!'
  },
  '[stun][shock][wicked][stun]': {
    en: 'I can\'t even...',
    ja: '私にはできません...',
    ko: '나는 할 수 없어요...'
  },
  '[lovely][proud][lovely][excited]': {
    en: 'This is everything!',
    ja: 'これがすべてです！',
    ko: '이것이 모든 것입니다!'
  },
  '[speechless][thinking][speechless]': {
    en: 'No words needed',
    ja: '言葉は不要',
    ko: '말이 필요 없어요'
  },
  '[excited][proud][excited]': {
    en: 'Living for this!',
    ja: 'これのために生きています！',
    ko: '이것을 위해 살고 있어요!'
  },
  '[proud][cool][proud]': {
    en: 'This is the content I signed up for',
    ja: 'これが私が登録したコンテンツです',
    ko: '이것이 내가 가입한 콘텐츠입니다'
  }
};

// 抖音表情的特殊含义 - 基于alltiktokemojis.com官方数据
export const DOUYIN_MEANINGS = {
  '●': {
    meaning: 'TikTok Custom Emoji - A platform-specific custom emoji',
    meaning_ja: 'TikTok カスタム絵文字 - プラットフォーム固有のカスタム絵文字',
    meaning_ko: 'TikTok 커스텀 이모지 - 플랫폼 특화 커스텀 이모지',
    meaning_it: 'Emoji personalizzato TikTok - Emoji personalizzato specifico della piattaforma',
    meaning_es: 'Emoji personalizado de TikTok - Emoji personalizado específico de la plataforma',
    meaning_fr: 'Emoji personnalisé TikTok - Emoji personnalisé spécifique à la plateforme',
    meaning_de: 'TikTok benutzerdefiniertes Emoji - Plattformspezifisches benutzerdefiniertes Emoji',
    meaning_pt: 'Emoji personalizado do TikTok - Emoji personalizado específico da plataforma',
    meaning_ru: 'Пользовательский эмодзи TikTok - Платформо-специфичный пользовательский эмодзи',
    usage: 'Used to express emotions in TikTok style',
    usage_ja: 'TikTokスタイルで感情を表現するために使用',
    usage_ko: 'TikTok 스타일로 감정을 표현하는 데 사용',
    usage_it: 'Usato per esprimere emozioni in stile TikTok',
    usage_es: 'Usado para expresar emociones en estilo TikTok',
    usage_fr: 'Utilisé pour exprimer des émotions dans le style TikTok',
    usage_de: 'Verwendet, um Emotionen im TikTok-Stil auszudrücken',
    usage_pt: 'Usado para expressar emoções no estilo TikTok',
    usage_ru: 'Используется для выражения эмоций в стиле TikTok',
    example: 'This is amazing ●',
    example_ja: 'これは素晴らしい ●',
    example_ko: '이것은 놀라워요 ●',
    example_it: 'Questo è incredibile ●',
    example_es: 'Esto es increíble ●',
    example_fr: 'C\'est incroyable ●',
    example_de: 'Das ist unglaublich ●',
    example_pt: 'Isso é incrível ●',
    example_ru: 'Это потрясающе ●'
  }
};

// 抖音热门表情列表 - 基于alltiktokemojis.com官方数据
export const DOUYIN_POPULAR_EMOJIS = [
  '[smile]', '[cool]', '[wicked]', '[proud]', '[flushed]', '[cry]',  // 最受欢迎的6个表情
  '[lovely]', '[greedy]', '[wow]', '[joyful]', '[hehe]', '[slap]', '[tears]', '[stun]', '[cute]', '[blink]',
  '[disdain]', '[scream]', '[rage]', '[excited]', '[angel]', '[laugh]', '[pride]', '[nap]', '[facewithrollingeyes]', '[thinking]'
];

// 抖音表情分类 - 使用抖音表情短代码
export const DOUYIN_CATEGORIES = {
  reactions: ['[scream]', '[surprised]', '[stun]', '[shock]', '[rage]', '[disdain]'],      // 反应表情
  emotions: ['[lovely]', '[greedy]', '[wow]', '[joyful]', '[hehe]', '[cry]'],      // 情感表情
  actions: ['[slap]', '[blink]', '[proud]', '[cool]', '[nap]'],             // 动作表情
  emphasis: ['[excited]', '[smile]', '[evil]', '[angel]'],                  // 强调表情
  special: ['[greedy]', '[tears]', '[hehe]', '[happy]', '[cry]']              // 特殊表情
};

// 解析抖音短代码
export function parseDouyinShortcodes(text: string): string {
  // 对于TikTok模式，保持短代码形式，不转换为符号
  // 这样可以保持抖音表情的原始形式，更符合TikTok平台的表达方式
  return text;
}

// 生成抖音风格的表情组合
export function generateDouyinStyle(text: string): string {
  const words = text.toLowerCase().split(' ');
  let result = text;
  
  // 根据关键词添加表情 - 只使用抖音自定义表情符号
  if (words.some(word => ['amazing', 'wow', 'incredible'].includes(word))) {
    result += ' [scream][wow][excited]';
  } else if (words.some(word => ['cant', 'even', 'understand'].includes(word))) {
    result += ' [stun][shock][speechless]';
  } else if (words.some(word => ['perfect', 'everything', 'love'].includes(word))) {
    result += ' [lovely][proud][excited]';
  } else if (words.some(word => ['speechless', 'words', 'needed'].includes(word))) {
    result += ' [speechless][thinking][speechless]';
  } else if (words.some(word => ['living', 'excited', 'love'].includes(word))) {
    result += ' [excited][proud][excited]';
  } else if (words.some(word => ['content', 'signed', 'up'].includes(word))) {
    result += ' [proud][cool][proud]';
  }
  
  return result;
}

// 获取抖音表情含义
export function getDouyinMeaning(emoji: string): string | null {
  return DOUYIN_MEANINGS[emoji as keyof typeof DOUYIN_MEANINGS]?.meaning ?? null;
}

// 获取抖音表情示例
export function getDouyinExample(emoji: string): string | null {
  return DOUYIN_MEANINGS[emoji as keyof typeof DOUYIN_MEANINGS]?.example ?? null;
}

// 检查是否为抖音热门表情
export function isDouyinPopular(emoji: string): boolean {
  return DOUYIN_POPULAR_EMOJIS.includes(emoji);
} 