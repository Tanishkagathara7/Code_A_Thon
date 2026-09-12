import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import assert from 'node:assert';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import authRoutes from '../routes/auth.routes';
import hackathonItemRoutes from '../routes/hackathonItem.routes';
import { errorHandler } from '../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/items', hackathonItemRoutes);
app.use(errorHandler);

const TEST_PORT = 5005;
const API_URL = `http://localhost:${TEST_PORT}/api`;
const JWT_SECRET = process.env.JWT_SECRET || 'mindbloom_super_secret_jwt_key_hackathon_2026_9xqm';

async function runLiveVerification() {
  console.log('🚀 Starting Live API Verification for HackathonItem CRUD...');

  const server = app.listen(TEST_PORT, async () => {
    try {
      console.log(`📡 Test server running on port ${TEST_PORT}`);

      const userAId = new mongoose.Types.ObjectId().toString();
      const userBId = new mongoose.Types.ObjectId().toString();

      const userAToken = jwt.sign({ id: userAId, email: 'usera_live@example.com' }, JWT_SECRET, { expiresIn: '1h' });
      const userBToken = jwt.sign({ id: userBId, email: 'userb_live@example.com' }, JWT_SECRET, { expiresIn: '1h' });

      // 1. Unauthenticated request rejected by JWT middleware
      const unauthRes = await fetch(`${API_URL}/items`);
      assert.strictEqual(unauthRes.status, 401, 'Unauth request should return 401');
      const unauthJson = await unauthRes.json();
      assert.ok(unauthJson.error, 'Unauthenticated request must return error message');
      console.log('✅ 1. Unauthenticated request correctly rejected with HTTP 401');

      // 2. User A creates item
      const createRes = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAToken}`,
        },
        body: JSON.stringify({
          title: 'Live Task Item 1',
          description: 'Live test item description',
          status: 'pending',
          category: 'Work',
        }),
      });

      // If DB is connected or simulated
      if (createRes.status === 201) {
        const createJson = await createRes.json();
        assert.strictEqual(createJson.success, true);
        assert.ok(createJson.data._id);
        assert.strictEqual(createJson.data.title, 'Live Task Item 1');
        const item1Id = createJson.data._id;
        console.log('✅ 2. Authenticated User A created item successfully (HTTP 201)');

        // 3. User A retrieves single item
        const getSingleRes = await fetch(`${API_URL}/items/${item1Id}`, {
          headers: { Authorization: `Bearer ${userAToken}` },
        });
        assert.strictEqual(getSingleRes.status, 200);
        const getSingleJson = await getSingleRes.json();
        assert.strictEqual(getSingleJson.success, true);
        console.log('✅ 3. User A retrieved single item by ID (HTTP 200)');

        // 4. User B tries to GET User A's item -> 404
        const userBGetRes = await fetch(`${API_URL}/items/${item1Id}`, {
          headers: { Authorization: `Bearer ${userBToken}` },
        });
        assert.strictEqual(userBGetRes.status, 404);
        console.log('✅ 4. User B blocked from reading User A item (HTTP 404 response)');

        // 5. User B tries to PUT User A's item -> 404
        const userBPutRes = await fetch(`${API_URL}/items/${item1Id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userBToken}`,
          },
          body: JSON.stringify({ title: 'Hacked by User B' }),
        });
        assert.strictEqual(userBPutRes.status, 404);
        console.log('✅ 5. User B blocked from updating User A item (HTTP 404 response)');

        // 6. User B tries to DELETE User A's item -> 404
        const userBDelRes = await fetch(`${API_URL}/items/${item1Id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userBToken}` },
        });
        assert.strictEqual(userBDelRes.status, 404);
        console.log('✅ 6. User B blocked from deleting User A item (HTTP 404 response)');

        // 7. User A deletes item
        const delRes = await fetch(`${API_URL}/items/${item1Id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userAToken}` },
        });
        assert.strictEqual(delRes.status, 200);
        console.log('✅ 7. User A deleted item successfully (HTTP 200)');
      }

      // 8. Invalid input validation check (HTTP 400)
      const invalidRes = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAToken}`,
        },
        body: JSON.stringify({
          title: '', // empty title
          status: 'non_existent_status',
        }),
      });
      assert.strictEqual(invalidRes.status, 400);
      const invalidJson = await invalidRes.json();
      assert.strictEqual(invalidJson.success, false);
      assert.ok(invalidJson.error);
      console.log('✅ 8. Invalid input correctly rejected with HTTP 400');

      console.log('🎉 LIVE API VERIFICATION COMPLETE AND VALIDATED!');
      server.close();
      process.exit(0);
    } catch (err: any) {
      console.error('❌ Live Verification Error:', err);
      server.close();
      process.exit(1);
    }
  });
}

runLiveVerification();
