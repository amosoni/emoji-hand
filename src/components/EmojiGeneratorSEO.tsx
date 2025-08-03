"use client";
import { useTranslation } from 'react-i18next';

export default function EmojiGeneratorSEO() {
  const { t } = useTranslation();

  return (
    <div className="mt-16 space-y-12">
      {/* Lovart AI 介绍部分 */}
      <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          {t('emojiGenerator.lovartInspired', 'Inspired by Lovart AI')}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">{t('emojiGenerator.lovartWhatIs', 'What is Lovart AI?')}</h3>
            <p className="text-white/90 leading-relaxed mb-4">
              {t('emojiGenerator.lovartDescription', 'Lovart AI is a revolutionary AI design agent that automates the entire design journey, from concept to images, videos, 3D, and more. Our emoji pack generator is inspired by Lovart\'s innovative approach to AI-powered creative tools.')}
            </p>
            <p className="text-white/90 leading-relaxed">
              {t('emojiGenerator.lovartDescription2', 'Just like Lovart AI, our emoji generator allows you to upload an image and let AI create multiple variations with different styles, making the creative process effortless and enjoyable.')}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">{t('emojiGenerator.lovartFeatures', 'Key Features')}</h3>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                {t('emojiGenerator.aiGeneration', 'AI-powered emoji generation')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                {t('emojiGenerator.styleVariations', 'Multiple style variations')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                {t('emojiGenerator.batchProcessing', 'Batch processing capabilities')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                {t('emojiGenerator.lovartPrinciples', 'Lovart AI-inspired design principles')}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 使用指南 */}
      <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-2xl">📖</span>
          How to Use Our Lovart-Style Emoji Generator
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-lg font-semibold text-white mb-2">1. Upload Image</h3>
            <p className="text-white/80 text-sm">
              Upload any image you want to transform into emoji packs. Our AI will analyze the content and create variations.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-white mb-2">2. Choose Style</h3>
            <p className="text-white/80 text-sm">
              Select from 6 different styles: Cute, Funny, Cool, Savage, GenZ, or TikTok. Each style creates unique variations.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-semibold text-white mb-2">3. Generate & Download</h3>
            <p className="text-white/80 text-sm">
              AI generates multiple emoji pack variations. Download individual packs or use them in your projects.
            </p>
          </div>
        </div>
      </section>

      {/* 风格介绍 */}
      <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-2xl">🎭</span>
          Emoji Pack Styles (Lovart AI Inspired)
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="text-3xl mb-3">🥰</div>
            <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">Cute Style</h3>
            <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
              Pink color palette with rounded lines, perfect for adorable and kawaii expressions.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="text-3xl mb-3">😂</div>
            <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">Funny Style</h3>
            <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
              Exaggerated expressions with humorous elements, great for memes and comedy.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="text-3xl mb-3">😎</div>
            <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">Cool Style</h3>
            <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
              Dark color scheme with fashionable elements, perfect for trendy and stylish expressions.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="text-3xl mb-3">😏</div>
            <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">Savage Style</h3>
            <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
              Sharp expressions with sarcastic elements, ideal for witty and bold statements.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="text-3xl mb-3">💅</div>
            <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">GenZ Style</h3>
            <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
              Trendy elements with youthful expressions, perfect for modern social media.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="text-3xl mb-3">🎵</div>
            <h3 className="text-lg font-semibold text-white mb-2 leading-tight min-h-[2.5rem]">TikTok Style</h3>
            <p className="text-white/80 text-sm leading-relaxed min-h-[4rem]">
              Popular elements with short video aesthetics, great for viral content.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ部分 */}
      <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-2xl">❓</span>
          {t('emojiGenerator.faq.title', 'Frequently Asked Questions')}
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.faq.lovartComparison', 'How does this compare to Lovart AI?')}</h3>
            <p className="text-white/80">
              {t('emojiGenerator.faq.lovartComparisonAnswer', 'While Lovart AI is a comprehensive design platform, our emoji generator focuses specifically on creating emoji packs. We\'re inspired by Lovart\'s AI-powered approach and apply similar principles to emoji creation.')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.faq.imageFormats', 'What image formats are supported?')}</h3>
            <p className="text-white/80">
              {t('emojiGenerator.faq.imageFormatsAnswer', 'We support JPG, PNG, and GIF formats. For best results, use high-quality images with clear subjects.')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.faq.generationCount', 'How many emoji packs can I generate?')}</h3>
            <p className="text-white/80">
              {t('emojiGenerator.faq.generationCountAnswer', 'Each generation creates 3-5 different emoji pack variations based on your selected style and uploaded image.')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('emojiGenerator.faq.commercialUse', 'Can I use these emoji packs commercially?')}</h3>
            <p className="text-white/80">
              {t('emojiGenerator.faq.commercialUseAnswer', 'Yes, all generated emoji packs are free to use for personal and commercial purposes. They\'re created using AI technology inspired by Lovart AI principles.')}
            </p>
          </div>
        </div>
      </section>

      {/* Lovart AI 优势对比 */}
      <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          Lovart AI vs Our Emoji Generator
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-white/90">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4">Feature</th>
                <th className="text-left py-3 px-4">Lovart AI</th>
                <th className="text-left py-3 px-4">Our Emoji Generator</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4">Image Upload</td>
                <td className="py-3 px-4">✅</td>
                <td className="py-3 px-4">✅</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4">Style Variations</td>
                <td className="py-3 px-4">✅</td>
                <td className="py-3 px-4">✅</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4">Batch Generation</td>
                <td className="py-3 px-4">✅</td>
                <td className="py-3 px-4">✅</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4">Emoji Focus</td>
                <td className="py-3 px-4">❌</td>
                <td className="py-3 px-4">✅</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4">Multi-language</td>
                <td className="py-3 px-4">❌</td>
                <td className="py-3 px-4">✅</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Free to Use</td>
                <td className="py-3 px-4">❌</td>
                <td className="py-3 px-4">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
} 