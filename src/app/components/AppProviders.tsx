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
    if (locale) {
      // 延迟执行以确保 i18n 已经初始化
      const timer = setTimeout(() => {
        void (async () => {
          try {
            await i18n.changeLanguage(locale);
            console.log(`Language changed to: ${locale}, i18n.language is now: ${i18n.language}`);
            // 强制重新渲染
            window.dispatchEvent(new Event('languageChanged'));
          } catch (error) {
            console.error("切换语言失败：", error);
          }
        })();
      }, 200);
      
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