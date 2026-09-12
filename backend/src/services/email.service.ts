import nodemailer, { SendMailOptions } from 'nodemailer';

// Robust Retry Email Dispatcher for Cloud Runners (Render/AWS)
export const sendEmailWithRetries = async (mailOptions: SendMailOptions, maxRetries = 3) => {
  const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
  const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim().replace(/\s+/g, '') : '';

  if (!smtpUser || !smtpPass) {
    throw new Error('SMTP_USER or SMTP_PASS environment variable is missing on server.');
  }

  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 [SMTP] Attempt ${attempt}/${maxRetries}: Dispatching email to ${mailOptions.to} via smtp.gmail.com:587...`);

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        connectionTimeout: 25000,
        greetingTimeout: 25000,
        socketTimeout: 25000,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      } as any);

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ [SMTP] Email successfully delivered to ${mailOptions.to} on attempt ${attempt}! MessageId: ${info.messageId}`);
      return info;
    } catch (err: any) {
      console.warn(`⚠️ [SMTP] Attempt ${attempt}/${maxRetries} failed: ${err.message || err}`);
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, 1500));
      }
    }
  }

  throw lastError || new Error(`All ${maxRetries} SMTP delivery attempts timed out.`);
};
