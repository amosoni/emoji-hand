"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Session } from 'next-auth';
import { api } from '~/utils/api';

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
  if (!ready) return null;

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
} 