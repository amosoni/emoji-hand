import Link from "next/link";
import Translator from "~/components/Translator";
import EmojiStats from "~/components/EmojiStats";
import LanguageSwitcher from "~/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import ModeSelector from "~/components/ModeSelector";
import ShareButton from "~/components/ShareButton";
import Head from "next/head";
import ShareFooter from "~/components/ShareFooter";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-300 via-pink-400 to-indigo-500 flex flex-col">
      <Head>
        {/* 网站/产品/FAQ结构化数据 */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Emoji Hand",
          "url": "https://emojihand.com/",
          "description": "Emoji Hand (emojihand) lets you instantly turn any text into expressive emoji messages. Try AI-powered emoji translation, trendy styles, and more!",
          "inLanguage": "en",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://emojihand.com/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }`}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Emoji Hand",
          "image": "https://emojihand.com/logo.svg",
          "description": "AI-powered emoji translator for expressive, fun text.",
          "brand": { "@type": "Brand", "name": "Emoji Hand" },
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
        }`}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What is Emoji Hand?", "acceptedAnswer": { "@type": "Answer", "text": "Emoji Hand is an AI-powered tool that instantly adds the most relevant emojis to your text, making your messages more expressive and fun." } },
            { "@type": "Question", "name": "Is Emoji Hand free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! You can use normal mode for free. Premium features are available for a small fee." } },
            { "@type": "Question", "name": "How does the AI work?", "acceptedAnswer": { "@type": "Answer", "text": "We use OpenAI's GPT to understand your text and add the most relevant emojis based on context and style." } },
            { "@type": "Question", "name": "Can I use Emoji Hand on my phone?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely! Emoji Hand is fully responsive and works great on mobile devices." } }
          ]
        }`}} />
      </Head>
      {/* 顶部导航 */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-3xl font-extrabold text-white drop-shadow">
          <span>🖐️✨</span> emojihand
        </div>
        <div className="flex items-center gap-6">
          {/* <Link 
            href="/realtime" 
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            🚀 Real-time
          </Link> */}
          <LanguageSwitcher />
        </div>
      </nav>
      {/* 英雄区/主操作区 */}
      <section className="flex flex-col items-center justify-center pt-24 pb-16">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl animate-bounce">🖐️✨</span>
          <h1 className="text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">emoji hand</h1>
        </div>
        <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-500 bg-clip-text text-transparent">The Ultimate Emoji Translator</h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl text-center">
          <b>Emoji Hand</b> (emojihand) is your one-stop tool to instantly turn any text into fun, expressive emoji messages. Powered by AI, Emoji Hand helps you communicate with more emotion, creativity, and style. Try it now and make your words stand out!
        </p>
        {/* 主操作区由Translator组件承载 */}
        <Translator />
        <div className="mt-4 text-white/80">Try: <span className="bg-white/20 rounded px-2 py-1">Let's party tonight</span> → <span className="font-bold">🎉🕺✨</span></div>
      </section>
      {/* 应用场景区块 */}
      <section className="flex flex-col items-center my-12">
        <h2 className="text-3xl font-bold text-white mb-6">Why Use Emoji Hand?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2">💬</span>
            <h3 className="font-bold text-xl mb-2 text-white">Spice Up Your Chats</h3>
            <p className="text-white/80 text-center">Make your messages more lively and engaging on WhatsApp, Telegram, Discord, and more.</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2">📢</span>
            <h3 className="font-bold text-xl mb-2 text-white">Social Media Magic</h3>
            <p className="text-white/80 text-center">Stand out on Twitter, Instagram, TikTok, and Facebook with creative emoji-powered posts.</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2">🌏</span>
            <h3 className="font-bold text-xl mb-2 text-white">Multi-language Support</h3>
            <p className="text-white/80 text-center">Translate and emoji-fy your text in English, Spanish, French, and more.</p>
          </div>
        </div>
      </section>
      {/* 用户评价区块 */}
      <section className="flex flex-col items-center my-12">
        <h2 className="text-3xl font-bold text-white mb-6">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
            <span className="text-2xl mb-2">⭐️⭐️⭐️⭐️⭐️</span>
            <p className="text-white/90 text-center mb-2">“Emoji Hand makes my group chats so much more fun!”</p>
            <span className="text-white/60 text-sm">— Alex, Student</span>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
            <span className="text-2xl mb-2">⭐️⭐️⭐️⭐️⭐️</span>
            <p className="text-white/90 text-center mb-2">“Perfect for spicing up my social media posts. Love the GenZ mode!”</p>
            <span className="text-white/60 text-sm">— Jamie, Content Creator</span>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
            <span className="text-2xl mb-2">⭐️⭐️⭐️⭐️⭐️</span>
            <p className="text-white/90 text-center mb-2">“Super easy to use and the emoji suggestions are spot on.”</p>
            <span className="text-white/60 text-sm">— Taylor, Marketer</span>
          </div>
        </div>
      </section>
      {/* 功能亮点区块 */}
      <section className="flex justify-center gap-8 my-12">
        <div className="bg-white/20 border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-8 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl hover:border-pink-300/60">
          <span className="text-4xl mb-3 animate-bounce">🤖</span>
          <h3 className="font-bold text-2xl mb-2 text-white drop-shadow">AI Smart Emoji</h3>
          <p className="text-white/80 text-center">Context-aware emoji translation powered by GPT.</p>
        </div>
        <div className="bg-white/20 border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-8 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl hover:border-blue-300/60">
          <span className="text-4xl mb-3 animate-spin-slow">🌍</span>
          <h3 className="font-bold text-2xl mb-2 text-white drop-shadow">Multi-language</h3>
          <p className="text-white/80 text-center">Supports English, Spanish, French, and more.</p>
        </div>
        <div className="bg-white/20 border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-8 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl hover:border-yellow-300/60">
          <span className="text-4xl mb-3 animate-bounce">🔥</span>
          <h3 className="font-bold text-2xl mb-2 text-white drop-shadow">Trendy Modes</h3>
          <p className="text-white/80 text-center">Normal, Savage, and GenZ Slang modes for every vibe.</p>
        </div>
      </section>
      {/* 热门表情区 */}
      <section className="flex flex-col items-center my-12">
        <div className="bg-white/20 rounded-xl px-6 py-2 text-lg font-bold text-indigo-700 mb-4 shadow">hotEmojis</div>
        <EmojiStats />
      </section>
      {/* 付费/解锁区 */}
      <section className="flex flex-col items-center my-12">
        <div className="bg-white/30 border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock Premium</h3>
          <p className="text-gray-800 mb-4 text-center">Get unlimited savage/GenZ translations, exclusive emoji packs, and ad-free experience for just <span className="font-bold text-[#EC4899]">$1.99/week</span>.</p>
          <button className="bg-gradient-to-r from-[#A259FF] to-[#43A1FF] text-white px-10 py-3 rounded-xl font-bold text-lg shadow-md transition hover:scale-105 hover:from-pink-400 hover:to-yellow-300 active:scale-95">Unlock Premium</button>
        </div>
      </section>
      {/* FAQ/帮助区 */}
      <section className="flex flex-col items-center my-12">
        <h3 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions about Emoji Hand</h3>
        <div className="space-y-4 max-w-2xl w-full">
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-white">What is Emoji Hand?</h4>
            <p className="text-white/80">Emoji Hand is an AI-powered tool that instantly adds the most relevant emojis to your text, making your messages more expressive and fun.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-white">Is Emoji Hand free?</h4>
            <p className="text-white/80">Yes! You can use normal mode for free. Premium features are available for a small fee.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-white">How does the AI work?</h4>
            <p className="text-white/80">We use OpenAI's GPT to understand your text and add the most relevant emojis based on context and style.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-white">Can I use Emoji Hand on my phone?</h4>
            <p className="text-white/80">Absolutely! Emoji Hand is fully responsive and works great on mobile devices.</p>
          </div>
        </div>
      </section>
      {/* 品牌故事区块 */}
      <section className="flex flex-col items-center my-12">
        <h2 className="text-3xl font-bold text-white mb-6">About Emoji Hand</h2>
        <div className="max-w-2xl text-white/90 text-center text-lg mb-4">
          Emoji Hand was born from the idea that everyone deserves to express themselves more vividly online. Our mission is to make digital communication more fun, emotional, and creative—one emoji at a time. Whether you’re chatting with friends, posting on social media, or just want to brighten someone’s day, Emoji Hand is here to help!
        </div>
      </section>
      {/* 使用案例区块 */}
      <section className="flex flex-col items-center my-12">
        <h2 className="text-3xl font-bold text-white mb-6">How People Use Emoji Hand</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2">👩‍💻</span>
            <h3 className="font-bold text-xl mb-2 text-white">Remote Teams</h3>
            <p className="text-white/80 text-center">"We use Emoji Hand to make our Slack standups more lively and keep the team spirit high!"</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2">🎉</span>
            <h3 className="font-bold text-xl mb-2 text-white">Event Planners</h3>
            <p className="text-white/80 text-center">"Perfect for sending out fun, engaging invitations and reminders with a personal touch."</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2">🧑‍🎤</span>
            <h3 className="font-bold text-xl mb-2 text-white">Content Creators</h3>
            <p className="text-white/80 text-center">"My followers love the extra flair in my posts—Emoji Hand makes my content pop!"</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2">👨‍👩‍👧‍👦</span>
            <h3 className="font-bold text-xl mb-2 text-white">Families & Friends</h3>
            <p className="text-white/80 text-center">"We use Emoji Hand to add fun to our family group chats and celebrate special moments together."</p>
          </div>
        </div>
      </section>
      {/* 页脚 */}
      <footer className="w-full py-8 text-center text-white/80 text-base font-medium tracking-wide flex flex-col items-center gap-2">
        <ShareFooter />
        <div>
          &copy; {new Date().getFullYear()} emojihand. All rights reserved. | <Link href="/privacy" className="underline">Privacy Policy</Link>
        </div>
      </footer>
      {/* 自定义动画 keyframes */}
      <style>{`
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }
      `}</style>
    </div>
  );
}
