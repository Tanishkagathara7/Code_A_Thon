import { domainConfig } from '../../shared/src/config/domain.config';

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
  appName: domainConfig.brand.name,
  tagline: domainConfig.brand.tagline,
  primaryEntityName: domainConfig.domain.primaryEntityName,
  entityPluralName: domainConfig.domain.entityPluralName,
  categories: domainConfig.domain.categories,
  statuses: domainConfig.domain.statuses.map((s) => ({
    key: s.key,
    label: s.label,
    bg: s.key === 'pending' ? '#FEF3C7' : s.key === 'in_progress' ? '#E0E7FF' : '#DCFCE7',
    text: s.key === 'pending' ? '#B45309' : s.key === 'in_progress' ? '#4338CA' : '#15803D',
  })),
  aiSystemPrompt: domainConfig.domain.aiSystemPrompt,
  notificationCopy: {
    itemCreatedTitle: `${domainConfig.domain.primaryEntityName} Logged`,
    itemCreatedMessage: `Your ${domainConfig.domain.primaryEntityName.toLowerCase()} record was created successfully.`,
    itemCompletedTitle: `${domainConfig.domain.primaryEntityName} Resolved`,
    itemCompletedMessage: `The ${domainConfig.domain.primaryEntityName.toLowerCase()} has been marked as resolved.`,
  },
  accentColor: domainConfig.brand.accentColor,
  themeGradient: domainConfig.brand.themeGradient,
};
