"use client";

interface ShareButtonProps {
  text: string;
  label?: string;
}

export default function ShareButton({ text, label }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      // 使用原生 Web Share API
      await navigator.share({
        title: "Emoji Translate",
        text,
        url: window.location.href,
      });
    } else {
      // 兼容不支持 Web Share 的浏览器
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <button
      className="w-full bg-green-500 text-white py-2 rounded mt-2"
      onClick={handleShare}
      disabled={!text}
    >
      {label || "Share / Copy"}
    </button>
  );
}
