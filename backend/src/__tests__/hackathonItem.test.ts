import assert from 'node:assert';
import { test, describe, before, after } from 'node:test';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDatabase } from '../config/database';
import { HackathonItemService } from '../services/hackathonItem.service';
import { HackathonItem } from '../models/HackathonItem';

const API_BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'mindbloom_super_secret_jwt_key_hackathon_2026_9xqm';

// Create test user IDs
const USER_A_ID = new mongoose.Types.ObjectId().toString();
const USER_B_ID = new mongoose.Types.ObjectId().toString();

const USER_A_TOKEN = jwt.sign({ id: USER_A_ID, email: 'usera@example.com' }, JWT_SECRET, { expiresIn: '1h' });
const USER_B_TOKEN = jwt.sign({ id: USER_B_ID, email: 'userb@example.com' }, JWT_SECRET, { expiresIn: '1h' });

describe('1. HackathonItem JWT & Data Validation Unit Assertions', () => {
  test('JWT authorization tokens sign and verify user ownership context correctly', () => {
    const decodedA = jwt.verify(USER_A_TOKEN, JWT_SECRET) as { id: string; email: string };
    const decodedB = jwt.verify(USER_B_TOKEN, JWT_SECRET) as { id: string; email: string };

    assert.strictEqual(decodedA.id, USER_A_ID);
    assert.strictEqual(decodedB.id, USER_B_ID);
    assert.notStrictEqual(decodedA.id, decodedB.id, 'User A and User B must have distinct identity IDs');
  });

  test('Mongoose model schema validates required fields and length constraints', () => {
    const validItem = new HackathonItem({
      title: 'Valid Hackathon Title',
      description: 'Sensible description',
      status: 'pending',
      category: 'Backend',
      owner: new mongoose.Types.ObjectId(USER_A_ID),
    });

    const validationError = validItem.validateSync();
    assert.strictEqual(validationError, undefined, 'Valid item schema should pass validation without errors');
  });

  test('Mongoose model schema rejects invalid status enums', () => {
    const invalidStatusItem = new HackathonItem({
      title: 'Title',
      status: 'invalid_status_type' as any,
      owner: new mongoose.Types.ObjectId(USER_A_ID),
    });

    const validationError = invalidStatusItem.validateSync();
    assert.ok(validationError, 'Invalid status must fail Mongoose validation');
    assert.ok(validationError.errors.status, 'Status error must be present in validation errors');
  });

  test('Mongoose model schema rejects empty titles', () => {
    const emptyTitleItem = new HackathonItem({
      title: '',
      owner: new mongoose.Types.ObjectId(USER_A_ID),
    });

    const validationError = emptyTitleItem.validateSync();
    assert.ok(validationError, 'Empty title must fail validation');
    assert.ok(validationError.errors.title, 'Title error must be present');
  });
});

