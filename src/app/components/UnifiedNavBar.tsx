"use client";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useLoginModal } from "@/components/LoginModalContext";
import { useParams, usePathname } from 'next/navigation';

export default function UnifiedNavBar() {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { show } = useLoginModal();
  const params = useParams();
  const pathname = usePathname();
  const supported = ['zh','en','ja','ko','es','fr','pt','de','it','ru'];
  let locale = params?.locale;
  if (Array.isArray(locale)) locale = locale[0];
  if (!locale || !supported.includes(locale)) {
    const regex = /^\/([a-z]{2})\b/;
    const match = regex.exec(pathname ?? '');
    if (match && typeof match[1] === 'string' && supported.includes(match[1])) {
      locale = match[1];
    } else {
      locale = 'zh';
    }
  }
  locale = typeof locale === 'string' && locale ? locale : 'zh';

  useEffect(() => {
    setOpen(false); // 语言切换时自动关闭菜单，下次打开就是新语言
  }, [i18n.language]);

  if (typeof window !== 'undefined') {
    window.onclick = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
  }

  return (
    <nav className="relative z-10 flex items-center justify-between px-4 py-6">
      <Link href={`/${locale}`} className="flex items-center gap-2 text-2xl md:text-3xl font-extrabold text-white drop-shadow">
        <span>🖐️✨</span> <span className="hidden sm:inline">emojihand</span>
      </Link>
      <div className="flex items-center gap-1 md:gap-3 flex-wrap justify-end min-w-0">
        <Link
          href={`/${locale}`}
          className="bg-white/20 hover:bg-orange-400 text-white px-1 md:px-3 py-1 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap"
        >
          🏠 {t('nav.home', 'Home')}
        </Link>
        <Link
          href={`/${locale}/tiktok`}
          className="bg-white/20 hover:bg-pink-400 text-white px-1 md:px-3 py-1 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap"
        >
          🎵 {t('nav.tiktok', 'TikTok Mode')}
        </Link>
        <Link
          href={`/${locale}/tiktok-emojis`}
          className="bg-white/20 hover:bg-purple-400 text-white px-1 md:px-3 py-1 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap"
        >
          📖 {t('nav.tiktokEmojis', 'TikTok Emojis Guide')}
        </Link>
        <Link
          href={`/${locale}/emoji-generator`}
          className="bg-white/20 hover:bg-green-400 text-white px-1 md:px-3 py-1 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap"
        >
          🎨 {t('nav.emojiGenerator', 'Emoji Generator')}
        </Link>
        <Link
          href={`/${locale}/gen-z`}
          className="bg-white/20 hover:bg-purple-400 text-white px-1 md:px-3 py-1 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap"
        >
          👥 {t('nav.genZ', 'Gen Z Guide')}
        </Link>
        <Link
          href={`/${locale}/lovart-style`}
          className="bg-white/20 hover:bg-blue-400 text-white px-1 md:px-3 py-1 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap"
        >
          🎭 {t('nav.lovartStyle', 'Lovart Style Design')}
        </Link>
        <Link
          href={`/${locale}/emoji-pack-subscription`}
          className="bg-white/20 hover:bg-yellow-400 text-white px-1 md:px-3 py-1 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap"
        >
          💎 {t('nav.subscription', 'Subscription')}
        </Link>
        {!session ? (
          <button
            className="bg-white/20 hover:bg-pink-400 text-white px-1 md:px-3 py-1 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap"
            onClick={show}
          >
            👤 {t('login.button', 'Login')}
          </button>
        ) : (
          <div className="relative flex items-center gap-2" ref={menuRef}>
            <button onClick={() => setOpen(v => !v)} className="focus:outline-none">
              <img
                src={session.user?.image ?? '/images/beanhead (1).svg'}
                alt={session.user?.name ?? 'User'}
                className="w-9 h-9 rounded-full border-2 border-white shadow"
                title={session.user?.name ?? session.user?.email ?? 'User'}
              />
            </button>
            {open && (
              <div className="absolute right-0 top-12 bg-white/90 rounded-lg shadow-lg py-2 min-w-[140px] z-50 flex flex-col text-gray-900">
                <Link href={`/${locale}/profile`} className="px-4 py-2 hover:bg-pink-100 rounded transition text-left">{t('profileTitle', 'Profile')}</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 hover:bg-pink-100 rounded text-left">{t('signOut', 'Sign Out')}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 