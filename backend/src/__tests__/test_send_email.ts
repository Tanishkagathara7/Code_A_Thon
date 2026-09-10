import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testSendEmail() {
  const recipient = 'oneloki05@gmail.com';
  console.log(`\n📧 Testing email delivery to: ${recipient}`);

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.log('\n-------------------------------------------------------------');
    console.log('⚠️ SMTP Credentials (SMTP_USER / SMTP_PASS) are NOT set in backend/.env!');
    console.log('Without real Gmail SMTP credentials, emails are sent to Ethereal sandbox (not real Gmail).');
    console.log('\nTo receive real emails in oneloki05@gmail.com:');
    console.log('1. Go to https://myaccount.google.com/apppasswords');
    console.log('2. Create an App Password for "MindBloom"');
    console.log('3. Add these lines to your backend/.env and Render Environment Variables:');
    console.log('   SMTP_USER=your_sending_gmail@gmail.com');
    console.log('   SMTP_PASS=your_16_char_app_password');
    console.log('-------------------------------------------------------------\n');
    return;
  }

  console.log(`🔑 Using SMTP Account: ${smtpUser}`);

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: process.env.SMTP_FROM || `"MindBloom" <${smtpUser}>`,
    to: recipient,
    subject: 'MindBloom Password Reset Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; border-radius: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin-top: 0;">Password Reset Verification</h2>
        <p style="color: #475569; font-size: 15px; line-height: 22px;">
          You requested to reset your password for <strong>MindBloom</strong>.
        </p>
        <div style="margin: 24px 0; padding: 18px; background-color: #ffffff; border-radius: 12px; text-align: center; border: 1.5px dashed #6366f1;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">${otpCode}</span>
        </div>
        <p style="color: #64748b; font-size: 13px;">This verification code is valid for 15 minutes.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ SUCCESS! Real email sent to ${recipient}. Message ID: ${info.messageId}`);
  } catch (err: any) {
    console.error(`❌ Failed to send email via SMTP:`, err.message);
  }
}

testSendEmail();
