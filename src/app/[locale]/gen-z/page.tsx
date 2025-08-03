"use client";
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import UnifiedNavBar from '../../components/UnifiedNavBar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function GenZPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const locale = params?.locale as string || 'en';

  return (
    <>
      <Head>
        <title>{t('genZ.seo.title', 'Gen Z Emoji Guide - Complete Slang & Expression Dictionary')}</title>
        <meta name="description" content={t('genZ.seo.description', 'Discover the complete Gen Z emoji guide with slang meanings, expressions, and how to use them effectively. Master Gen Z communication with our comprehensive emoji dictionary.')} />
        <meta name="keywords" content={t('genZ.seo.keywords', 'gen z, gen z emoji, gen z slang, gen z expressions, gen z communication, gen z dictionary, gen z guide, gen z meaning, gen z emoji pack, gen z style')} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t('genZ.seo.ogTitle', 'Gen Z Emoji Guide - Complete Slang & Expression Dictionary')} />
        <meta property="og:description" content={t('genZ.seo.ogDescription', 'Master Gen Z communication with our comprehensive emoji guide. Learn slang meanings and expressions.')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://emojihand.com/${locale}/gen-z`} />
        <meta property="og:image" content="https://emojihand.com/images/gen-z-guide.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('genZ.seo.twitterTitle', 'Gen Z Emoji Guide - Complete Slang & Expression Dictionary')} />
        <meta name="twitter:description" content={t('genZ.seo.twitterDescription', 'Master Gen Z communication with our comprehensive emoji guide.')} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": t('genZ.seo.title', 'Gen Z Emoji Guide - Complete Slang & Expression Dictionary'),
              "description": t('genZ.seo.description', 'Discover the complete Gen Z emoji guide with slang meanings, expressions, and how to use them effectively.'),
              "image": "https://emojihand.com/images/gen-z-guide.jpg",
              "author": {
                "@type": "Organization",
                "name": "EmojiHand"
              },
              "publisher": {
                "@type": "Organization",
                "name": "EmojiHand",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://emojihand.com/logo.svg"
                }
              },
              "datePublished": "2024-01-01",
              "dateModified": "2024-01-01",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://emojihand.com/${locale}/gen-z`
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col">
        <UnifiedNavBar />
        
        <div className="flex-1 container mx-auto py-8 px-4">
          <article className="max-w-4xl mx-auto">
            {/* 页面标题 */}
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t('genZ.title', 'Gen Z Emoji Guide')}
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                {t('genZ.subtitle', 'Master the art of Gen Z communication with our comprehensive emoji guide. Learn slang meanings, expressions, and how to use them effectively.')}
              </p>
            </header>

            {/* 主要内容 */}
            <div className="space-y-12">
              {/* 什么是Gen Z */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  {t('genZ.whatIs.title', 'What is Gen Z?')}
                </h2>
                <div className="text-white/90 space-y-4">
                  <p>
                    {t('genZ.whatIs.content1', 'Generation Z, commonly known as Gen Z, refers to individuals born between 1997 and 2012. This digital-native generation has developed unique communication styles that heavily rely on emojis, slang, and internet culture.')}
                  </p>
                  <p>
                    {t('genZ.whatIs.content2', 'Gen Z communication is characterized by its authenticity, creativity, and the use of visual language. Emojis play a crucial role in expressing emotions, sarcasm, and cultural references that are specific to this generation.')}
                  </p>
                </div>
              </section>

              {/* 热门Gen Z Emoji */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  {t('genZ.popular.title', 'Popular Gen Z Emojis')}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-4xl mb-3">💀</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.popular.skull.title', 'Skull')}</h3>
                    <p className="text-white/80 text-sm">
                      {t('genZ.popular.skull.meaning', 'Used to express "I\'m dead" or extreme reactions, often in a humorous context.')}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-4xl mb-3">😭</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.popular.crying.title', 'Crying')}</h3>
                    <p className="text-white/80 text-sm">
                      {t('genZ.popular.crying.meaning', 'Expresses intense emotions, often used ironically or to show overwhelming feelings.')}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-4xl mb-3">✨</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.popular.sparkles.title', 'Sparkles')}</h3>
                    <p className="text-white/80 text-sm">
                      {t('genZ.popular.sparkles.meaning', 'Adds emphasis or magic to messages, often used to highlight important points.')}
                    </p>
                  </div>
                </div>
              </section>

              {/* 更多Gen Z表情符号 */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">🎭</span>
                  {t('genZ.moreEmojis.title', 'More Gen Z Emojis')}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-3xl mb-2">🤡</div>
                    <h3 className="text-sm font-semibold text-white mb-1">{t('genZ.moreEmojis.clown.title', 'Clown')}</h3>
                    <p className="text-white/70 text-xs">
                      {t('genZ.moreEmojis.clown.meaning', 'Used to call someone out for foolish behavior')}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-3xl mb-2">💅</div>
                    <h3 className="text-sm font-semibold text-white mb-1">{t('genZ.moreEmojis.nail.title', 'Nail Polish')}</h3>
                    <p className="text-white/70 text-xs">
                      {t('genZ.moreEmojis.nail.meaning', 'Expresses confidence and sass')}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-3xl mb-2">💯</div>
                    <h3 className="text-sm font-semibold text-white mb-1">{t('genZ.moreEmojis.hundred.title', '100')}</h3>
                    <p className="text-white/70 text-xs">
                      {t('genZ.moreEmojis.hundred.meaning', 'Agreement or "facts"')}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-3xl mb-2">🔥</div>
                    <h3 className="text-sm font-semibold text-white mb-1">{t('genZ.moreEmojis.fire.title', 'Fire')}</h3>
                    <p className="text-white/70 text-xs">
                      {t('genZ.moreEmojis.fire.meaning', 'Something is amazing or cool')}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-3xl mb-2">💀</div>
                    <h3 className="text-sm font-semibold text-white mb-1">{t('genZ.moreEmojis.skull2.title', 'Skull')}</h3>
                    <p className="text-white/70 text-xs">
                      {t('genZ.moreEmojis.skull2.meaning', '"I\'m dead" from laughter')}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-3xl mb-2">😭</div>
                    <h3 className="text-sm font-semibold text-white mb-1">{t('genZ.moreEmojis.crying2.title', 'Crying')}</h3>
                    <p className="text-white/70 text-xs">
                      {t('genZ.moreEmojis.crying2.meaning', 'Intense emotions, often ironic')}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-3xl mb-2">✨</div>
                    <h3 className="text-sm font-semibold text-white mb-1">{t('genZ.moreEmojis.sparkles2.title', 'Sparkles')}</h3>
                    <p className="text-white/70 text-xs">
                      {t('genZ.moreEmojis.sparkles2.meaning', 'Adds magic and emphasis')}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-3xl mb-2">🤪</div>
                    <h3 className="text-sm font-semibold text-white mb-1">{t('genZ.moreEmojis.zany.title', 'Zany')}</h3>
                    <p className="text-white/70 text-xs">
                      {t('genZ.moreEmojis.zany.meaning', 'Playful and silly behavior')}
                    </p>
                  </div>
                </div>
              </section>

              {/* Gen Z沟通技巧 */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  {t('genZ.communication.title', 'Gen Z Communication Tips')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.communication.authentic.title', 'Be Authentic')}</h3>
                        <p className="text-white/80 text-sm">
                          {t('genZ.communication.authentic.content', 'Gen Z values real, unfiltered communication. Don\'t try to be someone you\'re not.')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🚀</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.communication.visual.title', 'Use Visual Language')}</h3>
                        <p className="text-white/80 text-sm">
                          {t('genZ.communication.visual.content', 'Emojis, GIFs, and memes are essential for expressing emotions and context.')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">⚡</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.communication.quick.title', 'Keep It Quick')}</h3>
                        <p className="text-white/80 text-sm">
                          {t('genZ.communication.quick.content', 'Short, punchy messages with clear intent work best for this generation.')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🎭</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.communication.humor.title', 'Embrace Humor')}</h3>
                        <p className="text-white/80 text-sm">
                          {t('genZ.communication.humor.content', 'Sarcasm, irony, and self-deprecating humor are highly appreciated.')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 常见Gen Z短语 */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  {t('genZ.phrases.title', 'Common Gen Z Phrases')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.phrases.period.title', 'Period.')}</h3>
                      <p className="text-white/80 text-sm mb-2">
                        {t('genZ.phrases.period.meaning', 'Used to emphasize a statement, similar to "end of story"')}
                      </p>
                      <p className="text-white/60 text-xs">
                        {t('genZ.phrases.period.example', 'Example: "That outfit is fire, period."')}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.phrases.slay.title', 'Slay')}</h3>
                      <p className="text-white/80 text-sm mb-2">
                        {t('genZ.phrases.slay.meaning', 'To do something exceptionally well or look amazing')}
                      </p>
                      <p className="text-white/60 text-xs">
                        {t('genZ.phrases.slay.example', 'Example: "You absolutely slayed that presentation!"')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.phrases.facts.title', 'Facts')}</h3>
                      <p className="text-white/80 text-sm mb-2">
                        {t('genZ.phrases.facts.meaning', 'Agreement with what someone said')}
                      </p>
                      <p className="text-white/60 text-xs">
                        {t('genZ.phrases.facts.example', 'Example: "That\'s facts, no cap."')}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.phrases.noCap.title', 'No Cap')}</h3>
                      <p className="text-white/80 text-sm mb-2">
                        {t('genZ.phrases.noCap.meaning', 'No lie, being completely honest')}
                      </p>
                      <p className="text-white/60 text-xs">
                        {t('genZ.phrases.noCap.example', 'Example: "This is the best movie ever, no cap."')}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 使用场景示例 */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">🎬</span>
                  {t('genZ.scenarios.title', 'Usage Scenarios')}
                </h2>
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">{t('genZ.scenarios.social.title', 'Social Media Posts')}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/80 text-sm mb-2">{t('genZ.scenarios.social.example1', 'Original: "Just finished my workout"')}</p>
                        <p className="text-white/90 font-medium">{t('genZ.scenarios.social.result1', 'Gen Z: "Just finished my workout 💪✨ slayed that cardio period 🔥"')}</p>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm mb-2">{t('genZ.scenarios.social.example2', 'Original: "This food is amazing"')}</p>
                        <p className="text-white/90 font-medium">{t('genZ.scenarios.social.result2', 'Gen Z: "This food is absolutely fire 🔥 no cap, best meal ever 💯"')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">{t('genZ.scenarios.chat.title', 'Group Chats')}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/80 text-sm mb-2">{t('genZ.scenarios.chat.example1', 'Original: "That\'s funny"')}</p>
                        <p className="text-white/90 font-medium">{t('genZ.scenarios.chat.result1', 'Gen Z: "💀💀💀 I\'m dead, that\'s hilarious 😭"')}</p>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm mb-2">{t('genZ.scenarios.chat.example2', 'Original: "I agree"')}</p>
                        <p className="text-white/90 font-medium">{t('genZ.scenarios.chat.result2', 'Gen Z: "Facts 💯 no cap, you\'re absolutely right"')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ部分 */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">❓</span>
                  {t('genZ.faq.title', 'Frequently Asked Questions')}
                </h2>
                <div className="space-y-6">
                  <div className="border-b border-white/20 pb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.faq.q1', 'Why do Gen Z use so many emojis?')}</h3>
                    <p className="text-white/80 text-sm">
                      {t('genZ.faq.a1', 'Gen Z uses emojis to add emotional context, express sarcasm, and make communication more engaging and authentic.')}
                    </p>
                  </div>
                  <div className="border-b border-white/20 pb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.faq.q2', 'How can I sound more Gen Z?')}</h3>
                    <p className="text-white/80 text-sm">
                      {t('genZ.faq.a2', 'Be authentic, use relevant emojis, embrace current slang, and don\'t be afraid to be playful and sarcastic.')}
                    </p>
                  </div>
                  <div className="border-b border-white/20 pb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.faq.q3', 'What\'s the difference between Gen Z and Millennial communication?')}</h3>
                    <p className="text-white/80 text-sm">
                      {t('genZ.faq.a3', 'Gen Z tends to be more direct, uses more visual elements, embraces irony and sarcasm more openly, and values authenticity over perfection.')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('genZ.faq.q4', 'How do I keep up with Gen Z trends?')}</h3>
                    <p className="text-white/80 text-sm">
                      {t('genZ.faq.a4', 'Follow Gen Z creators on social media, pay attention to viral trends, and stay updated with current events and pop culture references.')}
                    </p>
                  </div>
                </div>
              </section>

              {/* 行动号召 */}
              <section className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t('genZ.cta.title', 'Ready to Master Gen Z Communication?')}
                </h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  {t('genZ.cta.content', 'Try our Gen Z emoji translator and generator to create authentic, engaging content that resonates with the younger generation.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${locale}/emoji-generator`}
                    className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {t('genZ.cta.generator', 'Try Emoji Generator')}
                  </Link>
                  <Link
                    href={`/${locale}/tiktok`}
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    {t('genZ.cta.tiktok', 'Explore TikTok Mode')}
                  </Link>
                </div>
              </section>
            </div>
          </article>
        </div>

        <Footer />
      </div>
    </>
  );
} 