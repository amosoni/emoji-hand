"use client";
import React, { useEffect } from "react";
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import i18n from "@/i18n";
import { useTranslation } from 'react-i18next';

export default function CopyrightPage() {
  const { t } = useTranslation();
  return (
    <div key={i18n.language} className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500 flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full mx-auto p-8 mt-8 text-white">
          <h1 className="text-3xl font-bold mb-4">{t('copyrightTitle', '版权与商标声明')}</h1>
          <p className="mb-4">{t('copyrightContent', 'Emoji Hand 及其标识归 emojihand.com 所有。部分内容、字体或图标可能来自第三方，版权归原作者所有。未经授权，禁止擅自使用、复制或分发本网站内容。')}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
} 