"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookieConsent");
      if (!consent) setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/80 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-center gap-4">
      <span>{t('cookieConsent.text', 'We use cookies and similar technologies to improve your experience, analyze traffic, and for marketing. By using this site, you agree to our Privacy Policy.')}</span>
      <button className="bg-yellow-400 text-black font-bold px-4 py-2 rounded shadow ml-2" onClick={accept}>
        {t('cookieConsent.accept', 'Accept')}
      </button>
    </div>
  );
} 