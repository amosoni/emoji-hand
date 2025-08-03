'use client';
import Head from "next/head";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export default function SeoHead() {
  // 安全地使用 useTranslation，如果 i18n 未初始化则使用默认值
  let t: (key: string, defaultValue?: string) => string;
  
  try {
    const translation = useTranslation();
    t = (key: string, defaultValue?: string) => translation.t(key, defaultValue ?? key);
  } catch (error) {
    // 如果 useTranslation 失败，使用默认的翻译函数
    t = (key: string, defaultValue?: string) => defaultValue ?? key;
  }

  return (
    <Head>
      <title>{t('appTitle', 'Emoji Hand')} - {t('appSlogan', 'AI-Powered Emoji Translator & Generator')}</title>
      <meta name="description" content={t('appDesc', 'Emoji Hand is the ultimate AI-powered emoji translator and generator. Transform any text into expressive emoji messages instantly. Free emoji translation, TikTok emojis, emoji packs, and more!')} />
      <meta name="keywords" content="emoji hand, emoji translator, AI emoji, emoji generator, TikTok emojis, emoji packs, emoji翻译, AI表情包, 多语言emoji, emojihand" />
      <meta property="og:title" content={t('appTitle', 'Emoji Hand')} />
      <meta property="og:description" content={t('appDesc', 'Emoji Hand is the ultimate AI-powered emoji translator and generator. Transform any text into expressive emoji messages instantly. Free emoji translation, TikTok emojis, emoji packs, and more!')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://emojihand.com" />
      <meta property="og:image" content="https://emojihand.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
} 