// TikTok表情图片映射 - 基于真实的TikTok隐藏表情
export const TIKTOK_EMOJI_IMAGES = {
  // 基础表情
  '[smile]': '/images/tiktok-emojis/smile.png',
  '[happy]': '/images/tiktok-emojis/happy.png',
  '[angry]': '/images/tiktok-emojis/angry.png',
  '[cry]': '/images/tiktok-emojis/cry.png',
  '[embarrassed]': '/images/tiktok-emojis/embarrassed.png',
  '[surprised]': '/images/tiktok-emojis/surprised.png',
  '[wronged]': '/images/tiktok-emojis/wronged.png',
  '[shout]': '/images/tiktok-emojis/shout.png',
  '[flushed]': '/images/tiktok-emojis/flushed.png',
  '[yummy]': '/images/tiktok-emojis/yummy.png',
  '[complacent]': '/images/tiktok-emojis/complacent.png',
  '[drool]': '/images/tiktok-emojis/drool.png',
  '[scream]': '/images/tiktok-emojis/scream.png',
  '[weep]': '/images/tiktok-emojis/weep.png',
  '[speechless]': '/images/tiktok-emojis/speechless.png',
  '[funnyface]': '/images/tiktok-emojis/funnyface.png',
  '[laughwithtears]': '/images/tiktok-emojis/laughwithtears.png',
  '[wicked]': '/images/tiktok-emojis/wicked.png',
  '[facewithrollingeyes]': '/images/tiktok-emojis/facewithrollingeyes.png',
  '[sulk]': '/images/tiktok-emojis/sulk.png',
  '[thinking]': '/images/tiktok-emojis/thinking.png',
  '[shock]': '/images/tiktok-emojis/shock.png',
  
  // 高级表情
  '[lovely]': '/images/tiktok-emojis/lovely.png',
  '[greedy]': '/images/tiktok-emojis/greedy.png',
  '[wow]': '/images/tiktok-emojis/wow.png',
  '[joyful]': '/images/tiktok-emojis/joyful.png',
  '[hehe]': '/images/tiktok-emojis/hehe.png',
  '[slap]': '/images/tiktok-emojis/slap.png',
  '[tears]': '/images/tiktok-emojis/tears.png',
  '[stun]': '/images/tiktok-emojis/stun.png',
  '[cute]': '/images/tiktok-emojis/cute.png',
  '[blink]': '/images/tiktok-emojis/blink.png',
  '[disdain]': '/images/tiktok-emojis/disdain.png',
  '[astonish]': '/images/tiktok-emojis/astonish.png',
  '[rage]': '/images/tiktok-emojis/rage.png',
  '[cool]': '/images/tiktok-emojis/cool.png',
  '[excited]': '/images/tiktok-emojis/excited.png',
  '[proud]': '/images/tiktok-emojis/proud.png',
  '[smileface]': '/images/tiktok-emojis/smileface.png',
  '[evil]': '/images/tiktok-emojis/evil.png',
  '[angel]': '/images/tiktok-emojis/angel.png',
  '[laugh]': '/images/tiktok-emojis/laugh.png',
  '[pride]': '/images/tiktok-emojis/pride.png',
  '[nap]': '/images/tiktok-emojis/nap.png',
  '[loveface]': '/images/tiktok-emojis/loveface.png',
  '[awkward]': '/images/tiktok-emojis/awkward.png'
};

// TikTok表情图片组件
export interface TikTokEmojiImageProps {
  shortcode: string;
  size?: number;
  className?: string;
  alt?: string;
}

// 获取TikTok表情图片URL
export function getTikTokEmojiImage(shortcode: string): string | null {
  return TIKTOK_EMOJI_IMAGES[shortcode as keyof typeof TIKTOK_EMOJI_IMAGES] ?? null;
}

// 检查是否为TikTok表情短代码
export function isTikTokEmojiShortcode(text: string): boolean {
  return text in TIKTOK_EMOJI_IMAGES;
}

// 解析文本中的TikTok表情短代码并替换为图片
export function parseTikTokEmojiImages(text: string): string {
  let result = text;
  
  // 替换短代码为图片标签
  Object.entries(TIKTOK_EMOJI_IMAGES).forEach(([shortcode, imagePath]) => {
    const regex = new RegExp(shortcode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, `<img src="${imagePath}" alt="${shortcode}" class="tiktok-emoji" style="width: 20px; height: 20px; vertical-align: middle;" />`);
  });
  
  return result;
}

// 获取所有可用的TikTok表情短代码
export function getAllTikTokEmojiShortcodes(): string[] {
  return Object.keys(TIKTOK_EMOJI_IMAGES);
}

// TikTok表情分类
export const TIKTOK_EMOJI_CATEGORIES = {
  basic: [
    '[smile]', '[happy]', '[angry]', '[cry]', '[embarrassed]', '[surprised]',
    '[wronged]', '[shout]', '[flushed]', '[yummy]', '[complacent]', '[drool]',
    '[scream]', '[weep]', '[speechless]', '[funnyface]', '[laughwithtears]', '[wicked]',
    '[facewithrollingeyes]', '[sulk]', '[thinking]', '[shock]'
  ],
  advanced: [
    '[lovely]', '[greedy]', '[wow]', '[joyful]', '[hehe]', '[slap]',
    '[tears]', '[stun]', '[cute]', '[blink]', '[disdain]', '[astonish]',
    '[rage]', '[cool]', '[excited]', '[proud]', '[smileface]', '[evil]',
    '[angel]', '[laugh]', '[pride]', '[nap]', '[loveface]', '[awkward]'
  ]
};

// 热门TikTok表情
export const POPULAR_TIKTOK_EMOJIS = [
  '[smile]', '[cool]', '[wicked]', '[proud]', '[flushed]', '[cry]'
]; 