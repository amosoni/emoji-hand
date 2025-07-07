import { useState, useEffect } from 'react';
import { api } from '~/utils/api';

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CaptchaModal = ({ isOpen, onClose, onSuccess }: CaptchaModalProps) => {
  const [captchaId, setCaptchaId] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const generateCaptcha = api.captcha.generate.useMutation();
  const verifyCaptcha = api.captcha.verify.useMutation();

  const handleGenerateCaptcha = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await generateCaptcha.mutateAsync();
      setCaptchaId(result.captchaId);
      setQuestion(result.question);
    } catch (err) {
      setError('Failed to generate captcha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!answer.trim()) {
      setError('Please enter your answer');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await verifyCaptcha.mutateAsync({ captchaId, answer });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Incorrect answer, please try again');
      setAnswer('');
      // 重新生成验证码
      await handleGenerateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  // 当模态框打开时自动生成验证码
  useEffect(() => {
    if (isOpen && !captchaId) {
      handleGenerateCaptcha();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Security Verification</h2>
        <p className="text-gray-600 mb-4">
          To protect against abuse, please complete this verification:
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solve this math problem:
          </label>
          <div className="bg-gray-100 p-3 rounded text-center text-lg font-mono">
            {question}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your answer:
          </label>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your answer"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleGenerateCaptcha}
            disabled={isLoading}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            Generate new captcha
          </button>
        </div>
      </div>
    </div>
  );
}; 