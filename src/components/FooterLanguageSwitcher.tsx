"use client";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const languages = [
  { code: 'en', name: 'English', country: 'us' },
  { code: 'zh', name: '中文', country: 'cn' },
  { code: 'es', name: 'Español', country: 'es' },
  { code: 'fr', name: 'Français', country: 'fr' },
  { code: 'ja', name: '日本語', country: 'jp' },
  { code: 'ko', name: '한국어', country: 'kr' },
  { code: 'pt', name: 'Português', country: 'br' },
  { code: 'de', name: 'Deutsch', country: 'de' },
  { code: 'it', name: 'Italiano', country: 'it' },
  { code: 'ru', name: 'Русский', country: 'ru' },
];

export default function FooterLanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]!); // 默认设置为英语
  
  // 从URL路径获取当前语言
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/');
      const localeFromPath = pathSegments[1];
      
      // 查找匹配的语言
      const matchedLanguage = languages.find(l => l.code === localeFromPath);
      if (matchedLanguage) {
        setCurrentLanguage(matchedLanguage);
        // 确保i18n语言与URL路径一致
        if (i18n.language !== localeFromPath) {
          void i18n.changeLanguage(localeFromPath);
        }
      } else {
        // 如果没有找到匹配的语言，使用默认语言
        setCurrentLanguage(languages[0]!); // 英语
        if (i18n.language !== 'en') {
          void i18n.changeLanguage('en');
        }
      }
    }
  }, [pathname, i18n]);

  const handleLanguageClick = () => {
    // 简单的语言切换逻辑：循环到下一个语言
    const currentIndex = languages.findIndex(l => l.code === currentLanguage.code);
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLang = languages[nextIndex]!;
    
    if (!pathname || !nextLang) return;
    
    // 获取当前路径的语言部分
    const pathSegments = pathname.split('/');
    const currentLocale = pathSegments[1];
    
    // 如果当前路径没有语言代码，添加语言代码
    let newPath;
    if (!currentLocale || !languages.find(l => l.code === currentLocale)) {
      newPath = `/${nextLang.code}${pathname === '/' ? '' : pathname}`;
    } else {
      newPath = pathname.replace(`/${currentLocale}`, `/${nextLang.code}`);
    }
    
    // 切换语言并导航
    void i18n.changeLanguage(nextLang.code);
    router.push(newPath);
  };

  return (
    <button
      onClick={handleLanguageClick}
      className="flex items-center justify-center px-2 py-2 rounded-lg bg-white/20 font-bold w-full"
    >
      <img 
        src={`https://flagcdn.com/w20/${currentLanguage.country}.png`} 
        alt={currentLanguage.name} 
        width={24} 
        height={18} 
        className="rounded-sm" 
      />
    </button>
  );
} 