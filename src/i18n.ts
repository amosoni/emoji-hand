import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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

const languages = ['en','zh','es','fr','ja','ko','pt','de','it','ru'];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
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
    fallbackLng: 'en',
    supportedLngs: languages,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

// 只允许切换到支持的语言，否则强制切en
if (!languages.includes(i18n.language)) {
  void i18n.changeLanguage('en');
}

export default i18n; 