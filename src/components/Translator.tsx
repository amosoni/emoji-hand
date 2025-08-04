"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ModeSelector from "@/components/ModeSelector";
import { api } from "@/utils/api";
import ShareButton from "@/components/ShareButton";
import { applyBrandSponsorship } from "@/utils/helpers";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useLoginModal } from "@/components/LoginModalContext";
import DouyinEmojiPicker from "@/components/DouyinEmojiPicker";
import { parseDouyinShortcodes } from "@/utils/tiktokEmojis";
// i18n.changeLanguage('en'); // 移除全局强制切换，保留自动检测

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Translator() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"normal" | "savage" | "genz" | "tiktok">("normal");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [freeUses, setFreeUses] = useState(5);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDouyinPicker, setShowDouyinPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const user = session?.user;
  const { show } = useLoginModal();

  // 用 Clerk metadata 判断会员和配额
  // const isPremium = !!user?.premiumExpireAt && new Date(user.premiumExpireAt as string) > new Date();
  // const freeUsesWeekly = user?.freeUsesWeekly ?? 0;
  // const premiumUsesWeekly = user?.premiumUsesWeekly ?? 0;

  // 随机头像列表
  const avatarList = Array.from({ length: 28 }, (_, i) => `/images/beanhead (${i + 1}).svg`);
  const [aiAvatar] = useState(() => avatarList[Math.floor(Math.random() * avatarList.length)]);
  const [userAvatar] = useState(() => avatarList[Math.floor(Math.random() * avatarList.length)]);

  // 判断是否会员
  const premiumExpireAt = typeof user === 'object' && user && 'premiumExpireAt' in user ? (user as { premiumExpireAt?: string | null }).premiumExpireAt : null;
  const isPremium = !!premiumExpireAt && new Date(premiumExpireAt) > new Date();
  const availableModes = isPremium ? ["normal", "savage", "genz", "tiktok"] : ["normal"];

  useEffect(() => {
    const saved = localStorage.getItem("freeUses");
    if (saved) setFreeUses(parseInt(saved));
    else localStorage.setItem("freeUses", "5");
  }, []);

  const { mutateAsync, isPending } = api.emoji.translate.useMutation();
  const { data: usageStats, isLoading: usageLoading, refetch: refetchUsage } = api.usageLimits.getUserUsageStats.useQuery(
    undefined,
    { 
      enabled: true, // 总是启用查询，无论用户是否登录
      refetchInterval: 5000 // 每5秒刷新一次
    }
  );
  const recordUsageMutation = api.usageLimits.recordServiceUsage.useMutation();

  // 调试信息
  useEffect(() => {
    console.log('Translator Debug:', {
      user: !!user,
      usageStats,
      usageLoading
    });
  }, [user, usageStats, usageLoading]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText("");
    setIsLoading(true);
    setError("");

    // 添加用户消息
    setMessages(prev => [...prev, {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }]);

    try {
      // 调用翻译API
      const result = await mutateAsync({
        text: userMessage,
        mode: mode
      });

      // 添加AI回复
      setMessages(prev => [...prev, {
        role: "assistant",
        content: result.result,
        timestamp: new Date(),
      }]);
      
      // 记录使用量并立即刷新统计数据
      if (user) {
        await recordUsageMutation.mutateAsync({
          service: 'translation'
        });
        // 立即刷新使用量统计
        await refetchUsage();
      }
    } catch (err: any) {
      setError(err?.message ?? '服务异常');
    }
    setIsLoading(false);
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
      {/* 使用量显示 */}
      {user && usageStats && (
        <div className="mb-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between text-white">
            <span className="text-sm">{t('translationUsage', 'Translation Usage')}: {usageStats.usage.translation.used} / {usageStats.usage.translation.limit}</span>
            <div className="w-32 bg-white/20 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (usageStats.usage.translation.used / usageStats.usage.translation.limit) * 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* 移除 userProfile 相关 UI，保留风格选择器和弹窗 */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 flex flex-col min-h-[500px]" style={{ minHeight: 500 }}>
        {error && (
          <div className="mb-2 px-4 py-2 bg-red-500/80 text-white rounded text-center animate-fade-in">
            {error}
          </div>
        )}
        {/* {premiumUsesWeekly === 0 && freeUsesWeekly === 0 && (
          <div className="mt-4 p-4 bg-yellow-200 text-yellow-900 rounded text-center font-bold">
            {t('quota.exhausted', '今日额度已用完，升级会员仅需 $9.99/month，立即解锁每天15次全部风格和GPT-4.0!')}
          </div>
        )} */}
        {/* 模式选择器 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["normal", "savage", "genz", "tiktok"] as const).map((modeOption) => (
            <button
              key={modeOption}
              className={`px-4 py-2 rounded-lg font-bold text-lg transition ${mode === modeOption ? "bg-pink-200 text-pink-700" : "bg-pink-100 text-pink-500"} ${!availableModes.includes(modeOption) ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (!availableModes.includes(modeOption)) {
                  setShowPaywall(true);
                  return;
                }
                setMode(modeOption);
              }}
              title={!availableModes.includes(modeOption) ? t('paywall.desc', '升级会员解锁全部风格和GPT-4.0') : ""}
            >
              {modeOption === "normal" && `${t('style.normal', 'Normal')} ✨`}
              {modeOption === "savage" && `${t('style.savage', 'Savage')} 🔥`}
              {modeOption === "genz" && `${t('style.genz', 'GenZ Slang')} 😎`}
              {modeOption === "tiktok" && `${t('style.tiktok', 'TikTok')} 🎵`}
            </button>
          ))}
        </div>
        {showPaywall && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <h2 className="text-xl font-bold mb-2">{t('paywall.title', '会员专属风格')}</h2>
              <p className="mb-4">{t('paywall.desc', '升级会员即可解锁全部风格和GPT-4.0！')}</p>
              <button className="bg-pink-500 text-white px-6 py-2 rounded-lg font-bold" onClick={() => setShowPaywall(false)}>{t('paywall.iknow', '我知道了')}</button>
            </div>
          </div>
        )}
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
              {isPending && (
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
        {/* 抖音表情选择器 */}
        {showDouyinPicker && (
          <div className="mb-4">
            <DouyinEmojiPicker
              onSelect={(emoji) => {
                setInputText(prev => prev + emoji);
              }}
              onSelectShortcode={(shortcode) => {
                setInputText(prev => prev + shortcode);
              }}
            />
          </div>
        )}
        
        {/* 输入区 */}
        <div className="flex gap-3 items-end">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("realtime.inputPlaceholder", "Type your message...")}
            disabled={isPending}
            rows={1}
            aria-label="Type your message"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none min-h-[48px] max-h-40 overflow-y-auto"
            style={{height: 'auto'}}
          />
          <button
            onClick={() => setShowDouyinPicker(!showDouyinPicker)}
            className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            aria-label="Toggle Douyin emoji picker"
          >
            🎵
          </button>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isPending}
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