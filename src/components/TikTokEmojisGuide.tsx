"use client";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DOUYIN_SHORTCODES,
  DOUYIN_COMBINATIONS,
  DOUYIN_MEANINGS,
  DOUYIN_POPULAR_EMOJIS,
  DOUYIN_CATEGORIES,
  getDouyinMeaning,
  getDouyinExample
} from '@/utils/tiktokEmojis';
import TikTokEmojiImage from '@/components/TikTokEmojiImage';
import { processTikTokShortcodes } from '@/utils/textProcessor';
import i18n from '@/i18n';

export default function TikTokEmojisGuide() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'shortcodes' | 'meanings' | 'combinations' | 'popular'>('shortcodes');

  const tabs = [
    { id: 'shortcodes', label: t('tiktok.guide.tabs.shortcodes', 'Hidden Shortcodes'), icon: '🔍' },
    { id: 'meanings', label: t('tiktok.guide.tabs.meanings', 'Emoji Meanings'), icon: '📖' },
    { id: 'combinations', label: t('tiktok.guide.tabs.combinations', 'Popular Combinations'), icon: '🎭' },
    { id: 'popular', label: t('tiktok.guide.tabs.popular', 'Most Popular'), icon: '⭐' },
  ] as const;

  return (
    <div className="space-y-12">
      {/* 介绍部分 */}
      <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t('tiktok.guide.intro.title', 'What are TikTok Emojis?')}
        </h2>
        <div className="text-white/90 space-y-4 leading-relaxed">
          <p>
            {t('tiktok.guide.intro.p1', 'TikTok emojis are a unique collection of custom emoji characters and hidden shortcodes that users can use in comments, captions, and messages on the TikTok platform. Unlike standard emojis, TikTok has its own "hidden emoji" system that allows users to access special emoji characters through shortcodes.')}
          </p>
          <p>
            {t('tiktok.guide.intro.p2', 'These hidden emojis are accessed by typing specific shortcodes in square brackets, such as')} <TikTokEmojiImage shortcode="[smile]" size={20} />, <TikTokEmojiImage shortcode="[happy]" size={20} />, {t('tiktok.guide.intro.p2_2', 'or')} <TikTokEmojiImage shortcode="[loveface]" size={20} />. {t('tiktok.guide.intro.p2_3', 'When you type these shortcodes in TikTok comments or captions, they automatically convert to the corresponding custom emoji graphics.')}
          </p>
          <p>
            {t('tiktok.guide.intro.p3', 'TikTok supports all platform-native emojis, but these hidden emojis provide a unique visual style that\'s consistent across all devices and platforms, making them popular among TikTok users for expressing specific emotions and reactions.')}
          </p>
        </div>
      </section>

      {/* 如何使用 */}
      <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t('tiktok.guide.howto.title', 'How to Use TikTok Emojis')}
        </h2>
        <div className="text-white/90 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">{t('tiktok.guide.howto.method1.title', 'Method 1: Shortcodes')}</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>{t('tiktok.guide.howto.method1.step1', 'Type the shortcode in square brackets (e.g.,')} <TikTokEmojiImage shortcode="[smile]" size={20} />)</li>
                <li>{t('tiktok.guide.howto.method1.step2', 'TikTok will automatically convert it to the emoji')}</li>
                <li>{t('tiktok.guide.howto.method1.step3', 'Works in comments, captions, and messages')}</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">{t('tiktok.guide.howto.method2.title', 'Method 2: Direct Emoji')}</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>{t('tiktok.guide.howto.method2.step1', 'Use your device\'s emoji keyboard')}</li>
                <li>{t('tiktok.guide.howto.method2.step2', 'Copy and paste emojis from other sources')}</li>
                <li>{t('tiktok.guide.howto.method2.step3', 'Works with all standard Unicode emojis')}</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 标签页内容 */}
      <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        {/* 标签导航 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* 标签内容 */}
        <div className="min-h-[400px]">
          {activeTab === 'shortcodes' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">{t('tiktok.guide.shortcodes.title', 'Hidden TikTok Emoji Shortcodes')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(DOUYIN_SHORTCODES).map(([shortcode, emoji]) => (
                  <div key={shortcode} className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-purple-300 font-mono text-sm">{shortcode}</code>
                      <TikTokEmojiImage shortcode={shortcode} size={32} />
                    </div>
                    <p className="text-white/80 text-sm">{getDouyinMeaning(emoji) ?? shortcode}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'meanings' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">{t('tiktok.guide.meanings.title', 'TikTok Emoji Meanings')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(DOUYIN_MEANINGS).map(([emoji, meaningObj]) => {
                  // 找到对应的短代码
                  const shortcode = Object.entries(DOUYIN_SHORTCODES).find(([_, unicodeEmoji]) => unicodeEmoji === emoji)?.[0];
                  
                  return (
                    <div key={emoji} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        {shortcode ? (
                          <TikTokEmojiImage shortcode={shortcode} size={48} />
                        ) : (
                          <span className="text-2xl">{emoji}</span>
                        )}
                        <span className="text-white font-medium">
                          {(meaningObj as any)[`meaning_${i18n.language}`] ?? meaningObj.meaning}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm">
                        {processTikTokShortcodes(
                          String((meaningObj as any)[`example_${i18n.language}`] ?? meaningObj.example), 
                          16
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'combinations' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">{t('tiktok.guide.combinations.title', 'Popular TikTok Emoji Combinations')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(DOUYIN_COMBINATIONS).map(([combination, meaningObj]) => {
                  // 解析组合中的短代码
                  const shortcodes = combination.match(/\[[^\]]+\]/g) ?? [];
                  const meaning = typeof meaningObj === 'string' ? meaningObj : 
                    (i18n.language === 'ja' ? meaningObj.ja : 
                     i18n.language === 'ko' ? meaningObj.ko : meaningObj.en);
                  return (
                    <div key={combination} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex gap-2 mb-2">
                        {shortcodes.map((shortcode, index) => (
                          <TikTokEmojiImage key={index} shortcode={shortcode} size={32} />
                        ))}
                      </div>
                      <p className="text-white/80 text-sm">{meaning}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'popular' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">{t('tiktok.guide.popular.title', 'Most Popular TikTok Emojis')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {DOUYIN_POPULAR_EMOJIS.map((shortcode) => {
                  const unicodeEmoji = DOUYIN_SHORTCODES[shortcode as keyof typeof DOUYIN_SHORTCODES];
                  return (
                    <div key={shortcode} className="bg-white/10 rounded-lg p-4 border border-white/20 text-center">
                      <TikTokEmojiImage shortcode={shortcode} size={40} />
                      <p className="text-white/80 text-sm mt-2">{getDouyinMeaning(unicodeEmoji)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 分类表情 */}
      <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('tiktok.guide.categories.title', 'TikTok Emoji Categories')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(DOUYIN_CATEGORIES).map(([category, emojis]) => (
            <div key={category} className="bg-white/10 rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 capitalize">
                {t(`tiktok.guide.categories.${category}`, category.replace(/([A-Z])/g, ' $1').trim())}
              </h3>
              <div className="flex flex-wrap gap-2">
                {emojis.map((shortcode) => {
                  const unicodeEmoji = DOUYIN_SHORTCODES[shortcode as keyof typeof DOUYIN_SHORTCODES];
                  return (
                    <span key={shortcode} className="text-2xl" title={getDouyinMeaning(unicodeEmoji) ?? shortcode}>
                      <TikTokEmojiImage shortcode={shortcode} size={32} />
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 