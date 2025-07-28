"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import '../i18n';

interface RealtimeMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function RealtimeTranslator() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"normal" | "savage" | "genz" | "tiktok">("normal");
  const [currentTranslation, setCurrentTranslation] = useState("");
  
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  const initializeConnection = () => {
    try {
      const ws = new WebSocket('ws://localhost:3001');
      
      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received:", data);
          
          if (data.type === "translation") {
            setMessages(prev => [...prev, {
              role: "assistant",
              content: data.content,
              timestamp: new Date()
            }]);
            setIsLoading(false);
            setCurrentTranslation("");
          } else if (data.type === "translation_partial") {
            setCurrentTranslation(prev => prev + data.content);
          } else if (data.type === "error") {
            console.error("Translation error:", data.message);
            setIsLoading(false);
            setCurrentTranslation("");
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
      
      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to initialize WebSocket connection:", error);
      setIsConnected(false);
    }
  };

  // Send message through WebSocket
  const sendMessage = () => {
    if (!wsRef.current || !isConnected || !inputText.trim()) {
      return;
    }

    const message: RealtimeMessage = {
      role: "user",
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setIsLoading(true);
    setCurrentTranslation("");

    // Send through WebSocket
    wsRef.current.send(JSON.stringify({
      type: "translate",
      content: inputText,
      mode: mode
    }));

    setInputText("");
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          🚀 {t("realtime.title", "Real-time Emoji Translation")}
        </h2>

        {/* Connection Status */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-white/80">
              {isConnected ? t("realtime.connected", "Connected") : t("realtime.disconnected", "Disconnected")}
            </span>
            {!isConnected && (
              <button
                onClick={initializeConnection}
                className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {t("realtime.connect", "Connect")}
              </button>
            )}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {(["normal", "savage", "genz", "tiktok"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === m
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {t(`modes.${m}`, m)}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="mb-6 h-96 overflow-y-auto bg-black/20 rounded-lg p-4">
          {messages.length === 0 ? (
            <div className="text-white/50 text-center py-8">
              {t("realtime.startConversation", "Start a conversation to see real-time emoji translation!")}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                      <span>{t("realtime.translating", "Translating...")}</span>
                    </div>
                    {currentTranslation && (
                      <div className="text-sm mt-2 opacity-80">
                        {currentTranslation}
                        <span className="animate-pulse">|</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("realtime.inputPlaceholder", "Type your message...")}
            disabled={!isConnected}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !inputText.trim() || isLoading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white rounded-lg transition-colors"
          >
            {t("realtime.send", "Send")}
          </button>
        </div>
      </div>
    </div>
  );
} 