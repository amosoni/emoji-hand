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
    lng: 'en', // 默认语言为英文
    fallbackLng: 'en', // 回退语言为英文
    supportedLngs: languages,
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
    },
    debug: false,
    initImmediate: false,
    // 禁用自动语言保存
    saveMissing: false,
    saveMissingTo: 'fallback',
    // 禁用语言检测
    detection: {
      order: [],
      caches: [],
    },
  });

// 添加调试信息
console.log('=== I18N INITIALIZATION ===');
console.log('Default language:', i18n.language);
console.log('Fallback language:', i18n.options.fallbackLng);
console.log('Supported languages:', i18n.options.supportedLngs);
console.log('==========================');

export default i18n; 