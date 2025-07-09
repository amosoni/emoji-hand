"use client";
import { useEffect } from "react";
import { useLoginModal } from "./LoginModalContext";
import { useTranslation } from 'react-i18next';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginModal() {
  const { open, close } = useLoginModal();
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        await signIn('credentials', { email, password, redirect: false });
        close();
      } else {
        setError(data.error || t('register.error', 'Registration failed'));
      }
    } catch (err) {
      setError(t('register.error', 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.ok) {
        setSuccess(true);
        close();
      } else {
        setError(t('login.error', 'Login failed'));
      }
    } catch (err) {
      setError(t('login.error', 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Close">×</button>
        <h2 className="modal-title">
          {mode === 'login' ? t('login.title', 'Sign in to emojihand') : t('register.title', 'Create your account')}
        </h2>
        <div className="modal-desc">
          {mode === 'login' ? t('login.desc', 'Welcome! Please sign in to continue') : t('register.desc', 'Welcome! Please fill in the details to get started.')}
        </div>
        <button
          className="login-google-btn"
          onClick={() => signIn('google')}
        >
          <span className="google-icon">G</span> {t('login.google', 'Continue with Google')}
        </button>
        <div className="modal-divider">
          <span>{t('login.or', 'or')}</span>
        </div>
        {mode === 'register' ? (
          <form onSubmit={handleRegister} className="login-form">
            <label className="modal-label">{t('register.usernameLabel', 'Username')}</label>
            <input
              className="modal-input"
              type="text"
              placeholder={t('register.usernamePlaceholder', 'Enter your username')}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
            <label className="modal-label">{t('register.emailLabel', 'Email address')}</label>
            <input
              className="modal-input"
              type="email"
              placeholder={t('register.emailPlaceholder', 'Enter your email address')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <label className="modal-label">{t('register.passwordLabel', 'Password')}</label>
            <input
              className="modal-input"
              type="password"
              placeholder={t('register.passwordPlaceholder', 'Enter your password')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button className="login-continue-btn" type="submit" disabled={loading}>
              {loading ? t('register.loading', 'Registering...') : t('register.continue', 'Continue')}
            </button>
            {error && <div className="modal-error">{error}</div>}
            {success && <div className="modal-success">{t('register.success', 'Registration successful!')}</div>}
          </form>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <label className="modal-label">{t('login.emailLabel', 'Email address or username')}</label>
            <input
              className="modal-input"
              type="text"
              placeholder={t('login.emailPlaceholder', 'Enter email or username')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <label className="modal-label">{t('login.passwordLabel', 'Password')}</label>
            <input
              className="modal-input"
              type="password"
              placeholder={t('login.passwordPlaceholder', 'Enter your password')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button className="login-continue-btn" type="submit" disabled={loading}>
              {loading ? t('login.loading', 'Logging in...') : t('login.continue', 'Continue')}
            </button>
            {error && <div className="modal-error">{error}</div>}
            {success && <div className="modal-success">{t('login.success', 'Login successful!')}</div>}
          </form>
        )}
        <div className="modal-bottom">
          {mode === 'login' ? (
            <>
              {t('login.noAccount', "Don't have an account?")} <span className="modal-link" onClick={() => { setMode('register'); setError(''); }}>{t('login.signup', 'Sign up')}</span>
            </>
          ) : (
            <>
              {t('register.hasAccount', 'Already have an account?')} <span className="modal-link" onClick={() => { setMode('login'); setError(''); }}>{t('register.signin', 'Sign in')}</span>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 9999;
        }
        .modal-content {
          background: #fff; border-radius: 18px; padding: 32px 32px 24px 32px; min-width: 370px; max-width: 90vw;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          position: relative;
          display: flex; flex-direction: column; align-items: stretch;
        }
        .modal-close {
          position: absolute; right: 18px; top: 18px; background: none; border: none; font-size: 1.5rem; color: #888; cursor: pointer;
        }
        .modal-title {
          font-size: 1.35rem; font-weight: bold; text-align: center; margin-bottom: 4px;
        }
        .modal-desc {
          text-align: center; color: #888; font-size: 1rem; margin-bottom: 18px;
        }
        .login-google-btn {
          display: flex; align-items: center; justify-content: center;
          background: #fff; border: 1px solid #eee; border-radius: 8px; font-size: 1rem; font-weight: 500;
          padding: 10px 0; margin-bottom: 12px; cursor: pointer; transition: box-shadow .2s;
        }
        .login-google-btn:hover {
          box-shadow: 0 2px 8px rgba(66,133,244,0.08);
        }
        .google-icon {
          font-family: Arial, sans-serif; font-weight: bold; color: #4285F4; font-size: 1.2em; margin-right: 8px;
        }
        .modal-divider {
          display: flex; align-items: center; text-align: center; color: #bbb; margin: 12px 0 16px 0; font-size: 0.95rem;
        }
        .modal-divider:before, .modal-divider:after {
          content: ""; flex: 1; border-bottom: 1px solid #eee; margin: 0 8px;
        }
        .login-form {
          display: flex; flex-direction: column; gap: 8px;
        }
        .modal-label {
          font-size: 0.98rem; color: #444; margin-bottom: 2px;
        }
        .modal-input {
          border: 1px solid #ddd; border-radius: 7px; padding: 10px; font-size: 1rem; outline: none;
        }
        .modal-input:focus {
          border-color: #a259ff;
        }
        .login-continue-btn {
          background: linear-gradient(90deg, #222 60%, #888 100%);
          color: #fff; border: none; border-radius: 7px; padding: 10px 0; font-size: 1.08rem; font-weight: 500;
          margin-top: 8px; cursor: pointer; transition: background .2s;
        }
        .login-continue-btn:disabled {
          background: #ccc; color: #fff; cursor: not-allowed;
        }
        .modal-error {
          color: #d32f2f; font-size: 0.97rem; margin-top: 4px; text-align: center;
        }
        .modal-success {
          color: #388e3c; font-size: 0.97rem; margin-top: 4px; text-align: center;
        }
        .modal-bottom {
          text-align: center; color: #888; font-size: 0.97rem; margin-top: 18px;
        }
        .modal-link {
          color: #a259ff; cursor: pointer; text-decoration: underline; margin-left: 2px;
        }
      `}</style>
    </div>
  );
} 