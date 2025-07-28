"use client";
import Link from "next/link";
import TikTokEmojis from '@/components/TikTokEmojis';
import Translator from '@/components/Translator';
import DouyinEmojiPickerDemo from '@/components/DouyinEmojiPickerDemo';
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

export default function TikTokPageClient() {
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
          {/* 页面标题 */}
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6 flex items-center justify-center gap-4">
              <span className="text-4xl">🎵</span>
              {t('tiktok.page.title', 'TikTok Emojis')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t('tiktok.page.subtitle', 'Transform your messages into TikTok-style expressions with exaggerated, fun, and engaging emojis!')}
            </p>
          </header>

          {/* TikTok表情示例 */}
          <TikTokEmojis />

          {/* 翻译器 */}
          <div className="mt-12">
            <Translator />
          </div>

          {/* 抖音官方表情选择器 */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">{t('tiktok.page.official.title', '🎵 Official TikTok Emojis')}</h2>
              <p className="text-lg text-white/80">
                {t('tiktok.page.official.desc', 'Choose official TikTok emojis and experience authentic TikTok emoji culture!')}
              </p>
            </div>
            <DouyinEmojiPickerDemo />
          </div>
        </div>

        {/* 尾部栏 */}
        <Footer />
      </div>
    </ClientOnly>
  );
} 