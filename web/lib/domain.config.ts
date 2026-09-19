export type PrimitiveFieldType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'date' 
  | 'enum' 
  | 'text' 
  | 'location' 
  | 'user_ref' 
  | 'object';

export interface EntityFieldSpec {
  name: string;
  label: string;
  type: PrimitiveFieldType;
  required?: boolean;
  options?: string[];
  description?: string;
  defaultValue?: any;
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface EntityRelationshipSpec {
  type: 'one_to_one' | 'one_to_many' | 'many_to_many';
  targetEntity: string;
  field: string;
  description?: string;
}

export interface EntityStatusSpec {
  key: string;
  label: string;
  color: 'emerald' | 'amber' | 'blue' | 'rose' | 'indigo' | 'violet' | 'zinc';
  bg: string;
  text: string;
  border?: string;
  description?: string;
  isTerminal?: boolean;
}

export interface DomainEntitySpec {
  name: string;
  pluralName: string;
  description: string;
  isPrimary?: boolean;
  fields: EntityFieldSpec[];
  statuses: EntityStatusSpec[];
  relationships?: EntityRelationshipSpec[];
  categories?: string[];
  permissions?: {
    createRoles: string[];
    readRoles: string[];
    updateRoles: string[];
    deleteRoles: string[];
  };
}

export interface RoleSpec {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  permissions: string[];
  defaultRoute: string;
  customProfileFields?: EntityFieldSpec[];
}

export interface WorkflowTransitionSpec {
  fromStatus: string;
  toStatus: string;
  actionLabel: string;
  allowedRoles: string[];
  requiresReason?: boolean;
  triggersNotification?: {
    recipientRoles: string[];
    titleTemplate: string;
    messageTemplate: string;
  };
}

export interface WorkflowSpec {
  id: string;
  name: string;
  description: string;
  entityName: string;
  initialStatus: string;
  transitions: WorkflowTransitionSpec[];
}

export interface NavigationItemSpec {
  id: string;
  name: string;
  href: string;
  iconName: string;
  allowedRoles?: string[];
  badgeKey?: string;
  description?: string;
}

export type DashboardWidgetType = 
  | 'metric_card' 
  | 'status_breakdown' 
  | 'workflow_action_feed' 
  | 'recent_items_table' 
  | 'category_progress' 
  | 'ai_action_assistant' 
  | 'timeline_tracker' 
  | 'emergency_banner'
  | 'quick_create_action';

export interface DashboardWidgetSpec {
  id: string;
  type: DashboardWidgetType;
  title: string;
  subtitle?: string;
  gridSpan: 'full' | 'half' | 'third' | 'two_thirds';
  config?: Record<string, any>;
  allowedRoles?: string[];
}

export interface RoleDashboardSpec {
  roleId: string;
  welcomeMessage: string;
  primaryAction: {
    label: string;
    href: string;
    iconName?: string;
  };
  widgets: DashboardWidgetSpec[];
}

export type LandingSectionType = 
  | 'hero' 
  | 'problem_solution' 
  | 'workflow_pipeline' 
  | 'role_breakdown' 
  | 'capability_matrix' 
  | 'real_time_sync' 
  | 'interactive_demo' 
  | 'faq' 
  | 'cta_banner';

export interface LandingSectionSpec {
  id: string;
  type: LandingSectionType;
  title?: string;
  subtitle?: string;
  content: Record<string, any>;
  order: number;
}

export interface BespokeLandingSpec {
  badge: string;
  headlineHighlightWords: {
    text: string;
    colorHex?: string;
    bgHex?: string;
  }[];
  tagline: string;
  detailedSubheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  sections: LandingSectionSpec[];
}

export interface AuthExperienceSpec {
  requireRoleSelectionOnSignup: boolean;
  availableRoles: { id: string; name: string; description: string }[];
  customSignupFields: EntityFieldSpec[];
  loginGuidanceText?: string;
}

export interface MobileExperienceSpec {
  appName: string;
  tabBarItems: {
    key: string;
    label: string;
    iconName: string;
    allowedRoles?: string[];
  }[];
  quickActionTitle: string;
  primaryEntityWorkflowName: string;
}

export interface CompleteProductSpec {
  id: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  
  meta: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    objective: string;
    problemSummary: string;
    targetUsers: string[];
    accentColorHex: string;
    themeGradient: [string, string];
  };

