import nodemailer, { SendMailOptions } from 'nodemailer';

/**
 * Dispatches email via Resend HTTPS API (Port 443 - zero firewall blocks on Render).
 */
async function sendViaResend(apiKey: string, mailOptions: SendMailOptions) {
  // Resend requires sending from a verified domain. By default on free accounts, that is onboarding@resend.dev.
  // Never send from @gmail.com or @yahoo.com through Resend unless the custom domain is verified.
  let from = process.env.RESEND_FROM?.trim() || 'onboarding@resend.dev';
  if (typeof mailOptions.from === 'string' && !mailOptions.from.includes('gmail.com') && !mailOptions.from.includes('yahoo.com')) {
    from = mailOptions.from;
  }
  const to = Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to as string];

  console.log(`🚀 [EMAIL] Dispatching email to ${to.join(', ')} via Resend HTTPS API (Port 443)...`);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) {
    throw new Error(data?.message || `Resend HTTP error ${res.status}: ${JSON.stringify(data)}`);
  }

  console.log(`✅ [EMAIL] Delivered via Resend HTTPS! ID: ${data?.id}`);
  return { messageId: data?.id };
}

/**
 * Dispatches email via SendGrid HTTPS API (Port 443).
 */
async function sendViaSendGrid(apiKey: string, mailOptions: SendMailOptions) {
  const from = typeof mailOptions.from === 'string' ? mailOptions.from : (process.env.SENDGRID_FROM || 'no-reply@hackathon.dev');
  const to = Array.isArray(mailOptions.to) 
    ? mailOptions.to.map((t) => ({ email: String(t) }))
    : [{ email: String(mailOptions.to) }];

  console.log(`🚀 [EMAIL] Dispatching email via SendGrid HTTPS API (Port 443)...`);

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      personalizations: [{ to }],
      from: { email: from.includes('<') ? from.replace(/.*<([^>]+)>.*/, '$1') : from },
      subject: mailOptions.subject,
      content: [
        ...(mailOptions.text ? [{ type: 'text/plain', value: String(mailOptions.text) }] : []),
        ...(mailOptions.html ? [{ type: 'text/html', value: String(mailOptions.html) }] : []),
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`SendGrid HTTP error ${res.status}: ${errorText}`);
  }

  console.log(`✅ [EMAIL] Delivered via SendGrid HTTPS!`);
  return { messageId: 'sendgrid-success' };
}

/**
 * Robust Multi-Channel Email Dispatcher:
 * 1. Resend HTTPS (Port 443) - Preferred for cloud hosts like Render
 * 2. SendGrid HTTPS (Port 443) - Secondary HTTPS provider
 * 3. Nodemailer Gmail SMTP (Port 587/465) with IPv4 enforcement
 */
export const sendEmailWithRetries = async (mailOptions: SendMailOptions, maxRetries = 3) => {
  const resendKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : '';
  const sendgridKey = process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.trim() : '';

  // Provider 1: Resend HTTPS API (Port 443)
  if (resendKey) {
    try {
      return await sendViaResend(resendKey, mailOptions);
    } catch (resendErr: any) {
      console.warn(`⚠️ [RESEND] HTTPS delivery failed: ${resendErr.message}. Falling back to next channel...`);
    }
  }

  // Provider 2: SendGrid HTTPS API (Port 443)
  if (sendgridKey) {
    try {
      return await sendViaSendGrid(sendgridKey, mailOptions);
    } catch (sgErr: any) {
      console.warn(`⚠️ [SENDGRID] HTTPS delivery failed: ${sgErr.message}. Falling back to SMTP...`);
    }
  }

  // Provider 3: Nodemailer SMTP with IPv4 enforcement
  const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
  const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim().replace(/\s+/g, '') : '';

  if (!smtpUser || !smtpPass) {
    throw new Error('No email provider configured. Please provide RESEND_API_KEY, SENDGRID_API_KEY, or SMTP_USER & SMTP_PASS.');
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
        family: 4,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
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

  throw lastError || new Error(`All ${maxRetries} email delivery attempts failed.`);
};
