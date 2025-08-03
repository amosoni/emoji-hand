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
        <nav className="relative z-10 flex items-center justify-between px-4 py-6">
          <Link href={`/${i18n.language}`} className="flex items-center gap-2 text-2xl md:text-3xl font-extrabold text-white drop-shadow">
            <span>🖐️✨</span> <span className="hidden sm:inline">emojihand</span>
          </Link>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            minWidth: 'auto',
            maxWidth: 'none',
            width: 'auto'
          }}>
            <Link
              href={`/${i18n.language}/tiktok`}
              style={{
                display: 'inline-block',
                visibility: 'visible',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                margin: '0 2px'
              }}
            >
              🎵 {t('nav.tiktok', 'TikTok Mode')}
            </Link>
            <Link
              href={`/${i18n.language}/tiktok-emojis`}
              style={{
                display: 'inline-block',
                visibility: 'visible',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                margin: '0 2px'
              }}
            >
              📖 {t('nav.tiktokEmojis', 'TikTok Emojis Guide')}
            </Link>
            <Link
              href={`/${i18n.language}/emoji-generator`}
              style={{
                display: 'inline-block',
                visibility: 'visible',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                margin: '0 2px'
              }}
            >
              🎨 {t('nav.emojiGenerator', 'Emoji Generator')}
            </Link>
            {!user ? (
              <button
                onClick={show}
                style={{
                  display: 'inline-block',
                  visibility: 'visible',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  border: 'none',
                  cursor: 'pointer',
                  margin: '0 2px'
                }}
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
                    <Link href={`/${i18n.language}/profile`} className="px-4 py-2 hover:bg-pink-100 rounded transition text-left">{t('profileTitle', 'Profile')}</Link>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 hover:bg-pink-100 rounded text-left">{t('signOut', 'Sign Out')}</button>
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
                  "headline": t('tiktokEmojis.seo.title', 'TikTok Emojis - Complete Guide to Hidden Emojis & Meanings'),
                  "description": t('tiktokEmojis.seo.description', 'Discover all TikTok emojis including hidden shortcodes, meanings, and how to use them effectively in your TikTok content.'),
                  "image": "https://emojihand.com/images/tiktok-emojis-guide.jpg",
                  "author": {
                    "@type": "Organization",
                    "name": "EmojiHand"
                  },
                  "publisher": {
                    "@type": "Organization",
                    "name": "EmojiHand",
                    "logo": {
                      "@type": "ImageObject",
                      "url": "https://emojihand.com/images/logo.png"
                    }
                  },
                  "datePublished": "2024-01-01",
                  "dateModified": "2024-01-01",
                  "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": "https://emojihand.com/tiktok-emojis"
                  }
                })
              }}
            />

            {/* 主要内容 */}
            <TikTokEmojisGuide />
            
            {/* 表情符号图片展示 */}
            <TikTokEmojiImage shortcode="[blush]" />
          </article>
        </div>

        {/* 页脚 */}
        <Footer />
      </div>
    </ClientOnly>
  );
} 