  roles: RoleSpec[];
  entities: DomainEntitySpec[];
  workflows: WorkflowSpec[];
  navigation: NavigationItemSpec[];
  roleDashboards: RoleDashboardSpec[];
  landingPage: BespokeLandingSpec;
  authExperience: AuthExperienceSpec;
  mobileExperience: MobileExperienceSpec;
  aiSystemPrompt: string;
}

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

export const defaultProductSpec: CompleteProductSpec = {
  id: 'vyaapargst-billing-suite',
  version: '2.0.0',
  createdAt: '2026-09-19T00:00:00Z',
  updatedAt: '2026-09-19T00:00:00Z',
  meta: {
    name: 'VyaaparGST',
    shortName: 'VyaaparGST',
    tagline: 'Smart GST Billing & Invoicing Suite for Indian Shopkeepers',
    description: 'Fast, compliant GST billing, party khata ledger, and instant A4 PDF invoice generator for retail and wholesale businesses.',
    objective: 'Empower retail shopkeepers with 30-second GST invoice generation, automated CGST/SGST/IGST tax calculation, party balance tracking, and compliant printable invoices.',
    problemSummary: 'Small retailers struggle with manual billing calculations across multiple GST slabs (0%, 5%, 12%, 18%, 28%) and distinguishing intra-state from inter-state tax splits.',
    targetUsers: ['Retail Shopkeepers', 'Kirana Store Merchants', 'Wholesale Traders', 'Service Providers', 'Cashiers'],
    accentColorHex: '#0A0A0A',
    themeGradient: ['#1E242B', '#0A0A0A'],
  },
  roles: [
    {
      id: 'shop_owner',
      name: 'Shopkeeper / Owner',
      description: 'Business proprietor with full access to bills, customer balances, product inventory, and tax summaries',
      responsibilities: ['Create & print GST invoices', 'Manage parties & customer balances', 'Monitor tax collections & sales'],
      permissions: ['*'],
      defaultRoute: '/dashboard',
      customProfileFields: [
        { name: 'businessName', label: 'Shop / Firm Name', type: 'string', required: true, defaultValue: 'Shreeji General Store' },
        { name: 'gstin', label: 'Shop GSTIN', type: 'string', required: false, defaultValue: '24AAACP1234M1Z5' },
        { name: 'state', label: 'Operating State', type: 'string', required: true, defaultValue: 'Gujarat' },
      ],
    },
    {
      id: 'cashier',
      name: 'Billing Cashier',
      description: 'Point-of-sale operator focused on rapid invoice creation and customer checkout',
      responsibilities: ['Generate sales bills', 'Lookup customer phone numbers', 'Print & share invoices'],
      permissions: ['items:create', 'items:read', 'items:update'],
      defaultRoute: '/items/new',
    },
  ],
  entities: [
    {
      name: 'GST Bill',
      pluralName: 'Bills',
      description: 'Official GST Tax Invoice record for goods and services sold',
      isPrimary: true,
      categories: ['Retail Counter', 'Wholesale B2B', 'Credit / Khata', 'Direct Cash', 'Service Invoice'],
      statuses: [
        { key: 'completed', label: 'Paid in Full', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', isTerminal: true },
        { key: 'in_progress', label: 'Partial Balance', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
        { key: 'pending', label: 'Unpaid / Due', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
      ],
      fields: [
        { name: 'title', label: 'Invoice No & Party', type: 'string', required: true, description: 'e.g. INV-2026-0042 • Rajesh Traders' },
        { name: 'description', label: 'Itemized Summary', type: 'text', required: false },
        { name: 'category', label: 'Billing Type', type: 'enum', required: true, options: ['Retail Counter', 'Wholesale B2B', 'Credit / Khata', 'Direct Cash', 'Service Invoice'] },
        { name: 'priority', label: 'Invoice Severity', type: 'enum', required: true, options: ['low', 'medium', 'high', 'urgent'], defaultValue: 'medium' },
      ],
    },
  ],
  workflows: [
    {
      id: 'bill-lifecycle',
      name: 'Invoice Status Lifecycle',
      description: 'From invoice generation to full payment settlement',
      entityName: 'GST Bill',
      initialStatus: 'completed',
      transitions: [
        {
          fromStatus: 'pending',
          toStatus: 'in_progress',
          actionLabel: 'Record Partial Payment',
          allowedRoles: ['shop_owner', 'cashier'],
        },
        {
          fromStatus: 'in_progress',
          toStatus: 'completed',
          actionLabel: 'Mark Fully Settled',
          allowedRoles: ['shop_owner', 'cashier'],
        },
      ],
    },
  ],
  navigation: [
    { id: 'nav-dashboard', name: 'Dashboard', href: '/dashboard', iconName: 'LayoutDashboard', description: 'Real-time sales, tax collected, and bill volume' },
    { id: 'nav-new-bill', name: 'Create Bill', href: '/items/new', iconName: 'Plus', description: 'Fast GST invoice counter' },
    { id: 'nav-bills', name: 'Bill History', href: '/items', iconName: 'Layers', description: 'Search and download past invoices' },
    { id: 'nav-settings', name: 'Shop Settings', href: '/settings', iconName: 'Settings', description: 'Business profile, GSTIN, and tax rules' },
  ],
  roleDashboards: [
    {
      roleId: 'shop_owner',
      welcomeMessage: 'Welcome to your GST billing desk. Fast invoicing and real-time tax accounting.',
      primaryAction: { label: '+ Create GST Bill', href: '/items/new', iconName: 'Plus' },
      widgets: [
        { id: 'w-kpis', type: 'metric_card', title: 'Billing Metrics', gridSpan: 'full' },
        { id: 'w-recent', type: 'recent_items_table', title: 'Recent Tax Invoices', gridSpan: 'two_thirds' },
        { id: 'w-categories', type: 'category_progress', title: 'Tax Split Breakdown', gridSpan: 'third' },
      ],
    },
    {
      roleId: 'cashier',
      welcomeMessage: 'Point of Sale Counter active. Create itemized bills in seconds.',
      primaryAction: { label: '+ New Invoice', href: '/items/new', iconName: 'Plus' },
      widgets: [
        { id: 'w-kpis', type: 'metric_card', title: 'Counter Volume', gridSpan: 'full' },
        { id: 'w-recent', type: 'recent_items_table', title: 'Recent Invoices', gridSpan: 'two_thirds' },
      ],
    },
  ],
  landingPage: {
    badge: 'GST-Compliant Retail & Wholesale Invoicing',
    tagline: 'Generate Compliant GST Bills in 30 Seconds',
    detailedSubheadline: 'Automatic CGST, SGST, and IGST tax splits, reusable customer parties, item catalogs with HSN codes, and instant A4 PDF invoice export.',
    primaryCta: { label: 'Launch Billing Desk', href: '/items/new' },
    secondaryCta: { label: 'Explore Platform', href: '#features' },
    headlineHighlightWords: [
      { text: 'Effortless' },
      { text: 'GST', bgHex: '#10B981', colorHex: '#FFFFFF' },
      { text: 'Invoicing' },
      { text: 'for', bgHex: '#2563EB', colorHex: '#FFFFFF' },
      { text: 'Indian' },
      { text: 'Retailers.', bgHex: '#EC4899', colorHex: '#FFFFFF' },
    ],
    sections: [
      {
        id: 'sec-hero',
        type: 'hero',
        order: 1,
        content: {},
      },
      {
        id: 'sec-problem-solution',
        type: 'problem_solution',
        title: 'Manual Billing Slowdowns',
        order: 2,
        content: {
          problem: 'Manual paper bills and complicated spreadsheets lead to calculation errors across multi-rate GST slabs, missing HSN codes, and incorrect intra/inter-state tax splits.',
          solution: 'A unified single-source billing application that automates tax splits, generates sequential invoices, and prints statutory A4 tax bills instantly.',
        },
      },
      {
        id: 'sec-capabilities',
        type: 'capability_matrix',
        title: 'Purpose-Built GST Capabilities',
        order: 3,
        content: {
          items: [
            {
              title: 'Statutory GST Calculation',
              description: 'Auto-computes taxable value (Rate × Qty) and splits 50:50 CGST+SGST for intra-state or 100% IGST for inter-state transactions.',
              category: 'Tax Engine',
              badge: 'Automated Split',
            },
            {
              title: 'Reusable Customer & Item Catalog',
              description: 'Maintain party details with GSTIN and item catalog with HSN codes so you never retype product prices or customer info.',
              category: 'Speed',
              badge: 'Fast Lookup',
            },
            {
              title: 'Instant A4 PDF & WhatsApp Share',
              description: 'Download or print standard GST tax invoices with amount in words, declaration, and send PDF summaries directly to customer WhatsApp.',
              category: 'Invoicing',
              badge: 'Print Ready',
            },
          ],
        },
      },
      {
        id: 'sec-faq',
        type: 'faq',
        title: 'Frequently Asked Questions',
        order: 4,
        content: {
          faqs: [
            {
              question: 'How does VyaaparGST calculate intra-state vs inter-state GST?',
              answer: 'The system automatically compares the selected party state with your shop state. If both are the same (e.g. Gujarat to Gujarat), the item GST rate is split equally into CGST (50%) and SGST (50%). If states differ (e.g. Gujarat to Maharashtra), the full tax is applied as IGST.',
            },
            {
              question: 'Can I generate bills without a customer GSTIN (B2C)?',
              answer: 'Yes. The GSTIN field is optional. For walk-in retail customers, simply enter their name and mobile number, and the system generates a compliant retail tax invoice.',
            },
            {
              question: 'Are saved invoices editable after generation?',
              answer: 'In accordance with GST rules, saved tax invoices are immutable once finalized to maintain audit integrity and prevent sequential tampering.',
            },
            {
              question: 'Can I print invoices on any standard printer?',
              answer: 'Yes! The invoice view is styled specifically for standard A4 and thermal printing using your browser print dialogue (Ctrl+P / Command+P) with zero setup required.',
            },
          ],
        },
      },
    ],
  },
  authExperience: {
    requireRoleSelectionOnSignup: true,
    availableRoles: [
      { id: 'shop_owner', name: 'Shopkeeper / Owner', description: 'Manage shop profile, bills, customer balances, and tax reports' },
      { id: 'cashier', name: 'Billing Cashier', description: 'Point-of-sale operator focused on rapid invoice creation' },
    ],
    customSignupFields: [
      { name: 'businessName', label: 'Shop / Firm Name', type: 'string', required: true },
      { name: 'gstin', label: 'Shop GSTIN (Optional)', type: 'string', required: false },
    ],
    loginGuidanceText: 'Sign in to access your shop billing counter and invoice ledger.',
  },
  mobileExperience: {
    appName: 'VyaaparGST',
    tabBarItems: [
      { key: 'home', label: 'Counter', iconName: 'Home' },
      { key: 'items', label: 'Ledger', iconName: 'Layers' },
      { key: 'create', label: 'New Bill', iconName: 'Plus' },
      { key: 'notifications', label: 'Alerts', iconName: 'Bell' },
    ],
    quickActionTitle: 'Generate GST Bill',
    primaryEntityWorkflowName: 'Quick Retail Checkout',
  },
  aiSystemPrompt: 'Act as a specialized GST billing assistant for Indian retail and wholesale businesses. Help verify tax calculation, suggest HSN codes, and answer GST compliance questions.',
};

import { activeProductSpec as sharedActiveProductSpec } from '@shared/config/activeProductSpec';

/**
 * Active Product Specification for Web
 * Autonomous single-source-of-truth generated by the Product Generation Engine.
 */
export const activeProductSpec: CompleteProductSpec = sharedActiveProductSpec;

export function deriveDomainConfig(spec: CompleteProductSpec): DomainConfig {
  const primaryEntity = spec.entities.find((e: any) => e.isPrimary) || spec.entities[0] || {
    name: 'Item',
    pluralName: 'Items',
    categories: ['General'],
    statuses: [
      { key: 'pending', label: 'Pending', color: 'amber' as const, bg: 'bg-amber-50', text: 'text-amber-700' },
      { key: 'in_progress', label: 'In Progress', color: 'blue' as const, bg: 'bg-blue-50', text: 'text-blue-700' },
      { key: 'completed', label: 'Completed', color: 'emerald' as const, bg: 'bg-emerald-50', text: 'text-emerald-700' },
    ],
  };

  const heroWords = spec.landingPage.headlineHighlightWords.map((w: any) => ({
    text: w.text,
    highlightBg: w.bgHex,
    textColor: w.colorHex,
  }));

  const capabilitySection = spec.landingPage.sections.find((s: any) => s.type === 'capability_matrix');
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

  const problemSection = spec.landingPage.sections.find((s: any) => s.type === 'problem_solution');
  const faqSection = spec.landingPage.sections.find((s: any) => s.type === 'faq');

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
      statuses: primaryEntity.statuses.map((s: any) => ({
        key: s.key,
        label: s.label,
        color: s.color,
        bg: s.bg,
        text: s.text,
        border: s.border,
      })),
      roles: spec.roles.map((r: any) => r.name),
      aiSystemPrompt: spec.aiSystemPrompt,
    },
    navigation: spec.navigation.map((n: any) => ({
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

export default domainConfig;
