import { Resend } from 'resend';

const resend = new Resend('re_KcVHk5AJ_5J35NRAgKQxHMxDRHe8gtzpY');

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['soniceono@gmail.com'],
      subject: 'Test Email from EmojiHand',
      html: '<p>This is a test email from EmojiHand using Resend</p>'
    });
    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}

testEmail(); 