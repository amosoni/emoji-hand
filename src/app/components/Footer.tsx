"use client";
import { useTranslation } from "react-i18next";
export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full text-center py-6 text-white/70 text-sm mt-12">
      <span>© {new Date().getFullYear()} emojihand.com</span>
      <span className="mx-2">|</span>
      <a href="/privacy" className="underline">{t('footer.privacy', 'Privacy Policy')}</a>
      <span className="mx-2">|</span>
      <a href="/terms" className="underline">{t('footer.terms', 'Terms of Service')}</a>
      <span className="mx-2">|</span>
      <a href="/accessibility" className="underline">{t('footer.accessibility')}</a>
      <span className="mx-2">|</span>
      <a href="/copyright" className="underline">{t('footer.copyright')}</a>
      <div>{t('footer.contact', 'Contact')}: <a href="mailto:soniceono@gmail.com" className="underline">soniceono@gmail.com</a></div>
    </footer>
  );
} 