import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export function useSafeTranslation() {
  try {
    return useTranslation();
  } catch (error) {
    // 如果 useTranslation 失败，返回一个安全的 fallback
    console.warn('i18n not initialized, using fallback translation');
    return {
      t: (key: string) => key,
      i18n: i18n,
      ready: false,
    };
  }
} 