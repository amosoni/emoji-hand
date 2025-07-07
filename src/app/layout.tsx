import "~/styles/globals.css";
// import "../i18n"; // 不要在Server Component引入

import { type Metadata } from "next";
// import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { LoginModalProvider } from "../../components/LoginModalContext";
import LoginModal from "../../components/LoginModal";

const clerkLocaleMap = {
  zh: "zh-CN",
  en: "en",
  ko: "ko",
  ja: "ja",
  fr: "fr",
  de: "de",
  es: "es",
  it: "it",
  pt: "pt-BR",
  ru: "ru",
};

export const metadata: Metadata = {
  title: "Emoji Hand - Instantly Add Fun Emoji to Your Text | emojihand",
  description: "Emoji Hand (emojihand) lets you instantly turn any text into expressive emoji messages. Try AI-powered emoji translation, trendy styles, and more!",
  keywords: ["emoji hand", "emojihand", "emoji translator", "AI emoji", "text to emoji", "emoji generator", "GPT emoji", "fun text"],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Emoji Hand - Instantly Add Fun Emoji to Your Text | emojihand",
    description: "Emoji Hand (emojihand) lets you instantly turn any text into expressive emoji messages. Try AI-powered emoji translation, trendy styles, and more!",
    url: "https://emojihand.com/",
    siteName: "Emoji Hand",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "Emoji Hand Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Emoji Hand - Instantly Add Fun Emoji to Your Text | emojihand",
    description: "Emoji Hand (emojihand) lets you instantly turn any text into expressive emoji messages. Try AI-powered emoji translation, trendy styles, and more!",
    images: ["/logo.svg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-68FV3N1QZR"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-68FV3N1QZR');
            `,
          }}
        />
      </head>
      <body>
        <ClerkProvider>
          <LoginModalProvider>
            <TRPCReactProvider>
              {children}
              <LoginModal />
            </TRPCReactProvider>
          </LoginModalProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
