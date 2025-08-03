"use client";
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { useLoginModal } from '@/components/LoginModalContext';
// import TikTokTranslator from '@/components/TikTokTranslator';
import Footer from './Footer';
import UnifiedNavBar from './UnifiedNavBar';
import { useState, useRef, useEffect } from 'react';

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
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
        <UnifiedNavBar />
        {/* <TikTokTranslator /> */}
        <Footer />
      </div>
    </ClientOnly>
  );
} 