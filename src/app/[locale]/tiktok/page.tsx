"use client";
import { useTranslation } from 'react-i18next';
import TikTokEmojis from '../../../components/TikTokEmojis';
import Translator from '../../../components/Translator';
import DouyinEmojiPickerDemo from '../../../components/DouyinEmojiPickerDemo';
import Link from 'next/link';
import Footer from '../../components/Footer';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

export default function TikTokPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600">
      {/* 导航栏 */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link href={`/${i18n.language}`} className="flex items-center gap-2 text-3xl font-extrabold text-white drop-shadow">
          <span>🖐️✨</span> emojihand
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href={`/${i18n.language}/tiktok`}
            className="bg-white/20 hover:bg-pink-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
          >
            🎵 {t('nav.tiktok', 'TikTok Mode')}
          </Link>
          <Link
            href={`/${i18n.language}/tiktok-emojis`}
            className="bg-white/20 hover:bg-purple-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
          >
            📖 {t('nav.tiktokEmojis', 'TikTok Emojis Guide')}
          </Link>
        </div>
      </nav>

      {/* 页面内容 */}
      <div className="container mx-auto py-8 px-4">
        {/* 页面标题 */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6 flex items-center justify-center gap-4">
            <span className="text-4xl">🎵</span>
            {t('pages.tiktok.title', 'TikTok Emojis')}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('pages.tiktok.subtitle', 'Transform your messages into TikTok-style expressions with exaggerated, fun, and engaging emojis!')}
          </p>
        </header>

        {/* TikTok表情示例 */}
        <section className="mb-12">
          <TikTokEmojis />
        </section>

        {/* 官方抖音表情选择器 */}
        <section className="mb-12 bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">🎵 {t('pages.tiktok.officialEmojis', 'Official TikTok Emojis')}</h2>
          <p className="text-lg text-white/80 mb-6">
            {t('pages.tiktok.officialEmojisDesc', 'Choose official TikTok emojis and experience authentic TikTok emoji culture!')}
          </p>
          <DouyinEmojiPickerDemo />
        </section>

        {/* 翻译器 */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">{t('pages.tiktok.tryTitle', 'Try TikTok Mode')}</h2>
            <p className="text-lg text-white/80">
              {t('pages.tiktok.tryDesc', 'Select "TikTok" mode in the translator below to experience the magic!')}
            </p>
          </div>
          <Translator />
        </section>
      </div>

      {/* 页脚 */}
      <Footer />
      <div className="mt-1 mb-1 flex justify-center w-full">
        <LanguageSwitcher />
      </div>
    </div>
  );
} 