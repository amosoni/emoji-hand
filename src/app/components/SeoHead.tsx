'use client';
import Head from "next/head";
import { useTranslation } from "react-i18next";

export default function SeoHead() {
  const { t } = useTranslation();

  return (
    <Head>
      <title>{t('appTitle', 'emoji hand')} - {t('appSlogan', 'The Ultimate Emoji Translator')}</title>
      <meta name="description" content={t('appDesc', 'Powered by AI, Emoji Hand helps you communicate with more emotion, creativity, and style. Try it now and make your words stand out!')} />
      <meta name="keywords" content="emoji, emoji翻译, AI, 表情包, 多语言, emojihand" />
      <meta property="og:title" content={t('appTitle', 'emoji hand')} />
      <meta property="og:description" content={t('appDesc', 'Powered by AI, Emoji Hand helps you communicate with more emotion, creativity, and style. Try it now and make your words stand out!')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://emojihand.com" />
      <meta property="og:image" content="https://emojihand.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
} 