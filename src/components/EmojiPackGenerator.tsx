"use client";

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';

interface EmojiPackResult {
  imageAnalysis: string;
  emojiPacks: Array<{
    url: string | null;
    style: string | undefined;
    description: string;
  }>;
  designAdvice: string | null | undefined;
  targetAudience?: string;
  commercialUse: boolean;
  remainingCredits: number;
}

export default function EmojiPackGenerator() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [style, setStyle] = useState('');
  const [emotion, setEmotion] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [commercialUse, setCommercialUse] = useState(false);
  const [packCount, setPackCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<EmojiPackResult | null>(null);

  // 获取订阅状态
  const { data: subscription } = api.emojiPackSubscription.getSubscription.useQuery(
    undefined,
    { enabled: !!session }
  );
  
  // 获取使用次数统计
  const { data: usageStats } = api.usageLimits.getUserUsageStats.useQuery(
    undefined,
    { enabled: !!session }
  );
  
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API调用
  const emojiPackMutation = api.emojiPack.generateEmojiPack.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setIsGenerating(false);
      setError(null);
    },
    onError: (error) => {
      // 处理每日限制超出的错误信息
      if (error.message.includes('Daily limit exceeded')) {
        const match = error.message.match(/You can generate (\d+) more packs today/);
        if (match) {
          const remaining = match[1];
          setError(t('emojiGenerator.error.dailyLimitExceeded', 'Daily limit exceeded') + '. ' + 
                   t('emojiGenerator.error.remainingPacks', { remaining }) + '. ' + 
                   t('emojiGenerator.error.upgradeForMore', 'Please upgrade your subscription for more daily usage.'));
        } else {
          setError(t('emojiGenerator.error.dailyLimitExceeded', 'Daily limit exceeded') + '. ' + 
                   t('emojiGenerator.error.upgradeForMore', 'Please upgrade your subscription for more daily usage.'));
        }
      } else {
        setError(error.message);
      }
      setIsGenerating(false);
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError(t('emojiGenerator.error.invalidFile', 'Please upload an image file'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError(t('emojiGenerator.error.fileTooLarge', 'Image size cannot exceed 10MB'));
        return;
      }

      setUploadedFile(file);
      setError(null);
      setResult(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedFile) {
      setError(t('emojiGenerator.error.noImage', 'Please upload an image first'));
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // 将文件转换为base64或上传到服务器获取URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        
        emojiPackMutation.mutate({
          imageUrl,
          style: style || undefined,
          emotion: emotion || undefined,
          targetAudience: targetAudience || undefined,
          commercialUse,
          packCount
        });
      };
      reader.readAsDataURL(uploadedFile);
    } catch (err) {
      setError(t('emojiGenerator.error.generationFailed', 'Generation failed'));
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setStyle('');
    setEmotion('');
    setTargetAudience('');
    setCommercialUse(false);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          🎭 表情包生成器
        </h1>
        
        <p className="text-white/80 text-center mb-8">
          上传一张图片，AI将分析图片内容并生成5个不同风格的表情包设计
        </p>

        {/* 使用次数显示 */}
        {session && usageStats && (
          <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between text-white">
              <span className="text-sm">{t('usage.imageGeneration', 'Image Generation Usage')}: {usageStats.usage.imageGeneration.used} / {usageStats.usage.imageGeneration.limit}</span>
              <div className="w-32 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.max(0, Math.min(100, (usageStats.usage.imageGeneration.used / usageStats.usage.imageGeneration.limit) * 100))}%` 
                  }}
                ></div>
              </div>
            </div>
            <div className="mt-2 text-xs text-white/70">
              {t('usage.remaining', 'Remaining')}: {usageStats.usage.imageGeneration.remaining}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/80 text-white rounded-lg text-center">
            {error}
          </div>
        )}

        {/* 图片上传区域 */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-4">上传图片</label>
          <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {!uploadedImage ? (
              <div>
                <div className="text-6xl mb-4">📸</div>
                <p className="text-white/80 mb-4">点击上传图片或拖拽到此处</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
                >
                  选择图片
                </button>
              </div>
            ) : (
              <div>
                <img 
                  src={uploadedImage} 
                  alt="上传的图片" 
                  className="max-w-full max-h-64 mx-auto rounded-lg mb-4"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                >
                  重新选择
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 设置选项 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-white font-semibold mb-2">设计风格</label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="例如：卡通、写实、简约"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20"
            />
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">情感风格</label>
            <input
              type="text"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="例如：开心、惊讶、搞笑"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-white font-semibold mb-2">目标受众</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="例如：年轻人、学生、职场人士"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/20"
            />
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">生成数量</label>
            <select
              value={packCount}
              onChange={(e) => setPackCount(Number(e.target.value))}
              className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/20"
            >
              <option value={1}>1个表情包 ($0.06)</option>
              <option value={2}>2个表情包 ($0.10)</option>
              <option value={3}>3个表情包 ($0.14)</option>
              <option value={4}>4个表情包 ($0.18)</option>
              <option value={5}>5个表情包 ($0.22)</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={commercialUse}
                onChange={(e) => setCommercialUse(e.target.checked)}
                className="mr-2"
              />
              商业用途
            </label>
          </div>
        </div>

        {/* 生成按钮 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !uploadedFile}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:scale-105 transition disabled:opacity-50"
          >
            {isGenerating ? t('emojiGenerator.generating', 'AI Generating...') : t('emojiGenerator.generate', 'Generate Emoji Packs')}
          </button>
          
          <button
            onClick={resetForm}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            {t('emojiGenerator.reset', 'Reset')}
          </button>
        </div>

        {/* 结果显示 */}
        {result && (
          <div className="mt-8 bg-white/5 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">🎭 {t('emojiGenerator.resultTitle', 'Result')}</h3>
            
            {/* 图片分析 */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.analysis', 'AI Analysis')}</h4>
              <div className="bg-white/10 rounded-lg p-4 text-white/90 whitespace-pre-wrap">
                {result.imageAnalysis}
              </div>
            </div>

            {/* 表情包设计 */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">5个表情包设计</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                 {result.emojiPacks.filter(pack => pack.url).map((pack, index) => (
                   <div key={index} className="bg-white/10 rounded-lg p-4">
                     <img 
                       src={pack.url!} 
                       alt={`表情包 ${index + 1}`} 
                       className="w-full rounded-lg mb-2"
                     />
                    <div className="text-center">
                      <div className="text-white font-semibold mb-1">{pack.style}风格</div>
                      <div className="text-white/70 text-sm">{pack.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 设计建议 */}
            {result.designAdvice && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2">设计建议</h4>
                <div className="bg-white/10 rounded-lg p-4 text-white/90 whitespace-pre-wrap">
                  {result.designAdvice}
                </div>
              </div>
            )}

            {/* 剩余配额 */}
            <div className="text-sm text-gray-300">
              剩余配额：{result.remainingCredits} 次
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 