"use client";

function openShare(platform: string) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  switch (platform) {
    case 'x':
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`,'_blank');
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`,'_blank');
      break;
    case 'instagram':
      window.open(`https://www.instagram.com/`,'_blank'); // Instagram 无官方网页分享接口，跳主页
      break;
    case 'linkedin':
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`,'_blank');
      break;
    case 'reddit':
      window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`,'_blank');
      break;
    case 'whatsapp':
      window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`,'_blank');
      break;
    case 'telegram':
      window.open(`https://t.me/share/url?url=${url}&text=${title}`,'_blank');
      break;
    default:
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied! Paste to share anywhere.');
  }
}

export default function ShareFooter() {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-2 text-3xl text-yellow-400">
      <button aria-label="Share to X" className="hover:scale-110 transition bg-transparent border-0 p-0" onClick={() => openShare('x')}>
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32"><path d="M19.5 14.1L28.2 4h-2.1l-7.6 8.7L12 4H4.5l9.2 13.1L4.5 28h2.1l8.1-9.3 6.7 9.3h7.5L19.5 14.1zm-2.9 3.3l-1-1.4-7.5-10.7h4.1l6 8.6 1 1.4 7.8 11.1h-4.1l-6.3-9z"/></svg>
      </button>
      <button aria-label="Share to Facebook" className="hover:scale-110 transition bg-transparent border-0 p-0" onClick={() => openShare('facebook')}>
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32"><path d="M29 16A13 13 0 1 0 16 29V19h-3v-3h3v-2.2c0-3 1.8-4.7 4.5-4.7 1.3 0 2.6.2 2.6.2v3h-1.5c-1.5 0-2 .9-2 1.9V16h3.4l-.5 3H19v10A13 13 0 0 0 29 16z"/></svg>
      </button>
      <button aria-label="Share to Instagram" className="hover:scale-110 transition bg-transparent border-0 p-0" onClick={() => openShare('instagram')}>
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32"><rect x="6" y="6" width="20" height="20" rx="6"/><circle cx="16" cy="16" r="6" fill="#fff"/><circle cx="23" cy="9" r="1.5"/></svg>
      </button>
      <button aria-label="Share to LinkedIn" className="hover:scale-110 transition bg-transparent border-0 p-0" onClick={() => openShare('linkedin')}>
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32"><path d="M27 27h-4.5v-7c0-1.7-.6-2.8-2.1-2.8-1.1 0-1.7.7-2 1.4-.1.2-.1.5-.1.8v7.6H14V14h4.3v1.8c.6-.9 1.6-2.1 3.8-2.1 2.8 0 4.9 1.8 4.9 5.7V27zM7.5 12.2a2.6 2.6 0 1 1 2.6-2.6 2.6 2.6 0 0 1-2.6 2.6zm2.2 14.8H5.3V14h4.4zm17.3-22.5H5.3A2.3 2.3 0 0 0 3 4.5v23A2.3 2.3 0 0 0 5.3 30h21.7A2.3 2.3 0 0 0 29 27.5v-23A2.3 2.3 0 0 0 27.5 2.5z"/></svg>
      </button>
      <button aria-label="Share to Reddit" className="hover:scale-110 transition bg-transparent border-0 p-0" onClick={() => openShare('reddit')}>
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14"/><circle cx="10.5" cy="18" r="2" fill="#fff"/><circle cx="21.5" cy="18" r="2" fill="#fff"/><ellipse cx="16" cy="22" rx="5" ry="2" fill="#fff"/><circle cx="16" cy="12" r="1.5" fill="#fff"/></svg>
      </button>
      <button aria-label="Share to WhatsApp" className="hover:scale-110 transition bg-transparent border-0 p-0" onClick={() => openShare('whatsapp')}>
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14"/><path d="M10 22l2-5c-1-2 0-4 2-5s4 0 5 2l5 2-2 5c-1 2-4 3-6 2s-3-4-2-6z" fill="#fff"/></svg>
      </button>
      <button aria-label="Share to Telegram" className="hover:scale-110 transition bg-transparent border-0 p-0" onClick={() => openShare('telegram')}>
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14"/><path d="M24 8l-3 14c-.2.8-.7 1-1.4.7l-4-3-2 2c-.2.2-.4.3-.7.2l.3-4.2 9-8.2c.4-.3.8.1.7.5z" fill="#fff"/></svg>
      </button>
    </div>
  );
} 