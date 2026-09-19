import { CompleteProductSpec } from '../types/productSpec';

export const activeProductSpec: CompleteProductSpec = {
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
    { id: 'nav-parties', name: 'Customers & Parties', href: '/parties', iconName: 'Users', description: 'Customer directory & Khata balances' },
    { id: 'nav-catalog', name: 'Product Catalog', href: '/products', iconName: 'FolderOpen', description: 'Items, HSN codes, and GST rates' },
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
        { id: 'w-categories', type: 'category_progress', title: 'Sales Breakdown', gridSpan: 'third' },
      ],
    },
  ],
  landingPage: {
    badge: 'GST-Compliant Billing for Indian Retailers',
    tagline: 'Smart Invoicing, Party Ledger & Instant GST Calculation',
    detailedSubheadline: 'Create professional, compliant GST bills in 30 seconds. Automatic CGST/SGST/IGST splits, party ledger history, and instant printable A4 PDF invoices for your shop.',
    primaryCta: { label: 'Start Billing Now', href: '/login' },
    secondaryCta: { label: 'Try Guest Billing (Instant)', href: '/login' },
    headlineHighlightWords: [
      { text: 'Effortless' },
      { text: 'GST', bgHex: '#10B981', colorHex: '#FFFFFF' },
      { text: 'Billing' },
      { text: 'for', bgHex: '#F59E0B', colorHex: '#FFFFFF' },
      { text: 'Indian' },
      { text: 'Retailers.', bgHex: '#0A0A0A', colorHex: '#FFFFFF' },
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
        title: 'Solving Retail Invoicing Pain',
        order: 2,
        content: {
          problem: 'Manual calculation of CGST, SGST, and IGST across different tax slabs (0%, 5%, 12%, 18%, 28%) causes billing bottlenecks and accounting mistakes.',
          solution: 'VyaaparGST automates state-based tax splits, manages reusable product catalogs with HSN codes, and outputs compliant PDF invoices ready for print and WhatsApp.',
        },
      },
      {
        id: 'sec-capabilities',
        type: 'capability_matrix',
        order: 3,
        content: {
          items: [
            {
              title: 'Auto GST Tax Split',
              description: 'Automatically detects buyer state vs seller state to apply CGST + SGST (intra-state) or IGST (inter-state).',
              category: 'Tax Engine',
              iconName: 'ShieldCheck',
              badge: 'Automated',
            },
            {
              title: 'Party & Khata Ledger',
              description: 'Save customer GSTIN, address, and mobile numbers for 1-click invoice generation and credit history.',
              category: 'Customer CRM',
              iconName: 'Users',
              badge: 'Reusable',
            },
            {
              title: 'Printable A4 PDF Invoices',
              description: 'Generate standard, clear tax invoices with shop headers, tax summaries, and amount in words ready for A4 printers.',
              category: 'Documents',
              iconName: 'FolderOpen',
              badge: 'Print Ready',
            },
            {
              title: 'Mobile POS Billing',
              description: 'Complete billing capability on mobile phones with touch-friendly numpads and offline cache protection.',
              category: 'Mobile Parity',
              iconName: 'Smartphone',
              badge: 'On-the-go',
            },
          ],
        },
      },
      {
        id: 'sec-faq',
        type: 'faq',
        order: 4,
        content: {
          faqs: [
            {
              question: 'How does VyaaparGST compute CGST, SGST, and IGST?',
              answer: 'If the customer is in the same state as your shop (e.g. Gujarat to Gujarat), applicable GST is divided equally into CGST and SGST. If the customer is in another state, the full tax is applied as IGST.',
            },
            {
              question: 'Can I generate a bill without a customer account (Guest Mode)?',
              answer: 'Yes! VyaaparGST provides an instant Guest Billing mode allowing you to create and print tax invoices immediately over the counter.',
            },
            {
              question: 'Can saved bills be edited after generation?',
              answer: 'In strict compliance with GST guidelines, saved bills are immutable. Corrections can be made by creating a revised invoice or credit note.',
            },
          ],
        },
      },
    ],
  },
  authExperience: {
    requireRoleSelectionOnSignup: false,
    availableRoles: [
      { id: 'shop_owner', name: 'Shopkeeper / Business Owner', description: 'Full business management & GST invoice control' },
      { id: 'cashier', name: 'Counter Cashier', description: 'Quick checkout and invoice printing' },
    ],
    customSignupFields: [
      { name: 'businessName', label: 'Shop / Business Name', type: 'string', required: true, defaultValue: 'Shreeji General Store' },
      { name: 'gstin', label: 'GSTIN (Optional)', type: 'string', required: false },
    ],
    loginGuidanceText: 'Sign in with your shopkeeper credentials or continue with Guest Billing for instant counter checkout.',
  },
  mobileExperience: {
    appName: 'VyaaparGST',
    tabBarItems: [
      { key: 'home', label: 'Dashboard', iconName: 'NavHomeIcon' },
      { key: 'items', label: 'Bills', iconName: 'NavShieldIcon' },
      { key: 'create', label: 'New Bill', iconName: 'NavPlusIcon' },
      { key: 'parties', label: 'Parties', iconName: 'NavProfileIcon' },
      { key: 'profile', label: 'Settings', iconName: 'NavSettingsIcon' },
    ],
    quickActionTitle: 'Create GST Bill',
    primaryEntityWorkflowName: 'New Invoice',
  },
  aiSystemPrompt: 'You are VyaaparGST AI Assistant, an expert Indian retail billing and GST accounting advisor. Assist shopkeepers with HSN classification, tax slabs, customer balance summaries, and business insights concisely.',
};
