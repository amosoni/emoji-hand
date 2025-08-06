import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义缺失的翻译键和对应的翻译
const missingTranslations = {
  en: {
    "profile.subscriptionPlan": "Subscription Plan",
    "profile.subscriptionExpireAt": "Subscription until",
    "profile.translationUsesToday": "Translation uses today",
    "profile.remainingTranslation": "Remaining translations",
    "profile.imageGenerationUsesToday": "Image generation uses today",
    "profile.remainingImageGeneration": "Remaining image generations",
    "profile.notLoggedIn": "You are not logged in."
  },
  zh: {
    "profile.subscriptionPlan": "订阅计划",
    "profile.subscriptionExpireAt": "订阅到期时间",
    "profile.translationUsesToday": "今日翻译使用次数",
    "profile.remainingTranslation": "剩余翻译次数",
    "profile.imageGenerationUsesToday": "今日图片生成使用次数",
    "profile.remainingImageGeneration": "剩余图片生成次数",
    "profile.notLoggedIn": "您尚未登录。"
  },
  es: {
    "profile.subscriptionPlan": "Plan de Suscripción",
    "profile.subscriptionExpireAt": "Suscripción hasta",
    "profile.translationUsesToday": "Traducciones usadas hoy",
    "profile.remainingTranslation": "Traducciones restantes",
    "profile.imageGenerationUsesToday": "Generaciones de imágenes usadas hoy",
    "profile.remainingImageGeneration": "Generaciones de imágenes restantes",
    "profile.notLoggedIn": "No has iniciado sesión."
  },
  fr: {
    "profile.subscriptionPlan": "Plan d'Abonnement",
    "profile.subscriptionExpireAt": "Abonnement jusqu'au",
    "profile.translationUsesToday": "Traductions utilisées aujourd'hui",
    "profile.remainingTranslation": "Traductions restantes",
    "profile.imageGenerationUsesToday": "Générations d'images utilisées aujourd'hui",
    "profile.remainingImageGeneration": "Générations d'images restantes",
    "profile.notLoggedIn": "Vous n'êtes pas connecté."
  },
  ja: {
    "profile.subscriptionPlan": "サブスクリプションプラン",
    "profile.subscriptionExpireAt": "サブスクリプション期限",
    "profile.translationUsesToday": "今日の翻訳使用回数",
    "profile.remainingTranslation": "残り翻訳回数",
    "profile.imageGenerationUsesToday": "今日の画像生成使用回数",
    "profile.remainingImageGeneration": "残り画像生成回数",
    "profile.notLoggedIn": "ログインしていません。"
  },
  ko: {
    "profile.subscriptionPlan": "구독 플랜",
    "profile.subscriptionExpireAt": "구독 만료일",
    "profile.translationUsesToday": "오늘 번역 사용 횟수",
    "profile.remainingTranslation": "남은 번역 횟수",
    "profile.imageGenerationUsesToday": "오늘 이미지 생성 사용 횟수",
    "profile.remainingImageGeneration": "남은 이미지 생성 횟수",
    "profile.notLoggedIn": "로그인되지 않았습니다."
  },
  pt: {
    "profile.subscriptionPlan": "Plano de Assinatura",
    "profile.subscriptionExpireAt": "Assinatura até",
    "profile.translationUsesToday": "Traduções usadas hoje",
    "profile.remainingTranslation": "Traduções restantes",
    "profile.imageGenerationUsesToday": "Gerações de imagens usadas hoje",
    "profile.remainingImageGeneration": "Gerações de imagens restantes",
    "profile.notLoggedIn": "Você não está logado."
  },
  de: {
    "profile.subscriptionPlan": "Abonnement-Plan",
    "profile.subscriptionExpireAt": "Abonnement bis",
    "profile.translationUsesToday": "Übersetzungen heute verwendet",
    "profile.remainingTranslation": "Verbleibende Übersetzungen",
    "profile.imageGenerationUsesToday": "Bildgenerierungen heute verwendet",
    "profile.remainingImageGeneration": "Verbleibende Bildgenerierungen",
    "profile.notLoggedIn": "Sie sind nicht angemeldet."
  },
  it: {
    "profile.subscriptionPlan": "Piano di Abbonamento",
    "profile.subscriptionExpireAt": "Abbonamento fino al",
    "profile.translationUsesToday": "Traduzioni utilizzate oggi",
    "profile.remainingTranslation": "Traduzioni rimanenti",
    "profile.imageGenerationUsesToday": "Generazioni di immagini utilizzate oggi",
    "profile.remainingImageGeneration": "Generazioni di immagini rimanenti",
    "profile.notLoggedIn": "Non sei loggato."
  },
  ru: {
    "profile.subscriptionPlan": "План подписки",
    "profile.subscriptionExpireAt": "Подписка до",
    "profile.translationUsesToday": "Переводов использовано сегодня",
    "profile.remainingTranslation": "Оставшихся переводов",
    "profile.imageGenerationUsesToday": "Генераций изображений использовано сегодня",
    "profile.remainingImageGeneration": "Оставшихся генераций изображений",
    "profile.notLoggedIn": "Вы не вошли в систему."
  }
};

// 语言代码映射
const languageMap = {
  'en': 'en',
  'zh': 'zh',
  'es': 'es',
  'fr': 'fr',
  'ja': 'ja',
  'ko': 'ko',
  'pt': 'pt',
  'de': 'de',
  'it': 'it',
  'ru': 'ru'
};

// 为每个语言添加缺失的翻译
Object.keys(languageMap).forEach(langCode => {
  const langDir = languageMap[langCode];
  const translationFile = path.join(__dirname, '..', 'public', 'locales', langDir, 'translation.json');
  
  if (fs.existsSync(translationFile)) {
    try {
      const translationData = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
      
      // 添加缺失的翻译
      const missingKeys = missingTranslations[langCode];
      if (missingKeys) {
        Object.keys(missingKeys).forEach(key => {
          if (!translationData[key]) {
            translationData[key] = missingKeys[key];
            console.log(`Added ${key} to ${langCode}`);
          }
        });
      }
      
      // 写回文件
      fs.writeFileSync(translationFile, JSON.stringify(translationData, null, 2));
      console.log(`Updated ${langCode} translation file`);
    } catch (error) {
      console.error(`Error processing ${langCode}:`, error.message);
    }
  } else {
    console.log(`Translation file not found for ${langCode}`);
  }
});

console.log('Translation update completed!'); 