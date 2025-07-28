"use client";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DouyinEmojiPicker from './DouyinEmojiPicker';

export default function DouyinEmojiPickerDemo() {
  const { t } = useTranslation();
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [selectedShortcode, setSelectedShortcode] = useState<string>('');

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    console.log('Selected emoji:', emoji);
  };

  const handleShortcodeSelect = (shortcode: string) => {
    setSelectedShortcode(shortcode);
    console.log('Selected shortcode:', shortcode);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <DouyinEmojiPicker
        onSelect={handleEmojiSelect}
        onSelectShortcode={handleShortcodeSelect}
      />
      
      {/* 显示选中的内容 */}
      {(selectedEmoji || selectedShortcode) && (
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
          <h4 className="text-lg font-bold text-white mb-2">{t('tiktok.demo.selected.title', 'Selected Content:')}</h4>
          {selectedEmoji && (
            <div className="mb-2">
              <span className="text-white/80">{t('tiktok.demo.selected.emoji', 'Emoji:')}</span>
              <span className="text-2xl ml-2">{selectedEmoji}</span>
            </div>
          )}
          {selectedShortcode && (
            <div>
              <span className="text-white/80">{t('tiktok.demo.selected.shortcode', 'Shortcode:')}</span>
              <span className="text-lg ml-2 font-mono bg-white/20 px-2 py-1 rounded">
                {selectedShortcode}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 