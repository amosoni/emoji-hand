"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ModeSelector from "./ModeSelector";
import { api } from "~/utils/api";
import ShareButton from "./ShareButton";
import { applyBrandSponsorship } from "~/utils/helpers";
import '../i18n';
import Image from "next/image";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Translator() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"normal" | "savage" | "genz">("normal");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [freeUses, setFreeUses] = useState(5);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 随机头像列表
  const avatarList = Array.from({ length: 28 }, (_, i) => `/images/beanhead (${i + 1}).svg`);
  const [aiAvatar] = useState(() => avatarList[Math.floor(Math.random() * avatarList.length)]);
  const [userAvatar] = useState(() => avatarList[Math.floor(Math.random() * avatarList.length)]);

  useEffect(() => {
    const saved = localStorage.getItem("freeUses");
    if (saved) setFreeUses(parseInt(saved));
    else localStorage.setItem("freeUses", "5");
  }, []);

  const translate = api.emoji.translate.useMutation({
    onSuccess: (data) => {
      setError(null);
      const resultWithBrand = applyBrandSponsorship(data.result);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: resultWithBrand,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
      // 统计数据
      fetch("/api/track-translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original: inputText,
          translated: resultWithBrand,
          mode,
          timestamp: Date.now(),
        }),
      });
      // 统计 emoji 热度
      fetch("/api/emoji-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ translated: resultWithBrand }),
      });
    },
    onError: (err) => {
      setIsLoading(false);
      setError(t('realtime.error', 'Network error, please try again.'));
    },
  });

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    // 移除免费次数和付费墙限制
    // if (mode !== "normal" && freeUses <= 0) {
    //   setShowPaywall(true);
    //   return;
    // }
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: inputText,
        timestamp: new Date(),
      },
    ]);
    setIsLoading(true);
    translate.mutate({ text: inputText, mode });
    // if (mode !== "normal" && freeUses > 0) {
    //   const newUses = freeUses - 1;
    //   setFreeUses(newUses);
    //   localStorage.setItem("freeUses", newUses.toString());
    // }
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 flex flex-col min-h-[500px]" style={{ minHeight: 500 }}>
        {error && (
          <div className="mb-2 px-4 py-2 bg-red-500/80 text-white rounded text-center animate-fade-in">
            {error}
          </div>
        )}
        {/* 模式选择器 */}
        <div className="mb-4">
          <ModeSelector mode={mode} setMode={setMode} />
        </div>
        {/* 聊天历史区 */}
        <div className="flex-1 bg-black/20 rounded-lg p-4 mb-4 custom-scrollbar-hide">
          {messages.length === 0 ? (
            <div className="text-white/50 text-center py-8">
              {t("realtime.startConversation", "Start a conversation to see real-time emoji translation!")}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow overflow-hidden">
                      {aiAvatar && (
                        <Image src={aiAvatar} alt="AI avatar" width={32} height={32} className="w-8 h-8 object-cover" />
                      )}
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow relative ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-sm" : "bg-white/20 text-white rounded-bl-sm border border-white/30"}`}>
                    <div className="text-sm whitespace-pre-line">{msg.content}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs opacity-50 text-right">{msg.timestamp.toLocaleTimeString()}</div>
                      {msg.role === "assistant" && (
                        <button
                          className="ml-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/30 hover:bg-blue-400 text-blue-700 hover:text-white font-bold text-base transition shadow"
                          onClick={async () => {
                            await navigator.clipboard.writeText(msg.content);
                            setCopiedIdx(idx);
                            setTimeout(() => setCopiedIdx(null), 1200);
                          }}
                          title="Copy"
                          aria-label="Copy AI reply"
                        >
                          {copiedIdx === idx ? (
                            <span className="text-xs">✓</span>
                          ) : (
                            <span>C</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-pink-400 flex items-center justify-center shadow overflow-hidden">
                      {userAvatar && (
                        <Image src={userAvatar} alt="User avatar" width={32} height={32} className="w-8 h-8 object-cover" />
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                      {t("realtime.translating", "Translating...")}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        {/* 输入区 */}
        <div className="flex gap-3 items-end">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("realtime.inputPlaceholder", "Type your message...")}
            disabled={isLoading}
            rows={1}
            aria-label="Type your message"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none min-h-[48px] max-h-40 overflow-y-auto"
            style={{height: 'auto'}}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white rounded-lg transition-colors"
            aria-label="Send message"
          >
            {t("realtime.send", "Send")}
          </button>
        </div>
        {/* 分享按钮和付费提示可根据需要保留/隐藏 */}
      </div>
      <style jsx global>{`
        .custom-scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .custom-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}