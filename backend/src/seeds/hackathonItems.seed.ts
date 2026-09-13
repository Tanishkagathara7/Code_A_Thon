import mongoose from 'mongoose';
import { HackathonItem, IHackathonItem } from '../models/HackathonItem';
import { SeedDataset } from './datasets/types';
import { daysAgo, logSeed } from './seed.utils';

export interface SeedItemsResult {
  createdCount: number;
  updatedCount: number;
  totalDemoItems: number;
}

/**
 * Seeds domain items deterministically for the given demo user.
 * Re-running multiple times updates existing demo records instead of creating duplicates.
 */
export async function seedHackathonItems(
  dataset: SeedDataset,
  ownerId: mongoose.Types.ObjectId
): Promise<SeedItemsResult> {
  let createdCount = 0;
  let updatedCount = 0;

  for (const template of dataset.items) {
    const createdAt = daysAgo(template.daysAgo);
    const itemData = {
      title: template.title,
      description: template.description,
      category: template.category,
      status: template.status,
      owner: ownerId,
      isDemo: true,
      createdAt,
      updatedAt: createdAt,
    };

    // Find by title and owner to ensure deterministic idempotency
    const existing = await HackathonItem.findOne({ title: template.title, owner: ownerId });

    if (existing) {
      existing.description = template.description;
      existing.category = template.category;
      existing.status = template.status;
      existing.isDemo = true;
      existing.createdAt = createdAt;
      await existing.save();
      updatedCount++;
    } else {
      const newItem = new HackathonItem(itemData);
      await newItem.save();
      createdCount++;
    }
  }

  const totalDemoItems = await HackathonItem.countDocuments({ owner: ownerId, isDemo: true });

  logSeed(`📦 Items seed summary: ${createdCount} created, ${updatedCount} updated. Total demo items: ${totalDemoItems}`);

  return {
    createdCount,
    updatedCount,
    totalDemoItems,
  };
}

/**
 * Safely removes ONLY demo items created for the demo user.
 * Never drops database or touches non-demo user records.
 */
export async function resetDemoItems(ownerId: mongoose.Types.ObjectId): Promise<number> {
  const result = await HackathonItem.deleteMany({ owner: ownerId, isDemo: true });
  logSeed(`🧹 Demo items reset: Removed ${result.deletedCount} demo records for owner ${ownerId}`);
  return result.deletedCount;
}
