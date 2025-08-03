"use client";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useState } from "react";

// 多语言加载提示
const loadingMessages = {
  en: "Loading multi-language support...",
  zh: "正在加载多语言支持...",
  ja: "多言語サポートを読み込み中...",
  ko: "다국어 지원을 로드하는 중...",
  es: "Cargando soporte multiidioma...",
  fr: "Chargement du support multilingue...",
  pt: "Carregando suporte multilíngue...",
  de: "Mehrsprachige Unterstützung wird geladen...",
  it: "Caricamento supporto multilingue...",
  ru: "Загрузка многоязычной поддержки..."
};

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages.en);

  useEffect(() => {
    const checkInitialization = async () => {
      // 根据当前语言设置加载提示
      const currentLang = i18n.language || 'en';
      const message = loadingMessages[currentLang as keyof typeof loadingMessages] || loadingMessages.en;
      setLoadingMessage(message);

      // 等待 i18n 初始化完成
      if (i18n.isInitialized) {
        setIsReady(true);
      } else {
        // 如果还没初始化，等待初始化事件
        await new Promise<void>((resolve) => {
          const checkReady = () => {
            if (i18n.isInitialized) {
              resolve();
            } else {
              setTimeout(checkReady, 50);
            }
          };
          checkReady();
        });
        setIsReady(true);
      }
    };
    
    void checkInitialization();
  }, []);

  // 如果 i18n 还没有准备好，显示加载状态
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">{loadingMessage}</div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 