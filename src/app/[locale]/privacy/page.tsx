"use client";
import React from "react";
import UnifiedNavBar from '../../components/UnifiedNavBar';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500">
      <UnifiedNavBar />
      <div className="max-w-3xl mx-auto p-8 mt-8 text-white">
        <h1 className="text-3xl font-bold mb-4">{t('privacy.title', 'Privacy Policy')}</h1>
        <p className="mb-4">{t('privacy.intro', 'This is the privacy policy page.')}</p>
      </div>
      <Footer />
    </div>
  );
} 