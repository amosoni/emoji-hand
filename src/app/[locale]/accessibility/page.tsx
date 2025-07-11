"use client";
import React, { useEffect } from "react";
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import i18n from "@/i18n";
import { useTranslation } from 'react-i18next';

export default function AccessibilityPage() {
  const { t } = useTranslation();
  return (
    <div key={i18n.language} className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500 flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full mx-auto p-8 mt-8 text-white">
          <h1 className="text-3xl font-bold mb-4">{t('accessibilityTitle', '可访问性声明')}</h1>
          <p className="mb-4">{t('accessibilityContent', '本网站致力于为所有用户（包括残障人士）提供无障碍访问体验。如有无障碍建议，请通过客服邮箱联系我们。')}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
} 