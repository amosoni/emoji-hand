"use client";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useUser } from "@clerk/nextjs";
import { useLoginModal } from "../../../components/LoginModalContext";
import { useState, useRef } from 'react';

export default function NavBar() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { show } = useLoginModal();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  if (typeof window !== 'undefined') {
    window.onclick = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
  }
  return (
    <nav className="relative z-10 flex items-center justify-between px-8 py-6">
      <Link href="/" className="flex items-center gap-2 text-3xl font-extrabold text-white drop-shadow">
        <span>🖐️✨</span> emojihand
      </Link>
      <div className="flex items-center gap-6">
        {!user ? (
          <button
            className="bg-white/20 hover:bg-pink-400 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            onClick={show}
          >
            {t('login', '登录 / Login')}
          </button>
        ) : (
          <div className="relative flex items-center gap-2" ref={menuRef}>
            <button onClick={() => setOpen(v => !v)} className="focus:outline-none">
              <img
                src={user.imageUrl || '/images/beanhead (1).svg'}
                alt={user.fullName || 'User'}
                className="w-9 h-9 rounded-full border-2 border-white shadow"
                title={user.fullName || user.primaryEmailAddress?.emailAddress || 'User'}
              />
            </button>
            {open && (
              <div className="absolute right-0 top-12 bg-white/90 rounded-lg shadow-lg py-2 min-w-[140px] z-50 flex flex-col text-gray-900">
                <Link href="/profile" className="px-4 py-2 hover:bg-pink-100 rounded transition text-left">{t('profile', '个人中心')}</Link>
                <button onClick={() => window.location.href = '/sign-out'} className="px-4 py-2 hover:bg-pink-100 rounded text-left">{t('signOut', '退出登录')}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 