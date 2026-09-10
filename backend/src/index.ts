import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';
import nodemailer, { Transporter } from 'nodemailer';
import { User } from './models/User';

// Avoid Windows ISP / local router DNS failure on SRV records & force IPv4 for Render cloud SMTP
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://tanish:XRWKFbHVbDAFShu1@cluster0.b9k1bph.mongodb.net/mindbloom?retryWrites=true&w=majority';

// Custom IPv4-only DNS lookup function for Nodemailer to prevent Render cloud ENETUNREACH IPv6 errors
const ipv4Lookup = (hostname: string, options: any, callback: any) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const opts = typeof options === 'object' ? { ...options, family: 4 } : { family: 4 };
  return dns.lookup(hostname, opts, callback);
};

// Cached Email Transporter (SMTP / Gmail or fallback)
let cachedTransporter: Transporter | null = null;

const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
  const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim().replace(/\s+/g, '') : '';

  if (smtpUser && smtpPass) {
    console.log(`🔑 [SMTP] Initializing Gmail SMTP Transporter for ${smtpUser} (port 587 STARTTLS with IPv4 lookup)...`);
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      lookup: ipv4Lookup,
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    } as any);
    return cachedTransporter;
  }

  console.warn('⚠️ [SMTP] SMTP_USER or SMTP_PASS environment variable is missing on server.');
  return null;
};

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas (Database: mindbloom)');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// OAuth / User sync endpoint
app.post('/api/auth/sync', async (req: Request, res: Response) => {
  try {
    const { email, name, provider, providerId, avatarUrl } = req.body;
    console.log(`[AUTH] User sync requested for email: ${email || 'none'} (${provider || 'unknown'})`);

    if (!email) {
      console.warn('[AUTH] Auth sync failed: Email is required');
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        provider: provider || 'email',
        providerId: providerId || null,
        avatarUrl: avatarUrl || null,
      });
      await user.save();
      console.log(`[AUTH] New user created in MongoDB: ${user.email} (${user.provider})`);
    } else {
      if (name) user.name = name;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      if (provider) user.provider = provider;
      if (providerId) user.providerId = providerId;
      await user.save();
      console.log(`[AUTH] Existing user synced in MongoDB: ${user.email}`);
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[AUTH] Auth sync error:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// GitHub OAuth Code Exchange & Sync Endpoint
app.post('/api/auth/github', async (req: Request, res: Response) => {
  try {
    const { code, redirectUri } = req.body;
    console.log(`[AUTH] Exchanging authorization code with GitHub. Redirect URI: ${redirectUri || 'none'}`);

    if (!code) {
      console.warn('[AUTH] GitHub exchange failed: Code missing');
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const clientId = process.env.GITHUB_CLIENT_ID || process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || 'Ov23lijRkAOA5aBGuvDL';
    const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET || '';

    if (!clientSecret) {
      console.warn('⚠️ [AUTH] GITHUB_CLIENT_SECRET is missing from backend environment variables.');
    }

    // Step 1: Exchange auth code for access token with GitHub
    const tokenParams: Record<string, string> = {
      client_id: clientId,
      code,
    };
    if (clientSecret) {
      tokenParams.client_secret = clientSecret;
    }
    if (redirectUri) {
      tokenParams.redirect_uri = redirectUri;
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'MindBloom-App',
      },
      body: JSON.stringify(tokenParams),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
      console.warn('[AUTH] GitHub token exchange response error:', tokenData.error_description || tokenData.error);
      return res.status(400).json({
        error: tokenData.error_description || tokenData.error || 'Failed to exchange GitHub authorization code.',
      });
    }

    const accessToken = tokenData.access_token;
    console.log('[AUTH] GitHub token exchange successful. Fetching GitHub user profile...');

    // Step 2: Fetch GitHub User Profile
    const profileResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'MindBloom-App',
      },
    });

    if (!profileResponse.ok) {
      console.warn('[AUTH] Failed to fetch GitHub profile');
      return res.status(400).json({ error: 'Failed to fetch GitHub user profile' });
    }

    const ghUser = await profileResponse.json();

    // Step 3: Fetch User Emails if email is private
    let userEmail = ghUser.email;
    if (!userEmail) {
      try {
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'MindBloom-App',
          },
        });
        if (emailsResponse.ok) {
          const emails = await emailsResponse.json();
          if (Array.isArray(emails)) {
            const primaryEmail = emails.find((e: any) => e.primary && e.verified) || emails.find((e: any) => e.verified) || emails[0];
            if (primaryEmail && primaryEmail.email) {
              userEmail = primaryEmail.email;
            }
          }
        }
      } catch (emailErr) {
        console.warn('[AUTH] Could not fetch GitHub private emails:', emailErr);
      }
    }

    if (!userEmail) {
      userEmail = `${ghUser.login || 'github_user'}@users.noreply.github.com`;
    }

    const userName = ghUser.name || ghUser.login || 'GitHub User';
    const avatarUrl = ghUser.avatar_url || null;
    const providerId = String(ghUser.id);

    // Step 4: Upsert User in MongoDB Atlas
    let user = await User.findOne({ email: userEmail.toLowerCase() });

    if (!user) {
      user = new User({
        email: userEmail.toLowerCase(),
        name: userName,
        provider: 'github',
        providerId,
        avatarUrl,
      });
      await user.save();
      console.log(`[AUTH] New GitHub user created in MongoDB: ${user.email}`);
    } else {
      user.name = userName;
      user.provider = 'github';
      user.providerId = providerId;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
      console.log(`[AUTH] Existing GitHub user synced in MongoDB: ${user.email}`);
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[AUTH] GitHub auth error:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal server error during GitHub authentication' });
  }
});


