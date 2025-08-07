"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { api } from '~/utils/api';

interface EmojiPack {
  url: string | null;
  style: string | undefined;
  description: string;
}

interface EmojiGeneratorProps {
  session: Session | null;
  showLoginModal: () => void;
  locale?: string;
}

export default function EmojiGenerator({ session, showLoginModal, locale }: EmojiGeneratorProps) {
  const { t, i18n } = useTranslation();
  const [ready, setReady] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedPacks, setGeneratedPacks] = useState<EmojiPack[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('cute');
  const [batchSize, setBatchSize] = useState(3);
  const [customPrompt, setCustomPrompt] = useState('');
  const [includeText, setIncludeText] = useState(false);
  const [customText, setCustomText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 使用tRPC API
  const emojiPackMutation = api.emojiPack.generateEmojiPack.useMutation({
    onSuccess: (data) => {
      setGeneratedPacks(data.emojiPacks ?? []);
      setAnalysis(data.designAdvice ?? null);
      setIsGenerating(false);
      setError(null);
    },
    onError: (error) => {
      // 检查是否是翻译键
      const errorKey = error.message;
      if (errorKey && ['apiModelDeprecated', 'apiRateLimit', 'apiQuotaExceeded', 'imageAnalysisFailed'].includes(errorKey)) {
        setError(t(`emojiGenerator.error.${errorKey}`, error.message));
      } else if (errorKey === 'User not found') {
        setError(t('emojiGenerator.error.loginRequired', '请登录后生成表情包'));
      } else {
        setError(error.message);
      }
      setIsGenerating(false);
    }
  });

  const { data: usageStats, isLoading: usageLoading, refetch: refetchUsage } = api.usageLimits.getUserUsageStats.useQuery(
    undefined,
    { 
      enabled: true, // 总是启用查询，无论用户是否登录
      refetchInterval: 5000 // 每5秒刷新一次
    }
  );
  const recordUsageMutation = api.usageLimits.recordServiceUsage.useMutation();

  useEffect(() => {
    console.log('EmojiGenerator: locale =', locale, 'Current i18n language =', i18n.language);
    // 移除强制语言切换，让AppProviders处理
    setReady(true);
  }, [locale, i18n]);

  if (!ready) return null;

  // 在 ready 状态后创建 styles，确保语言已切换
  const styles = [
    { id: 'cute', name: t('emojiGenerator.styles.cute', 'Cute Style'), emoji: '🥰', description: t('emojiGenerator.styleDescriptions.cute', 'Pink color palette with rounded lines, perfect for adorable and kawaii expressions.') },
    { id: 'funny', name: t('emojiGenerator.styles.funny', 'Funny Style'), emoji: '😂', description: t('emojiGenerator.styleDescriptions.funny', 'Exaggerated expressions with humorous elements, great for memes and comedy.') },
    { id: 'cool', name: t('emojiGenerator.styles.cool', 'Cool Style'), emoji: '😎', description: t('emojiGenerator.styleDescriptions.cool', 'Dark color scheme with fashionable elements, perfect for trendy and stylish expressions.') },
    { id: 'savage', name: t('emojiGenerator.styles.savage', 'Savage Style'), emoji: '😏', description: t('emojiGenerator.styleDescriptions.savage', 'Sharp expressions with sarcastic elements, ideal for witty and bold statements.') },
    { id: 'genz', name: t('emojiGenerator.styles.genz', 'GenZ Style'), emoji: '💅', description: t('emojiGenerator.styleDescriptions.genz', 'Trendy elements with youthful expressions, perfect for modern social media.') },
    { id: 'tiktok', name: t('emojiGenerator.styles.tiktok', 'TikTok Style'), emoji: '🎵', description: t('emojiGenerator.styleDescriptions.tiktok', 'Popular elements with short video aesthetics, great for viral content.') },
    { id: 'vintage', name: t('emojiGenerator.styles.vintage', 'Vintage Style'), emoji: '📷', description: t('emojiGenerator.styleDescriptions.vintage', 'Retro color palette with classic elements, perfect for nostalgic designs.') },
    { id: 'minimalist', name: t('emojiGenerator.styles.minimalist', 'Minimalist Style'), emoji: '⚪', description: t('emojiGenerator.styleDescriptions.minimalist', 'Clean lines with single color, perfect for minimalist designs.') }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError(t('emojiGenerator.error.invalidFile', '请上传图片文件'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(t('emojiGenerator.error.fileTooLarge', '图片大小不能超过5MB'));
        return;
      }

      setUploadedFile(file);
      setError(null);
      setGeneratedPacks([]);
      setAnalysis(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateEmojiPacks = async () => {
    // 检查用户是否已登录
    if (!session) {
      showLoginModal();
      return;
    }

    if (!uploadedFile) {
      setError(t('emojiGenerator.error.noImage', '请先上传图片'));
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // 将文件转换为base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        // 调用tRPC API
        emojiPackMutation.mutate({
          imageUrl,
          packCount: batchSize,
          style: selectedStyle,
          emotion: includeText ? customText : undefined,
          customPrompt: customPrompt || undefined,
          targetAudience: undefined,
          commercialUse: false
        });
      };
      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      console.error(t('emojiGenerator.error.consoleError', '生成表情包失败:'), error);
      setError(error instanceof Error ? error.message : t('emojiGenerator.error.retryLater', '生成失败，请稍后重试'));
      setIsGenerating(false);
    }
  };

  const downloadPack = async (pack: EmojiPack) => {
    if (!pack.url) return;
    
    try {
      // 获取图片数据
      const response = await fetch(pack.url);
      const blob = await response.blob();
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `emoji-pack-${pack.style ?? 'unknown'}-${Date.now()}.png`;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理URL对象
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // 如果fetch失败，回退到直接链接方式
      const link = document.createElement('a');
      link.href = pack.url;
      link.download = `emoji-pack-${pack.style ?? 'unknown'}-${Date.now()}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetForm = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setGeneratedPacks([]);
    setAnalysis(null);
    setError(null);
    setCustomPrompt('');
    setIncludeText(false);
    setCustomText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">
              {t('emojiGenerator.title', 'Emoji Pack Generator - Lovart AI Style')}
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              {t('emojiGenerator.subtitle', 'Upload an image and AI will generate beautiful emoji packs inspired by Lovart AI design principles')}
            </p>
          </div>

          {/* 使用量显示 */}
          {session?.user && usageStats && (
            <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <span className="text-sm">
                    {t('profile.imageGenerationUsesToday', 'Image generation uses today')}: 
                    <span className="ml-1 font-semibold text-blue-400">{usageStats.usage.imageGeneration.used}</span> / 
                    <span className="ml-1 font-semibold text-green-400">{usageStats.usage.imageGeneration.limit}</span>
                  </span>
                  <span className="text-sm">
                    {t('profile.remainingImageGeneration', 'Remaining image generations')}: 
                    <span className="ml-1 font-semibold text-yellow-400">{usageStats.usage.imageGeneration.remaining}</span>
                  </span>
                </div>
                <div className="w-32 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (usageStats.usage.imageGeneration.used / usageStats.usage.imageGeneration.limit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold mb-4">
                {t('emojiGenerator.uploadTitle', 'Upload Image')}
              </h2>
              
              <div 
                className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center cursor-pointer hover:border-white/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="max-w-full h-48 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-sm text-white">
                      {t('emojiGenerator.imageUploaded', 'Image uploaded, click to reselect')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-lg font-medium text-white">
                      {t('emojiGenerator.uploadHint', 'Click to upload or drag image here')}
                    </p>
                    <p className="text-sm text-white/80">
                      {t('emojiGenerator.uploadLimit', 'Supports JPG, PNG, max 5MB')}
                    </p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Style Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold mb-4">
                {t('emojiGenerator.styleTitle', 'Choose Style')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 rounded-lg border-2 transition-all flex-shrink-0 ${
                      selectedStyle === style.id
                        ? 'border-white bg-purple-500/40 shadow-lg shadow-purple-500/25'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                  >
                    <div className="text-lg mb-1">{style.emoji}</div>
                    <div className="font-medium text-xs text-white">{style.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Controls */}
          <div className="mt-8 space-y-6">
            {/* Batch Size Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">{t('emojiGenerator.batchSize', 'Batch Size')}</h3>
              <div className="flex gap-3">
                {[1, 3, 5].map((size) => (
                  <button
                    key={size}
                    onClick={() => setBatchSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-all text-white ${
                      batchSize === size
                        ? 'border-white bg-purple-500/40 shadow-lg shadow-purple-500/25'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                  >
                    {size} {size > 1 ? t('emojiGenerator.packs', 'Packs') : t('emojiGenerator.pack', 'Pack')}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">
                {t('emojiGenerator.promptTitle', 'Custom Prompt (Optional)')}
              </h3>
                              <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={t('emojiGenerator.promptPlaceholder', 'Describe the emoji pack effect you want...')}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
                  rows={3}
                />
            </div>

            {/* Text Options */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">
                {t('emojiGenerator.textOptions', 'Text Options')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="includeText"
                    checked={includeText}
                    onChange={(e) => setIncludeText(e.target.checked)}
                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/30 rounded focus:ring-purple-500 focus:ring-2 checked:bg-purple-500 checked:border-purple-500"
                  />
                  <label htmlFor="includeText" className="text-white cursor-pointer">
                    {t('emojiGenerator.includeText', 'Include text in emoji pack')}
                  </label>
                </div>
                
                {includeText && (
                  <div className="space-y-3">
                    <label className="block text-sm text-white">
                      {t('emojiGenerator.customTextLabel', 'Custom text (optional):')}
                    </label>
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder={t('emojiGenerator.customTextPlaceholder', 'Enter text to add to emoji pack...')}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-purple-400"
                    />
                    <p className="text-xs text-white/80">
                      {t('emojiGenerator.textHint', 'Leave empty to let AI generate appropriate text based on the image and style')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateEmojiPacks}
              disabled={isGenerating || !uploadedFile}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('emojiGenerator.generating', 'AI Generating...')}
                </div>
              ) : (
                t('emojiGenerator.generate', 'Generate Emoji Packs')
              )}
            </button>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300">
                {error}
              </div>
            )}

            {/* Subscription Info - 只在免费用户时显示 */}
            {(!session?.user?.subscriptionPlan || session.user.subscriptionPlan === 'free') && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">💎</span>
                  <h4 className="font-semibold text-yellow-300">
                    {t('subscriptionInfo', 'Subscription Info')}
                  </h4>
                </div>
                <p className="text-sm text-yellow-200/90 mb-3">
                  {t('subscriptionDesc', 'Free users can generate 3 packs per day. Upgrade to unlock more features!')}
                </p>
                <Link
                  href={`/${locale}/emoji-pack-subscription`}
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('upgradeNow', 'Upgrade Now')}
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="mt-8 space-y-6">
            {generatedPacks.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {t('emojiGenerator.resultTitle', 'Generated Results')}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {t('emojiGenerator.reset', 'Reset')}
                  </button>
                </div>
                <div className="grid gap-4">
                  {generatedPacks.map((pack, idx) => (
                    <div key={pack.url ?? idx} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
                      <img 
                        src={pack.url ?? ''} 
                        alt=""
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => downloadPack(pack)}
                        className="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        {t('emojiGenerator.download', 'Download')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 