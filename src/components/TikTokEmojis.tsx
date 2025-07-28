"use client";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TikTokEmojiImage from '@/components/TikTokEmojiImage';

interface TikTokEmojiExample {
  text: string;
  emoji: string;
  description: string;
}

export default function TikTokEmojis() {
  const { t } = useTranslation();
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

  const tiktokExamples: TikTokEmojiExample[] = [
    {
      text: t('tiktok.examples.scream.text', 'OMG this is amazing!'),
      emoji: "scream",
      description: t('tiktok.examples.scream', 'Classic TikTok shocked expression combination')
    },
    {
      text: t('tiktok.examples.stun.text', 'I can\'t even...'),
      emoji: "stun",
      description: t('tiktok.examples.stun', 'Express confusion or shock')
    },
    {
      text: t('tiktok.examples.lovely.text', 'This is everything!'),
      emoji: "lovely",
      description: t('tiktok.examples.lovely', 'Express perfection and love')
    },
    {
      text: t('tiktok.examples.speechless.text', 'No words needed'),
      emoji: "speechless",
      description: t('tiktok.examples.speechless', 'Speechless or shocked beyond words')
    },
    {
      text: t('tiktok.examples.excited.text', 'Living for this!'),
      emoji: "excited",
      description: t('tiktok.examples.excited', 'Express extreme excitement and love')
    },
    {
      text: t('tiktok.examples.proud.text', 'This is the content I signed up for'),
      emoji: "proud",
      description: t('tiktok.examples.proud', 'Express this is exactly the content I wanted')
    }
  ];

  const popularTikTokEmojis = [
    "scream", "cool", "angry", "surprised", "stun", "shock", "rage", "slap", "wow", "lovely",
    "speechless", "thinking", "tears", "excited", "proud", "joyful", "greedy", "complacent", "pride", "wronged",
    "weep", "laughwithtears", "embarrassed", "sulk", "shout", "complacent", "proud", "funnyface", "funnyface", "thinking"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">🎵 TikTok Emojis</h2>
          <p className="text-xl opacity-90">
            {t('tiktok.description', 'Transform your text into TikTok-style expressions with exaggerated, fun, and engaging emojis!')}
          </p>
        </div>

        {/* TikTok特色功能 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-bold mb-2">{t('tiktok.feature1.title', 'Dramatic Expressions')}</h3>
            <p className="opacity-90">{t('tiktok.feature1.desc', 'Exaggerated emotions and reactions like TikTok creators')}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🎪</div>
            <h3 className="text-xl font-bold mb-2">{t('tiktok.feature2.title', 'Trendy Vibes')}</h3>
            <p className="opacity-90">{t('tiktok.feature2.desc', 'Latest emoji trends and viral expressions')}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">{t('tiktok.feature3.title', 'Creative Style')}</h3>
            <p className="opacity-90">{t('tiktok.feature3.desc', 'Unique combinations that stand out on social media')}</p>
          </div>
        </div>

        {/* 示例展示 */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">{t('tiktok.examples.title', 'TikTok Style Examples')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {tiktokExamples.map((example, index) => (
              <div
                key={index}
                className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedExample === index ? 'ring-2 ring-white/50' : ''
                }`}
                onClick={() => setSelectedExample(selectedExample === index ? null : index)}
              >
                <div className="text-sm opacity-80 mb-2">{example.text}</div>
                <div className="text-2xl mb-2">
                  <TikTokEmojiImage shortcode={`[${example.emoji}]`} size={32} />
                </div>
                <div className="text-sm opacity-90">{example.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门TikTok表情 */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">{t('tiktok.popular.title', 'Popular TikTok Emojis')}</h3>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
            <div className="grid grid-cols-10 gap-3">
              {popularTikTokEmojis.map((emoji, index) => (
                <div
                  key={index}
                  className="text-2xl hover:scale-125 transition-transform duration-200 cursor-pointer text-center"
                  title={`TikTok emoji ${index + 1}`}
                >
                  <TikTokEmojiImage shortcode={`[${emoji}]`} size={24} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-center">{t('tiktok.howToUse.title', 'How to Use TikTok Mode')}</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-bold mb-2">💡 {t('tiktok.howToUse.tip1.title', 'Tip 1: Be Dramatic')}</h4>
              <p className="opacity-90">{t('tiktok.howToUse.tip1.desc', 'Use exaggerated expressions and reactions')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">🎯 {t('tiktok.howToUse.tip2.title', 'Tip 2: Stay Trendy')}</h4>
              <p className="opacity-90">{t('tiktok.howToUse.tip2.desc', 'Follow current emoji trends and viral expressions')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">✨ {t('tiktok.howToUse.tip3.title', 'Tip 3: Be Creative')}</h4>
              <p className="opacity-90">{t('tiktok.howToUse.tip3.desc', 'Mix and match emojis for unique combinations')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">🎪 {t('tiktok.howToUse.tip4.title', 'Tip 4: Show Personality')}</h4>
              <p className="opacity-90">{t('tiktok.howToUse.tip4.desc', 'Let your personality shine through your emoji choices')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 