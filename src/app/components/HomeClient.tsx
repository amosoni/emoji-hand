"use client";
import Link from "next/link";
import Head from "next/head";
import HomeHero from './HomeHero';
import Translator from "~/components/Translator";
import EmojiStats from "~/components/EmojiStats";
import LanguageSwitcher from "~/components/LanguageSwitcher";
import { LatestPost } from "~/app/_components/post";
import ShareFooter from "~/components/ShareFooter";
// import { useTranslation } from 'react-i18next';
// import { api as trpc } from "~/trpc/react";
import { useState, useRef, useEffect } from 'react';
import i18n from "../../i18n";
import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import { useLoginModal } from '../../../components/LoginModalContext';

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

export default function HomeClient({ hello }: { hello: any }) {
  const { t } = useTranslation();
  // const createCheckout = trpc.creem.createCheckoutSession.useMutation();
  // 用户菜单逻辑
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // 点击外部关闭菜单
  if (typeof window !== 'undefined') {
    window.onclick = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
  }

  const { show } = useLoginModal();

  // user/show/clerkLocale/productId 相关逻辑全部注释或用占位符替换
  // 登录、头像、会员、付费等相关按钮全部用 alert('待实现') 占位
  const user: any = null; // Placeholder for user data
  const showData = false; // Placeholder for show data
  const clerkLocale = 'en'; // Placeholder for clerk locale
  const productId = 'prod_123'; // Placeholder for product ID

  return (
    <ClientOnly>
        <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500">
          <nav className="relative z-10 flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-2 text-3xl font-extrabold text-white drop-shadow">
              <span>🖐️✨</span> emojihand
            </div>
            <div className="flex items-center gap-6">
            {/* 登录按钮和头像逻辑后续用 NextAuth.js 替换 */}
              {!user ? (
                <button
                  className="bg-white/20 hover:bg-pink-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                onClick={show}
                >
                {/* {t('login', '登录 / Login')} */}
                Login
                </button>
              ) : (
                <div className="relative flex items-center gap-2" ref={menuRef}>
                  <button onClick={() => setOpen(v => !v)} className="focus:outline-none">
                    <img
                    src={user?.imageUrl || '/images/beanhead (1).svg'}
                    alt={user?.fullName || 'User'}
                      className="w-9 h-9 rounded-full border-2 border-white shadow"
                    title={user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User'}
                    />
                  </button>
                  {open && (
                    <div className="absolute right-0 top-12 bg-white/90 rounded-lg shadow-lg py-2 min-w-[140px] z-50 flex flex-col text-gray-900">
                    <Link href="/profile" className="px-4 py-2 hover:bg-pink-100 rounded transition text-left">Profile</Link>
                    <button onClick={() => window.location.href = '/sign-out'} className="px-4 py-2 hover:bg-pink-100 rounded text-left">Sign Out</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
          <HomeHero />
          <Translator />
          <div className="mt-4 text-white/80 text-center">
            {t('tryPrefix', 'Try:')} <span className="bg-white/20 rounded px-2 py-1">{t('tryExample', "Let's party tonight")}</span> → <span className="font-bold">{t('tryResult', '🎉🕺✨')}</span>
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
              <p className="text-white/80 text-center">{t('highlight1Desc', 'Context-aware emoji translation powered by GPT.')}</p>
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
            <h2 className="text-4xl font-bold text-white text-center mb-8">{t('hotEmojis', 'hotEmojis')}</h2>
            <EmojiStats />
          </section>
          {/* 付费/解锁区 */}
          <section className="flex flex-col items-center my-12">
            <div className="bg-white/30 border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('unlockPremiumTitle', 'Unlock Premium')}</h3>
              <p className="text-gray-800 mb-4 text-center">{t('unlockPremiumDesc', 'Get unlimited savage/GenZ translations, exclusive emoji packs, and ad-free experience for just')} <span className="font-bold text-[#EC4899]">$9.99/month</span>.</p>
              <button
                className="bg-gradient-to-r from-[#A259FF] to-[#43A1FF] text-white px-10 py-3 rounded-xl font-bold text-lg shadow-md transition hover:scale-105 hover:from-pink-400 hover:to-yellow-300 active:scale-95"
              onClick={() => {
                // 付费逻辑后续用 NextAuth.js 替换
                alert('付费功能待实现');
              }}
              // disabled={createCheckout.isPending}
              >
              {/* {createCheckout.isPending ? t('loading', 'Loading...') : t('unlockPremiumBtn', 'Unlock Premium')} */}
              {t('unlockPremiumBtn', 'Unlock Premium')}
              </button>
            <p className="text-xs text-gray-700 mt-3 text-center">{t('autoRenewNote', '会员为自动续费，您可随时在支付平台取消订阅，取消后会员权益在本周期结束后失效。')}</p>
            </div>
          </section>
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
              {t('aboutDesc', 'Emoji Hand was born from the idea that everyone deserves to express themselves more vividly online. Our mission is to make digital communication more fun, emotional, and creative—one emoji at a time. Whether you’re chatting with friends, posting on social media, or just want to brighten someone’s day, Emoji Hand is here to help!')}
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
            <ShareFooter />
        <Footer />
            <div className="mt-1 mb-1 flex justify-center w-full">
              <LanguageSwitcher />
            </div>
          {/* 自定义动画 keyframes */}
          <style>{`
            @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .animate-spin-slow { animation: spin-slow 6s linear infinite; }
          `}</style>
        </div>
    </ClientOnly>
  );
} 