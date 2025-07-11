import { useState } from 'react';
import { api } from '~/utils/api';
import { CaptchaModal } from '@/components/CaptchaModal';

export const EmojiTranslator = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);

  const translateMutation = api.emoji.translate.useMutation();

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const result = await translateMutation.mutateAsync({
        text: inputText,
        mode: 'emoji'
      });
      setOutputText(result.result);
    } catch (err: any) {
      // 检查是否是安全相关的错误
      if (err.message?.includes('rate limit') || 
          err.message?.includes('suspicious') ||
          err.message?.includes('blacklisted')) {
        setShowCaptcha(true);
      } else {
        setError(err.message || 'Translation failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaSuccess = () => {
    // 验证码验证成功后重试翻译
    handleTranslate();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Emoji Translator</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your text:
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleTranslate}
          disabled={isLoading || !inputText.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Translating...' : 'Translate to Emoji'}
        </button>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {outputText && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Result:
            </label>
            <div className="bg-gray-100 p-4 rounded-md min-h-20">
              {outputText}
            </div>
          </div>
        )}
      </div>

      <CaptchaModal
        isOpen={showCaptcha}
        onClose={() => setShowCaptcha(false)}
        onSuccess={handleCaptchaSuccess}
      />
    </div>
  );
}; 