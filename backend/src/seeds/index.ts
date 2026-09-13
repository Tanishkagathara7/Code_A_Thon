import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Load env before importing database config
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDatabase } from '../config/database';
import { checkSeedSafety, logSeed } from './seed.utils';
import { seedDemoUser, DEMO_USER_EMAIL, DEMO_USER_RAW_PASSWORD } from './users.seed';
import { seedHackathonItems, resetDemoItems } from './hackathonItems.seed';
import { genericDataset } from './datasets/generic';
import { SeedDataset } from './datasets/types';

const availableDatasets: Record<string, SeedDataset> = {
  generic: genericDataset,
};

export async function runSeeder(args: string[] = process.argv.slice(2)): Promise<void> {
  const isResetMode = args.includes('--reset');
  
  // Extract custom dataset if specified: --dataset=education
  const datasetArg = args.find((arg) => arg.startsWith('--dataset='));
  const datasetName = datasetArg ? datasetArg.split('=')[1] : 'generic';

  const dataset = availableDatasets[datasetName] || genericDataset;

  logSeed('==================================================');
  logSeed('🌱 STARTING DATABASE DEMO-DATA SEEDING SYSTEM');
  logSeed('==================================================');

  // Step 1: Environment Safety Guard
  const safety = checkSeedSafety();
  if (!safety.allowed) {
    console.error(safety.reason);
    process.exit(1);
  }

  // Step 2: Connect to MongoDB
  try {
    await connectDatabase();
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB connection is not active (offline/unreachable). Seeding aborted.');
      process.exit(1);
    }
  } catch (err: any) {
    console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  }

  try {
    // Step 3: Seed Demo User
    const demoUser = await seedDemoUser();

    // Step 4: Perform Reset if requested
    if (isResetMode) {
      logSeed('🧹 Reset flag detected (--reset). Cleaning existing demo records...');
      await resetDemoItems(demoUser._id as mongoose.Types.ObjectId);
    }

    // Step 5: Seed Demo Items
    logSeed(`📦 Seeding dataset: "${dataset.name}" (${dataset.items.length} records defined)...`);
    const seedResult = await seedHackathonItems(dataset, demoUser._id as mongoose.Types.ObjectId);

    // Step 6: Print Concise Summary
    logSeed('==================================================');
    logSeed('✨ SEEDING COMPLETED SUCCESSFULLY!');
    logSeed(`👤 Demo User Email:       ${DEMO_USER_EMAIL}`);
    logSeed(`🔐 Demo User Password:    ${DEMO_USER_RAW_PASSWORD} (Dev only)`);
    logSeed(`📊 Selected Dataset:      ${dataset.name}`);
    logSeed(`🆕 New Items Created:     ${seedResult.createdCount}`);
    logSeed(`🔄 Existing Updated:      ${seedResult.updatedCount}`);
    logSeed(`📈 Total Demo Records:    ${seedResult.totalDemoItems}`);
    logSeed('==================================================');
  } catch (err: any) {
    console.error(`❌ Error during seeding process: ${err.message}`);
    process.exitCode = 1;
  } finally {
    // Step 7: Close MongoDB connection cleanly
    await mongoose.disconnect();
    logSeed('🔌 Database connection closed cleanly.');
  }
}

// Run CLI directly if invoked from command line
if (require.main === module) {
  runSeeder();
}
