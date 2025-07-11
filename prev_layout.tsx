import "~/styles/globals.css";
// import "../i18n"; // 涓嶈鍦⊿erver Component寮曞叆

import { type Metadata } from "next";
// import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
// import ClientProviders from "../components/ClientProviders";

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
      <body>
        {/* <ClientProviders> */}
          <TRPCReactProvider>{children}</TRPCReactProvider>
        {/* </ClientProviders> */}
      </body>
    </html>
  );
}
