export * from '../config/domain.config';
import { domainConfig } from '../config/domain.config';

export const DEFAULT_CATEGORIES = domainConfig.domain.categories;

export const ITEM_STATUSES = domainConfig.domain.statuses;

export const PRODUCT_BRAND = {
  name: domainConfig.brand.name,
  tagline: domainConfig.brand.tagline,
  entityName: domainConfig.domain.primaryEntityName,
  entityPlural: domainConfig.domain.entityPluralName,
} as const;

