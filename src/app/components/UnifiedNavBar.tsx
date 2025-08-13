"use client";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useLoginModal } from "@/components/LoginModalContext";
import { useParams, usePathname } from 'next/navigation';
import OptimizedImage from './OptimizedImage';

// 提取导航链接配置
const NAV_LINKS = [
  { href: 'tiktok', icon: '🎵', key: 'nav.tiktok', label: 'TikTok Mode' },
  { href: 'tiktok-emojis', icon: '📖', key: 'nav.tiktokEmojis', label: 'TikTok Emojis Guide' },
  { href: 'emoji-generator', icon: '🎨', key: 'nav.emojiGenerator', label: 'Emoji Generator' },
  { href: 'gen-z', icon: '👥', key: 'nav.genZ', label: 'Gen Z Guide' },
  { href: 'emoji-pack-subscription', icon: '💎', key: 'nav.subscription', label: 'Subscription' },
];

export default function UnifiedNavBar() {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { show } = useLoginModal();
  const params = useParams();
  const pathname = usePathname();
  
  // 使用useMemo优化supported数组
  const supported = useMemo(() => ['zh','en','ja','ko','es','fr','pt','de','it','ru'], []);
  
  // 优化locale获取逻辑
  const getLocale = useCallback(() => {
    let locale = params?.locale;
    if (Array.isArray(locale)) locale = locale[0];
    if (!locale || !supported.includes(locale)) {
      const regex = /^\/([a-z]{2})\b/;
      const match = regex.exec(pathname ?? '');
      if (match && typeof match[1] === 'string' && supported.includes(match[1])) {
        locale = match[1];
      } else {
        locale = 'en';
      }
    }
    return typeof locale === 'string' && locale ? locale : 'en';
  }, [params?.locale, pathname, supported]);

  const locale = getLocale();

  // 优化点击事件处理
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, [open]);

  useEffect(() => {
    setOpen(false); // 语言切换时自动关闭菜单
  }, [i18n.language]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [handleClickOutside]);

  // 渲染导航链接
  const renderNavLinks = () => (
    <>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={`/${locale}/${link.href}`}
          className="bg-white/20 hover:bg-orange-400 text-white px-1 md:px-3 py-1 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap"
        >
          {link.icon} {t(link.key, link.label)}
        </Link>
      ))}
    </>
  );

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
        {renderNavLinks()}
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
              <OptimizedImage
                src={session.user?.image ?? '/images/beanhead (1).svg'}
                alt={session.user?.name ?? 'User'}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full border-2 border-white shadow"
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