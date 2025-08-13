import { Resend } from 'resend';

// 从环境变量获取API密钥，避免硬编码
const resend = new Resend(process.env.RESEND_API_KEY || 'your-api-key-here');

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['test@example.com'], // 使用测试邮箱
      subject: 'Test Email from EmojiHand',
      html: '<p>This is a test email from EmojiHand using Resend</p>'
    });
    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}

testEmail(); 