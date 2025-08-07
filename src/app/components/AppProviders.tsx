"use client";
import { SessionProvider } from "next-auth/react";
import { LoginModalProvider } from "@/components/LoginModalContext";
import i18n from "@/i18n";
import { useEffect } from "react";
import LoginModal from "@/components/LoginModal";
import { TRPCReactProvider } from '@/trpc/react';
import I18nProvider from './I18nProvider';
import type { Session } from "next-auth";

export default function AppProviders({ children, locale }: { children: React.ReactNode, locale: string }) {
  useEffect(() => {
    const changeLanguage = async () => {
      console.log('=== APP PROVIDERS DEBUG ===');
      console.log('locale =', locale);
      console.log('i18n.isInitialized =', i18n.isInitialized);
      console.log('i18n.language =', i18n.language);
      console.log('==========================');
      
      // 确保locale是有效的语言代码
      const validLocale = locale && ['en', 'zh', 'zh-CN', 'es', 'fr', 'ja', 'ko', 'pt', 'de', 'it', 'ru'].includes(locale) 
        ? locale 
        : 'en';
      
      if (validLocale && i18n.isInitialized) {
        try {
          // 清除可能存在的语言缓存
          if (typeof window !== 'undefined') {
            localStorage.removeItem('i18nextLng');
            sessionStorage.removeItem('i18nextLng');
          }
          
          // 检查当前语言是否已经是目标语言
          if (i18n.language !== validLocale) {
            console.log(`AppProviders: 切换语言从 ${i18n.language} 到 ${validLocale}`);
            await i18n.changeLanguage(validLocale);
            console.log(`AppProviders: 语言已切换到: ${validLocale}, 当前语言: ${i18n.language}`);
            // 强制重新渲染
            window.dispatchEvent(new Event('languageChanged'));
          } else {
            console.log(`AppProviders: 语言已经是 ${validLocale}，无需切换`);
          }
        } catch (error) {
          console.error("AppProviders: 切换语言失败：", error);
          // 如果切换失败，回退到默认语言
          try {
            await i18n.changeLanguage('en');
          } catch (fallbackError) {
            console.error("AppProviders: 回退到默认语言也失败：", fallbackError);
          }
        }
      } else {
        console.log('AppProviders: 条件不满足，validLocale =', validLocale, 'i18n.isInitialized =', i18n.isInitialized);
      }
    };

    // 如果 i18n 已经初始化，立即切换语言
    if (i18n.isInitialized) {
      void changeLanguage();
    } else {
      console.log('AppProviders: i18n 未初始化，等待初始化...');
      // 等待 i18n 初始化完成后再切换语言
      const timer = setTimeout(() => {
        void changeLanguage();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [locale]);
  
  return (
    <I18nProvider>
      <SessionProvider>
        <LoginModalProvider>
          <TRPCReactProvider>
            <LoginModal />
            {children}
          </TRPCReactProvider>
        </LoginModalProvider>
      </SessionProvider>
    </I18nProvider>
  );
} 