import { CompleteProductSpec } from '../types/productSpec';
import { activeProductSpec } from './activeProductSpec';

export interface DomainNavigationItem {
  name: string;
  href: string;
  iconName: 'LayoutDashboard' | 'Layers' | 'Sparkles' | 'FolderOpen' | 'Bell' | 'Activity' | 'Shield' | 'Users' | 'MapPin' | 'HeartPulse' | string;
  badge?: string | number | null;
  description?: string;
  allowedRoles?: string[];
}

export interface DomainStatusOption {
  key: string;
  label: string;
  color: string;
  bg: string;
  text: string;
  border?: string;
}

export interface DomainLandingHero {
  badge: string;
  headlineWords: {
    text: string;
    highlightBg?: string;
    textColor?: string;
  }[];
  subheadline: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export interface DomainLandingFeature {
  title: string;
  description: string;
  category: string;
  iconName: string;
  badge?: string;
}

export interface DomainConfig {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    accentColor: string;
    themeGradient: [string, string];
  };
  domain: {
    primaryEntityName: string;
    entityPluralName: string;
    categories: string[];
    statuses: DomainStatusOption[];
    roles: string[];
    aiSystemPrompt: string;
  };
  navigation: DomainNavigationItem[];
  landing: {
    hero: DomainLandingHero;
    features: DomainLandingFeature[];
    problemSolution: {
      problem: string;
      solution: string;
    };
    faqs: { question: string; answer: string }[];
  };
  dashboard: {
    metrics: {
      key: string;
      label: string;
      iconName: string;
      color: string;
      accentBg: string;
    }[];
  };
  productSpec: CompleteProductSpec;
}

/**
 * Derives the active DomainConfig dynamically from the active CompleteProductSpec.
 */
function deriveDomainConfig(spec: CompleteProductSpec): DomainConfig {
  const primaryEntity = spec.entities.find((e) => e.isPrimary) || spec.entities[0] || {
    name: 'Item',
    pluralName: 'Items',
    categories: ['General'],
    statuses: [
      { key: 'pending', label: 'Pending', color: 'amber' as const, bg: 'bg-amber-50', text: 'text-amber-700' },
      { key: 'in_progress', label: 'In Progress', color: 'blue' as const, bg: 'bg-blue-50', text: 'text-blue-700' },
      { key: 'completed', label: 'Completed', color: 'emerald' as const, bg: 'bg-emerald-50', text: 'text-emerald-700' },
    ],
  };

  const heroWords = spec.landingPage.headlineHighlightWords.map((w) => ({
    text: w.text,
    highlightBg: w.bgHex,
    textColor: w.colorHex,
  }));

  const capabilitySection = spec.landingPage.sections.find((s) => s.type === 'capability_matrix');
  const features: DomainLandingFeature[] = capabilitySection?.content?.items?.map((item: any) => ({
    title: item.title,
    description: item.description,
    category: item.category || 'Feature',
    iconName: item.iconName || 'Activity',
    badge: item.badge,
  })) || [
    {
      title: 'Real-Time Sync',
      description: 'Instant state synchronization between web command center and mobile field clients.',
      category: 'Real-Time',
      iconName: 'Activity',
      badge: 'Zero Latency',
    },
  ];

  const problemSection = spec.landingPage.sections.find((s) => s.type === 'problem_solution');
  const faqSection = spec.landingPage.sections.find((s) => s.type === 'faq');

  return {
    brand: {
      name: spec.meta.name,
      shortName: spec.meta.shortName,
      tagline: spec.meta.tagline,
      description: spec.meta.description,
      accentColor: spec.meta.accentColorHex,
      themeGradient: spec.meta.themeGradient,
    },
    domain: {
      primaryEntityName: primaryEntity.name,
      entityPluralName: primaryEntity.pluralName,
      categories: primaryEntity.categories || ['General'],
      statuses: primaryEntity.statuses.map((s) => ({
        key: s.key,
        label: s.label,
        color: s.color,
        bg: s.bg,
        text: s.text,
        border: s.border,
      })),
      roles: spec.roles.map((r) => r.name),
      aiSystemPrompt: spec.aiSystemPrompt,
    },
    navigation: spec.navigation.map((n) => ({
      name: n.name,
      href: n.href,
      iconName: n.iconName as any,
      description: n.description,
      allowedRoles: n.allowedRoles,
    })),
    landing: {
      hero: {
        badge: spec.landingPage.badge,
        headlineWords: heroWords,
        subheadline: spec.landingPage.detailedSubheadline,
        ctaPrimary: spec.landingPage.primaryCta,
        ctaSecondary: spec.landingPage.secondaryCta,
      },
      features,
      problemSolution: {
        problem: problemSection?.content?.problem || spec.meta.problemSummary,
        solution: problemSection?.content?.solution || spec.meta.objective,
      },
      faqs: faqSection?.content?.faqs || [],
    },
    dashboard: {
      metrics: [
        { key: 'total', label: `Total ${primaryEntity.pluralName}`, iconName: 'Layers', color: spec.meta.accentColorHex, accentBg: 'bg-indigo-50' },
        { key: 'inProgress', label: 'Active / In-Flight', iconName: 'Activity', color: '#2563EB', accentBg: 'bg-blue-50' },
        { key: 'pending', label: 'Pending Triage', iconName: 'Bell', color: '#D97706', accentBg: 'bg-amber-50' },
        { key: 'completed', label: 'Resolved', iconName: 'Shield', color: '#059669', accentBg: 'bg-emerald-50' },
      ],
    },
    productSpec: spec,
  };
}

export const domainConfig: DomainConfig = deriveDomainConfig(activeProductSpec);

export { activeProductSpec };
export default domainConfig;
