"use client";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const LANGUAGES = [
  { code: "en", label: "English", flag: "/flags/us.svg" },
  { code: "es", label: "Español", flag: "/flags/es.svg" },
  { code: "fr", label: "Français", flag: "/flags/fr.svg" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];
  if (!current) return null;

  return (
    <div ref={ref} className="relative z-50 select-none" style={{ minWidth: 48 }}>
      <button
        className="flex items-center gap-1 bg-white text-black rounded px-2 py-1 shadow hover:bg-gray-100 focus:outline-none"
        onClick={() => setOpen(v => !v)}
        aria-label="Change language"
      >
        <Image src={current.flag} alt={current.label + ' flag'} width={24} height={18} className="w-6 h-6 rounded-sm" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border border-gray-200">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 ${i18n.language === lang.code ? 'font-bold' : ''}`}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              aria-label={`Switch to ${lang.label}`}
            >
              <span className="text-lg"><Image src={lang.flag} alt={lang.label + ' flag'} width={20} height={15} className="w-5 h-5 rounded-sm inline-block" /></span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 