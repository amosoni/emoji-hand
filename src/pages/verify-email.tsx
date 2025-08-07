import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function VerifyEmail() {
  const router = useRouter();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const { token, lang } = router.query;
    if (!token) {
      setStatus('error');
      setMessage(t('verify.invalidToken', 'Invalid verification link.'));
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}&lang=${lang || 'en'}`);
        const data = await res.json();
        
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || t('verify.success', 'Email verified successfully!'));
        } else {
          setStatus('error');
          setMessage(data.error || t('verify.error', 'Verification failed.'));
        }
      } catch (err) {
        setStatus('error');
        setMessage(t('verify.error', 'Verification failed.'));
      }
    };

    verifyEmail();
  }, [router.query, t]);

  const handleLogin = () => {
    router.push('/en');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t('verify.verifying', 'Verifying...')}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'success' ? (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {status === 'success' 
              ? t('verify.successTitle', 'Email Verified!') 
              : t('verify.errorTitle', 'Verification Failed')
            }
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
          {status === 'success' && (
            <div className="mt-6">
              <button
                onClick={handleLogin}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {t('verify.loginNow', 'Login Now')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 