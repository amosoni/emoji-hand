"use client";
import { Listbox } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
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

function getFlagUrl(country: string) {
  return `https://flagcdn.com/w20/${country}.png`;
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]!);

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
        setCurrentLanguage(languages[0]!);
        if (i18n.language !== 'en') {
          void i18n.changeLanguage('en');
        }
      }
    }
  }, [pathname, i18n]);

  const handleLanguageChange = async (lang: typeof languages[0]) => {
    // 检查 pathname 是否存在
    if (!pathname) {
      console.error('pathname is null');
      return;
    }
    
    // 获取当前路径的语言部分
    const pathSegments = pathname.split('/');
    const currentLocale = pathSegments[1];
    
    // 构建新路径
    const newPath = pathname.replace(`/${currentLocale}`, `/${lang.code}`);
    
    // 切换语言并导航
    await i18n.changeLanguage(lang.code);
    router.push(newPath);
  };

  return (
    <div className="flex items-center justify-center relative">
      <Listbox value={currentLanguage} onChange={handleLanguageChange}>
        <Listbox.Button className="flex items-center justify-center px-2 py-2 rounded-lg bg-white/20 font-bold w-full">
          <img src={getFlagUrl(currentLanguage.country)} alt={currentLanguage.name} width={24} height={18} className="rounded-sm" />
        </Listbox.Button>
        <Listbox.Options className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg mb-1 absolute bottom-full left-0 w-full z-10">
          {languages.map(lang => (
            <Listbox.Option key={lang.code} value={lang} className="cursor-pointer px-2 py-2 hover:bg-pink-100 flex items-center justify-center">
              <img src={getFlagUrl(lang.country)} alt={lang.name} width={24} height={18} className="rounded-sm" />
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
} 