import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { validatePassword } from '../utils/validation';
import { sendEmailWithRetries } from './email.service';

export interface SyncOAuthPayload {
  email: string;
  name?: string;
  provider?: string;
  providerId?: string;
  avatarUrl?: string;
}

export interface GitHubAuthPayload {
  code: string;
  redirectUri?: string;
}

export interface EmailAuthPayload {
  email: string;
  password: string;
  name?: string;
  mode?: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export const generateToken = (userId: string, email: string): string => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is missing on server.');
  }
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
};

export class AuthService {
  static async syncOAuthUser(payload: SyncOAuthPayload) {
    const { email, name, provider, providerId, avatarUrl } = payload;
    console.log(`[AUTH] User sync requested for email: ${email || 'none'} (${provider || 'unknown'})`);

    if (!email) {
      const error: any = new Error('Email is required');
      error.statusCode = 400;
      throw error;
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        provider: (provider as 'email' | 'google' | 'github') || 'email',
        providerId: providerId || null,
        avatarUrl: avatarUrl || null,
      });
      await user.save();
      console.log(`[AUTH] New user created in MongoDB: ${user.email} (${user.provider})`);
    } else {
      if (name) user.name = name;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      if (provider) user.provider = provider as 'email' | 'google' | 'github';
      if (providerId) user.providerId = providerId;
      await user.save();
      console.log(`[AUTH] Existing user synced in MongoDB: ${user.email}`);
    }

    return {
      success: true,
      token: generateToken((user._id as any).toString(), user.email),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    };
  }

  static async exchangeGitHubCode(payload: GitHubAuthPayload) {
    const { code, redirectUri } = payload;
    console.log(`[AUTH] Exchanging authorization code with GitHub. Redirect URI: ${redirectUri || 'none'}`);

    if (!code) {
      const error: any = new Error('Authorization code is required');
      error.statusCode = 400;
      throw error;
    }

    const clientId = process.env.GITHUB_CLIENT_ID || process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ [AUTH] GitHub auth configuration error: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET environment variable is missing on server.');
      const error: any = new Error('Server authentication misconfigured: Missing GitHub credentials.');
      error.statusCode = 500;
      throw error;
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
      const error: any = new Error(tokenData.error_description || tokenData.error || 'Failed to exchange GitHub authorization code.');
      error.statusCode = 400;
      throw error;
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
      const error: any = new Error('Failed to fetch GitHub user profile');
      error.statusCode = 400;
      throw error;
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

    return {
      success: true,
      token: generateToken((user._id as any).toString(), user.email),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    };
  }

  static async emailAuthenticate(payload: EmailAuthPayload) {
    const { email, password, name, mode } = payload;

    if (!email || !password) {
      const error: any = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (mode === 'signup') {
      if (user) {
        const error: any = new Error('An account already exists with this email address.');
        error.statusCode = 400;
        throw error;
      }

      // Enforce strong password validation on Sign Up
      const passwordError = validatePassword(password);
      if (passwordError) {
        const error: any = new Error(passwordError);
        error.statusCode = 400;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        email: normalizedEmail,
        name: name ? name.trim() : normalizedEmail.split('@')[0],
        provider: 'email',
        passwordHash: hashedPassword,
      });
      await user.save();
      console.log(`👤 New user registered via email: ${user.email}`);
    } else {
      // Mode: 'login' - User MUST be registered
      if (!user) {
        const error: any = new Error('No account found with this email. Please sign up first.');
        error.statusCode = 404;
        throw error;
      }

      // Check password if set
      if (user.passwordHash) {
        let isMatch = false;
        try {
          isMatch = await bcrypt.compare(password, user.passwordHash);
        } catch (bcryptErr) {
          isMatch = false;
        }

        // Dual-check for legacy plaintext passwords to auto-migrate them to bcrypt
        if (!isMatch && user.passwordHash === password) {
          isMatch = true;
          user.passwordHash = await bcrypt.hash(password, 10);
          await user.save();
          console.log(`🔐 Auto-upgraded legacy plaintext password to bcrypt hash for user: ${user.email}`);
        }

        if (!isMatch) {
          const error: any = new Error('Incorrect password. Please try again or reset your password.');
          error.statusCode = 401;
          throw error;
        }
      } else {
        // If user registered with Google or GitHub and hasn't set a password yet
        user.passwordHash = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    return {
      success: true,
      token: generateToken((user._id as any).toString(), user.email),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  static async forgotPassword(email: string) {
    if (!email) {
      const error: any = new Error('Email address is required.');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const error: any = new Error('No account is registered with this email address. Please sign up first.');
      error.statusCode = 404;
      throw error;
    }

    // Generate secure 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Save OTP to database immediately
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    const hasRealSmtp = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
    const isProduction = process.env.NODE_ENV === 'production';

    if (!hasRealSmtp && !isProduction) {
      console.log(`🔑 Verification code generated for ${normalizedEmail}: ${otp}`);
    } else {
      console.log(`🔑 Verification code generated for ${normalizedEmail}: [REDACTED]`);
    }

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

    // Dispatch verification email in background with 3x retries
    if (hasRealSmtp) {
      (async () => {
        try {
          await sendEmailWithRetries(mailOptions, 3);
        } catch (sendErr: any) {
          console.error(`❌ [SMTP] Background delivery error for ${normalizedEmail}:`, sendErr.message || sendErr);
        }
      })();
    } else {
      console.warn(`⚠️ [SMTP] Dev Mode: SMTP_USER or SMTP_PASS missing. Dev OTP: ${otp}`);
    }

    return {
      success: true,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}.`,
    };
  }

  static async resetPassword(payload: ResetPasswordPayload) {
    const { email, otp, newPassword } = payload;

    if (!email || !otp || !newPassword) {
      const error: any = new Error('Email, verification code, and new password are required.');
      error.statusCode = 400;
      throw error;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      const error: any = new Error(passwordError);
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const error: any = new Error('No account found with this email address.');
      error.statusCode = 404;
      throw error;
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp.trim()) {
      const error: any = new Error('Invalid verification code. Please check and try again.');
      error.statusCode = 400;
      throw error;
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      const error: any = new Error('Verification code has expired. Please request a new one.');
      error.statusCode = 400;
      throw error;
    }

    // Update password and clear OTP
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`✅ Password successfully updated for ${normalizedEmail}`);

    return {
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    };
  }

  static async getUserProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      const error: any = new Error('User profile not found.');
      error.statusCode = 404;
      throw error;
    }

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    };
  }
}
