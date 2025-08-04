"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Session } from 'next-auth';
import { api } from '~/utils/api';
import { useLoginModal } from '@/components/LoginModalContext';

interface DesignConcept {
  id: string;
  style: string;
  image?: string;
  prompt: string;
}

interface LovartStyleResult {
  designType: string;
  concepts: string;
  businessAdvice: string;
  visualDesigns: DesignConcept[];
  analysis: string;
}

interface LovartStyleClientProps {
  session?: Session | null;
  locale?: string;
}

export default function LovartStyleClient({ session, locale }: LovartStyleClientProps) {
  const { t, i18n } = useTranslation();
  const { show } = useLoginModal();
  const [ready, setReady] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [designType, setDesignType] = useState('emoji');
  const [targetAudience, setTargetAudience] = useState('');
  const [commercialUse, setCommercialUse] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<LovartStyleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // locale 切换
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale).then(() => setReady(true)).catch((error) => {
        console.error('Failed to change language:', error);
        setReady(true);
      });
    } else {
      setReady(true);
    }
  }, [locale, i18n]);

  const designTypes = [
    { id: 'brand', name: t('lovartStyle.designType.brand', 'Brand Identity'), desc: t('lovartStyle.designType.brandDesc', 'Create complete brand strategy, logos, colors, typography') },
    { id: 'marketing', name: t('lovartStyle.designType.marketing', 'Marketing Visuals'), desc: t('lovartStyle.designType.marketingDesc', 'Create eye-catching promotional materials and campaigns') },
    { id: 'social', name: t('lovartStyle.designType.social', 'Social Media'), desc: t('lovartStyle.designType.socialDesc', 'Create engaging social media content and posts') },
    { id: 'product', name: t('lovartStyle.designType.product', 'Product Design'), desc: t('lovartStyle.designType.productDesc', 'Design product mockups and packaging') },
    { id: 'web', name: t('lovartStyle.designType.web', 'Web & UI'), desc: t('lovartStyle.designType.webDesc', 'Create website designs and user interfaces') },
    { id: 'video', name: t('lovartStyle.designType.video', 'Video & 3D'), desc: t('lovartStyle.designType.videoDesc', 'Generate videos, 3D models and animations') }
  ];

  const audiences = [
    { id: 'general', name: t('lovartStyle.audience.general', 'General Public') },
    { id: 'youngAdults', name: t('lovartStyle.audience.youngAdults', 'Young Adults (18-25)') },
    { id: 'professionals', name: t('lovartStyle.audience.professionals', 'Professionals (25-40)') },
    { id: 'teenagers', name: t('lovartStyle.audience.teenagers', 'Teenagers (13-17)') },
    { id: 'businessOwners', name: t('lovartStyle.audience.businessOwners', 'Business Owners') },
    { id: 'creativeProfessionals', name: t('lovartStyle.audience.creativeProfessionals', 'Creative Professionals') },
    { id: 'students', name: t('lovartStyle.audience.students', 'Students') },
    { id: 'parents', name: t('lovartStyle.audience.parents', 'Parents') }
  ];

  // 使用tRPC API
  const lovartMutation = api.lovart.generateEmojiPack.useMutation({
    onSuccess: (data) => {
      // 转换API返回的数据格式以匹配LovartStyleResult接口
      const convertedData: LovartStyleResult = {
        designType: data.designType,
        concepts: data.concepts,
        businessAdvice: data.businessAdvice,
        visualDesigns: data.visualDesigns.map(item => ({
          id: item.id,
          style: item.style ?? 'Unknown',
          image: item.image ?? undefined,
          prompt: item.prompt
        })),
        analysis: data.analysis
      };
      setResult(convertedData);
      setIsGenerating(false);
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
      setIsGenerating(false);
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError(t('lovartStyle.error.invalidFile', 'Please upload an image file'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError(t('lovartStyle.error.fileTooLarge', 'Image size cannot exceed 10MB'));
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

  const generateDesign = async () => {
    // 检查用户是否登录
    if (!session) {
      setError(t('login.designRequired', '请先登录后再使用设计生成功能'));
      show(); // 弹出登录模态框
      return;
    }

    if (!uploadedFile && !textPrompt) {
      setError(t('lovartStyle.error.noInput', 'Please provide either an image or text prompt'));
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // 将文件转换为base64或上传到服务器获取URL
      let imageUrl = '';
      if (uploadedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imageUrl = e.target?.result as string;
          
          // 调用tRPC API
          lovartMutation.mutate({
            imageUrl,
            style: designType,
            emotion: textPrompt,
            targetAudience: targetAudience || undefined,
            commercialUse
          });
        };
        reader.readAsDataURL(uploadedFile);
      } else {
        // 如果没有图片，直接调用API
        lovartMutation.mutate({
          imageUrl: '',
          style: designType,
          emotion: textPrompt,
          targetAudience: targetAudience || undefined,
          commercialUse
        });
      }
    } catch (error) {
      console.error('Design generation failed:', error);
      setError(error instanceof Error ? error.message : t('lovartStyle.error.generationFailed', 'Generation failed, please try again later'));
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setTextPrompt('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {t('lovartStyle.title', 'Lovart Style AI')}
          </h1>
          <p className="text-lg text-white max-w-3xl mx-auto">
            {t('lovartStyle.description', 'The world\'s first AI design agent. Create complete brand strategies, marketing visuals, social media content, product designs, web interfaces, and even 3D models - all from a single prompt.')}
          </p>
        </div>

        {/* 两列布局：左侧输入，右侧结果 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 左侧：输入区域 */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all">
              <h2 className="text-lg font-semibold mb-3 text-white">{t('lovartStyle.upload.title', 'Upload Image (Optional)')}</h2>
              <div 
                className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center cursor-pointer hover:border-white/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedImage ? (
                  <div className="space-y-3">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="max-w-full h-32 object-cover rounded-lg mx-auto shadow-lg"
                    />
                    <p className="text-sm text-white">{t('lovartStyle.upload.reselect', 'Image uploaded, click to reselect')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-4xl mb-3">📸</div>
                    <p className="text-base font-medium text-white">{t('lovartStyle.upload.instruction', 'Click to upload or drag image here')}</p>
                    <p className="text-xs text-white/70">{t('lovartStyle.upload.supported', 'Supports JPG, PNG, max 10MB')}</p>
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

            {/* Text Prompt */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all">
              <h2 className="text-lg font-semibold mb-3 text-white">{t('lovartStyle.prompt.title', 'Text Prompt (Optional)')}</h2>
              <textarea
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                placeholder={t('lovartStyle.prompt.placeholder', 'Describe your design idea, brand concept, or creative vision...')}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                rows={3}
              />
            </div>

            {/* Design Type */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all">
              <h2 className="text-lg font-semibold mb-3 text-white">{t('lovartStyle.designType.title', 'Design Type')}</h2>
              <div className="grid grid-cols-3 gap-2">
                {designTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setDesignType(type.id)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      designType === type.id
                        ? 'border-purple-400 bg-purple-500/20 shadow-lg'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-xl mb-1">{type.name}</div>
                    <div className="font-medium text-xs text-white">{type.name}</div>
                    <div className="text-xs text-white/70 mt-1 leading-tight">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience & Commercial Use in one row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Target Audience */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all">
                <h2 className="text-sm font-semibold mb-2 text-white">{t('lovartStyle.audience.title', 'Target Audience')}</h2>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-800/90 border border-white/30 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all text-sm"
                  style={{
                    color: 'white',
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>{t('lovartStyle.audience.select', 'Select target audience')}</option>
                  {audiences.map((audience) => (
                    <option key={audience.id} value={audience.id} style={{ backgroundColor: '#1f2937', color: 'white' }}>{audience.name}</option>
                  ))}
                </select>
              </div>

              {/* Commercial Use */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold mb-1 text-white">{t('lovartStyle.commercial.title', 'Commercial Use')}</h2>
                    <p className="text-xs text-white/70">{t('lovartStyle.commercial.description', 'Optimize for commercial applications')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={commercialUse}
                      onChange={(e) => setCommercialUse(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateDesign}
              disabled={isGenerating || (!uploadedFile && !textPrompt)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('lovartStyle.generating', 'AI Generating...')}
                </div>
              ) : (
                <>{t('lovartStyle.generate', 'Generate Design')}</>
              )}
            </button>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* 右侧：结果区域 */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Analysis */}
                {result.analysis && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                    <h3 className="text-base font-semibold mb-2 text-white">{t('lovartStyle.results.analysis', 'AI Analysis')}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{result.analysis}</p>
                  </div>
                )}

                {/* Creative Concepts */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <h3 className="text-base font-semibold mb-3 text-white">{t('lovartStyle.results.concepts', 'Creative Concepts')}</h3>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-sm text-white/80 whitespace-pre-wrap">{result.concepts}</div>
                  </div>
                </div>

                {/* Business Advice */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <h3 className="text-base font-semibold mb-3 text-white">{t('lovartStyle.results.businessAdvice', 'Business Recommendations')}</h3>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-sm text-white/80 whitespace-pre-wrap">{result.businessAdvice}</div>
                  </div>
                </div>

                {/* Visual Designs */}
                {result.visualDesigns && result.visualDesigns.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                    <h3 className="text-base font-semibold mb-3 text-white">{t('lovartStyle.results.designs', 'Generated Designs')}</h3>
                    <div className="grid gap-3">
                      {result.visualDesigns.map((design) => (
                        <div key={design.id} className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all">
                          <div className="flex gap-3">
                            {design.image && (
                              <img 
                                src={design.image} 
                                alt={`Design ${design.style}`}
                                className="w-16 h-16 object-cover rounded-lg shadow-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium mb-1 text-white text-sm">{design.style} Style</h4>
                              <p className="text-xs text-white/70">{design.prompt}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reset Button */}
                <button
                  onClick={resetForm}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-xl transition-all hover:scale-105"
                >
                  {t('lovartStyle.reset', 'Reset')}
                </button>
              </>
            ) : (
              /* 空状态提示 */
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="text-lg font-semibold mb-2">{t('lovartStyle.waiting.title', 'Waiting for generation results')}</h3>
                  <p className="text-sm text-white/80">{t('lovartStyle.waiting.description', 'Fill out the form on the left and click the generate button to start creating your design')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-12 space-y-8">
          {/* Lovart AI Introduction */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">{t('lovartStyle.about.title', 'About Lovart AI')}</h2>
            <div className="text-white/90 space-y-4">
              <p>
                {t('lovartStyle.about.description1', 'Lovart AI is the world\'s first AI design agent that revolutionizes the creative process. Inspired by Lovart\'s innovative approach to AI-powered design, our Lovart Style AI tool brings the same cutting-edge technology to your fingertips.')}
              </p>
              <p>
                {t('lovartStyle.about.description2', 'Whether you need brand identity design, marketing visuals, social media content, product designs, web interfaces, or even 3D models, Lovart Style AI can handle it all from a single prompt - just like the original Lovart AI platform.')}
              </p>
            </div>
          </section>

          {/* Lovart Features */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">{t('lovartStyle.features.title', 'Lovart AI Features')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{t('lovartStyle.features.solutions.title', 'Complete Design Solutions')}</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• {t('lovartStyle.features.solutions.brand', 'Brand strategy and identity design')}</li>
                  <li>• {t('lovartStyle.features.solutions.marketing', 'Marketing campaigns and promotional materials')}</li>
                  <li>• {t('lovartStyle.features.solutions.social', 'Social media content and posts')}</li>
                  <li>• {t('lovartStyle.features.solutions.product', 'Product mockups and packaging design')}</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{t('lovartStyle.features.technology.title', 'Advanced AI Technology')}</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• {t('lovartStyle.features.technology.web', 'Web and UI design generation')}</li>
                  <li>• {t('lovartStyle.features.technology.video', 'Video and 3D model creation')}</li>
                  <li>• {t('lovartStyle.features.technology.analysis', 'Intelligent design analysis')}</li>
                  <li>• {t('lovartStyle.features.technology.quality', 'Professional-grade output quality')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Lovart vs Traditional Design */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">{t('lovartStyle.why.title', 'Why Choose Lovart Style AI?')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('lovartStyle.why.fast.title', 'Lightning Fast')}</h3>
                <p className="text-white/80 text-sm">{t('lovartStyle.why.fast.description', 'Generate professional designs in minutes, not days')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('lovartStyle.why.ai.title', 'AI-Powered')}</h3>
                <p className="text-white/80 text-sm">{t('lovartStyle.why.ai.description', 'Advanced Lovart AI technology for superior results')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('lovartStyle.why.creative.title', 'Creative Freedom')}</h3>
                <p className="text-white/80 text-sm">{t('lovartStyle.why.creative.description', 'Unlimited design possibilities with intelligent guidance')}</p>
              </div>
            </div>
          </section>

          {/* Lovart Keywords for SEO */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">{t('lovartStyle.solutions.title', 'Lovart AI Design Solutions')}</h2>
            <div className="text-white/90 space-y-4">
              <p>
                {t('lovartStyle.solutions.description1', 'Experience the power of Lovart AI technology with our comprehensive design platform. From brand identity to marketing campaigns, Lovart Style AI delivers professional-quality designs that match the innovation and creativity of the original Lovart AI platform.')}
              </p>
              <p>
                {t('lovartStyle.solutions.description2', 'Our Lovart-inspired AI design tool supports multiple formats including images, videos, 3D models, and interactive content. Whether you\'re a designer, marketer, entrepreneur, or creative professional, Lovart Style AI provides the tools you need to bring your vision to life with the same cutting-edge technology that makes Lovart AI revolutionary.')}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  // 条件渲染移到最后，确保所有Hook都被调用
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🔄</div>
          <h2 className="text-xl font-semibold">{t('common.loading', 'Loading...')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-purple-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{t('lovartStyle.title', 'Lovart Style AI')}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">{t('lovartStyle.subtitle', 'Create professional designs with Lovart AI technology - from brand identity to 3D models')}</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">{t('lovartStyle.upload.title', 'Upload Reference Image (Optional)')}</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => {
                      if (!session) {
                        setError(t('login.designRequired', '请先登录后再使用设计生成功能'));
                        show();
                        return;
                      }
                      fileInputRef.current?.click();
                    }}
                    disabled={!session}
                    className={`text-white hover:text-orange-300 transition-colors ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploadedImage ? (
                      <div className="space-y-2">
                        <img src={uploadedImage!} alt="Uploaded" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                        <p className="text-sm">{t('lovartStyle.upload.change', 'Click to change image')}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl">📁</div>
                        <p>{session ? t('lovartStyle.upload.placeholder', 'Click to upload image') : t('login.designRequired', '请先登录后再使用设计生成功能')}</p>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Text Prompt */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">{t('lovartStyle.prompt.title', 'Design Description')}</h3>
              <textarea
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                placeholder={session ? t('lovartStyle.prompt.placeholder', 'Describe your design needs, style preferences, or business goals...') : t('login.designRequired', '请先登录后再使用设计生成功能')}
                disabled={!session}
                className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-400 resize-none disabled:opacity-50"
              />
            </div>

            {/* Design Type Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">{t('lovartStyle.designType.title', 'Design Type')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {designTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setDesignType(type.id)}
                    disabled={!session}
                    className={`p-3 rounded-lg text-left transition-all ${
                      designType === type.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    } ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-semibold">{type.name}</div>
                    <div className="text-xs opacity-80">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">{t('lovartStyle.audience.title', 'Target Audience (Optional)')}</h3>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                disabled={!session}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-400 disabled:opacity-50"
              >
                <option value="">{t('lovartStyle.audience.placeholder', 'Select target audience...')}</option>
                {audiences.map((audience) => (
                  <option key={audience.id} value={audience.id}>
                    {audience.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Commercial Use */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <label className="flex items-center space-x-3 text-white">
                <input
                  type="checkbox"
                  checked={commercialUse}
                  onChange={(e) => setCommercialUse(e.target.checked)}
                  disabled={!session}
                  className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 disabled:opacity-50"
                />
                <span>{t('lovartStyle.commercial.title', 'Commercial Use')}</span>
              </label>
              <p className="text-sm text-white/70 mt-2">{t('lovartStyle.commercial.description', 'Enable for commercial projects and business use')}</p>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateDesign}
              disabled={isGenerating || !session}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 disabled:scale-100"
            >
              {isGenerating 
                ? t('lovartStyle.generating', 'Generating...') 
                : session 
                  ? t('lovartStyle.generate', 'Generate Design')
                  : t('login.button', 'Login to Generate')
              }
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">{t('lovartStyle.results.title', 'Generated Results')}</h3>
            {result ? (
              <>
                <div className="space-y-6">
                  {/* Design Concepts */}
                  <div>
                    <h4 className="text-md font-semibold text-white mb-2">{t('lovartStyle.results.concepts', 'Design Concepts')}</h4>
                    <div className="bg-white/10 rounded-lg p-4 text-white/90 text-sm">
                      {result!.concepts}
                    </div>
                  </div>

                  {/* Business Advice */}
                  <div>
                    <h4 className="text-md font-semibold text-white mb-2">{t('lovartStyle.results.businessAdvice', 'Business Advice')}</h4>
                    <div className="bg-white/10 rounded-lg p-4 text-white/90 text-sm">
                      {result!.businessAdvice}
                    </div>
                  </div>

                  {/* Visual Designs */}
                  <div>
                    <h4 className="text-md font-semibold text-white mb-2">{t('lovartStyle.results.visualDesigns', 'Visual Designs')}</h4>
                    <div className="space-y-3">
                      {result!.visualDesigns.map((design, index) => (
                        <div key={design.id} className="bg-white/10 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{design.style}</span>
                            {design.image && (
                              <img src={design.image} alt={design.style} className="w-16 h-16 object-cover rounded" />
                            )}
                          </div>
                          <p className="text-white/80 text-sm">{design.prompt}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analysis */}
                  <div>
                    <h4 className="text-md font-semibold text-white mb-2">{t('lovartStyle.results.analysis', 'Design Analysis')}</h4>
                    <div className="bg-white/10 rounded-lg p-4 text-white/90 text-sm">
                      {result!.analysis}
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetForm}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-xl transition-all hover:scale-105 mt-6"
                >
                  {t('lovartStyle.reset', 'Reset')}
                </button>
              </>
            ) : (
              /* 空状态提示 */
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="text-lg font-semibold mb-2">{t('lovartStyle.waiting.title', 'Waiting for generation results')}</h3>
                  <p className="text-sm text-white/80">{t('lovartStyle.waiting.description', 'Fill out the form on the left and click the generate button to start creating your design')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-12 space-y-8">
          {/* Lovart AI Introduction */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">{t('lovartStyle.about.title', 'About Lovart AI')}</h2>
            <div className="text-white/90 space-y-4">
              <p>
                {t('lovartStyle.about.description1', 'Lovart AI is the world\'s first AI design agent that revolutionizes the creative process. Inspired by Lovart\'s innovative approach to AI-powered design, our Lovart Style AI tool brings the same cutting-edge technology to your fingertips.')}
              </p>
              <p>
                {t('lovartStyle.about.description2', 'Whether you need brand identity design, marketing visuals, social media content, product designs, web interfaces, or even 3D models, Lovart Style AI can handle it all from a single prompt - just like the original Lovart AI platform.')}
              </p>
            </div>
          </section>

          {/* Lovart Features */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">{t('lovartStyle.features.title', 'Lovart AI Features')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{t('lovartStyle.features.solutions.title', 'Complete Design Solutions')}</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• {t('lovartStyle.features.solutions.brand', 'Brand strategy and identity design')}</li>
                  <li>• {t('lovartStyle.features.solutions.marketing', 'Marketing campaigns and promotional materials')}</li>
                  <li>• {t('lovartStyle.features.solutions.social', 'Social media content and posts')}</li>
                  <li>• {t('lovartStyle.features.solutions.product', 'Product mockups and packaging design')}</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{t('lovartStyle.features.technology.title', 'Advanced AI Technology')}</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• {t('lovartStyle.features.technology.web', 'Web and UI design generation')}</li>
                  <li>• {t('lovartStyle.features.technology.video', 'Video and 3D model creation')}</li>
                  <li>• {t('lovartStyle.features.technology.analysis', 'Intelligent design analysis')}</li>
                  <li>• {t('lovartStyle.features.technology.quality', 'Professional-grade output quality')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Lovart vs Traditional Design */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">{t('lovartStyle.why.title', 'Why Choose Lovart Style AI?')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('lovartStyle.why.fast.title', 'Lightning Fast')}</h3>
                <p className="text-white/80 text-sm">{t('lovartStyle.why.fast.description', 'Generate professional designs in minutes, not days')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('lovartStyle.why.ai.title', 'AI-Powered')}</h3>
                <p className="text-white/80 text-sm">{t('lovartStyle.why.ai.description', 'Advanced Lovart AI technology for superior results')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('lovartStyle.why.creative.title', 'Creative Freedom')}</h3>
                <p className="text-white/80 text-sm">{t('lovartStyle.why.creative.description', 'Unlimited design possibilities with intelligent guidance')}</p>
              </div>
            </div>
          </section>

          {/* Lovart Keywords for SEO */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">{t('lovartStyle.solutions.title', 'Lovart AI Design Solutions')}</h2>
            <div className="text-white/90 space-y-4">
              <p>
                {t('lovartStyle.solutions.description1', 'Experience the power of Lovart AI technology with our comprehensive design platform. From brand identity to marketing campaigns, Lovart Style AI delivers professional-quality designs that match the innovation and creativity of the original Lovart AI platform.')}
              </p>
              <p>
                {t('lovartStyle.solutions.description2', 'Our Lovart-inspired AI design tool supports multiple formats including images, videos, 3D models, and interactive content. Whether you\'re a designer, marketer, entrepreneur, or creative professional, Lovart Style AI provides the tools you need to bring your vision to life with the same cutting-edge technology that makes Lovart AI revolutionary.')}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 