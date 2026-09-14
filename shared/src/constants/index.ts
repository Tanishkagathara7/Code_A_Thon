export const DEFAULT_CATEGORIES = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'General',
] as const;

export const ITEM_STATUSES = [
  { key: 'pending', label: 'Pending', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { key: 'in_progress', label: 'In Progress', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { key: 'completed', label: 'Completed', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
] as const;

export const PRODUCT_BRAND = {
  name: 'Pulse',
  tagline: 'Real-Time Operational Intelligence & AI Workflow Platform',
  entityName: 'Item',
  entityPlural: 'Items',
} as const;
