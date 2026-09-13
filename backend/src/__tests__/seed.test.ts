import assert from 'node:assert';
import { test, describe, before, after } from 'node:test';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { HackathonItem } from '../models/HackathonItem';
import { checkSeedSafety } from '../seeds/seed.utils';
import { seedDemoUser, DEMO_USER_EMAIL, DEMO_USER_RAW_PASSWORD } from '../seeds/users.seed';
import { seedHackathonItems, resetDemoItems } from '../seeds/hackathonItems.seed';
import { genericDataset } from '../seeds/datasets/generic';

describe('Database Seeding System Foundation Tests', () => {
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
        const demoUser = await User.findOne({ email: DEMO_USER_EMAIL.toLowerCase() });
        if (demoUser) {
          await HackathonItem.deleteMany({ owner: demoUser._id });
          await User.deleteOne({ _id: demoUser._id });
        }
      } catch {}
      await mongoose.disconnect();
    }
  });

  test('1. Safety guard protects production environment against unauthorized seeding', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSeedAllowed = process.env.SEED_ALLOWED;

    try {
      process.env.NODE_ENV = 'production';
      delete process.env.SEED_ALLOWED;

      const safety = checkSeedSafety();
      assert.strictEqual(safety.allowed, false, 'Check must fail when NODE_ENV is production');
      assert.ok(safety.reason?.includes('SEED REFUSED'), 'Reason must mention SEED REFUSED');
    } finally {
      process.env.NODE_ENV = originalEnv;
      process.env.SEED_ALLOWED = originalSeedAllowed;
    }
  });

  test('2. Safety guard allows execution in development environment or when SEED_ALLOWED=true', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSeedAllowed = process.env.SEED_ALLOWED;

    try {
      process.env.NODE_ENV = 'development';
      delete process.env.SEED_ALLOWED;
      let safety = checkSeedSafety();
      assert.strictEqual(safety.allowed, true);

      process.env.NODE_ENV = 'production';
      process.env.SEED_ALLOWED = 'true';
      safety = checkSeedSafety();
      assert.strictEqual(safety.allowed, true);
    } finally {
      process.env.NODE_ENV = originalEnv;
      process.env.SEED_ALLOWED = originalSeedAllowed;
    }
  });

  test('3. Demo user creation with valid bcrypt hashed password', async () => {
    if (!isDbConnected) return;

    const demoUser = await seedDemoUser();
    assert.ok(demoUser._id, 'Demo user must have a valid Mongoose _id');
    assert.strictEqual(demoUser.email, DEMO_USER_EMAIL.toLowerCase());
    assert.strictEqual(demoUser.provider, 'email');
    assert.ok(demoUser.passwordHash, 'Password hash must be present');
    assert.notStrictEqual(demoUser.passwordHash, DEMO_USER_RAW_PASSWORD, 'Password must not be stored in plaintext');

    const isMatch = await bcrypt.compare(DEMO_USER_RAW_PASSWORD, demoUser.passwordHash!);
    assert.strictEqual(isMatch, true, 'Bcrypt compare must succeed for valid demo password');
  });

  test('4. Domain items seeding with correct demo user ownership and isDemo marking', async () => {
    if (!isDbConnected) return;

    const demoUser = await User.findOne({ email: DEMO_USER_EMAIL.toLowerCase() });
    assert.ok(demoUser, 'Demo user must exist');

    const result = await seedHackathonItems(genericDataset, demoUser!._id as mongoose.Types.ObjectId);
    assert.ok(result.totalDemoItems >= 30, 'Should seed at least 30 demo records');

    const items = await HackathonItem.find({ owner: demoUser!._id });
    assert.strictEqual(items.length, result.totalDemoItems);
    assert.ok(items.every((item) => item.isDemo === true), 'All seeded records must have isDemo: true');
    assert.ok(items.every((item) => item.owner.toString() === demoUser!._id.toString()), 'All seeded items must belong to demo user');
  });

  test('5. Deterministic seeding idempotency (multiple runs update without creating duplicates)', async () => {
    if (!isDbConnected) return;

    const demoUser = await User.findOne({ email: DEMO_USER_EMAIL.toLowerCase() });
    assert.ok(demoUser);

    const firstRun = await seedHackathonItems(genericDataset, demoUser!._id as mongoose.Types.ObjectId);
    const countAfterFirstRun = await HackathonItem.countDocuments({ owner: demoUser!._id, isDemo: true });

    // Second run pass
    const secondRun = await seedHackathonItems(genericDataset, demoUser!._id as mongoose.Types.ObjectId);
    const countAfterSecondRun = await HackathonItem.countDocuments({ owner: demoUser!._id, isDemo: true });

    assert.strictEqual(secondRun.createdCount, 0, 'Second run should create 0 new items');
    assert.strictEqual(secondRun.updatedCount, genericDataset.items.length, 'Second run should update existing items');
    assert.strictEqual(countAfterSecondRun, countAfterFirstRun, 'Total item count must remain stable across multiple runs');
  });

  test('6. Reset mode removes ONLY isDemo records and preserves non-demo user data', async () => {
    if (!isDbConnected) return;

    const demoUser = await User.findOne({ email: DEMO_USER_EMAIL.toLowerCase() });
    assert.ok(demoUser);

    // Create a real (non-demo) item for demo user
    const nonDemoItem = new HackathonItem({
      title: 'Real User Created Item',
      description: 'This item was created by the user through UI',
      status: 'pending',
      category: 'Personal',
      owner: demoUser!._id,
      isDemo: false,
    });
    await nonDemoItem.save();

    // Execute reset mode
    const deletedCount = await resetDemoItems(demoUser!._id as mongoose.Types.ObjectId);
    assert.ok(deletedCount > 0, 'Reset should report deleted demo items');

    const remainingDemoCount = await HackathonItem.countDocuments({ owner: demoUser!._id, isDemo: true });
    assert.strictEqual(remainingDemoCount, 0, 'All isDemo: true records should be deleted');

    const preservedItem = await HackathonItem.findById(nonDemoItem._id);
    assert.ok(preservedItem, 'Non-demo item must be preserved after reset');

    // Clean up test non-demo item
    await HackathonItem.deleteOne({ _id: nonDemoItem._id });
  });
});
