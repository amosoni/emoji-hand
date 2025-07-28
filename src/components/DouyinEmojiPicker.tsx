"use client";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DOUYIN_SHORTCODES, 
  DOUYIN_COMBINATIONS, 
  DOUYIN_CATEGORIES,
  DOUYIN_POPULAR_EMOJIS,
  getDouyinMeaning,
  getDouyinExample
} from '@/utils/tiktokEmojis';
import TikTokEmojiImage from '@/components/TikTokEmojiImage';
import i18n from '@/i18n';

interface DouyinEmojiPickerProps {
  onSelect: (emoji: string) => void;
  onSelectShortcode: (shortcode: string) => void;
}

export default function DouyinEmojiPicker({ onSelect, onSelectShortcode }: DouyinEmojiPickerProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'shortcodes' | 'combinations' | 'popular' | 'categories'>('shortcodes');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    onSelect(emoji);
  };

  const handleShortcodeClick = (shortcode: string) => {
    onSelectShortcode(shortcode);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
      <h3 className="text-lg font-bold text-white mb-4">{t('tiktok.page.official.title', '🎵 Official TikTok Emojis')}</h3>
      
      {/* 标签页 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('shortcodes')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'shortcodes' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/20 text-white/80 hover:bg-white/30'
          }`}
        >
          {t('tiktok.picker.shortcodes', 'Shortcodes')}
        </button>
        <button
          onClick={() => setActiveTab('combinations')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'combinations' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/20 text-white/80 hover:bg-white/30'
          }`}
        >
          {t('tiktok.picker.combinations', 'Combinations')}
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'popular' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/20 text-white/80 hover:bg-white/30'
          }`}
        >
          {t('tiktok.picker.popular', 'Popular')}
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'categories' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/20 text-white/80 hover:bg-white/30'
          }`}
        >
          {t('tiktok.picker.categories', 'Categories')}
        </button>
      </div>

      {/* 内容区域 */}
      <div className="max-h-64 overflow-y-auto">
        {activeTab === 'shortcodes' && (
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(DOUYIN_SHORTCODES).map(([shortcode, emoji]) => (
              <button
                key={shortcode}
                onClick={() => handleShortcodeClick(shortcode)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
                title={`${shortcode} - ${emoji}`}
              >
                <div className="text-lg mb-1">
                  <TikTokEmojiImage shortcode={shortcode} size={24} />
                </div>
                <div className="text-xs text-white/70">{shortcode}</div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'combinations' && (
          <div className="space-y-3">
            {Object.entries(DOUYIN_COMBINATIONS).map(([combination, meaningObj]) => {
              const meaning = typeof meaningObj === 'string' ? meaningObj : 
                (i18n.language === 'ja' ? meaningObj.ja : 
                 i18n.language === 'ko' ? meaningObj.ko : meaningObj.en);
              return (
                <button
                  key={combination}
                  onClick={() => handleEmojiClick(combination)}
                  className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left"
                >
                  <div className="text-xl mb-1">{combination}</div>
                  <div className="text-sm text-white/70">{meaning}</div>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'popular' && (
          <div className="grid grid-cols-8 gap-2">
            {DOUYIN_POPULAR_EMOJIS.map((emoji) => {
              // 根据emoji找到对应的shortcode
              const shortcode = Object.entries(DOUYIN_SHORTCODES).find(([_, e]) => e === emoji)?.[0];
              return (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center text-lg"
                  title={getDouyinMeaning(emoji) ?? emoji}
                >
                  {shortcode ? (
                    <TikTokEmojiImage shortcode={shortcode} size={24} />
                  ) : (
                    emoji
                  )}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-4">
            {Object.entries(DOUYIN_CATEGORIES).map(([category, emojis]) => (
              <div key={category}>
                <h4 className="text-sm font-bold text-white/80 mb-2 capitalize">
                  {t(`tiktok.guide.categories.${category}`, category.replace(/([A-Z])/g, ' $1').trim())}
                </h4>
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map((emoji) => {
                    // 根据emoji找到对应的shortcode
                    const shortcode = Object.entries(DOUYIN_SHORTCODES).find(([_, e]) => e === emoji)?.[0];
                    return (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiClick(emoji)}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center text-lg"
                        title={getDouyinMeaning(emoji) ?? emoji}
                      >
                        {shortcode ? (
                          <TikTokEmojiImage shortcode={shortcode} size={24} />
                        ) : (
                          emoji
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 选中表情的详细信息 */}
      {selectedEmoji && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{selectedEmoji}</span>
            <span className="text-sm text-white/70">
              {getDouyinMeaning(selectedEmoji) ?? t('tiktok.emoji.default', 'TikTok Emoji')}
            </span>
          </div>
          {getDouyinExample(selectedEmoji) && (
            <div className="text-sm text-white/60">
              {t('tiktok.emoji.example', 'Example:')} {getDouyinExample(selectedEmoji)}
            </div>
          )}
        </div>
      )}

      {/* 使用说明 */}
      <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
        <h4 className="text-sm font-bold text-white mb-2">💡 {t('tiktok.picker.instructions.title', 'Usage Instructions')}</h4>
        <ul className="text-xs text-white/80 space-y-1">
          <li>• {t('tiktok.picker.instructions.tip1', 'Click shortcodes to insert directly into input box')}</li>
          <li>• {t('tiktok.picker.instructions.tip2', 'Combination emojis are suitable for expressing complex emotions')}</li>
          <li>• {t('tiktok.picker.instructions.tip3', 'Popular emojis are most commonly used by TikTok users')}</li>
          <li>• {t('tiktok.picker.instructions.tip4', 'Categorized emojis are organized by function for easy finding')}</li>
        </ul>
      </div>
    </div>
  );
} 