"use client";
import { useTranslation } from 'react-i18next';
import TikTokEmojisGuide from '../../../components/TikTokEmojisGuide';
import TikTokEmojiImage from '@/components/TikTokEmojiImage';
import Footer from '../../components/Footer';

import { processTikTokShortcodes } from '@/utils/textProcessor';
import UnifiedNavBar from '../../components/UnifiedNavBar';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TikTokEmojisPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const locale = params?.locale as string || 'zh';

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600">
      <UnifiedNavBar />

      {/* 页面内容 */}
      <div className="container mx-auto py-8 px-4">
        {/* 页面标题 */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">
            {t('pages.tiktokEmojis.title', 'TikTok Emojis - Complete Guide to Hidden Emojis & Meanings')}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {processTikTokShortcodes(t('pages.tiktokEmojis.subtitle', 'Discover all TikTok emojis including hidden shortcodes like [smile], [happy], [loveface]. Learn how to use TikTok emojis, their meanings, and get the complete list of official TikTok emoji codes.'), 20)}
          </p>
        </header>

        {/* 主要内容 */}
        <TikTokEmojisGuide />

        {/* FAQ Section */}
        <section className="mt-16 bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {t('pages.tiktokEmojis.faq.title', 'Frequently Asked Questions About TikTok Emojis')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('pages.tiktokEmojis.faq.q1.title', 'What are TikTok emojis?')}
              </h3>
              <p className="text-white/90 leading-relaxed">
                {processTikTokShortcodes(t('pages.tiktokEmojis.faq.q1.answer', 'TikTok emojis are a collection of custom emoji characters and hidden shortcodes that users can use in comments, captions, and messages on the TikTok platform. These include both standard Unicode emojis and TikTok-specific hidden emojis that can be accessed through shortcodes like [smile], [happy], and [loveface].'), 20)}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('pages.tiktokEmojis.faq.q2.title', 'How do I use TikTok emojis?')}
              </h3>
              <p className="text-white/90 leading-relaxed">
                {processTikTokShortcodes(t('pages.tiktokEmojis.faq.q2.answer', 'To use TikTok emojis, simply type the shortcode in square brackets (e.g., [smile]) in your comment or caption. TikTok will automatically convert these shortcodes into the corresponding emoji. You can also use standard emoji keyboards or copy-paste emojis directly.'), 20)}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('pages.tiktokEmojis.faq.q3.title', 'What are the most popular TikTok emojis?')}
              </h3>
              <p className="text-white/90 leading-relaxed">
                {processTikTokShortcodes(t('pages.tiktokEmojis.faq.q3.answer', 'Some of the most popular TikTok emojis include [smile], [happy], [loveface], [wronged], [cry], [laugh], [cool], [angry], and [surprised]. These emojis are frequently used in comments and captions to express emotions and reactions.'), 20)}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('pages.tiktokEmojis.faq.q4.title', 'Are TikTok emojis the same as regular emojis?')}
              </h3>
              <p className="text-white/90 leading-relaxed">
                {processTikTokShortcodes(t('pages.tiktokEmojis.faq.q4.answer', 'TikTok supports both standard Unicode emojis (like [laughwithtears], [lovely], [excited]) and its own custom hidden emojis accessed through shortcodes. The hidden emojis have a unique visual style that\'s consistent across all devices and platforms.'), 20)}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('pages.tiktokEmojis.faq.q5.title', 'Can I use TikTok emojis on other platforms?')}
              </h3>
              <p className="text-white/90 leading-relaxed">
                {t('pages.tiktokEmojis.faq.q5.answer', 'TikTok\'s hidden emojis (accessed via shortcodes) are specific to the TikTok platform and won\'t display as intended on other social media platforms. However, standard Unicode emojis work across all platforms.')}
              </p>
            </div>
          </div>
        </section>

        {/* 相关链接 */}
        <section className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t('pages.tiktokEmojis.try.title', 'Try Our TikTok Emoji Translator')}
          </h2>
          <p className="text-white/90 mb-8">
            {t('pages.tiktokEmojis.try.desc', 'Transform your text into TikTok-style expressions with our AI-powered emoji translator!')}
          </p>
          <Link
            href={`/${locale}/tiktok`}
            className="inline-block bg-white/20 hover:bg-pink-400 text-white px-8 py-4 rounded-lg font-bold transition-colors text-lg"
          >
            🎵 {t('pages.tiktokEmojis.try.button', 'Try TikTok Mode Now')}
          </Link>
        </section>
      </div>

      {/* 页脚 */}
              <Footer />
    </div>
  );
} 