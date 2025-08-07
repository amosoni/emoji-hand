import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function EmailVerificationBanner() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  // 如果用户已登录但邮箱未验证，显示横幅
  const user = session?.user as { emailVerified?: Date | null } | undefined;
  if (!user || user.emailVerified !== null || !isVisible) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {t('emailVerification.pleaseVerify', 'Please verify your email address to unlock all features.')}
          </p>
          <div className="mt-2">
            <button
              type="button"
              className="bg-yellow-400 px-2 py-1 rounded text-xs font-medium text-yellow-900 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              onClick={() => {
                // 这里可以添加重新发送验证邮件的逻辑
                alert(t('emailVerification.resendEmail', 'Verification email will be resent.'));
              }}
            >
              {t('emailVerification.resend', 'Resend Email')}
            </button>
            <button
              type="button"
              className="ml-2 text-xs text-yellow-600 hover:text-yellow-500"
              onClick={() => setIsVisible(false)}
            >
              {t('emailVerification.dismiss', 'Dismiss')}
            </button>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
              onClick={() => setIsVisible(false)}
            >
              <span className="sr-only">{t('emailVerification.dismiss', 'Dismiss')}</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 