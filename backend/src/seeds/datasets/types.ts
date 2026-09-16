import { HackathonItemStatus } from '../../models/HackathonItem';

export interface SeedItemTemplate {
  seedKey: string;
  title: string;
  description: string;
  category: string;
  status: HackathonItemStatus;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  attributes?: Record<string, any>;
  daysAgo: number;
}

export interface SeedDataset {
  name: string;
  description: string;
  items: SeedItemTemplate[];
}
