"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import ShareFooter from "@/components/ShareFooter";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useParams } from 'next/navigation';

export default function Footer() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  
  return (
    <footer className="w-full text-center py-6 text-white/70 text-sm">
      {/* 分享按钮 */}
      <ShareFooter />
      
      {/* 版权和链接 */}
      <span>© {new Date().getFullYear()} emojihand.com</span>
      <span className="mx-2">|</span>
      <Link href={`/${locale}/privacy`} className="underline">{t('footer.privacy', 'Privacy Policy')}</Link>
      <span className="mx-2">|</span>
      <Link href={`/${locale}/terms`} className="underline">{t('footer.terms', 'Terms of Service')}</Link>
      <span className="mx-2">|</span>
      <Link href={`/${locale}/accessibility`} className="underline">{t('footer.accessibility', 'Accessibility')}</Link>
      <span className="mx-2">|</span>
      <Link href={`/${locale}/copyright`} className="underline">{t('footer.copyright', 'Copyright')}</Link>
      <div>{t('footer.contact', 'Contact')}: <a href="mailto:soniceono@gmail.com" className="underline">soniceono@gmail.com</a></div>
      
      {/* 语言切换器 - Footer底部居中 */}
      <div className="mt-4 flex justify-center">
        <LanguageSwitcher />
      </div>
    </footer>
  );
} 