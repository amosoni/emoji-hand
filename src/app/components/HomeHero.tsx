"use client";
import { useTranslation } from 'react-i18next';

export default function HomeHero() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col items-center justify-center pt-6 pb-1">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-5xl animate-bounce">🖐️✨</span>
        <h1 className="text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">{t('appTitle', 'Emoji Hand')}</h1>
      </div>
      <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-500 bg-clip-text text-transparent">{t('appSlogan', 'AI驱动的表情翻译器与生成器')}</h2>
      <p className="text-xl text-white/80 mb-8 max-w-2xl text-center">
        <b>{t('appDescBold', 'Emoji Hand (emojihand) is your one-stop tool to instantly turn any text into fun, expressive emoji messages.')}</b> {t('appDesc', 'Emoji Hand是终极AI驱动的表情翻译器和生成器。立即将任何文本转换为富有表现力的表情消息。免费表情翻译、抖音表情、表情包等更多功能!')}
      </p>
    </section>
  );
} 