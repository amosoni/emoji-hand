"use client";
import { useTranslation } from 'react-i18next';
import EmojiPackSubscription from '~/components/EmojiPackSubscription';
import UnifiedNavBar from '~/app/components/UnifiedNavBar';
import Footer from '~/app/components/Footer';

import Head from 'next/head';

export default function EmojiPackSubscriptionPage() {
  const { t } = useTranslation();

  // SEO结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Emoji Pack Subscription - EmojiHand",
    "description": "Choose your emoji pack subscription plan and enjoy professional AI emoji generation services.",
    "url": "https://emojihand.com/emoji-pack-subscription",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "EmojiHand"
    }
  };

  return (
    <>
      <Head>
        <title>{t('subscription.seo.title', 'Emoji Pack Subscription - EmojiHand')}</title>
        <meta name="description" content={t('subscription.seo.description', 'Choose your emoji pack subscription plan and enjoy professional AI emoji generation services.')} />
        <meta name="keywords" content={t('subscription.seo.keywords', 'emoji subscription, AI emoji, emoji generation, subscription plans')} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t('subscription.seo.ogTitle', 'Emoji Pack Subscription - EmojiHand')} />
        <meta property="og:description" content={t('subscription.seo.ogDescription', 'Choose your emoji pack subscription plan and enjoy professional AI emoji generation services.')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://emojihand.com/emoji-pack-subscription" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500">
        <UnifiedNavBar />
        
        {/* 页面内容 */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                {t('subscription.title', 'Emoji Pack Subscription System')}
              </h1>
              <p className="text-lg text-white/90">
                {t('subscription.subtitle', 'Choose your suitable subscription package and enjoy professional AI emoji pack generation service')}
              </p>
            </div>
            
            <EmojiPackSubscription />
          </div>
        </main>
        
        {/* 页脚 */}
        <Footer />
      </div>
    </>
  );
} 