// Strong password validator: min 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
const validatePassword = (pass: string): string | null => {
  if (!pass || pass.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(pass)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(pass)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[0-9]/.test(pass)) {
    return 'Password must contain at least one number.';
  }
  if (!/[!@#$%^&*(),.?":{}|<>\-_=+[\]\\/~`]/.test(pass)) {
    return 'Password must contain at least one special character (!@#$%^&*...).';
  }
  return null;
};

// Email login / signup endpoint
app.post('/api/auth/email', async (req: Request, res: Response) => {
  try {
    const { email, password, name, mode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (mode === 'signup') {
      if (user) {
        return res.status(400).json({ error: 'An account already exists with this email address.' });
      }

      // Enforce strong password validation on Sign Up
      const passwordError = validatePassword(password);
      if (passwordError) {
        return res.status(400).json({ error: passwordError });
      }

      user = new User({
        email: normalizedEmail,
        name: name ? name.trim() : normalizedEmail.split('@')[0],
        provider: 'email',
        passwordHash: password,
      });
      await user.save();
      console.log(`👤 New user registered via email: ${user.email}`);
    } else {
      // Mode: 'login' - User MUST be registered
      if (!user) {
        return res.status(404).json({
          error: 'No account found with this email. Please sign up first.',
        });
      }

      // Check password if set
      if (user.passwordHash && user.passwordHash !== password) {
        return res.status(401).json({
          error: 'Incorrect password. Please try again or reset your password.',
        });
      }

      // If user registered with Google or GitHub and hasn't set a password yet
      if (!user.passwordHash) {
        user.passwordHash = password;
        await user.save();
      }
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to authenticate' });
  }
});

// Request Password Reset (generates 6-digit OTP code valid for 15 minutes)
app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // User MUST be registered in MongoDB (via email, Google, or GitHub)
    if (!user) {
      return res.status(404).json({
        error: 'No account is registered with this email address. Please sign up first.',
      });
    }

    // Generate secure 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Save OTP to database immediately
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    console.log(`🔑 Verification code generated for ${normalizedEmail}: ${otp}`);

    const hasRealSmtp = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

    // Respond immediately to the client so UI is instant (< 100ms)
    res.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}.${!hasRealSmtp ? ` (Dev OTP: ${otp})` : ''}`,
      otp: !hasRealSmtp ? otp : undefined,
    });

    // Dispatch verification email asynchronously in background
    (async () => {
      try {
        const transporter = await getTransporter();
        if (!transporter) {
          console.warn(`⚠️ [SMTP] Cannot send email to ${normalizedEmail}: SMTP_USER or SMTP_PASS is missing in server environment variables.`);
          return;
        }

        console.log(`📧 [SMTP] Dispatching verification email to ${normalizedEmail}...`);
        const mailOptions = {
          from: process.env.SMTP_FROM || `"MindBloom" <${process.env.SMTP_USER || 'security@mindbloom.app'}>`,
          to: normalizedEmail,
          subject: 'MindBloom Password Reset Verification Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; border-radius: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
              <h2 style="color: #1e293b; margin-top: 0;">Password Reset Verification</h2>
              <p style="color: #475569; font-size: 15px; line-height: 22px;">
                You recently requested to reset the password for your <strong>MindBloom</strong> account.
              </p>
              <div style="margin: 24px 0; padding: 18px; background-color: #ffffff; border-radius: 12px; text-align: center; border: 1.5px dashed #6366f1;">
                <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">${otp}</span>
              </div>
              <p style="color: #64748b; font-size: 13px; margin-bottom: 4px;">
                This code will expire in <strong>15 minutes</strong>. If you did not request this, please disregard this email.
              </p>
            </div>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [SMTP] Email successfully dispatched to ${normalizedEmail}. MessageId: ${info.messageId}`);
      } catch (emailErr: any) {
        console.error('❌ [SMTP] Email delivery error:', emailErr.message || emailErr);
      }
    })();
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: error.message || 'Failed to initiate password reset' });
  }
});

// Verify Code and Reset Password
app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required.' });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Update password and clear OTP
    user.passwordHash = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`✅ Password successfully updated for ${normalizedEmail}`);

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: error.message || 'Failed to reset password' });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 MindBloom Backend API running on http://localhost:${PORT}`);
});
