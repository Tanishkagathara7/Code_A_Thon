import assert from 'node:assert';
import { test, describe } from 'node:test';

const API_BASE_URL = process.env.TEST_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';

describe('1. Deployed Backend Health & Connectivity', () => {
  test('GET /api/health returns status ok and database state', async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    assert.strictEqual(res.status, 200, 'Health check should return status 200');
    const data = await res.json();
    assert.strictEqual(data.status, 'ok', 'Status should be ok');
    assert.ok(data.database, 'Database field should be present');
  });
});

describe('2. Google Login & Auth Sync Endpoint', () => {
  test('POST /api/auth/sync creates/syncs a Google user profile', async () => {
    const googleMockUser = {
      email: `google_test_${Date.now()}@example.com`,
      name: 'Google Test User',
      provider: 'google',
      providerId: 'google_sub_123456789',
      avatarUrl: 'https://lh3.googleusercontent.com/a/mock_photo',
    };

    const res = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleMockUser),
    });

    assert.strictEqual(res.status, 200, 'Sync should return status 200');
    const data = await res.json();
    assert.strictEqual(data.success, true, 'Response success should be true');
    assert.ok(data.user, 'Returned user object should exist');
    assert.strictEqual(data.user.email, googleMockUser.email.toLowerCase());
    assert.strictEqual(data.user.provider, 'google');
  });

  test('POST /api/auth/sync rejects request when email is missing', async () => {
    const res = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'No Email User', provider: 'google' }),
    });

    assert.strictEqual(res.status, 400, 'Should return status 400 for missing email');
    const data = await res.json();
    assert.ok(data.error, 'Error message should be returned');
  });
});

describe('3. Forgot Password & OTP Flow', () => {
  test('POST /api/auth/forgot-password returns error for unregistered email', async () => {
    const nonExistentEmail = `unregistered_${Date.now()}@test.com`;
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: nonExistentEmail }),
    });

    assert.strictEqual(res.status, 404, 'Unregistered email should return 404');
    const data = await res.json();
    assert.ok(data.error, 'Error message should exist for unregistered email');
  });

  test('POST /api/auth/reset-password validates password complexity requirements', async () => {
    const weakPasswords = [
      'short', // < 8 chars
      'alllowercase1!', // no uppercase
      'ALLUPPERCASE1!', // no lowercase
      'NoNumberSpecial', // no numbers or special chars
    ];

    for (const weakPass of weakPasswords) {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          otp: '123456',
          newPassword: weakPass,
        }),
      });

      assert.strictEqual(res.status, 400, `Weak password '${weakPass}' should fail validation`);
      const data = await res.json();
      assert.ok(data.error, 'Should return password validation error message');
    }
  });

  test('POST /api/auth/reset-password rejects invalid verification code', async () => {
    // First register a test user
    const testEmail = `forgot_test_${Date.now()}@example.com`;
    await fetch(`${API_BASE_URL}/auth/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'ValidPass123!',
        mode: 'signup',
      }),
    });

    // Request reset OTP
    await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });

    // Attempt reset with invalid OTP
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        otp: '000000',
        newPassword: 'NewValidPass123!',
      }),
    });

    assert.strictEqual(res.status, 400, 'Invalid OTP should return status 400');
    const data = await res.json();
    assert.strictEqual(data.error, 'Invalid verification code. Please check and try again.');
  });
});
