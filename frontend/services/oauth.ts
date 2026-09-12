import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

WebBrowser.maybeCompleteAuthSession();

// OAuth Endpoint configurations
const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

const GITHUB_AUTH_ENDPOINT = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_ENDPOINT = 'https://github.com/login/oauth/access_token';

export const OAUTH_CONFIG = {
  google: {
    clientIdIos: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '',
    clientIdAndroid: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '',
    clientIdWeb: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '878949461550-s6de153nvgoq1gb94191i1pgqfqbv1jd.apps.googleusercontent.com',
  },
  github: {
    clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || 'Ov23lijRkAOA5aBGuvDL',
  },
};

// Configure Native Google Sign-In safely:
// webClientId MUST be a Web Application Client ID (Type: Web application in Google Cloud Console).
// If webClientId is identical to Android Client ID or placeholder, omit webClientId to let Android Play Services authenticate directly using the Android Client ID.
const rawWebClientId = OAUTH_CONFIG.google.clientIdWeb;
const isWebClientValid =
  rawWebClientId &&
  !rawWebClientId.includes('your_web_client_id') &&
  rawWebClientId !== OAUTH_CONFIG.google.clientIdAndroid;

if (isWebClientValid) {
  console.log('[AUTH] GoogleSignin configured with Web Client ID');
  GoogleSignin.configure({
    webClientId: rawWebClientId,
    offlineAccess: true,
  });
} else {
  console.log('[AUTH] GoogleSignin configured for Native Android Client ID');
  GoogleSignin.configure({
    scopes: ['email', 'profile'],
  });
}

export const getRedirectUri = (customScheme?: string) => {
  if (Platform.OS === 'web') {
    return AuthSession.makeRedirectUri();
  }
  const scheme = customScheme || process.env.EXPO_PUBLIC_APP_SCHEME || 'mindbloom';
  return AuthSession.makeRedirectUri({
    scheme,
    path: 'oauthredirect',
  });
};

