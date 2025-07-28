'use client';

import { useState, useEffect } from 'react';
import { getTikTokEmojiImage, isTikTokEmojiShortcode } from '@/utils/tiktokEmojiImages';
import { DOUYIN_SHORTCODES } from '@/utils/tiktokEmojis';

interface TikTokEmojiImageProps {
  shortcode: string;
  size?: number;
  className?: string;
  alt?: string;
  fallbackToUnicode?: boolean;
}

export default function TikTokEmojiImage({ 
  shortcode, 
  size = 24, 
  className = '', 
  alt,
  fallbackToUnicode = false  // 禁用Unicode回退，优先显示图片
}: TikTokEmojiImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imagePath = getTikTokEmojiImage(shortcode);
  const isTikTokEmoji = isTikTokEmojiShortcode(shortcode);
  
  // 从DOUYIN_SHORTCODES获取Unicode表情符号作为回退
  const unicodeEmoji = DOUYIN_SHORTCODES[shortcode as keyof typeof DOUYIN_SHORTCODES];
  
  // 调试信息
  console.log('TikTokEmojiImage:', { shortcode, imagePath, isTikTokEmoji, unicodeEmoji });
  
  useEffect(() => {
    if (imagePath) {
      // 尝试预加载图片
      const img = new Image();
      img.onload = () => {
        console.log(`Image preloaded successfully: ${imagePath}`);
        setImageSrc(imagePath);
        setImageLoaded(true);
        setImageError(false);
      };
      img.onerror = () => {
        console.error(`Image preload failed: ${imagePath}`);
        setImageError(true);
        setImageLoaded(false);
      };
      img.src = imagePath;
    }
  }, [imagePath]);
  
  // 优先显示图片表情
  if (imagePath && imageSrc && !imageError) {
    return (
      <span className="relative inline-block">
        <img
          src={imageSrc}
          alt={alt ?? shortcode}
          className={`inline-block ${className}`}
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            verticalAlign: 'middle'
          }}
        />
      </span>
    );
  }
  
  // 如果图片加载失败或没有图片路径，显示Unicode表情
  return (
    <span 
      className={`inline-block ${className}`}
      style={{ fontSize: `${size}px` }}
      title={alt ?? shortcode}
    >
      {unicodeEmoji || shortcode}
    </span>
  );
} 