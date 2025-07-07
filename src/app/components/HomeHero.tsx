"use client";
import { useTranslation } from 'react-i18next';

export default function HomeHero() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col items-center justify-center pt-6 pb-1">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-5xl animate-bounce">🖐️✨</span>
        <h1 className="text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">{t('appTitle', 'emoji hand')}</h1>
      </div>
      <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-500 bg-clip-text text-transparent">{t('appSlogan', 'The Ultimate Emoji Translator')}</h2>
      <p className="text-xl text-white/80 mb-8 max-w-2xl text-center">
        <b>{t('appDescBold', 'Emoji Hand (emojihand) is your one-stop tool to instantly turn any text into fun, expressive emoji messages.')}</b> {t('appDesc', 'Powered by AI, Emoji Hand helps you communicate with more emotion, creativity, and style. Try it now and make your words stand out!')}
      </p>
    </section>
  );
} 