export const parseUrlParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const queryIndex = url.indexOf('?');
  const hashIndex = url.indexOf('#');
  const queryString =
    hashIndex !== -1
      ? url.substring(hashIndex + 1)
      : queryIndex !== -1
      ? url.substring(queryIndex + 1)
      : '';

  queryString.split('&').forEach((part) => {
    const [key, value] = part.split('=');
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return params;
};

export const startGoogleAuthFlow = async (): Promise<any> => {
  try {
    console.log('[AUTH] Initiating Native Google Sign-In...');

    if (Platform.OS === 'web') {
      const redirectUri = getRedirectUri();
      const authUrl = `${GOOGLE_AUTH_ENDPOINT}?client_id=${encodeURIComponent(
        OAUTH_CONFIG.google.clientIdWeb
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=${encodeURIComponent('openid profile email')}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      if (result.type === 'cancel' || result.type === 'dismiss') {
        return { cancelled: true };
      }
      if (result.type === 'success' && result.url) {
        const params = parseUrlParams(result.url);
        if (params.access_token) {
          return await fetchGoogleUserProfile(params.access_token);
        }
      }
      return null;
    }

    // Native Mobile (Android & iOS): Use official Native Google Play Services prompt (0 browser redirects)
    const t2 = Date.now();
    console.log(`[TIMING] T2: Google SDK sign-in starts at ${t2}`);
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    const t3 = Date.now();
    console.log(`[TIMING] T3: Google SDK sign-in returns at ${t3} (Google SDK Duration: ${t3 - t2}ms)`);

    // Extract user profile from native Google Sign-In response
    const userInfo = (response as any)?.data || response;
    const userObj = userInfo?.user || userInfo;

    if (userObj && userObj.email) {
      console.log('[AUTH] Native Google profile retrieved:', userObj.email);
      return {
        email: userObj.email,
        name: userObj.name || userObj.givenName || userObj.email.split('@')[0],
        picture: userObj.photo || userObj.picture,
        id: userObj.id || userObj.sub,
        sub: userObj.id || userObj.sub,
        idToken: userInfo.idToken || response.data?.idToken,
      };
    }

    return null;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('[AUTH] Google Sign-In cancelled by user');
      return { cancelled: true };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('[AUTH] Google Sign-In in progress');
      return { inProgress: true };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.error('[AUTH] Google Play Services not available');
      throw new Error('Google Play Services is not available or outdated on this device.');
    } else if (
      error.code === '10' ||
      error.code === 10 ||
      String(error.message || '').includes('DEVELOPER_ERROR')
    ) {
      console.error('[AUTH] DEVELOPER_ERROR in Native Google Sign-In');
      throw new Error(
        'DEVELOPER_ERROR: Android SHA-1 fingerprint (5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25) for com.mindbloom.app must be added to an Android OAuth Client ID in Google Cloud Console.'
      );
    } else {
      console.error('[AUTH] Native Google Sign-In error:', error.message || error);
      throw error;
    }
  }
};

export const startGitHubAuthFlow = async (): Promise<any> => {
  try {
    const redirectUri = getRedirectUri();
    const clientId = OAUTH_CONFIG.github.clientId;

    if (!clientId) {
      console.warn('[AUTH] GitHub Client ID is not configured.');
      throw new Error('GitHub OAuth is not configured with a valid Client ID.');
    }

    const authUrl = `${GITHUB_AUTH_ENDPOINT}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent('read:user user:email')}`;

    console.log('[AUTH] OAuth started (GitHub)');
    console.log('[AUTH] Redirect URI:', redirectUri);
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    console.log('[AUTH] OAuth result:', result.type);

    if (result.type === 'cancel' || result.type === 'dismiss') {
      console.log('[AUTH] User cancelled GitHub OAuth flow.');
      return { cancelled: true };
    }

    if (result.type === 'success' && result.url) {
      console.log('[AUTH] OAuth callback received from GitHub');
      const params = parseUrlParams(result.url);
      const code = params.code;

      if (params.error) {
        console.error('[AUTH] GitHub OAuth error response:', params.error_description || params.error);
        throw new Error(params.error_description || `GitHub OAuth failed: ${params.error}`);
      }

      if (!code) {
        throw new Error('No authorization code returned from GitHub OAuth.');
      }

      console.log('[AUTH] Exchanging authorization code via backend API...');

      // Step 1: Attempt exchange via backend API
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
      try {
        const backendRes = await fetch(`${apiUrl}/auth/github`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri }),
        });
        const backendData = await backendRes.json();
        if (backendRes.ok && backendData.user) {
          console.log('[AUTH] Backend GitHub exchange successful');
          return { user: backendData.user, token: backendData.token };
        }
        if (backendData && backendData.error) {
          console.warn('[AUTH] Backend GitHub exchange error:', backendData.error);
        }
      } catch (backendErr: any) {
        console.warn('[AUTH] Backend GitHub exchange network issue, falling back to direct exchange:', backendErr.message || backendErr);
      }

      // Step 2: Fallback direct token exchange
      try {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            code,
            redirect_uri: redirectUri,
          }),
        });

        const tokenData = await tokenRes.json();
        if (tokenData && tokenData.access_token) {
          const profile = await fetchGitHubUserProfile(tokenData.access_token);
          let email = profile?.email;
          if (!email && tokenData.access_token) {
            email = await fetchGitHubPrimaryEmail(tokenData.access_token);
          }
          return {
            profile,
            email: email || `${profile?.login || 'github_user'}@users.noreply.github.com`,
            accessToken: tokenData.access_token,
          };
        }
      } catch (directErr: any) {
        console.warn('[AUTH] Direct GitHub token exchange failed:', directErr.message || directErr);
      }

      return { code };
    }

    return null;
  } catch (err: any) {
    console.error('[AUTH] OAuth error (GitHub):', err.message || err);
    throw err;
  }
};

export const fetchGoogleUserProfile = async (token: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const response2 = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response2.json();
    }
    return await response.json();
  } catch (err) {
    console.warn('Error fetching Google profile:', err);
    return null;
  }
};

export const fetchGitHubUserProfile = async (token: string) => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'MindBloom-App',
      },
    });
    return await response.json();
  } catch (err) {
    console.warn('Error fetching GitHub profile:', err);
    return null;
  }
};

export const fetchGitHubPrimaryEmail = async (token: string): Promise<string | null> => {
  try {
    const response = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'MindBloom-App',
      },
    });
    if (response.ok) {
      const emails = await response.json();
      if (Array.isArray(emails)) {
        const primary = emails.find((e: any) => e.primary && e.verified) || emails.find((e: any) => e.verified) || emails[0];
        return primary?.email || null;
      }
    }
    return null;
  } catch (err) {
    console.warn('Error fetching GitHub user emails:', err);
    return null;
  }
};


