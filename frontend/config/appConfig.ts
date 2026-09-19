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
  appName: 'Pulse',
  tagline: 'Multi-Platform Operational Intelligence & AI Workflow Platform',
  primaryEntityName: 'Incident',
  entityPluralName: 'Incidents',
  categories: ['Critical', 'High Priority', 'Logistics', 'Medical', 'General'],
  statuses: [
    { key: 'pending', label: 'Triage / Pending', bg: '#FEF3C7', text: '#B45309' },
    { key: 'in_progress', label: 'In Transit / Active', bg: '#EDE9FE', text: '#5B45F5' },
    { key: 'completed', label: 'Resolved / Done', bg: '#DCFCE7', text: '#15803D' },
  ],
  aiSystemPrompt:
    'Act as a specialized operational intelligence copilot. Extract urgent actions, prioritize domain tasks, and synthesize cross-platform incident updates.',
  notificationCopy: {
    itemCreatedTitle: 'Incident Logged',
    itemCreatedMessage: 'Your incident record was created successfully.',
    itemCompletedTitle: 'Incident Resolved',
    itemCompletedMessage: 'The incident has been marked as resolved.',
  },
  accentColor: '#5B45F5',
  themeGradient: ['#5B45F5', '#4834df'],
};
