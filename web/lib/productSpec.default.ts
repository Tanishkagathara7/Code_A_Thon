import { CompleteProductSpec } from './productSpec.types';

export const defaultProductSpec: CompleteProductSpec = {
  id: 'pulse-default-starter',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  meta: {
    name: 'GST Billing',
    shortName: 'GST Billing',
    tagline: 'Bill Smarter • Grow Faster',
    description: 'High-density GST billing and financial operational management with real-time web & mobile synchronization.',
    objective: 'Provide high-density multi-platform operational intelligence and real-time incident lifecycle management across web and native mobile clients.',
    problemSummary: 'Fragmented operations across slow web dashboards and disconnected mobile tools lead to critical delays in field reporting and resolution.',
    targetUsers: ['Operations Coordinators', 'Field Responders', 'Risk Analysts', 'Incident Commanders'],
    accentColorHex: '#4F46E5',
    themeGradient: ['#1E274A', '#2D3A6B'],
  },
  roles: [
    {
      id: 'coordinator',
      name: 'Coordinator',
      description: 'Central operations manager overseeing incident triage and resource dispatch',
      responsibilities: ['Review incoming incidents', 'Assign priorities and categories', 'Dispatch field teams'],
      permissions: ['items:create', 'items:read', 'items:update', 'items:delete', 'ai:generate', 'analytics:view'],
      defaultRoute: '/dashboard',
      customProfileFields: [
        { name: 'department', label: 'Department / Division', type: 'string', required: true },
        { name: 'badgeNumber', label: 'Operations Badge ID', type: 'string', required: false },
      ],
    },
    {
      id: 'field_responder',
      name: 'Field Responder',
      description: 'Frontline operational personnel executing resolution tasks on mobile',
      responsibilities: ['Acknowledge assignments', 'Log real-time field status updates', 'Submit evidence attachments'],
      permissions: ['items:create', 'items:read', 'items:update', 'notifications:read'],
      defaultRoute: '/items',
      customProfileFields: [
        { name: 'callSign', label: 'Unit / Call Sign', type: 'string', required: true },
        { name: 'locationSector', label: 'Assigned Sector', type: 'string', required: false },
      ],
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'System-wide governance and security authority',
      responsibilities: ['System configuration', 'User RBAC assignment', 'Audit trails'],
      permissions: ['*'],
      defaultRoute: '/dashboard',
    },
  ],
  entities: [
    {
      name: 'Incident',
      pluralName: 'Incidents',
      description: 'Primary operational record representing an urgent event requiring lifecycle tracking',
      isPrimary: true,
      categories: ['Critical', 'High Priority', 'Logistics', 'Medical', 'General'],
      statuses: [
        { key: 'pending', label: 'Triage / Pending', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
        { key: 'in_progress', label: 'In Transit / Active', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
        { key: 'completed', label: 'Resolved / Done', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', isTerminal: true },
      ],
      fields: [
        { name: 'title', label: 'Incident Title', type: 'string', required: true, description: 'Concise summary of the incident' },
        { name: 'description', label: 'Detailed Description', type: 'text', required: false },
        { name: 'category', label: 'Operational Category', type: 'enum', required: true, options: ['Critical', 'High Priority', 'Logistics', 'Medical', 'General'] },
        { name: 'priority', label: 'Severity Level', type: 'enum', required: true, options: ['low', 'medium', 'high', 'urgent'], defaultValue: 'medium' },
        { name: 'location', label: 'Incident Coordinates / Location', type: 'string', required: false },
        { name: 'assignedUnit', label: 'Assigned Unit / Responder', type: 'string', required: false },
      ],
      permissions: {
        createRoles: ['coordinator', 'field_responder', 'admin'],
        readRoles: ['coordinator', 'field_responder', 'admin'],
        updateRoles: ['coordinator', 'field_responder', 'admin'],
        deleteRoles: ['coordinator', 'admin'],
      },
    },
  ],
  workflows: [
    {
      id: 'incident-lifecycle',
      name: 'Incident Resolution Lifecycle',
      description: 'End-to-end transition path from dispatch intake through on-scene action to resolution',
      entityName: 'Incident',
      initialStatus: 'pending',
      transitions: [
        {
          fromStatus: 'pending',
          toStatus: 'in_progress',
          actionLabel: 'Dispatch & Claim Incident',
          allowedRoles: ['coordinator', 'field_responder', 'admin'],
          triggersNotification: {
            recipientRoles: ['coordinator', 'field_responder'],
            titleTemplate: 'Incident Dispatched: {title}',
            messageTemplate: 'Field response initiated by {user}.',
          },
        },
        {
          fromStatus: 'in_progress',
          toStatus: 'completed',
          actionLabel: 'Mark Incident Resolved',
          allowedRoles: ['coordinator', 'field_responder', 'admin'],
          triggersNotification: {
            recipientRoles: ['coordinator', 'admin'],
            titleTemplate: 'Incident Resolved: {title}',
            messageTemplate: 'Field incident has been finalized and verified.',
          },
        },
        {
          fromStatus: 'completed',
          toStatus: 'in_progress',
          actionLabel: 'Reopen Incident',
          allowedRoles: ['coordinator', 'admin'],
        },
      ],
    },
  ],
  navigation: [
    { id: 'nav-dashboard', name: 'Dashboard', href: '/dashboard', iconName: 'LayoutDashboard', description: 'Real-time telemetry and operational metrics' },
    { id: 'nav-items', name: 'Incident Hub', href: '/items', iconName: 'Layers', description: 'Core domain records and status lifecycle' },
    { id: 'nav-ai', name: 'AI Copilot', href: '/ai-assistant', iconName: 'Sparkles', description: 'Prompt generation and automated synthesis' },
    { id: 'nav-files', name: 'Files & Media', href: '/files', iconName: 'FolderOpen', description: 'Evidence files and attachments' },
    { id: 'nav-alerts', name: 'Notifications', href: '/notifications', iconName: 'Bell', description: 'Dispatch alerts and priority activity' },
  ],
  roleDashboards: [
    {
      roleId: 'coordinator',
      welcomeMessage: 'Welcome to Command Dispatch. Review active telemetry and assign field units.',
      primaryAction: { label: 'Log Incident', href: '/items/new', iconName: 'Plus' },
      widgets: [
        { id: 'w-kpis', type: 'metric_card', title: 'Operational KPIs', gridSpan: 'full' },
        { id: 'w-recent', type: 'recent_items_table', title: 'Live Incident Feed', gridSpan: 'two_thirds' },
        { id: 'w-categories', type: 'category_progress', title: 'Category Breakdown', gridSpan: 'third' },
        { id: 'w-ai-gateway', type: 'ai_action_assistant', title: 'AI Copilot Gateway', gridSpan: 'third' },
      ],
    },
    {
      roleId: 'field_responder',
      welcomeMessage: 'Field Mode Active. Prioritize assigned urgent triage cases.',
      primaryAction: { label: 'Quick Field Log', href: '/items/new', iconName: 'Plus' },
      widgets: [
        { id: 'w-kpis', type: 'metric_card', title: 'Field Queue Stats', gridSpan: 'full' },
        { id: 'w-recent', type: 'recent_items_table', title: 'Assigned Incidents', gridSpan: 'two_thirds' },
        { id: 'w-actions', type: 'workflow_action_feed', title: 'Pending State Actions', gridSpan: 'third' },
      ],
    },
    {
      roleId: 'admin',
      welcomeMessage: 'System Governance Console. Full audit visibility and role oversight.',
      primaryAction: { label: 'Log Incident', href: '/items/new', iconName: 'Plus' },
      widgets: [
        { id: 'w-kpis', type: 'metric_card', title: 'System-Wide Metrics', gridSpan: 'full' },
        { id: 'w-recent', type: 'recent_items_table', title: 'All System Records', gridSpan: 'two_thirds' },
        { id: 'w-categories', type: 'category_progress', title: 'Domain Distribution', gridSpan: 'third' },
      ],
    },
  ],
  landingPage: {
    badge: 'Real-Time Multi-Platform Coordination',
    tagline: 'Multi-Platform Operational Intelligence & AI Workflow Platform',
    detailedSubheadline: 'Synchronize critical domain workflows instantly across desktop command centers and touch-first mobile devices.',
    primaryCta: { label: 'Launch Workspace', href: '/login' },
    secondaryCta: { label: 'Explore Platform', href: '#features' },
    headlineHighlightWords: [
      { text: 'Precision', bgHex: '#2563EB', colorHex: '#FFFFFF' },
      { text: 'Operations', bgHex: '#EC4899', colorHex: '#FFFFFF' },
      { text: 'on' },
      { text: 'Desktop,', bgHex: '#10B981', colorHex: '#FFFFFF' },
      { text: 'Native' },
      { text: 'Velocity', bgHex: '#6366F1', colorHex: '#FFFFFF' },
      { text: 'on' },
      { text: 'Mobile.' },
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
        title: 'The Operational Gap',
        order: 2,
        content: {
          problem: 'Fragmented operations across slow web dashboards and disconnected mobile tools lead to critical delays.',
          solution: 'A unified single-source-of-truth platform connecting desktop decision-makers with mobile responders in real time.',
        },
      },
      {
        id: 'sec-capabilities',
        type: 'capability_matrix',
        title: 'Purpose-Built Capabilities',
        order: 3,
        content: {
          items: [
            {
              title: 'Instant Triage & Dispatch',
              description: 'Categorize, prioritize, and route high-impact domain items in sub-second cycles.',
              category: 'Workflows',
              badge: 'Zero Latency',
            },
            {
              title: 'Bi-Directional Mobile Sync',
              description: 'Field responders receive real-time updates and push logs seamlessly via native Expo client.',
              category: 'Mobility',
              badge: 'Dual-Platform',
            },
            {
              title: 'OpenRouter AI Copilot',
              description: 'Automate situation summaries, classify urgencies, and synthesize action plans on demand.',
              category: 'Intelligence',
              badge: 'LLM Powered',
            },
          ],
        },
      },
      {
        id: 'sec-roles',
        type: 'role_breakdown',
        title: 'Tailored for Every Operational Role',
        order: 4,
        content: {
          roles: [
            {
              name: 'Command Coordinator',
              tagline: 'Desktop control room view with full triage feed, filters, and priority dispatch.',
            },
            {
              name: 'Field Responder',
              tagline: 'Native mobile client with instant tap-to-update statuses and secure credentials.',
            },
            {
              name: 'Operations Analyst',
              tagline: 'Automated AI synthesis, audit histories, and cross-platform completion metrics.',
            },
          ],
        },
      },
      {
        id: 'sec-faq',
        type: 'faq',
        title: 'Frequently Asked Questions',
        order: 5,
        content: {
          faqs: [
            {
              question: 'How do Web and Mobile remain synchronized?',
              answer: 'Both platforms consume the same REST backend and database. Status transitions and records created on Mobile reflect instantly on Web upon refresh or polling.',
            },
            {
              question: 'Can this product adapt to other problem domains?',
              answer: 'Yes! The product generator parses any problem statement into a structured product specification that regenerates models, workflows, landing copy, and RBAC views.',
            },
          ],
        },
      },
    ],
  },
  authExperience: {
    requireRoleSelectionOnSignup: true,
    availableRoles: [
      { id: 'coordinator', name: 'Coordinator', description: 'Manage dispatch, triage records, and oversee workflows' },
      { id: 'field_responder', name: 'Field Responder', description: 'Log frontline updates and claim assigned tasks on mobile' },
    ],
    customSignupFields: [
      { name: 'organization', label: 'Organization / Team Name', type: 'string', required: true },
      { name: 'roleSpecificIdentifier', label: 'Department / Unit Identifier', type: 'string', required: false },
    ],
    loginGuidanceText: 'Sign in with your operational credentials to access your designated workspace.',
  },
  mobileExperience: {
    appName: 'GST Billing',
    tabBarItems: [
      { key: 'home', label: 'Home', iconName: 'Home' },
      { key: 'items', label: 'Records', iconName: 'Shield' },
      { key: 'create', label: 'Log', iconName: 'Plus' },
      { key: 'ai', label: 'AI Copilot', iconName: 'Sparkles' },
      { key: 'notifications', label: 'Alerts', iconName: 'Bell' },
    ],
    quickActionTitle: 'Log Operational Incident',
    primaryEntityWorkflowName: 'Field Incident Triage',
  },
  aiSystemPrompt: 'Act as a specialized operational intelligence copilot. Extract urgent actions, prioritize domain tasks, and synthesize cross-platform incident updates.',
};
