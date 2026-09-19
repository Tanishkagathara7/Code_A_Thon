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
  appName: 'VyaaparGST',
  tagline: 'Smart GST Billing & Invoicing Suite for Indian Shopkeepers',
  primaryEntityName: 'Bill',
  entityPluralName: 'Bills',
  categories: ['Retail Counter', 'Wholesale B2B', 'Credit / Khata', 'Direct Cash', 'Service Invoice'],
  statuses: [
    { key: 'completed', label: 'Paid in Full', bg: '#DCFCE7', text: '#15803D' },
    { key: 'in_progress', label: 'Partial Balance', bg: '#EDE9FE', text: '#4338CA' },
    { key: 'pending', label: 'Unpaid / Due', bg: '#FEF3C7', text: '#B45309' },
  ],
  aiSystemPrompt:
    'Act as an expert Indian GST billing advisor. Provide fast HSN lookups, GST rate verifications (0%, 5%, 12%, 18%, 28%), and concise customer balance summaries.',
  notificationCopy: {
    itemCreatedTitle: 'GST Invoice Generated',
    itemCreatedMessage: 'Your tax invoice was saved successfully with sequential number.',
    itemCompletedTitle: 'Payment Settled',
    itemCompletedMessage: 'The invoice has been marked as fully paid.',
  },
  accentColor: '#0A0A0A',
  themeGradient: ['#1E242B', '#0A0A0A'],
};