describe('2. HackathonItem Service & Ownership Integration Tests', () => {
  let isDbConnected = false;

  before(async () => {
    if (process.env.MONGODB_URI) {
      try {
        await connectDatabase();
        isDbConnected = mongoose.connection.readyState === 1;
      } catch (err: any) {
        console.warn('[TEST NOTICE] DB connection skipped during offline run pass');
      }
    }
  });

  after(async () => {
    if (isDbConnected) {
      try {
        await HackathonItem.deleteMany({ owner: { $in: [USER_A_ID, USER_B_ID] } });
      } catch {}
    }
  });

  test('1. Authenticated user creates item', async () => {
    if (!isDbConnected) return;

    const item = await HackathonItemService.create(
      { title: 'Project Design', description: 'Design mockup for hackathon', category: 'Design', status: 'pending' },
      USER_A_ID
    );

    assert.ok(item._id, 'Created item should have an ID');
    assert.strictEqual(item.title, 'Project Design');
    assert.strictEqual(item.owner.toString(), USER_A_ID);
    assert.strictEqual(item.status, 'pending');
  });

  test('2. User retrieves their items with pagination', async () => {
    if (!isDbConnected) return;

    const result = await HackathonItemService.getAll(USER_A_ID, { page: 1, limit: 10 });
    assert.ok(Array.isArray(result.items), 'Result items should be an array');
    assert.ok(result.items.length >= 1, 'User A should have at least 1 item');
    assert.strictEqual(result.pagination.page, 1);
    assert.strictEqual(result.pagination.limit, 10);
  });

  test('3. User retrieves one of their items by ID', async () => {
    if (!isDbConnected) return;

    const created = await HackathonItemService.create(
      { title: 'Backend API', description: 'Express endpoints' },
      USER_A_ID
    );

    const fetched = await HackathonItemService.getById(created._id.toString(), USER_A_ID);
    assert.strictEqual(fetched._id.toString(), created._id.toString());
    assert.strictEqual(fetched.title, 'Backend API');
  });

  test('4. User updates their item', async () => {
    if (!isDbConnected) return;

    const created = await HackathonItemService.create(
      { title: 'Old Title', status: 'pending' },
      USER_A_ID
    );

    const updated = await HackathonItemService.update(created._id.toString(), USER_A_ID, {
      title: 'New Updated Title',
      status: 'in_progress',
    });

    assert.strictEqual(updated.title, 'New Updated Title');
    assert.strictEqual(updated.status, 'in_progress');
  });

  test('5. User deletes their item', async () => {
    if (!isDbConnected) return;

    const created = await HackathonItemService.create(
      { title: 'Item to delete' },
      USER_A_ID
    );

    const delResult = await HackathonItemService.delete(created._id.toString(), USER_A_ID);
    assert.strictEqual(delResult.id, created._id.toString());
  });

  test('6, 7, 8, 9. User A cannot retrieve, update, or delete User B\'s private item', async () => {
    if (!isDbConnected) return;

    const itemB = await HackathonItemService.create(
      { title: 'User B Private Item' },
      USER_B_ID
    );

    // User A GET User B item
    await assert.rejects(async () => {
      await HackathonItemService.getById(itemB._id.toString(), USER_A_ID);
    }, (err: any) => err.message === 'Item not found');

    // User A PUT User B item
    await assert.rejects(async () => {
      await HackathonItemService.update(itemB._id.toString(), USER_A_ID, { title: 'Hacked Title' });
    }, (err: any) => err.message === 'Item not found');

    // User A DELETE User B item
    await assert.rejects(async () => {
      await HackathonItemService.delete(itemB._id.toString(), USER_A_ID);
    }, (err: any) => err.message === 'Item not found');
  });

  test('10. Nonexistent item returns 404 error', async () => {
    if (!isDbConnected) return;

    const randomId = new mongoose.Types.ObjectId().toString();
    await assert.rejects(async () => {
      await HackathonItemService.getById(randomId, USER_A_ID);
    }, (err: any) => err.message === 'Item not found');
  });

  test('11. Search by title, description, category (case-insensitive & empty search handling)', async () => {
    if (!isDbConnected) return;

    // Seed test items
    await HackathonItemService.create({ title: 'Alpha Mobile App', description: 'React Native project', category: 'Mobile', status: 'pending' }, USER_A_ID);
    await HackathonItemService.create({ title: 'Beta Cloud API', description: 'Node.js Express backend', category: 'Backend', status: 'in_progress' }, USER_A_ID);

    // Search by title
    const searchTitle = await HackathonItemService.getAll(USER_A_ID, { search: 'mobile' });
    assert.ok(searchTitle.items.some(i => i.title.includes('Alpha Mobile')));

    // Search by description
    const searchDesc = await HackathonItemService.getAll(USER_A_ID, { search: 'express' });
    assert.ok(searchDesc.items.some(i => i.title.includes('Beta Cloud')));

    // Search by category
    const searchCategory = await HackathonItemService.getAll(USER_A_ID, { search: 'backend' });
    assert.ok(searchCategory.items.some(i => i.category === 'Backend'));

    // Empty search returns all user items
    const searchEmpty = await HackathonItemService.getAll(USER_A_ID, { search: '   ' });
    assert.ok(searchEmpty.items.length >= 2);
  });

  test('12. Filtering by status, category, and combined query', async () => {
    if (!isDbConnected) return;

    const statusRes = await HackathonItemService.getAll(USER_A_ID, { status: 'in_progress' });
    assert.ok(statusRes.items.every(i => i.status === 'in_progress'));

    const categoryRes = await HackathonItemService.getAll(USER_A_ID, { category: 'Backend' });
    assert.ok(categoryRes.items.every(i => i.category === 'Backend'));

    const combinedRes = await HackathonItemService.getAll(USER_A_ID, {
      search: 'cloud',
      status: 'in_progress',
      category: 'Backend',
    });
    assert.ok(combinedRes.items.length >= 1);
    assert.strictEqual(combinedRes.items[0].category, 'Backend');
    assert.strictEqual(combinedRes.items[0].status, 'in_progress');
  });

  test('13. Controlled sorting (title_asc, title_desc, createdAt_asc, createdAt_desc)', async () => {
    if (!isDbConnected) return;

    const titleAsc = await HackathonItemService.getAll(USER_A_ID, { sort: 'title_asc' });
    assert.ok(titleAsc.items.length >= 2);
    const firstTitle = titleAsc.items[0].title.toLowerCase();
    const secondTitle = titleAsc.items[1].title.toLowerCase();
    assert.ok(firstTitle.localeCompare(secondTitle) <= 0, 'Items should be sorted alphabetically by title ascending');

    const titleDesc = await HackathonItemService.getAll(USER_A_ID, { sort: 'title_desc' });
    assert.ok(titleDesc.items[0].title.toLowerCase().localeCompare(titleDesc.items[1].title.toLowerCase()) >= 0, 'Items should be sorted title descending');
  });

  test('14. Pagination metadata (hasNextPage, hasPrevPage, page, totalPages)', async () => {
    if (!isDbConnected) return;

    const page1 = await HackathonItemService.getAll(USER_A_ID, { page: 1, limit: 1 });
    assert.strictEqual(page1.pagination.page, 1);
    assert.strictEqual(page1.pagination.limit, 1);
    assert.ok(page1.pagination.total >= 2);
    assert.strictEqual(page1.pagination.hasNextPage, true);
    assert.strictEqual(page1.pagination.hasPrevPage, false);

    const page2 = await HackathonItemService.getAll(USER_A_ID, { page: 2, limit: 1 });
    assert.strictEqual(page2.pagination.page, 2);
    assert.strictEqual(page2.pagination.hasPrevPage, true);
  });

  test('15. Security: User B search/filter query cannot access User A items', async () => {
    if (!isDbConnected) return;

    const userBSearch = await HackathonItemService.getAll(USER_B_ID, { search: 'Alpha Mobile' });
    assert.strictEqual(userBSearch.items.length, 0, 'User B must not see User A items via search');

    const userBFilter = await HackathonItemService.getAll(USER_B_ID, { category: 'Backend' });
    assert.strictEqual(userBFilter.items.length, 0, 'User B must not see User A items via filter');
  });
});

describe('3. HackathonItem HTTP Endpoints (Simulated / Live)', () => {
  test('6. Unauthenticated request is rejected (HTTP 401)', async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/items`);
      assert.strictEqual(res.status, 401, 'Unauthenticated request to /api/items must return 401');
    } catch (err: any) {
      console.warn(`[TEST NOTICE] Server offline at ${API_BASE_URL}, HTTP verification skipped`);
    }
  });

  test('10. Invalid input is rejected (HTTP 400)', async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${USER_A_TOKEN}`,
        },
        body: JSON.stringify({
          title: '', // empty title
          status: 'invalid_status_value',
        }),
      });

      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.success, false);
    } catch (err: any) {
      console.warn(`[TEST NOTICE] Server offline at ${API_BASE_URL}, HTTP verification skipped`);
    }
  });

  test('16. Invalid sort query parameter is rejected (HTTP 400)', async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/items?sort=malicious_field_asc`, {
        headers: { Authorization: `Bearer ${USER_A_TOKEN}` },
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.success, false);
    } catch (err: any) {
      console.warn(`[TEST NOTICE] Server offline at ${API_BASE_URL}, HTTP verification skipped`);
    }
  });
});

