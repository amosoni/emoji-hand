"use client";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function TestI18n() {
  const { t, i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(i18n.isInitialized);
  }, [i18n.isInitialized]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">多语言测试页面</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-100 rounded">
            <h2 className="text-xl font-semibold mb-2">i18n 状态</h2>
            <p><strong>初始化状态:</strong> {isReady ? '✅ 已初始化' : '❌ 未初始化'}</p>
            <p><strong>当前语言:</strong> {i18n.language}</p>
            <p><strong>支持的语言:</strong> {Array.isArray(i18n.options.supportedLngs) ? i18n.options.supportedLngs.join(', ') : '未设置'}</p>
          </div>

          <div className="p-4 bg-green-100 rounded">
            <h2 className="text-xl font-semibold mb-2">翻译测试</h2>
            <p><strong>应用标题:</strong> {t('appTitle', 'emoji hand')}</p>
            <p><strong>应用标语:</strong> {t('appSlogan', 'The Ultimate Emoji Translator')}</p>
            <p><strong>翻译按钮:</strong> {t('translateButton', 'Translate')}</p>
            <p><strong>分享按钮:</strong> {t('shareButton', 'Share')}</p>
          </div>

          <div className="p-4 bg-yellow-100 rounded">
            <h2 className="text-xl font-semibold mb-2">语言切换测试</h2>
            <div className="flex gap-2 flex-wrap">
              {['en', 'zh', 'es', 'fr', 'ja', 'ko'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`px-4 py-2 rounded ${
                    i18n.language === lang 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-purple-100 rounded">
            <h2 className="text-xl font-semibold mb-2">导航测试</h2>
            <p><strong>首页:</strong> {t('nav.home', 'Home')}</p>
            <p><strong>表情生成器:</strong> {t('nav.emojiGenerator', 'Emoji Generator')}</p>
            <p><strong>登录:</strong> {t('login.button', 'Login')}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 