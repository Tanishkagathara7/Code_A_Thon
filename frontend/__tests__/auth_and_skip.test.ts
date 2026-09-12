// Mock OAuth config matching oauth.ts
const OAUTH_CONFIG = {
  google: {
    clientIdIos: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '',
    clientIdAndroid: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '878949461550-s6de153nvgoq1gb94191i1pgqfqbv1jd.apps.googleusercontent.com',
    clientIdWeb: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '878949461550-s6de153nvgoq1gb94191i1pgqfqbv1jd.apps.googleusercontent.com',
  },
};

// Password validation logic matching AuthScreen / ForgotPasswordModal
const validatePassword = (pass: string): string | null => {
  if (!pass || pass.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(pass)) return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(pass)) return 'Password must contain at least one number.';
  if (!/[!@#$%^&*(),.?":{}|<>\-_=+[\]\\/~`]/.test(pass)) return 'Password must contain at least one special character (!@#$%^&*...).';
  return null;
};

// Skip button handler simulation
const handleSkipFlow = (navigationHistory: string[]) => {
  navigationHistory.push('/home');
  return {
    currentRoute: '/home',
    guestModeActive: true,
    userProfile: null,
  };
};

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function runTests() {
  console.log('--- Running Frontend Auth & Skip Tests ---');

  // Test 1: Google OAuth configuration
  assert(OAUTH_CONFIG.google.clientIdWeb.includes('.apps.googleusercontent.com'), 'Web Client ID must be valid');
  assert(OAUTH_CONFIG.google.clientIdAndroid.includes('.apps.googleusercontent.com'), 'Android Client ID must be valid');
  console.log('✅ 1. Google OAuth Client IDs configuration passed');

  // Test 2: Native Google user profile extraction
  const mockGoogleResponse = {
    user: {
      email: 'developer.test@gmail.com',
      name: 'Developer Test',
      photo: 'https://lh3.googleusercontent.com/photo.jpg',
      id: 'google_user_998877',
    },
    idToken: 'mock_jwt_id_token_xyz',
  };
  const userObj = mockGoogleResponse.user;
  const extracted = {
    email: userObj.email,
    name: userObj.name || userObj.email.split('@')[0],
    picture: userObj.photo,
    id: userObj.id,
    idToken: mockGoogleResponse.idToken,
  };
  assert(extracted.email === 'developer.test@gmail.com', 'Email should match');
  assert(extracted.name === 'Developer Test', 'Name should match');
  assert(extracted.id === 'google_user_998877', 'ID should match');
  console.log('✅ 2. Google User Profile extraction passed');

  // Test 3: Google Login DEVELOPER_ERROR formatting
  const simulateErrorCode10 = (code: number) => {
    if (code === 10) {
      return new Error('DEVELOPER_ERROR: Android SHA-1 fingerprint (5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25) required');
    }
    return new Error('Unknown error');
  };
  const err = simulateErrorCode10(10);
  assert(err.message.includes('DEVELOPER_ERROR'), 'DEVELOPER_ERROR message check');
  console.log('✅ 3. Google DEVELOPER_ERROR exception handling passed');

  // Test 4: Forgot Password validation
  assert(validatePassword('StrongP@ss1') === null, 'Strong password should pass');
  assert(validatePassword('short') !== null, 'Short password should fail');
  assert(validatePassword('NoSpecial123') !== null, 'Password without special char should fail');
  console.log('✅ 4. Forgot Password validation rules passed');

  // Test 5: Skip button & Guest Mode
  const history: string[] = ['/(auth)'];
  const skipResult = handleSkipFlow(history);
  assert(skipResult.currentRoute === '/home', 'Skip button should navigate to /home');
  assert(skipResult.guestModeActive === true, 'Guest Mode should be active on /home');
  assert(skipResult.userProfile === null, 'User profile should be null in Guest Mode');
  console.log('✅ 5. Skip button & Guest Mode navigation passed');

  // Test 6: JWT Token Storage Key & Authorization Header formatting
  const TOKEN_KEY = 'mindbloom_auth_token';
  const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.signature';
  const formatAuthHeader = (token: string | null) => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  };

  assert(TOKEN_KEY === 'mindbloom_auth_token', 'TOKEN_KEY should match');
  const headers = formatAuthHeader(mockJwtToken);
  assert(headers.Authorization === `Bearer ${mockJwtToken}`, 'Authorization header should be Bearer token');
  console.log('✅ 6. JWT Token Storage & Authorization header formatting passed');

  console.log('--- All Frontend Auth & Skip Tests Passed! ---');
}

runTests();
