"use client";

import { useTranslation } from "react-i18next";

interface ModeSelectorProps {
  mode: "normal" | "savage" | "genz";
  setMode: (mode: "normal" | "savage" | "genz") => void;
}

const MODES = [
  { key: "normal", label: "Normal", icon: "✨" },
  { key: "savage", label: "Savage", icon: "🔥" },
  { key: "genz", label: "GenZ Slang", icon: "😎" },
] as const;

export default function ModeSelector({ mode, setMode }: ModeSelectorProps) {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col items-center mb-2">
      <div className="mb-2 text-sm text-white/80 text-center animate-fade-in">
        Try different styles for more fun results!
      </div>
      <div className="flex gap-2 justify-center">
        {MODES.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`
              px-4 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all duration-200
              ${mode === key
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 border-2 border-white/60"
                : "bg-white/30 text-blue-900 hover:bg-blue-100 hover:scale-105 border border-transparent"}
            `}
            style={{ minWidth: 90 }}
          >
            <span>{t(`modes.${key}`, label)}</span>
            <span className="text-lg">{icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// 动画样式可在全局css或组件内加：
// .animate-fade-in { animation: fade-in 1s; }
// @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
