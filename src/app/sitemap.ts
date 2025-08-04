import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.emojihand.com'
  const locales = ['en', 'zh', 'zh-CN', 'de', 'it', 'fr', 'es', 'pt', 'ru', 'ja', 'ko'];
  
  const pages = [
    '',
    '/tiktok',
    '/tiktok-emojis',
    '/realtime',
    '/profile',
    '/genz',
    '/emoji-generator',
    '/lovart-style',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 为每个语言和页面生成sitemap条目
  locales.forEach(locale => {
    pages.forEach(page => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
} 