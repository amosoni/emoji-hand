"use client";
import type { Metadata } from 'next';
import LovartStyleClient from '~/components/LovartStyleClient';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useLoginModal } from '@/components/LoginModalContext';
import Footer from '../../components/Footer';

import UnifiedNavBar from '@/app/components/UnifiedNavBar';

export default function LovartStylePage({ params }: { params: { locale: string } }) {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user;
  
  // 页面语言切换
  useEffect(() => {
    if (params.locale && i18n.language !== params.locale) {
      void i18n.changeLanguage(params.locale);
    }
  }, [params.locale, i18n]);
  
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { show } = useLoginModal();

  useEffect(() => {
    setOpen(false); // 语言切换时自动关闭菜单，下次打开就是新语言
  }, [i18n.language]);

  if (typeof window !== 'undefined') {
    window.onclick = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
  }

  return (
    <>
      <Head>
        <title>{t('lovartStyle.seo.title', 'Lovart Style AI - Creative Design Assistant')}</title>
        <meta name="description" content={t('lovartStyle.seo.description', 'Professional AI-powered design assistant inspired by Lovart AI. Generate logos, posters, social media content, and more with intelligent creative analysis.')} />
        <meta name="keywords" content={t('lovartStyle.seo.keywords', 'lovart, ai design, creative assistant, logo design, poster design, social media design, ai art, design automation')} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t('lovartStyle.seo.ogTitle', 'Lovart Style AI - Creative Design Assistant')} />
        <meta property="og:description" content={t('lovartStyle.seo.ogDescription', 'Professional AI-powered design assistant inspired by Lovart AI. Generate logos, posters, social media content, and more.')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://emojihand.com/lovart-style" />
        <meta property="og:image" content="https://emojihand.com/images/lovart-style-og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('lovartStyle.seo.twitterTitle', 'Lovart Style AI - Creative Design Assistant')} />
        <meta name="twitter:description" content={t('lovartStyle.seo.twitterDescription', 'Professional AI-powered design assistant inspired by Lovart AI.')} />
        <meta name="twitter:image" content="https://emojihand.com/images/lovart-style-og.jpg" />
      </Head>
      <div className="min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-blue-600">
        <UnifiedNavBar />
        <LovartStyleClient session={session} locale={params.locale} />
        <Footer />
      </div>
    </>
  );
} 