import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import AppProviders from "../components/AppProviders";

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale;
  
  // 根据语言设置不同的标题和描述
  const titles = {
    en: 'Emoji Hand - AI-Powered Emoji Translator & Generator',
    zh: 'Emoji Hand - AI驱动的表情符号翻译器和生成器',
    ko: 'Emoji Hand - AI 기반 이모지 번역기 및 생성기',
    ja: 'Emoji Hand - AI駆動の絵文字翻訳・生成ツール',
  };
  
  const descriptions = {
    en: 'Emoji Hand is the ultimate AI-powered emoji translator and generator. Transform any text into expressive emoji messages instantly. Free emoji translation, TikTok emojis, emoji packs, and more!',
    zh: 'Emoji Hand是终极的AI驱动表情符号翻译器和生成器。立即将任何文本转换为富有表现力的表情符号消息。免费表情符号翻译、TikTok表情符号、表情符号包等！',
    ko: 'Emoji Hand는 궁극적인 AI 기반 이모지 번역기 및 생성기입니다. 모든 텍스트를 즉시 표현력 있는 이모지 메시지로 변환하세요. 무료 이모지 번역, TikTok 이모지, 이모지 팩 등!',
    ja: 'Emoji Hand는 究極のAI駆動絵文字翻訳・生成ツールです。あらゆるテキストを即座に表現力豊かな絵文字メッセージに変換します。無料絵文字翻訳、TikTok絵文字、絵文字パックなど！',
  };

  return {
    title: {
      default: titles[locale as keyof typeof titles] || titles.en,
      template: `%s | Emoji Hand`
    },
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: 'emoji hand, emoji translator, AI emoji, emoji generator, TikTok emojis, emoji packs, emoji翻译, AI表情包, 多语言emoji, emojihand',
    authors: [{ name: 'Emoji Hand Team' }],
    creator: 'Emoji Hand',
    publisher: 'Emoji Hand',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://emojihand.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'zh': '/zh',
        'ko': '/ko',
        'ja': '/ja',
      },
    },
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: `https://emojihand.com/${locale}`,
      siteName: 'Emoji Hand',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: titles[locale as keyof typeof titles] || titles.en,
        },
      ],
      locale: locale === 'en' ? 'en_US' : locale === 'zh' ? 'zh_CN' : locale === 'ko' ? 'ko_KR' : 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      images: ['/og-image.svg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        { url: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' },
        { url: '/logo.svg', sizes: '64x64', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    manifest: '/site.webmanifest',
    verification: {
      google: 'your-google-verification-code',
    },
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = params.locale;
  
  console.log('=== LOCALE LAYOUT DEBUG ===');
  console.log('params.locale =', params.locale);
  console.log('final locale =', locale);
  console.log('==========================');
  
  return (
    <AppProviders locale={locale}>
      {children}
    </AppProviders>
  );
} 