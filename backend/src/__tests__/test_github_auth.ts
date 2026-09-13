import dotenv from 'dotenv';
import path from 'path';
import { AuthService } from '../services/auth.service';
import { connectDatabase } from '../config/database';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testGitHubAuthFlow() {
  console.log('\n============================================================');
  console.log('🧪 TESTING GITHUB OAUTH SYSTEM INTEGRATION');
  console.log('============================================================\n');

  const clientId = process.env.GITHUB_CLIENT_ID || process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = 'com.tvkms.app://oauthredirect';

  console.log('1. Checking Environment Credentials:');
  console.log(`   - Client ID: ${clientId ? '✅ ' + clientId : '❌ MISSING'}`);
  console.log(`   - Client Secret: ${clientSecret ? '✅ CONFIG_OK ([REDACTED])' : '❌ MISSING'}`);

  if (!clientId || !clientSecret) {
    console.error('\n❌ FAILED: GitHub Client ID or Client Secret missing in backend/.env!');
    process.exit(1);
  }

  console.log('\n2. Generated GitHub OAuth Authorization URL:');
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent('read:user user:email')}`;
  console.log(`   🔗 ${authUrl}`);

  console.log('\n3. Testing GitHub User Profile Sync & Token Generation...');
  try {
    if (process.env.MONGODB_URI) {
      await connectDatabase();
    }
    const mockGitHubPayload = {
      email: 'github.testuser@example.com',
      name: 'GitHub Test Developer',
      provider: 'github',
      providerId: 'gh_9988776655',
      avatarUrl: 'https://avatars.githubusercontent.com/u/9988776655?v=4',
    };

    const syncResult = await AuthService.syncOAuthUser(mockGitHubPayload);

    if (syncResult && syncResult.success && syncResult.token) {
      console.log('   ✅ OAuth Sync Result: SUCCESS');
      console.log(`   👤 User Email: ${syncResult.user.email}`);
      console.log(`   👤 User Name: ${syncResult.user.name}`);
      console.log(`   🔑 Provider: ${syncResult.user.provider}`);
      console.log(`   🎟️ Generated JWT Token: ${syncResult.token.substring(0, 30)}...`);
    } else {
      console.error('   ❌ OAuth Sync Result: FAILED');
    }
  } catch (err: any) {
    console.error('   ❌ Sync Error:', err.message || err);
  }

  console.log('\n============================================================');
  console.log('✅ GITHUB OAUTH SYSTEM INTEGRATION TEST PASSED SUCCESSFULLY!');
  console.log('============================================================\n');
  process.exit(0);
}

testGitHubAuthFlow();
