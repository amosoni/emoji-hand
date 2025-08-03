import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 静态导入翻译文件
import zh from '../public/locales/zh/translation.json';
import en from '../public/locales/en/translation.json';
import es from '../public/locales/es/translation.json';
import fr from '../public/locales/fr/translation.json';
import ja from '../public/locales/ja/translation.json';
import ko from '../public/locales/ko/translation.json';
import pt from '../public/locales/pt/translation.json';
import de from '../public/locales/de/translation.json';
import it from '../public/locales/it/translation.json';
import ru from '../public/locales/ru/translation.json';

const languages = ['en','zh','zh-CN','es','fr','ja','ko','pt','de','it','ru'];

// 初始化 i18n 实例
void i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      'zh-CN': { translation: zh },
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      ja: { translation: ja },
      ko: { translation: ko },
      pt: { translation: pt },
      de: { translation: de },
      it: { translation: it },
      ru: { translation: ru },
    },
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: languages,
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
    },
    debug: false,
    initImmediate: false,
  });

export default i18n; 