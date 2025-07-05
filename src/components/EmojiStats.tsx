"use client";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function EmojiStats() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/emoji-stats")
      .then(res => res.json())
      .then(data => setStats(data.stats || {}));
  }, []);

  // 自动横向滚动
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let frame: number;
    function animate() {
      if (!el) return;
      // 单一方向右往左
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
        el.scrollLeft = 0; // 回到开头
      } else {
        el.scrollLeft += 0.5; // 速度
      }
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // 示例标签和释义，可根据实际数据完善
  const emojiMeta: Record<string, { label: string; example: string }> = {
    '🎉': { label: 'Party', example: "Let's party tonight! 🎉" },
    '😂': { label: 'Laugh', example: 'That was so funny! 😂' },
    '🥳': { label: 'Celebrate', example: 'Congrats! 🥳' },
    '💥': { label: 'Explosion', example: 'That was epic! 💥' },
    '🔥': { label: 'Hot', example: 'This is on fire! 🔥' },
    // ...可补充更多
  };

  const maxCount = Object.values(stats).length > 0 ? Math.max(...Object.values(stats)) : 1;

  // 常用 emoji 备选池
  const fallbackEmojis = [
    '🎉','😂','🥳','💥','🔥','😍','👍','😎','🤔','🎂','🎈','😄','😅','😆','😉','😊','😋','😜','😝','🤩',
    '👏','🙌','🙏','💯','🎁','🎵','🎶','🍰','🍕','🍔','🍟','🍺','🍻','🍦','🍩','🍪','🍫','🍿','🥤','🥇','🏆'
  ];

  // 组装展示用的 emoji 列表，优先用 stats，数量不足补 fallback
  const statsEntries = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  const usedEmojis = new Set(statsEntries.map(([emoji]) => emoji));
  const fillEmojis = fallbackEmojis.filter(e => !usedEmojis.has(e)).slice(0, 30 - statsEntries.length);
  const displayEmojis = [
    ...statsEntries,
    ...fillEmojis.map(e => [e, 1] as [string, number])
  ].slice(0, 30);

  return (
    <div className="mt-8 w-full flex flex-col items-center gap-4">
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto custom-scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-8 min-w-max py-2 px-1">
          {displayEmojis.length === 0 ? (
            Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="w-24 h-24 flex items-center justify-center animate-pulse opacity-60 text-6xl" />
            ))
          ) : (
            displayEmojis.map(([emoji, count], i) => {
              const meta = emojiMeta[emoji] || { label: 'Popular', example: '' };
              const percent = Math.round((count / maxCount) * 100);
              return (
                <div
                  key={emoji}
                  className="relative flex flex-col items-center justify-center flex-shrink-0 cursor-pointer group"
                  title={meta.example}
                  style={{ width: 128, height: 128 }}
                >
                  <span className="text-8xl select-none">{emoji}</span>
                  <span className="text-xs text-indigo-700 font-semibold mt-1">x{count}</span>
                  {/* 可选：悬停显示释义 */}
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {meta.label}<br />
                    <i>{meta.example}</i>
                  </span>
                  {i === 0 && <span className="absolute -top-2 -right-2 text-lg">🔥</span>}
                </div>
              );
            })
          )}
        </div>
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