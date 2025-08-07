"use client";
import { useTranslation } from 'react-i18next';
import EmojiGenerator from '../../../components/EmojiGenerator';
import Footer from '../../components/Footer';

import Head from 'next/head';
import UnifiedNavBar from '../../components/UnifiedNavBar';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLoginModal } from '../../../components/LoginModalContext';

export default function EmojiGeneratorPage({ params }: { params: { locale: string } }) {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const { show } = useLoginModal();
  
  // 页面语言切换 - 移除强制切换，让AppProviders处理
  useEffect(() => {
    console.log('EmojiGeneratorPage: locale =', params.locale, 'Current i18n language =', i18n.language);
  }, [params.locale, i18n]);

  // SEO结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Emoji Pack Generator - Lovart AI Style",
    "description": "Create beautiful emoji packs with AI, inspired by Lovart AI design principles. Upload images and generate multiple emoji pack variations with different styles.",
    "url": "https://emojihand.com/emoji-generator",
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
    },
    "keywords": "lovart, emoji generator, AI emoji, emoji pack, AI design, lovart ai, emoji creation, AI art, emoji maker"
  };

  return (
    <>
      <Head>
        <title>{t('emojiGenerator.seo.title', 'Emoji Pack Generator - Lovart AI Style')} | EmojiHand</title>
        <meta name="description" content={t('emojiGenerator.seo.description', 'Create beautiful emoji packs with AI, inspired by Lovart AI design principles. Upload images and generate multiple emoji pack variations with different styles including cute, savage, GenZ, and TikTok styles.')} />
        <meta name="keywords" content={t('emojiGenerator.seo.keywords', 'lovart, emoji generator, AI emoji, emoji pack, AI design, lovart ai, emoji creation, AI art, emoji maker, emoji pack generator')} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t('emojiGenerator.seo.ogTitle', 'Emoji Pack Generator - Lovart AI Style')} />
        <meta property="og:description" content={t('emojiGenerator.seo.ogDescription', 'Create beautiful emoji packs with AI, inspired by Lovart AI design principles. Upload images and generate multiple emoji pack variations.')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://emojihand.com/emoji-generator" />
        <meta property="og:image" content="https://emojihand.com/images/emoji-generator-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('emojiGenerator.seo.twitterTitle', 'Emoji Pack Generator - Lovart AI Style')} />
        <meta name="twitter:description" content={t('emojiGenerator.seo.twitterDescription', 'Create beautiful emoji packs with AI, inspired by Lovart AI design principles.')} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600">
        <UnifiedNavBar />

        {/* 页面内容 */}
        <div className="container mx-auto py-8 px-4">
          <EmojiGenerator session={session} showLoginModal={show} locale={params.locale} />
          
          {/* 丰富的内容区域 */}
          <div className="mt-16 space-y-12">
            {/* Lovart AI 介绍部分 */}
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">🎨</span>
                {t('emojiGenerator.lovartInspired', 'Inspired by Lovart AI')}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">{t('emojiGenerator.lovartWhatIs', 'What is Lovart AI?')}</h3>
                  <p className="text-white/90 leading-relaxed mb-4">
                    {t('emojiGenerator.lovartDescription', 'Lovart AI is a revolutionary AI design agent that automates the entire design journey, from concept to images, videos, 3D, and more. Our emoji pack generator is inspired by Lovart\'s innovative approach to AI-powered creative tools.')}
                  </p>
                  <p className="text-white/90 leading-relaxed">
                    {t('emojiGenerator.lovartDescription2', 'Just like Lovart AI, our emoji generator allows you to upload an image and let AI create multiple variations with different styles, making the creative process effortless and enjoyable.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">{t('emojiGenerator.lovartFeatures', 'Key Features')}</h3>
                  <ul className="space-y-3 text-white/90">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {t('emojiGenerator.aiGeneration', 'AI-powered emoji generation')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {t('emojiGenerator.styleVariations', 'Multiple style variations')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {t('emojiGenerator.batchProcessing', 'Batch processing capabilities')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {t('emojiGenerator.lovartPrinciples', 'Lovart AI-inspired design principles')}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 使用指南 */}
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">📖</span>
                {t('emojiGenerator.howToUse', 'How to Use Our Lovart-Style Emoji Generator')}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📸</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.step1', '1. Upload Image')}</h3>
                  <p className="text-white/80 text-sm">
                    {t('emojiGenerator.uploadStep', 'Upload any image you want to transform into emoji packs. Our AI will analyze the content and create variations.')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.step2', '2. Choose Style')}</h3>
                  <p className="text-white/80 text-sm">
                    {t('emojiGenerator.styleStep', 'Select from 6 different styles: Cute, Funny, Cool, Savage, GenZ, or TikTok. Each style creates unique variations.')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.step3', '3. Generate & Download')}</h3>
                  <p className="text-white/80 text-sm">
                    {t('emojiGenerator.generateStep', 'AI generates multiple emoji pack variations. Download individual packs or use them in your projects.')}
                  </p>
                </div>
              </div>
            </section>

            {/* 风格介绍 */}
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">🎭</span>
                {t('emojiGenerator.stylesTitle', 'Emoji Pack Styles (Lovart AI Inspired)')}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-3xl mb-3">🥰</div>
                  <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">{t('emojiGenerator.styles.cute', 'Cute Style')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
                    {t('emojiGenerator.styleDescriptions.cute', 'Pink color palette with rounded lines, perfect for adorable and kawaii expressions.')}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-3xl mb-3">😂</div>
                  <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">{t('emojiGenerator.styles.funny', 'Funny Style')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
                    {t('emojiGenerator.styleDescriptions.funny', 'Exaggerated expressions with humorous elements, great for memes and comedy.')}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-3xl mb-3">😎</div>
                  <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">{t('emojiGenerator.styles.cool', 'Cool Style')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
                    {t('emojiGenerator.styleDescriptions.cool', 'Dark color scheme with fashionable elements, perfect for trendy and stylish expressions.')}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-3xl mb-3">😏</div>
                  <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">{t('emojiGenerator.styles.savage', 'Savage Style')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
                    {t('emojiGenerator.styleDescriptions.savage', 'Sharp expressions with sarcastic elements, ideal for witty and bold statements.')}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-3xl mb-3">💅</div>
                  <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">{t('emojiGenerator.styles.genz', 'GenZ Style')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
                    {t('emojiGenerator.styleDescriptions.genz', 'Trendy elements with youthful expressions, perfect for modern social media.')}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-3xl mb-3">🎵</div>
                  <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">{t('emojiGenerator.styles.tiktok', 'TikTok Style')}</h3>
                  <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
                    {t('emojiGenerator.styleDescriptions.tiktok', 'Popular elements with short video aesthetics, great for viral content.')}
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ部分 */}
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">❓</span>
                {t('emojiGenerator.faq.title', 'Frequently Asked Questions')}
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.faq.lovartComparison', 'How does this compare to Lovart AI?')}</h3>
                  <p className="text-white/80">
                    {t('emojiGenerator.faq.lovartComparisonAnswer', 'While Lovart AI is a comprehensive design platform, our emoji generator focuses specifically on creating emoji packs. We\'re inspired by Lovart\'s AI-powered approach and apply similar principles to emoji creation.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.faq.imageFormats', 'What image formats are supported?')}</h3>
                  <p className="text-white/80">
                    {t('emojiGenerator.faq.imageFormatsAnswer', 'We support JPG, PNG, and GIF formats. For best results, use high-quality images with clear subjects.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.faq.generationCount', 'How many emoji packs can I generate?')}</h3>
                  <p className="text-white/80">
                    {t('emojiGenerator.faq.generationCountAnswer', 'Each generation creates 3-5 different emoji pack variations based on your selected style and uploaded image.')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.faq.commercialUse', 'Can I use these emoji packs commercially?')}</h3>
                  <p className="text-white/80">
                    {t('emojiGenerator.faq.commercialUseAnswer', 'Yes, all generated emoji packs are free to use for personal and commercial purposes. They\'re created using AI technology inspired by Lovart AI principles.')}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 页脚 */}
        <Footer />
      </div>
    </>
  );
} 