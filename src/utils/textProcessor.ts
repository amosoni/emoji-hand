import * as React from 'react';
import TikTokEmojiImage from '@/components/TikTokEmojiImage';

// TikTok短代码映射
const SHORTCODE_MAP: Record<string, string> = {
  '[smile]': '[smile]',
  '[happy]': '[happy]',
  '[loveface]': '[loveface]',
  '[wronged]': '[wronged]',
  '[cry]': '[cry]',
  '[laugh]': '[laugh]',
  '[cool]': '[cool]',
  '[angry]': '[angry]',
  '[surprised]': '[surprised]',
  '[laughwithtears]': '[laughwithtears]',
  '[lovely]': '[lovely]',
  '[excited]': '[excited]',
  '[cute]': '[cute]',
  '[blink]': '[blink]',
  '[disdain]': '[disdain]',
  '[shock]': '[shock]',
  '[rage]': '[rage]',
  '[proud]': '[proud]',
  '[smileface]': '[smileface]',
  '[evil]': '[evil]',
  '[angel]': '[angel]',
  '[pride]': '[pride]',
  '[nap]': '[nap]',
  '[awkward]': '[awkward]',
  '[greedy]': '[greedy]',
  '[wow]': '[wow]',
  '[joyful]': '[joyful]',
  '[hehe]': '[hehe]',
  '[slap]': '[slap]',
  '[tears]': '[tears]',
  '[stun]': '[stun]',
  '[astonish]': '[astonish]',
  '[complacent]': '[complacent]',
  '[drool]': '[drool]',
  '[scream]': '[scream]',
  '[weep]': '[weep]',
  '[speechless]': '[speechless]',
  '[funnyface]': '[funnyface]',
  '[wicked]': '[wicked]',
  '[facewithrollingeyes]': '[facewithrollingeyes]',
  '[sulk]': '[sulk]',
  '[thinking]': '[thinking]',
  '[shout]': '[shout]',
  '[flushed]': '[flushed]',
  '[yummy]': '[yummy]',
};

/**
 * 处理文本中的TikTok短代码，将其替换为TikTokEmojiImage组件
 * @param text 包含短代码的文本
 * @param size 表情图片大小
 * @returns React节点数组
 */
export function processTikTokShortcodes(text: string, size = 20): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const currentText = text;
  
  // 检查是否包含短代码
  const hasShortcode = Object.keys(SHORTCODE_MAP).some(shortcode => 
    currentText.includes(shortcode)
  );
  
  if (!hasShortcode) {
    return [text];
  }
  
  // 遍历所有短代码
  for (const [shortcode, emojiShortcode] of Object.entries(SHORTCODE_MAP)) {
    if (currentText.includes(shortcode)) {
      const parts = currentText.split(shortcode);
      const newParts: React.ReactNode[] = [];
      
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) {
          newParts.push(parts[i]);
        }
        if (i < parts.length - 1) {
          newParts.push(
            React.createElement(TikTokEmojiImage, {
              key: `${emojiShortcode}-${i}`,
              shortcode: emojiShortcode,
              size: size
            })
          );
        }
      }
      
      result.push(...newParts);
      return result;
    }
  }
  
  return [text];
}

/**
 * 检查文本是否包含TikTok短代码
 * @param text 要检查的文本
 * @returns 是否包含短代码
 */
export function hasTikTokShortcodes(text: string): boolean {
  return Object.keys(SHORTCODE_MAP).some(shortcode => 
    text.includes(shortcode)
  );
} 