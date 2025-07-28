"use client";
import Link from "next/link";
import TikTokEmojisGuide from '@/components/TikTokEmojisGuide';
import TikTokEmojiImage from '@/components/TikTokEmojiImage';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import { useLoginModal } from '../../components/LoginModalContext';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

export default function TikTokEmojisPageClient() {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user;
  
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
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-600">
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
              🎵 TikTok Mode
            </Link>
            <Link
              href={`/${i18n.language}/tiktok-emojis`}
              className="bg-white/20 hover:bg-purple-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              📖 TikTok Emojis Guide
            </Link>
            {!user ? (
              <button
                className="bg-white/20 hover:bg-pink-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                onClick={show}
              >
                {t('login.button', 'Login')}
              </button>
            ) : (
              <div className="relative flex items-center gap-2" ref={menuRef}>
                <button onClick={() => setOpen(v => !v)} className="focus:outline-none">
                  <img
                    src={user?.image ?? '/images/beanhead (1).svg'}
                    alt={user?.name ?? 'User'}
                    className="w-9 h-9 rounded-full border-2 border-white shadow"
                    title={user?.name ?? user?.email ?? 'User'}
                  />
                </button>
                {open && (
                  <div className="absolute right-0 top-12 bg-white/90 rounded-lg shadow-lg py-2 min-w-[140px] z-50 flex flex-col text-gray-900">
                    <Link href="/zh/profile" className="px-4 py-2 hover:bg-pink-100 rounded transition text-left">{t('profileTitle', '个人中心')}</Link>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 hover:bg-pink-100 rounded text-left">{t('signOut', '退出登录')}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* 页面内容 */}
        <div className="container mx-auto py-8 px-4">
          <article className="max-w-4xl mx-auto">
            {/* 结构化数据 */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Article",
                  "headline": "TikTok Emojis - Complete Guide to Hidden Emojis & Meanings (2024)",
                  "description": "Discover all TikTok emojis including hidden shortcodes like [smile], [happy], [loveface]. Learn how to use TikTok emojis, their meanings, and get the complete list of official TikTok emoji codes.",
                  "image": "https://yourdomain.com/og-tiktok-emojis.jpg",
                  "author": {
                    "@type": "Organization",
                    "name": "Emoji Translator"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "Emoji Translator",
                    "logo": {
                      "@type": "ImageObject",
                      "url": "https://yourdomain.com/logo.png"
                    }
                  },
                  "datePublished": "2024-01-01",
                  "dateModified": new Date().toISOString().split('T')[0],
                  "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": "https://yourdomain.com/tiktok-emojis"
                  }
                })
              }}
            />

            {/* 页面标题 */}
            <header className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-6">
                {t('tiktok.emojis.page.title', 'TikTok Emojis - Complete Guide to Hidden Emojis & Meanings')}
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                {t('tiktok.emojis.page.subtitle', 'Discover all TikTok emojis including hidden shortcodes like [smile], [happy], [loveface]. Learn how to use TikTok emojis, their meanings, and get the complete list of official TikTok emoji codes.')}
              </p>
            </header>

            {/* 主要内容 */}
            <TikTokEmojisGuide />

            {/* FAQ Section for SEO */}
            <section className="mt-16 bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {t('tiktok.emojis.faq.title', 'Frequently Asked Questions About TikTok Emojis')}
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('tiktok.emojis.faq.q1', 'What are TikTok emojis?')}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {t('tiktok.emojis.faq.a1', 'TikTok emojis are a collection of custom emoji characters and hidden shortcodes that users can use in comments, captions, and messages on the TikTok platform. These include both standard Unicode emojis and TikTok-specific hidden emojis that can be accessed through shortcodes like [smile], [happy], and [loveface].')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('tiktok.emojis.faq.q2', 'How do I use TikTok emojis?')}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {t('tiktok.emojis.faq.a2', 'To use TikTok emojis, simply type the shortcode in square brackets (e.g., [smile]) in your comment or caption. TikTok will automatically convert these shortcodes into the corresponding emoji. You can also use standard emoji keyboards or copy-paste emojis directly.')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('tiktok.emojis.faq.q3', 'What are the most popular TikTok emojis?')}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {t('tiktok.emojis.faq.a3', 'Some of the most popular TikTok emojis include [smile], [happy], [loveface], [wronged], [cry], [laugh], [cool], [angry], and [surprised]. These emojis are frequently used in comments and captions to express emotions and reactions.')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('tiktok.emojis.faq.q4', 'Are TikTok emojis the same as regular emojis?')}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {t('tiktok.emojis.faq.a4', 'TikTok supports both standard Unicode emojis (like 😂, ❤️, 🔥) and its own custom hidden emojis accessed through shortcodes. The hidden emojis have a unique visual style that is consistent across all devices and platforms.')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('tiktok.emojis.faq.q5', 'Can I use TikTok emojis on other platforms?')}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {t('tiktok.emojis.faq.a5', 'TikTok&apos;s hidden emojis (accessed via shortcodes) are specific to the TikTok platform and won&apos;t display as intended on other social media platforms. However, standard Unicode emojis work across all platforms.')}
                  </p>
                </div>
              </div>
            </section>

            {/* 相关链接 */}
            <section className="mt-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('tiktok.emojis.try.title', 'Try Our TikTok Emoji Translator')}
              </h2>
              <p className="text-white/90 mb-8">
                {t('tiktok.emojis.try.desc', 'Transform your text into TikTok-style expressions with our AI-powered emoji translator!')}
              </p>
              <Link
                href={`/${i18n.language}/tiktok`}
                className="inline-block bg-white/20 hover:bg-pink-400 text-white px-8 py-4 rounded-lg font-bold transition-colors text-lg"
              >
                {t('tiktok.emojis.try.button', '🎵 Try TikTok Mode Now')}
              </Link>
            </section>
          </article>
        </div>

        {/* 尾部栏 */}
        <Footer />
      </div>
    </ClientOnly>
  );
} 