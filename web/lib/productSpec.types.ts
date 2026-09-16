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
