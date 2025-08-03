"use client";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from 'next/navigation';

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
  
  const getCurrentFlag = () => {
    const currentLang = languages.find(l => l.code === i18n.language);
    return currentLang?.country ?? 'us';
  };

  const handleLanguageClick = () => {
    // 简单的语言切换逻辑：循环到下一个语言
    const currentIndex = languages.findIndex(l => l.code === i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLang = languages[nextIndex];
    
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
    <div className="w-8 h-6">
      <img 
        src={`https://flagcdn.com/w20/${getCurrentFlag()}.png`} 
        alt="Language" 
        width={32} 
        height={24} 
        className="rounded-sm cursor-pointer hover:opacity-80 transition-opacity"
        title="Click to change language"
        onClick={handleLanguageClick}
      />
    </div>
  );
} 