import { HackathonItemStatus } from '../../models/HackathonItem';

export interface SeedItemTemplate {
  seedKey: string;
  title: string;
  description: string;
  category: string;
  status: HackathonItemStatus;
  daysAgo: number;
}

export interface SeedDataset {
  name: string;
  description: string;
  items: SeedItemTemplate[];
}
