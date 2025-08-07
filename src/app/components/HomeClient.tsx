"use client";
import Link from "next/link";
import Head from "next/head";
import HomeHero from './HomeHero';
import Translator from "../../components/Translator";
import EmojiStats from "../../components/EmojiStats";

import { LatestPost } from "@/app/_components/post";

// import { useTranslation } from 'react-i18next';
// import { api as trpc } from "~/trpc/react";
import { useState, useRef, useEffect } from 'react';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import { useLoginModal } from '../../components/LoginModalContext';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { RechargeButton } from './RechargeButton';
import UnifiedNavBar from './UnifiedNavBar';

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

export default function HomeClient({ hello }: { hello: unknown }) {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user;
  console.log('session', session);
  if (typeof window !== 'undefined') {
    console.log('cookie', document.cookie);
  }
  // 用户菜单逻辑
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  if (typeof window !== 'undefined') {
    window.onclick = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
  }
  const { show } = useLoginModal();
  useEffect(() => {
    setOpen(false); // 语言切换时自动关闭菜单，下次打开就是新语言
  }, [i18n.language]);
  return (
    <ClientOnly>
        <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500">
          <UnifiedNavBar />
          <HomeHero />
          <Translator />
          <div className="mt-4 text-white/80 text-center">
            {t('tryPrefix', 'Try:')} <span className="bg-white/20 rounded px-2 py-1">{t('tryExample', "Let's party tonight")}</span> → <span className="font-bold">{t('tryResult', '🎉🍻🥳')}</span>
          </div>
          {/* 应用场景区块 */}
          <section className="flex flex-col items-center my-12">
            <h2 className="text-3xl font-bold text-white mb-6">{t('whyUseTitle', 'Why Use Emoji Hand?')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
              <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">💬</span>
                <h3 className="font-bold text-xl mb-2 text-white">{t('feature1Title', 'Spice Up Your Chats')}</h3>
                <p className="text-white/80 text-center">{t('feature1Desc', 'Make your messages more lively and engaging on WhatsApp, Telegram, Discord, and more.')}</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">📢</span>
                <h3 className="font-bold text-xl mb-2 text-white">{t('feature2Title', 'Social Media Magic')}</h3>
                <p className="text-white/80 text-center">{t('feature2Desc', 'Stand out on Twitter, Instagram, TikTok, and Facebook with creative emoji-powered posts.')}</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">🌏</span>
                <h3 className="font-bold text-xl mb-2 text-white">{t('feature3Title', 'Multi-language Support')}</h3>
                <p className="text-white/80 text-center">{t('feature3Desc', 'Translate and emoji-fy your text in English, Spanish, French, and more.')}</p>
              </div>
            </div>
          </section>
          {/* 用户评价区块 */}
          <section className="flex flex-col items-center my-12">
            <h2 className="text-4xl font-bold text-white mb-8">{t('whatUsersSay', 'What Users Say')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
              <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
                <span className="text-2xl mb-2">⭐️⭐️⭐️⭐️⭐️</span>
                <p className="text-white/90 text-center mb-2">{t('user1Quote', '“Emoji Hand makes my group chats so much more fun!”')}</p>
                <span className="text-white/60 text-sm">— {t('user1Name', 'Alex, Student')}</span>
              </div>
              <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
                <span className="text-2xl mb-2">⭐️⭐️⭐️⭐️⭐️</span>
                <p className="text-white/90 text-center mb-2">{t('user2Quote', '“Perfect for spicing up my social media posts. Love the GenZ mode!”')}</p>
                <span className="text-white/60 text-sm">— {t('user2Name', 'Jamie, Content Creator')}</span>
              </div>
              <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
                <span className="text-2xl mb-2">⭐️⭐️⭐️⭐️⭐️</span>
                <p className="text-white/90 text-center mb-2">{t('user3Quote', '“Super easy to use and the emoji suggestions are spot on.”')}</p>
                <span className="text-white/60 text-sm">— {t('user3Name', 'Taylor, Marketer')}</span>
              </div>
            </div>
          </section>
          {/* 功能亮点区块 */}
          <section className="flex justify-center gap-8 my-12">
            <div className="bg-white/20 border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-8 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl hover:border-pink-300/60">
              <span className="text-4xl mb-3 animate-bounce">🤖</span>
              <h3 className="font-bold text-2xl mb-2 text-white drop-shadow">{t('highlight1Title', 'AI Smart Emoji')}</h3>
              <p className="text-white/80 text-center">{t('highlight1Desc', 'Context aware emoji translation powered by GPT.')}</p>
            </div>
            <div className="bg-white/20 border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-8 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl hover:border-blue-300/60">
              <span className="text-4xl mb-3 animate-spin-slow">🌍</span>
              <h3 className="font-bold text-2xl mb-2 text-white drop-shadow">{t('highlight2Title', 'Multi-language')}</h3>
              <p className="text-white/80 text-center">{t('highlight2Desc', 'Supports English, Spanish, French, and more.')}</p>
            </div>
            <div className="bg-white/20 border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-8 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl hover:border-yellow-300/60">
              <span className="text-4xl mb-3 animate-bounce">🔥</span>
              <h3 className="font-bold text-2xl mb-2 text-white drop-shadow">{t('highlight3Title', 'Trendy Modes')}</h3>
              <p className="text-white/80 text-center">{t('highlight3Desc', 'Normal, Savage, and GenZ Slang modes for every vibe.')}</p>
            </div>
          </section>
          {/* 热门表情区 */}
          <section className="flex flex-col items-center my-12">
            <h2 className="text-4xl font-bold text-white text-center mb-8">{t('hotEmojis', 'Hot Emojis')}</h2>
            <EmojiStats />
          </section>

          
          {/* 订阅引导区 */}
          {!user && (
            <section className="flex flex-col items-center my-12">
              <div className="bg-white/30 border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('unlockPremiumTitle', 'Unlock Premium')}</h3>
                <p className="text-gray-800 mb-4 text-center">{t('unlockPremiumDesc', 'Get unlimited savage/GenZ translations, exclusive emoji packs, and ad-free experience')}</p>
                <button
                  onClick={() => window.location.href = '/subscription'}
                  className="bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  {t('viewSubscription', 'View Subscription Plans')}
                </button>
              </div>
            </section>
          )}
          {/* FAQ/帮助区 */}
          <section className="flex flex-col items-center my-12">
            <h3 className="text-3xl font-bold text-white mb-4">{t('faqTitle', 'Frequently Asked Questions about Emoji Hand')}</h3>
            <div className="space-y-4 max-w-2xl w-full">
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold text-white">{t('faq1Q', 'What is Emoji Hand?')}</h4>
                <p className="text-white/80">{t('faq1A', 'Emoji Hand is an AI-powered tool that instantly adds the most relevant emojis to your text, making your messages more expressive and fun.')}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold text-white">{t('faq2Q', 'Is Emoji Hand free?')}</h4>
                <p className="text-white/80">{t('faq2A', 'Yes! You can use normal mode for free. Premium features are available for a small fee.')}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold text-white">{t('faq3Q', 'How does the AI work?')}</h4>
                <p className="text-white/80">{t('faq3A', "We use OpenAI's GPT to understand your text and add the most relevant emojis based on context and style.")}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold text-white">{t('faq4Q', 'Can I use Emoji Hand on my phone?')}</h4>
                <p className="text-white/80">{t('faq4A', 'Absolutely! Emoji Hand is fully responsive and works great on mobile devices.')}</p>
              </div>
            </div>
          </section>
          {/* 品牌故事区块 */}
          <section className="flex flex-col items-center my-12">
            <h2 className="text-3xl font-bold text-white mb-6">{t('aboutTitle', 'About Emoji Hand')}</h2>
            <div className="max-w-2xl text-white/90 text-center text-lg mb-4">
              {t('aboutDesc', 'Emoji Hand was born from the idea that everyone deserves to express themselves more vividly online. Our mission is to make digital communication more fun, emotional, and creative — one emoji at a time. Whether you\'re chatting with friends, posting on social media, or just want to brighten someone\'s day, Emoji Hand is here to help!')}
            </div>
          </section>
          {/* 使用案例区块 */}
          <section className="flex flex-col items-center my-12">
            <h2 className="text-3xl font-bold text-white mb-6">{t('howUseTitle', 'How People Use Emoji Hand')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">👩‍💻</span>
                <h3 className="font-bold text-xl mb-2 text-white">{t('case1Title', 'Remote Teams')}</h3>
                <p className="text-white/80 text-center">{t('case1Desc', '"We use Emoji Hand to make our Slack standups more lively and keep the team spirit high!"')}</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">🎉</span>
                <h3 className="font-bold text-xl mb-2 text-white">{t('case2Title', 'Event Planners')}</h3>
                <p className="text-white/80 text-center">{t('case2Desc', '"Perfect for sending out fun, engaging invitations and reminders with a personal touch."')}</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">🧑‍🎤</span>
                <h3 className="font-bold text-xl mb-2 text-white">{t('case3Title', 'Content Creators')}</h3>
                <p className="text-white/80 text-center">{t('case3Desc', '"My followers love the extra flair in my posts—Emoji Hand makes my content pop!"')}</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
                <span className="text-3xl mb-2">👨‍👩‍👧‍👦</span>
                <h3 className="font-bold text-xl mb-2 text-white">{t('case4Title', 'Families & Friends')}</h3>
                <p className="text-white/80 text-center">{t('case4Desc', '"We use Emoji Hand to add fun to our family group chats and celebrate special moments together."')}</p>
              </div>
            </div>
          </section>
          {/* 页脚 */}
        <Footer />
          {/* 自定义动画 keyframes */}
          <style>{`
            @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .animate-spin-slow { animation: spin-slow 6s linear infinite; }
          `}</style>
        </div>
    </ClientOnly>
  );
} 