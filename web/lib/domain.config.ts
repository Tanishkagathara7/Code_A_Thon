export interface DomainNavigationItem {
  name: string;
  href: string;
  iconName: 'LayoutDashboard' | 'Layers' | 'Sparkles' | 'FolderOpen' | 'Bell' | 'Activity' | 'Shield' | 'Users' | 'MapPin' | 'HeartPulse';
  badge?: string | number | null;
  description?: string;
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
}

export const domainConfig: DomainConfig = {
  brand: {
    name: 'Pulse',
    shortName: 'Pulse',
    tagline: 'Multi-Platform Operational Intelligence & AI Workflow Platform',
    description: 'High-density operational intelligence with real-time web & mobile synchronization.',
    accentColor: '#4F46E5',
    themeGradient: ['#1E274A', '#2D3A6B'],
  },
  domain: {
    primaryEntityName: 'Incident',
    entityPluralName: 'Incidents',
    categories: ['Critical', 'High Priority', 'Logistics', 'Medical', 'General'],
    statuses: [
      { key: 'pending', label: 'Triage / Pending', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      { key: 'in_progress', label: 'In Transit / Active', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      { key: 'completed', label: 'Resolved / Done', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    ],
    roles: ['Coordinator', 'Field Responder', 'Analyst', 'Admin'],
    aiSystemPrompt: 'Act as a specialized operational intelligence copilot. Extract urgent actions, prioritize domain tasks, and synthesize cross-platform incident updates.',
  },
  navigation: [
    { name: 'Dashboard', href: '/dashboard', iconName: 'LayoutDashboard', description: 'Real-time telemetry and operational metrics' },
    { name: 'Incident Hub', href: '/items', iconName: 'Layers', description: 'Core domain records and status lifecycle' },
    { name: 'AI Copilot', href: '/ai-assistant', iconName: 'Sparkles', description: 'Prompt generation and automated synthesis' },
    { name: 'Files & Media', href: '/files', iconName: 'FolderOpen', description: 'Evidence files and attachments' },
    { name: 'Notifications', href: '/notifications', iconName: 'Bell', description: 'Dispatch alerts and priority activity' },
  ],
  landing: {
    hero: {
      badge: 'Real-Time Multi-Platform Coordination',
      headlineWords: [
        { text: 'Precision', highlightBg: '#2563EB', textColor: '#FFFFFF' },
        { text: 'Operations', highlightBg: '#EC4899', textColor: '#FFFFFF' },
        { text: 'on' },
        { text: 'Desktop,', highlightBg: '#10B981', textColor: '#FFFFFF' },
        { text: 'Native' },
        { text: 'Velocity', highlightBg: '#6366F1', textColor: '#FFFFFF' },
        { text: 'on' },
        { text: 'Mobile.' },
      ],
      subheadline: 'Synchronize critical domain workflows instantly across desktop command centers and touch-first mobile devices.',
      ctaPrimary: { label: 'Launch Workspace', href: '/login' },
      ctaSecondary: { label: 'Explore Features', href: '#features' },
    },
    features: [
      {
        title: 'Instant Triage & Dispatch',
        description: 'Categorize, prioritize, and route high-impact domain items in sub-second cycles.',
        category: 'Workflows',
        iconName: 'Activity',
        badge: 'Zero Latency',
      },
      {
        title: 'Bi-Directional Mobile Sync',
        description: 'Field responders receive real-time updates and push logs seamlessly via native Expo client.',
        category: 'Mobility',
        iconName: 'HeartPulse',
        badge: 'Dual-Platform',
      },
      {
        title: 'OpenRouter AI Copilot',
        description: 'Automate situation summaries, classify urgencies, and synthesize action plans on demand.',
        category: 'Intelligence',
        iconName: 'Sparkles',
        badge: 'LLM Powered',
      },
    ],
    problemSolution: {
      problem: 'Fragmented operations across slow web dashboards and disconnected mobile tools lead to critical delays.',
      solution: 'A unified single-source-of-truth platform connecting desktop decision-makers with mobile responders in real time.',
    },
    faqs: [
      {
        question: 'How do Web and Mobile remain synchronized?',
        answer: 'Both platforms consume the same REST backend and database. Status transitions and records created on Mobile reflect instantly on Web upon refresh or polling.',
      },
      {
        question: 'How do I pivot this to another problem domain?',
        answer: 'Simply edit `shared/src/config/domain.config.ts`. All navigation, titles, statuses, categories, and landing page copy adapt automatically across both platforms.',
      },
    ],
  },
  dashboard: {
    metrics: [
      { key: 'total', label: 'Total Records', iconName: 'Layers', color: '#4F46E5', accentBg: 'bg-indigo-50' },
      { key: 'inProgress', label: 'Active / In-Flight', iconName: 'Activity', color: '#2563EB', accentBg: 'bg-blue-50' },
      { key: 'pending', label: 'Pending Triage', iconName: 'Bell', color: '#D97706', accentBg: 'bg-amber-50' },
      { key: 'completed', label: 'Resolved', iconName: 'Shield', color: '#059669', accentBg: 'bg-emerald-50' },
    ],
  },
};

export default domainConfig;
