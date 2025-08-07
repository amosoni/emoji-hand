import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/server/db';

const getI18nText = (lang: string, key: string): string => {
  const dict: Record<string, Record<string, string>> = {
    en: {
      success: 'Email verified successfully! You can now login.',
      expired: 'Verification link expired or invalid.',
      already: 'Email already verified. Please login.',
      error: 'Verification failed. Please try again.'
    },
    zh: {
      success: '邮箱验证成功！请登录。',
      expired: '验证链接已失效或无效。',
      already: '邮箱已验证，请直接登录。',
      error: '验证失败，请重试。'
    },
    ja: {
      success: 'メール認証が完了しました。ログインできます。',
      expired: '認証リンクが無効または期限切れです。',
      already: 'メールはすでに認証済みです。ログインしてください。',
      error: '認証に失敗しました。再度お試しください。'
    },
    ko: {
      success: '이메일 인증이 완료되었습니다. 로그인하세요.',
      expired: '인증 링크가 만료되었거나 잘못되었습니다.',
      already: '이미 인증된 이메일입니다. 로그인하세요.',
      error: '인증에 실패했습니다. 다시 시도하세요.'
    },
    es: {
      success: '¡Correo verificado! Ahora puedes iniciar sesión.',
      expired: 'El enlace de verificación es inválido o ha expirado.',
      already: 'El correo ya está verificado. Por favor inicia sesión.',
      error: 'La verificación falló. Inténtalo de nuevo.'
    },
    fr: {
      success: 'E-mail vérifié avec succès ! Vous pouvez maintenant vous connecter.',
      expired: 'Lien de vérification invalide ou expiré.',
      already: 'E-mail déjà vérifié. Veuillez vous connecter.',
      error: 'Échec de la vérification. Veuillez réessayer.'
    },
    pt: {
      success: 'E-mail verificado! Agora você pode fazer login.',
      expired: 'O link de verificação expirou ou é inválido.',
      already: 'E-mail já verificado. Faça login.',
      error: 'Falha na verificação. Tente novamente.'
    },
    de: {
      success: 'E-Mail erfolgreich verifiziert! Sie können sich jetzt anmelden.',
      expired: 'Der Bestätigungslink ist ungültig oder abgelaufen.',
      already: 'E-Mail bereits verifiziert. Bitte einloggen.',
      error: 'Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
    },
    it: {
      success: 'Email verificata! Ora puoi accedere.',
      expired: 'Il link di verifica è scaduto o non valido.',
      already: 'Email già verificata. Effettua il login.',
      error: 'Verifica fallita. Riprova.'
    },
    ru: {
      success: 'Почта успешно подтверждена! Теперь вы можете войти.',
      expired: 'Ссылка для подтверждения недействительна или истекла.',
      already: 'Почта уже подтверждена. Пожалуйста, войдите.',
      error: 'Ошибка подтверждения. Попробуйте еще раз.'
    }
  };
  return dict[lang]?.[key] ?? dict.en?.[key] ?? '';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, lang = 'en' } = req.query;
  const langStr = Array.isArray(lang) ? lang[0] ?? 'en' : lang ?? 'en';
  
  if (!token || typeof token !== 'string') {
    return res.redirect(302, `/${langStr}/verify-email?status=error&message=${encodeURIComponent(getI18nText(langStr, 'expired'))}`);
  }
  
  try {
    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record || record.expires < new Date()) {
      return res.redirect(302, `/${langStr}/verify-email?status=error&message=${encodeURIComponent(getI18nText(langStr, 'expired'))}`);
    }
    
    const user = await prisma.user.findFirst({ where: { email: record.identifier } });
    if (!user) {
      return res.redirect(302, `/${langStr}/verify-email?status=error&message=${encodeURIComponent(getI18nText(langStr, 'error'))}`);
    }
    
    if (user.emailVerified) {
      return res.redirect(302, `/${langStr}/verify-email?status=already&message=${encodeURIComponent(getI18nText(langStr, 'already'))}`);
    }
    
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
    await prisma.verificationToken.delete({ where: { token } });
    
    // 验证成功，重定向到首页
    return res.redirect(302, `/${langStr}?verified=true`);
  } catch (e) {
    return res.redirect(302, `/${langStr}/verify-email?status=error&message=${encodeURIComponent(getI18nText(langStr, 'error'))}`);
  }
} 