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
      const isSslAttempt = attempt === maxRetries;
      const port = isSslAttempt ? 465 : 587;
      const secure = isSslAttempt;

      console.log(`📧 [SMTP] Attempt ${attempt}/${maxRetries}: Dispatching email to ${mailOptions.to} via smtp.gmail.com:${port}...`);

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port,
        secure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
        // Force IPv4 because cloud runners like Render do not support outbound IPv6
        family: 4,
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 15000,
      } as any);

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ [SMTP] Email successfully delivered to ${mailOptions.to} on attempt ${attempt}! MessageId: ${info.messageId}`);
      return info;
    } catch (err: any) {
      console.warn(`⚠️ [SMTP] Attempt ${attempt}/${maxRetries} failed: ${err.message || err}`);
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, 1200));
      }
    }
  }

  throw lastError || new Error(`All ${maxRetries} SMTP delivery attempts timed out.`);
};
