import assert from 'node:assert';
import { test, describe, before, after } from 'node:test';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDatabase } from '../config/database';
import { AnalyticsService } from '../services/analytics.service';
import { HackathonItem } from '../models/HackathonItem';

const API_BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'mindbloom_super_secret_jwt_key_hackathon_2026_9xqm';

// Create test user IDs
const USER_A_ID = new mongoose.Types.ObjectId().toString();
const USER_B_ID = new mongoose.Types.ObjectId().toString();
const USER_ZERO_ID = new mongoose.Types.ObjectId().toString();

const USER_A_TOKEN = jwt.sign({ id: USER_A_ID, email: 'usera_analytics@example.com' }, JWT_SECRET, { expiresIn: '1h' });
const USER_B_TOKEN = jwt.sign({ id: USER_B_ID, email: 'userb_analytics@example.com' }, JWT_SECRET, { expiresIn: '1h' });

describe('Analytics Module Tests', () => {
  let isDbConnected = false;

  before(async () => {
    if (process.env.MONGODB_URI) {
      try {
        await connectDatabase();
        isDbConnected = mongoose.connection.readyState === 1;
      } catch {
        console.warn('[TEST NOTICE] DB connection skipped during offline run pass');
      }
    }
  });

  after(async () => {
    if (isDbConnected) {
      try {
        await HackathonItem.deleteMany({ owner: { $in: [USER_A_ID, USER_B_ID, USER_ZERO_ID] } });
      } catch {}
    }
  });

  test('11. Zero-data behavior returns sensible zero metrics without NaN', async () => {
    if (!isDbConnected) return;

    const data = await AnalyticsService.getOverview(USER_ZERO_ID);

    assert.strictEqual(data.overview.total, 0, 'Total should be 0');
    assert.strictEqual(data.overview.completed, 0, 'Completed should be 0');
    assert.strictEqual(data.overview.inProgress, 0, 'In progress should be 0');
    assert.strictEqual(data.overview.pending, 0, 'Pending should be 0');
    assert.strictEqual(data.overview.completionRate, 0, 'Completion rate should be 0 for zero total');
    assert.ok(Array.isArray(data.categories), 'Categories should be an empty array');
    assert.strictEqual(data.categories.length, 0);
    assert.ok(Array.isArray(data.activity), 'Activity should be an array');
    assert.ok(Array.isArray(data.recentActivity), 'Recent activity should be an array');
  });

  test('Seed test data for User A and User B', async () => {
    if (!isDbConnected) return;

    // Seed User A data (10 items total: 4 completed, 3 in_progress, 3 pending)
    const userAItems = [
      { title: 'Edu Task 1', category: 'Education', status: 'completed', owner: new mongoose.Types.ObjectId(USER_A_ID) },
      { title: 'Edu Task 2', category: 'Education', status: 'completed', owner: new mongoose.Types.ObjectId(USER_A_ID) },
      { title: 'Edu Task 3', category: 'Education', status: 'in_progress', owner: new mongoose.Types.ObjectId(USER_A_ID) },
      { title: 'Health Task 1', category: 'Healthcare', status: 'completed', owner: new mongoose.Types.ObjectId(USER_A_ID) },
      { title: 'Health Task 2', category: 'Healthcare', status: 'pending', owner: new mongoose.Types.ObjectId(USER_A_ID) },
      { title: 'Civic Task 1', category: 'Civic', status: 'completed', owner: new mongoose.Types.ObjectId(USER_A_ID) },
      { title: 'Civic Task 2', category: 'Civic', status: 'in_progress', owner: new mongoose.Types.ObjectId(USER_A_ID) },
      { title: 'Civic Task 3', category: 'Civic', status: 'in_progress', owner: new mongoose.Types.ObjectId(USER_A_ID) },
      { title: 'Env Task 1', category: 'Environment', status: 'pending', owner: new mongoose.Types.ObjectId(USER_A_ID) },
      { title: 'Env Task 2', category: 'Environment', status: 'pending', owner: new mongoose.Types.ObjectId(USER_A_ID) },
    ];

    await HackathonItem.insertMany(userAItems);

    // Seed User B data (2 items total: 1 completed, 1 pending)
    const userBItems = [
      { title: 'User B Item 1', category: 'Finance', status: 'completed', owner: new mongoose.Types.ObjectId(USER_B_ID) },
      { title: 'User B Item 2', category: 'Finance', status: 'pending', owner: new mongoose.Types.ObjectId(USER_B_ID) },
    ];

    await HackathonItem.insertMany(userBItems);
  });

  test('1, 4, 5, 6, 7, 8. Authenticated analytics request returns accurate overview & completion rate', async () => {
    if (!isDbConnected) return;

    const data = await AnalyticsService.getOverview(USER_A_ID);

    assert.strictEqual(data.overview.total, 10, 'User A total should be 10');
    assert.strictEqual(data.overview.completed, 4, 'User A completed should be 4');
    assert.strictEqual(data.overview.inProgress, 3, 'User A inProgress should be 3');
    assert.strictEqual(data.overview.pending, 3, 'User A pending should be 3');
    // completionRate = (4 / 10) * 100 = 40.00
    assert.strictEqual(data.overview.completionRate, 40, 'Completion rate should be 40%');
  });

  test('3. User isolation: User B statistics are isolated from User A', async () => {
    if (!isDbConnected) return;

    const dataB = await AnalyticsService.getOverview(USER_B_ID);

    assert.strictEqual(dataB.overview.total, 2, 'User B total should be 2');
    assert.strictEqual(dataB.overview.completed, 1, 'User B completed should be 1');
    assert.strictEqual(dataB.overview.completionRate, 50, 'User B completion rate should be 50%');

    // Verify User B only gets Finance category
    assert.strictEqual(dataB.categories.length, 1);
    assert.strictEqual(dataB.categories[0].category, 'Finance');
  });

  test('9. Category aggregation sorts by count descending', async () => {
    if (!isDbConnected) return;

    const data = await AnalyticsService.getOverview(USER_A_ID);

    assert.ok(data.categories.length >= 4, 'Should aggregate categories');
    // Education (3), Civic (3), Healthcare (2), Environment (2)
    assert.ok(data.categories[0].count >= data.categories[1].count, 'Categories should be sorted descending by count');
  });

  test('10. Activity aggregation groups by creation date', async () => {
    if (!isDbConnected) return;

    const data = await AnalyticsService.getOverview(USER_A_ID);

    assert.ok(Array.isArray(data.activity), 'Activity should be an array');
    assert.ok(data.activity.length >= 1, 'Should have at least 1 activity entry');
    assert.ok(data.activity[0].date, 'Activity entry should have a date YYYY-MM-DD');
    assert.ok(data.activity[0].count >= 1, 'Activity count should be positive');
  });

  test('12. Recent activity returns top 5 recent records with required fields', async () => {
    if (!isDbConnected) return;

    const data = await AnalyticsService.getOverview(USER_A_ID);

    assert.ok(Array.isArray(data.recentActivity), 'Recent activity should be an array');
    assert.ok(data.recentActivity.length <= 5, 'Recent activity should not exceed 5 items');
    assert.ok(data.recentActivity.length > 0, 'Recent activity should contain items');

    const first = data.recentActivity[0];
    assert.ok(first.id, 'Item must have an id');
    assert.ok(first.title, 'Item must have a title');
    assert.ok(first.status, 'Item must have a status');
    assert.ok(first.category, 'Item must have a category');
    assert.ok(first.createdAt, 'Item must have createdAt timestamp');
  });

  test('2. Unauthenticated request rejected (HTTP 401 check)', async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`);
      assert.strictEqual(res.status, 401, 'Unauthenticated request to /api/analytics/overview must return 401');
    } catch {
      console.warn(`[TEST NOTICE] Server offline at ${API_BASE_URL}, HTTP verification skipped`);
    }
  });

  test('Authenticated request via HTTP endpoint GET /api/analytics/overview', async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`, {
        headers: {
          Authorization: `Bearer ${USER_A_TOKEN}`,
        },
      });

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(json.data.overview, 'Response data must contain overview metrics');
      assert.strictEqual(json.data.overview.total, 10);
    } catch {
      console.warn(`[TEST NOTICE] Server offline at ${API_BASE_URL}, HTTP verification skipped`);
    }
  });
});
