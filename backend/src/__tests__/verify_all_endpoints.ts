import assert from 'node:assert';
import { test, describe, before, after } from 'node:test';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TEST_PORT = 5099;
const API_BASE_URL = `http://localhost:${TEST_PORT}/api`;

describe('Comprehensive Live Backend API Verification', () => {
  let serverProcess: any;

  before(async () => {
    process.env.PORT = String(TEST_PORT);
    await import('../index');
    // Give server 500ms to bind to port
    await new Promise((res) => setTimeout(res, 500));
  });

  test('1. GET /api/health endpoint', async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    assert.strictEqual(res.status, 200, 'Health check status should be 200');
    const data = await res.json();
    assert.strictEqual(data.status, 'ok', 'Status should be ok');
    assert.ok(data.database, 'Database state field present');
    console.log('  ✅ GET /api/health verified');
  });

  test('2. POST /api/auth/sync (Google / OAuth sync)', async () => {
    const googleUser = {
      email: `sync_test_${Date.now()}@example.com`,
      name: 'Google Sync Tester',
      provider: 'google',
      providerId: 'google_sub_9988776655',
      avatarUrl: 'https://lh3.googleusercontent.com/photo.jpg',
    };

    const res = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleUser),
    });

    assert.strictEqual(res.status, 200, 'OAuth sync should return 200');
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token, 'Token returned');
    assert.strictEqual(data.user.email, googleUser.email);
    console.log('  ✅ POST /api/auth/sync verified');
  });

  test('3. POST /api/auth/email (Email Signup & Login & Password Error)', async () => {
    const testUser = {
      email: `email_user_${Date.now()}@example.com`,
      password: 'StrongPassword123!',
      name: 'Email Tester',
      mode: 'signup',
    };

    // Step 3a: Signup
    const signupRes = await fetch(`${API_BASE_URL}/auth/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    assert.strictEqual(signupRes.status, 200, 'Email signup should return 200');
    const signupData = await signupRes.json();
    assert.strictEqual(signupData.success, true);
    assert.ok(signupData.token);
    console.log('  ✅ Email Signup verified');

    // Step 3b: Login Wrong Password
    const wrongLoginRes = await fetch(`${API_BASE_URL}/auth/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'WrongPassword999!', mode: 'login' }),
    });
    assert.strictEqual(wrongLoginRes.status, 401, 'Wrong password should return 401');
    const wrongLoginData = await wrongLoginRes.json();
    assert.strictEqual(wrongLoginData.error, 'Incorrect password. Please try again or reset your password.');
    console.log('  ✅ Wrong Password Login rejection verified');

    // Step 3c: Valid Login
    const loginRes = await fetch(`${API_BASE_URL}/auth/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password, mode: 'login' }),
    });
    assert.strictEqual(loginRes.status, 200, 'Valid login should return 200');
    const loginData = await loginRes.json();
    assert.strictEqual(loginData.success, true);
    assert.ok(loginData.token);
    console.log('  ✅ Email Login verified');

    // Step 3d: GET /api/auth/me using valid token
    const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${loginData.token}` },
    });
    assert.strictEqual(meRes.status, 200, 'Authenticated /auth/me should return 200');
    const meData = await meRes.json();
    assert.strictEqual(meData.user.email, testUser.email);
    console.log('  ✅ GET /api/auth/me with valid Bearer token verified');

    // Step 3e: GET /api/auth/me without token / session logout behavior
    const unauthMeRes = await fetch(`${API_BASE_URL}/auth/me`);
    assert.strictEqual(unauthMeRes.status, 401, 'Unauthenticated /auth/me should return 401');
    console.log('  ✅ Session Logout / Unauthenticated GET /api/auth/me verified');
  });

  test('4. POST /api/auth/forgot-password & reset-password', async () => {
    // Register account first
    const email = `otp_user_${Date.now()}@example.com`;
    await fetch(`${API_BASE_URL}/auth/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'InitialPass123!', mode: 'signup' }),
    });

    // Forgot password request
    const forgotRes = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    assert.strictEqual(forgotRes.status, 200, 'Forgot password should return 200');
    const forgotData = await forgotRes.json();
    assert.strictEqual(forgotData.success, true);
    console.log('  ✅ POST /api/auth/forgot-password verified');

    // Reset password with weak password error check
    const weakResetRes = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: '123456', newPassword: 'weak' }),
    });
    assert.strictEqual(weakResetRes.status, 400, 'Weak new password reset should fail 400');
    console.log('  ✅ POST /api/auth/reset-password validation error verified');
  });

  test('5. POST /api/auth/github (GitHub OAuth empty code handling)', async () => {
    const ghRes = await fetch(`${API_BASE_URL}/auth/github`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: '' }),
    });
    assert.strictEqual(ghRes.status, 400, 'Empty GitHub code should return 400');
    const ghData = await ghRes.json();
    assert.strictEqual(ghData.error, 'Authorization code is required');
    console.log('  ✅ POST /api/auth/github error response verified');
  });
});
