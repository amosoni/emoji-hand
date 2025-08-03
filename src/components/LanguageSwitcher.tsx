"use client";
import { Listbox } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
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

function getFlagUrl(country: string) {
  return `https://flagcdn.com/w20/${country}.png`;
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const selected = (languages.find(l => l.code === i18n.language) ?? languages[0])!;

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
      <Listbox value={selected} onChange={handleLanguageChange}>
        <Listbox.Button className="flex items-center justify-center px-2 py-2 rounded-lg bg-white/20 font-bold w-full">
          <img src={getFlagUrl(selected.country)} alt={selected.name} width={24} height={18} className="rounded-sm" />
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