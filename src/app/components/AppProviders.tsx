"use client";
import { SessionProvider } from "next-auth/react";
import { LoginModalProvider } from "@/components/LoginModalContext";
import i18n from "@/i18n";
import { useEffect } from "react";
import LoginModal from "@/components/LoginModal";
import { TRPCReactProvider } from '@/trpc/react';
import I18nProvider from './I18nProvider';

export default function AppProviders({ children, locale }: { children: React.ReactNode, locale: string }) {
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      void (async () => {
        try {
          await i18n.changeLanguage(locale);
        } catch (error) {
          console.error("切换语言失败：", error);
        }
      })();
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