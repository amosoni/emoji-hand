"use client";
import React from "react";
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next';

export default function TermsOfService() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500">
      <NavBar />
      <div className="max-w-3xl mx-auto p-8 mt-8 text-white">
        <h1 className="text-3xl font-bold mb-4">{t('terms.title', 'Terms of Service')}</h1>
        <p className="mb-4">{t('terms.intro', 'This is the terms of service page.')}</p>
      </div>
      <Footer />
    </div>
  );
} 