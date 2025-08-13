import '../styles/globals.css';
import AppProviders from "./components/AppProviders";
import GoogleAnalytics from "./components/GoogleAnalytics";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Emoji Hand - AI Emoji Translator & Generator',
    template: '%s | Emoji Hand'
  },
  description: 'Emoji Hand is the ultimate AI-powered emoji translator and generator. Transform any text into expressive emoji messages instantly. Free emoji translation, TikTok emojis, emoji packs, and more!',
  keywords: 'emoji hand, emoji translator, AI emoji, emoji generator, TikTok emojis, emoji packs, emoji翻译, AI表情包, 多语言emoji, emojihand',
  authors: [{ name: 'Emoji Hand Team' }],
  creator: 'Emoji Hand',
  publisher: 'Emoji Hand',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://emojihand.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'zh': '/zh',
      'ko': '/ko',
      'ja': '/ja',
    },
  },
      openGraph: {
      title: 'Emoji Hand - AI-Powered Emoji Translator & Generator',
      description: 'Emoji Hand is the ultimate AI-powered emoji translator and generator. Transform any text into expressive emoji messages instantly.',
      url: 'https://emojihand.com',
      siteName: 'Emoji Hand',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'Emoji Hand - AI-Powered Emoji Translator & Generator',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
      twitter: {
      card: 'summary_large_image',
      title: 'Emoji Hand - AI-Powered Emoji Translator & Generator',
      description: 'Emoji Hand is the ultimate AI-powered emoji translator and generator. Transform any text into expressive emoji messages instantly.',
      images: ['/og-image.svg'],
    },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
              icons: {
          icon: [
            { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' },
            { url: '/favicon-simple.svg', sizes: '32x32', type: 'image/svg+xml' },
            { url: '/logo.svg', sizes: '64x64', type: 'image/svg+xml' },
          ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'google68fv3n1qzr',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale?: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  // Root layout only handles non-locale pages
  // Locale-specific pages are handled by [locale]/layout.tsx
  const locale = 'en'; // Default for non-locale pages
  
  console.log('=== ROOT LAYOUT DEBUG ===');
  console.log('params.locale =', params.locale);
  console.log('final locale =', locale);
  console.log('========================');
  
  return (
    <html lang={locale}>
      <body>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <AppProviders locale={locale}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
