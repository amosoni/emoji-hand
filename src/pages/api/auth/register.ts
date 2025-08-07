import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../server/db';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const getI18nText = (lang: string, key: string): string => {
  // 简化：实际项目应从多语言包读取
  const dict: Record<string, Record<string, string>> = {
    en: {
      subject: 'Verify your email',
      hello: 'Hello',
      body: 'Please click the link below to verify your email:',
      button: 'Verify Email',
      ignore: 'If you did not register, please ignore this email.'
    },
    zh: {
      subject: '验证您的邮箱',
      hello: '您好',
      body: '请点击下方链接完成邮箱验证：',
      button: '验证邮箱',
      ignore: '如果不是您本人注册，请忽略此邮件。'
    },
    ja: {
      subject: 'メールアドレス認証',
      hello: 'こんにちは',
      body: '以下のリンクをクリックしてメールアドレスを認証してください：',
      button: 'メール認証',
      ignore: 'このメールに心当たりがない場合は無視してください。'
    },
    ko: {
      subject: '이메일 인증',
      hello: '안녕하세요',
      body: '아래 링크를 클릭하여 이메일 인증을 완료하세요:',
      button: '이메일 인증',
      ignore: '본인이 가입하지 않았다면 이 메일을 무시하세요.'
    },
    es: {
      subject: 'Verifica tu correo electrónico',
      hello: 'Hola',
      body: 'Haz clic en el siguiente enlace para verificar tu correo electrónico:',
      button: 'Verificar correo',
      ignore: 'Si no te registraste, ignora este correo.'
    },
    fr: {
      subject: 'Vérifiez votre e-mail',
      hello: 'Bonjour',
      body: 'Veuillez cliquer sur le lien ci-dessous pour vérifier votre e-mail :',
      button: 'Vérifier l’e-mail',
      ignore: 'Si vous n’êtes pas à l’origine de cette inscription, ignorez cet e-mail.'
    },
    pt: {
      subject: 'Verifique seu e-mail',
      hello: 'Olá',
      body: 'Clique no link abaixo para verificar seu e-mail:',
      button: 'Verificar e-mail',
      ignore: 'Se você não se registrou, ignore este e-mail.'
    },
    de: {
      subject: 'Bestätigen Sie Ihre E-Mail',
      hello: 'Hallo',
      body: 'Bitte klicken Sie auf den untenstehenden Link, um Ihre E-Mail zu bestätigen:',
      button: 'E-Mail bestätigen',
      ignore: 'Wenn Sie sich nicht registriert haben, ignorieren Sie diese E-Mail.'
    },
    it: {
      subject: 'Verifica la tua email',
      hello: 'Ciao',
      body: 'Clicca sul link qui sotto per verificare la tua email:',
      button: 'Verifica email',
      ignore: 'Se non ti sei registrato, ignora questa email.'
    },
    ru: {
      subject: 'Подтвердите вашу почту',
      hello: 'Здравствуйте',
      body: 'Пожалуйста, перейдите по ссылке ниже, чтобы подтвердить вашу почту:',
      button: 'Подтвердить почту',
      ignore: 'Если вы не регистрировались, просто проигнорируйте это письмо.'
    }
  };
  return dict[lang]?.[key] ?? dict.en?.[key] ?? '';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password, username, lang = 'en' } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (password.length < 6) return res.status(400).json({ error: 'Password too short' });
  try {
    const exists = await prisma.user.findFirst({ where: { email: { equals: email } } });
    if (exists) return res.status(409).json({ error: 'User already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, name: username || email.split('@')[0] } });

    // 生成邮箱验证码token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30分钟有效
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    });

    // 发送多语言激活邮件（即使失败也不影响注册成功）
    try {
      const verifyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
      const html = `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;">
          <h2>${getI18nText(lang, 'hello')},</h2>
          <p>${getI18nText(lang, 'body')}</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">${getI18nText(lang, 'button')}</a>
          <p style="color:#888;font-size:12px;">${verifyUrl}</p>
          <p style="color:#888;font-size:12px;">${getI18nText(lang, 'ignore')}</p>
        </div>
      `;
              await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: getI18nText(lang, 'subject'),
          html
        });
      console.log('Email sent successfully to:', email);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // 邮件发送失败不影响注册成功
    }

    return res.status(201).json({ ok: true, user: { id: user.id, name: user.name, email: user.email }, message: 'register.emailSent' });
  } catch (e) {
    return res.status(500).json({ error: 'Registration failed' });
  }
} 