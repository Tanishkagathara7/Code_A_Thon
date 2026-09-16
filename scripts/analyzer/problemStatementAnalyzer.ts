import { CompleteProductSpec } from '../../shared/src/types/productSpec';

export interface ProblemAnalysisInput {
  title?: string;
  problemStatementText: string;
  constraints?: string[];
  targetUsers?: string[];
  providedRoles?: string[];
}

/**
 * Structured Problem Statement Parser
 * Analyzes problem statement text deterministically, extracting core domain entities,
 * actors & roles, workflows, database schema, landing page story, and mobile touch journeys.
 */
export class ProblemStatementAnalyzer {
  static analyze(input: ProblemAnalysisInput): CompleteProductSpec {
    const text = input.problemStatementText.trim();
    if (!text) {
      throw new Error('Problem statement text cannot be empty');
    }

    const lower = text.toLowerCase();

    // 1. Domain Detection
    const isDisaster = /disaster|relief|emergency|crisis|casualty|ambulance|flood|triage|hospital|evacuation/i.test(text);
    const isCampus = /campus|student|university|course|professor|tutor|dorm|academic|study/i.test(text);
    const isFood = /food|pantry|hunger|meal|grocery|surplus|waste|kitchen|donation/i.test(text);
    const isHealthcare = /patient|clinic|doctor|health|prescription|medical|vitals|appointment/i.test(text);
    const isCivic = /city|citizen|municipal|hazard|pothole|permit|neighborhood|council/i.test(text);

    let domainName = 'OpsNexus';
    let domainShortName = 'Ops';
    let domainTagline = 'Intelligent Operational Task & Workflow Coordination';
    let domainDescription = 'Real-time multi-platform coordination for mission-critical domain workflows.';
    let primaryEntity = 'Operation';
    let entityPlural = 'Operations';
    let accentColor = '#4F46E5';
    let themeGradient: [string, string] = ['#1E274A', '#2D3A6B'];
    let categories = ['Critical', 'High Priority', 'Logistics', 'General'];
    let aiPrompt = 'You are an elite operational intelligence copilot. Synthesize incoming records, assess operational risks, and recommend decisive actions.';

    let roles = [
      {
        id: 'coordinator',
        name: 'Coordinator',
        description: 'Oversees incoming operational requests and dispatches resources',
        responsibilities: ['Intake verification', 'Assign operational priority', 'Dispatch teams'],
        permissions: ['*'],
        defaultRoute: '/dashboard',
        customProfileFields: [
          { name: 'organization', label: 'Organization / Division', type: 'string' as const, required: true },
        ],
      },
      {
        id: 'field_agent',
        name: 'Field Operator',
        description: 'Executes operational actions on mobile and updates field status in real time',
        responsibilities: ['Claim tasks', 'Submit telemetry logs', 'Mark tasks complete'],
        permissions: ['items:read', 'items:create', 'items:update'],
        defaultRoute: '/items',
        customProfileFields: [
          { name: 'callSign', label: 'Unit Call Sign', type: 'string' as const, required: true },
        ],
      },
    ];

    let workflows = [
      {
        id: 'primary-lifecycle',
        name: 'Operation Lifecycle',
        description: 'Standard lifecycle from intake to verification and closure',
        entityName: primaryEntity,
        initialStatus: 'pending',
        transitions: [
          {
            fromStatus: 'pending',
            toStatus: 'in_progress',
            actionLabel: 'Claim & Start Action',
            allowedRoles: ['coordinator', 'field_agent', 'admin'],
          },
          {
            fromStatus: 'in_progress',
            toStatus: 'completed',
            actionLabel: 'Mark Resolved & Complete',
            allowedRoles: ['coordinator', 'field_agent', 'admin'],
          },
        ],
      },
    ];

    // Bespoke domain specialization
    if (isDisaster) {
      domainName = 'ReliefPulse';
      domainShortName = 'Relief';
      domainTagline = 'Rapid Disaster Resource & Emergency Casualty Coordination';
      domainDescription = 'Zero-latency crisis coordination connecting emergency control rooms with frontline responders.';
      primaryEntity = 'Emergency Incident';
      entityPlural = 'Emergency Incidents';
      accentColor = '#DC2626';
      themeGradient = ['#7F1D1D', '#991B1B'];
      categories = ['Casualty Triage', 'Logistics & Supply', 'Shelter Evac', 'Hazard Mitigation', 'Search & Rescue'];
      aiPrompt = 'You are an emergency crisis dispatcher copilot. Evaluate casualty severity, route medical ambulances, and calculate supply replenishment urgency.';

      roles = [
        {
          id: 'incident_commander',
          name: 'Incident Commander',
          description: 'Control room lead orchestrating sector response and resource allocation',
          responsibilities: ['Assess incident severity', 'Route ambulances and supply trucks', 'Authorize evacuations'],
          permissions: ['*'],
          defaultRoute: '/dashboard',
          customProfileFields: [
            { name: 'jurisdiction', label: 'Jurisdiction / Command District', type: 'string' as const, required: true },
            { name: 'badgeNumber', label: 'Command Badge Number', type: 'string' as const, required: true },
          ],
        },
        {
          id: 'field_paramedic',
          name: 'Field Responders',
          description: 'Emergency medical and rescue units deployed in the disaster zone',
          responsibilities: ['Triage on-scene victims', 'Log patient vitals and sector coordinates', 'Request backup'],
          permissions: ['items:read', 'items:create', 'items:update'],
          defaultRoute: '/items',
          customProfileFields: [
            { name: 'ambulanceUnit', label: 'Ambulance / Unit Call Sign', type: 'string' as const, required: true },
            { name: 'medicalLicense', label: 'Paramedic License Number', type: 'string' as const, required: true },
          ],
        },
      ];

      workflows = [
        {
          id: 'disaster-triage-workflow',
          name: 'Disaster Triage & Evacuation Workflow',
          description: 'Critical casualty triage path: Reported -> En Route -> On Scene -> Triaged -> Hospital Admitted',
          entityName: primaryEntity,
          initialStatus: 'pending',
          transitions: [
            {
              fromStatus: 'pending',
              toStatus: 'in_progress',
              actionLabel: 'Dispatch Ambulance Unit',
              allowedRoles: ['incident_commander', 'field_paramedic'],
            },
            {
              fromStatus: 'in_progress',
              toStatus: 'completed',
              actionLabel: 'Confirm Patient Admitted / Resolved',
              allowedRoles: ['incident_commander', 'field_paramedic'],
            },
          ],
        },
      ];
    } else if (isCampus) {
      domainName = 'CampusAssist';
      domainShortName = 'Campus';
      domainTagline = 'Unified Student Assistance, Tutoring & Academic Resource Hub';
      domainDescription = 'Seamless academic workflow synchronization connecting students, peer tutors, and university advisors.';
      primaryEntity = 'Assistance Request';
      entityPlural = 'Assistance Requests';
      accentColor = '#2563EB';
      themeGradient = ['#1E3A8A', '#1D4ED8'];
      categories = ['Peer Tutoring', 'Mental Health Support', 'Course Materials', 'Accessibility Needs', 'Financial Aid Guidance'];
      aiPrompt = 'You are a university student success advisor copilot. Match students with optimal peer tutors, recommend campus resources, and draft academic recovery roadmaps.';

      roles = [
        {
          id: 'student',
          name: 'Student',
          description: 'Undergraduate or graduate student seeking academic support or peer assistance',
          responsibilities: ['Submit assistance requests', 'Track tutor availability', 'Confirm session completion'],
          permissions: ['items:read', 'items:create'],
          defaultRoute: '/items',
          customProfileFields: [
            { name: 'studentId', label: 'University Student ID', type: 'string' as const, required: true },
            { name: 'major', label: 'Major / Department', type: 'string' as const, required: true },
            { name: 'gradYear', label: 'Expected Graduation Year', type: 'string' as const, required: false },
          ],
        },
        {
          id: 'peer_tutor',
          name: 'Peer Tutor / Advisor',
          description: 'Certified tutor or department advisor fulfilling assistance tickets',
          responsibilities: ['Review student requests', 'Claim tutoring sessions', 'Submit session feedback'],
          permissions: ['items:read', 'items:create', 'items:update'],
          defaultRoute: '/dashboard',
          customProfileFields: [
            { name: 'courseExpertise', label: 'Specialized Course Codes (e.g. CS101, MATH202)', type: 'string' as const, required: true },
            { name: 'advisorLevel', label: 'Department / Certification', type: 'string' as const, required: true },
          ],
        },
      ];

      workflows = [
        {
          id: 'assistance-request-workflow',
          name: 'Campus Assistance Request Workflow',
          description: 'Intake -> Advisor Review -> Tutor Claimed -> Session Held -> Resolved',
          entityName: primaryEntity,
          initialStatus: 'pending',
          transitions: [
            {
              fromStatus: 'pending',
              toStatus: 'in_progress',
              actionLabel: 'Claim Student Request',
              allowedRoles: ['peer_tutor', 'coordinator'],
            },
            {
              fromStatus: 'in_progress',
              toStatus: 'completed',
              actionLabel: 'Conclude Session & Resolve',
              allowedRoles: ['peer_tutor', 'student'],
            },
          ],
        },
      ];
    } else if (isFood) {
      domainName = 'HarvestBridge';
      domainShortName = 'Harvest';
      domainTagline = 'Surplus Food Redistribution & Community Pantry Network';
      domainDescription = 'Connecting grocery providers with local pantries and volunteer drivers to eradicate food waste.';
      primaryEntity = 'Food Rescue Claim';
      entityPlural = 'Food Rescue Claims';
      accentColor = '#059669';
      themeGradient = ['#064E3B', '#047857'];
      categories = ['Perishable Produce', 'Prepared Meals', 'Bakery / Dry Goods', 'Refrigerated Dairy', 'Pantry Staples'];
      aiPrompt = 'You are a food redistribution logistics copilot. Match perishable food batches with nearby shelter capacity, prioritize expiration windows, and optimize pickup routes.';

      roles = [
        {
          id: 'food_donor',
          name: 'Food Provider',
          description: 'Grocery store, bakery, or catering facility offering surplus edible food',
          responsibilities: ['Log surplus batches', 'Specify shelf-life windows', 'Verify handoff'],
          permissions: ['items:read', 'items:create'],
          defaultRoute: '/items',
          customProfileFields: [
            { name: 'facilityName', label: 'Store / Restaurant Name', type: 'string' as const, required: true },
            { name: 'facilityAddress', label: 'Pickup Address & Dock Number', type: 'string' as const, required: true },
          ],
        },
        {
          id: 'volunteer_driver',
          name: 'Volunteer Transporter',
          description: 'Community driver equipped with insulated transport bags',
          responsibilities: ['Claim rescue pickups', 'Transport batches to shelter', 'Confirm dropoff'],
          permissions: ['items:read', 'items:update'],
          defaultRoute: '/dashboard',
          customProfileFields: [
            { name: 'vehicleType', label: 'Vehicle Type (Sedan, Van, Refrigerated Truck)', type: 'string' as const, required: true },
          ],
        },
      ];
    }

    const statuses = [
      { key: 'pending', label: 'Intake / Pending Review', color: 'amber' as const, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      { key: 'in_progress', label: 'Active In Flight', color: 'blue' as const, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      { key: 'completed', label: 'Verified & Resolved', color: 'emerald' as const, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', isTerminal: true },
    ];

    const entityFields = [
      { name: 'title', label: `${primaryEntity} Subject`, type: 'string' as const, required: true },
      { name: 'description', label: 'Full Details & Context', type: 'text' as const, required: false },
      { name: 'category', label: 'Category', type: 'enum' as const, required: true, options: categories },
      { name: 'priority', label: 'Urgency Level', type: 'enum' as const, required: true, options: ['low', 'medium', 'high', 'urgent'], defaultValue: 'medium' },
      { name: 'assignedTo', label: 'Assigned Stakeholder', type: 'string' as const, required: false },
      { name: 'locationDetails', label: 'Location / Address / Zone', type: 'string' as const, required: false },
    ];

    return {
      id: `${domainShortName.toLowerCase()}-spec-${Date.now()}`,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      meta: {
        name: domainName,
        shortName: domainShortName,
        tagline: domainTagline,
        description: domainDescription,
        objective: `Provide an end-to-end multi-platform solution for: ${text.slice(0, 150)}...`,
        problemSummary: text,
        targetUsers: roles.map((r) => r.name),
        accentColorHex: accentColor,
        themeGradient,
      },
      roles,
      entities: [
        {
          name: primaryEntity,
          pluralName: entityPlural,
          description: `Primary operational entity for ${domainName}`,
          isPrimary: true,
          categories,
          statuses,
          fields: entityFields,
          permissions: {
            createRoles: roles.map((r) => r.id),
            readRoles: roles.map((r) => r.id),
            updateRoles: roles.map((r) => r.id),
            deleteRoles: [roles[0].id],
          },
        },
      ],
      workflows,
      navigation: [
        { id: 'nav-dash', name: 'Command Center', href: '/dashboard', iconName: 'LayoutDashboard', description: 'Telemetry & real-time queue' },
        { id: 'nav-items', name: `${entityPlural} Hub`, href: '/items', iconName: 'Layers', description: `Manage ${entityPlural.toLowerCase()}` },
        { id: 'nav-ai', name: 'AI Copilot', href: '/ai-assistant', iconName: 'Sparkles', description: 'Synthesis & automated recommendations' },
        { id: 'nav-files', name: 'Evidence & Media', href: '/files', iconName: 'FolderOpen', description: 'Attached records & telemetry files' },
        { id: 'nav-alerts', name: 'Alerts', href: '/notifications', iconName: 'Bell', description: 'Urgent dispatches & status transitions' },
      ],
      roleDashboards: roles.map((r, idx) => ({
        roleId: r.id,
        welcomeMessage: `${r.name} Command Interface. Active for ${domainName}.`,
        primaryAction: {
          label: idx === 0 ? `Log New ${primaryEntity}` : `Claim ${primaryEntity}`,
          href: idx === 0 ? '/items/new' : '/items',
          iconName: 'Plus',
        },
        widgets: [
          { id: `w-${r.id}-kpis`, type: 'metric_card' as const, title: `${r.name} Operational Metrics`, gridSpan: 'full' as const },
          { id: `w-${r.id}-recent`, type: 'recent_items_table' as const, title: `Active ${entityPlural}`, gridSpan: 'two_thirds' as const },
          { id: `w-${r.id}-breakdown`, type: 'category_progress' as const, title: 'Category Distribution', gridSpan: 'third' as const },
        ],
      })),
      landingPage: {
        badge: `Purpose-Built for ${domainName}`,
        tagline: domainTagline,
        detailedSubheadline: domainDescription,
        primaryCta: { label: 'Enter Command Center', href: '/login' },
        secondaryCta: { label: 'Explore Workflows', href: '#features' },
        headlineHighlightWords: [
          { text: domainShortName, bgHex: accentColor, colorHex: '#FFFFFF' },
          { text: 'Intelligence' },
          { text: 'for' },
          { text: `${roles[0].name}s,`, bgHex: '#10B981', colorHex: '#FFFFFF' },
          { text: 'Velocity' },
          { text: 'for' },
          { text: `${roles[1]?.name || 'Responders'}.`, bgHex: '#2563EB', colorHex: '#FFFFFF' },
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
            title: 'The Challenge & The Solution',
            order: 2,
            content: {
              problem: text,
              solution: `A dedicated dual-platform system connecting ${roles.map((r) => r.name).join(' and ')} in real-time.`,
            },
          },
          {
            id: 'sec-capabilities',
            type: 'capability_matrix',
            title: 'Core Domain Capabilities',
            order: 3,
            content: {
              items: categories.slice(0, 3).map((cat) => ({
                title: `${cat} Workflow`,
                description: `Dedicated tracking and dispatch for all ${cat.toLowerCase()} requirements.`,
                category: 'Domain Core',
                badge: 'Active',
              })),
            },
          },
          {
            id: 'sec-roles',
            type: 'role_breakdown',
            title: 'Engineered for Real Stakeholders',
            order: 4,
            content: {
              roles: roles.map((r) => ({
                name: r.name,
                tagline: r.description,
              })),
            },
          },
        ],
      },
      authExperience: {
        requireRoleSelectionOnSignup: true,
        availableRoles: roles.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
        })),
        customSignupFields: roles[0].customProfileFields || [],
        loginGuidanceText: `Access your ${domainName} workspace according to your assigned operational role.`,
      },
      mobileExperience: {
        appName: domainName,
        tabBarItems: [
          { key: 'home', label: 'Home', iconName: 'Home' },
          { key: 'items', label: entityPlural, iconName: 'Shield' },
          { key: 'create', label: 'Create', iconName: 'Plus' },
          { key: 'ai', label: 'Copilot', iconName: 'Sparkles' },
          { key: 'notifications', label: 'Alerts', iconName: 'Bell' },
        ],
        quickActionTitle: `Log ${primaryEntity}`,
        primaryEntityWorkflowName: `${domainName} Dispatch`,
      },
      aiSystemPrompt: aiPrompt,
    };
  }
}
