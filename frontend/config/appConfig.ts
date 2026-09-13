export interface StatusOption {
  key: string;
  label: string;
  bg: string;
  text: string;
}

export interface AppConfig {
  appName: string;
  tagline: string;
  primaryEntityName: string;
  entityPluralName: string;
  categories: string[];
  statuses: StatusOption[];
  aiSystemPrompt: string;
  notificationCopy: {
    itemCreatedTitle: string;
    itemCreatedMessage: string;
    itemCompletedTitle: string;
    itemCompletedMessage: string;
  };
  accentColor: string;
  themeGradient: [string, string];
}

export const appConfig: AppConfig = {
  appName: 'MindBloom',
  tagline: 'AI-Powered Hackathon Pivot Kit',
  primaryEntityName: 'Item',
  entityPluralName: 'Items',
  categories: ['Engineering', 'Design', 'Product', 'Marketing', 'General'],
  statuses: [
    { key: 'pending', label: 'Pending', bg: '#FEF3C7', text: '#B45309' },
    { key: 'in_progress', label: 'In Progress', bg: '#E0E7FF', text: '#4338CA' },
    { key: 'completed', label: 'Completed', bg: '#DCFCE7', text: '#15803D' },
  ],
  aiSystemPrompt: 'Act as an expert AI hackathon assistant. Analyze inputs and provide clear, actionable summaries and sub-tasks.',
  notificationCopy: {
    itemCreatedTitle: 'Item created',
    itemCreatedMessage: 'Your item was created successfully.',
    itemCompletedTitle: 'Item completed',
    itemCompletedMessage: 'Your item has been marked as completed.',
  },
  accentColor: '#4F46E5',
  themeGradient: ['#1E274A', '#2D3A6B'],
};
