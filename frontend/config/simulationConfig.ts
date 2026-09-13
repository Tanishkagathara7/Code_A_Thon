export interface DomainConfig {
  domainId: 'education' | 'civic' | 'health' | 'environment' | 'productivity';
  domainName: string;
  primaryEntityName: string;
  entityPluralName: string;
  tagline: string;
  categories: string[];
  statuses: { key: string; label: string; bg: string; text: string }[];
  aiPromptTemplate: (title: string, description?: string) => string;
  notificationEvents: {
    created: string;
    completed: string;
  };
}

export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  education: {
    domainId: 'education',
    domainName: 'EduPulse',
    primaryEntityName: 'Learning Goal',
    entityPluralName: 'Learning Goals',
    tagline: 'Personalized Student Learning & Skill Tracking',
    categories: ['Computer Science', 'Mathematics', 'Data Science', 'Design', 'Languages'],
    statuses: [
      { key: 'pending', label: 'Not Started', bg: '#FEF3C7', text: '#B45309' },
      { key: 'in_progress', label: 'Studying', bg: '#E0E7FF', text: '#4338CA' },
      { key: 'completed', label: 'Mastered', bg: '#DCFCE7', text: '#15803D' },
    ],
    aiPromptTemplate: (title, desc) =>
      `Act as an expert AI academic mentor. Provide personalized study advice, sub-topics to explore, and learning resources for the goal: "${title}". Context: "${desc || 'None provided'}".`,
    notificationEvents: {
      created: 'New learning goal created! Start your journey now.',
      completed: 'Congratulations! You mastered a learning goal.',
    },
  },
  civic: {
    domainId: 'civic',
    domainName: 'CivicPulse',
    primaryEntityName: 'Civic Issue',
    entityPluralName: 'Civic Issues',
    tagline: 'Community Problem Reporting & Resolution Tracker',
    categories: ['Roads & Potholes', 'Sanitation & Waste', 'Public Lighting', 'Parks & Recreation', 'Water Supply'],
    statuses: [
      { key: 'pending', label: 'Reported', bg: '#FEF3C7', text: '#B45309' },
      { key: 'in_progress', label: 'Under Review', bg: '#E0E7FF', text: '#4338CA' },
      { key: 'completed', label: 'Resolved', bg: '#DCFCE7', text: '#15803D' },
    ],
    aiPromptTemplate: (title, desc) =>
      `Act as a municipal AI dispatch manager. Analyze this civic issue: "${title}". Description: "${desc || 'None'}". Provide a formal summary, severity score (1-5), and recommended municipal action team.`,
    notificationEvents: {
      created: 'Civic issue report submitted successfully to city council.',
      completed: 'Great news! Your reported civic issue has been marked as resolved.',
    },
  },
  health: {
    domainId: 'health',
    domainName: 'WellTrack AI',
    primaryEntityName: 'Wellness Activity',
    entityPluralName: 'Wellness Activities',
    tagline: 'Holistic Personal Health & Habit Organizer',
    categories: ['Physical Fitness', 'Nutrition', 'Sleep Hygiene', 'Mindfulness', 'Hydration'],
    statuses: [
      { key: 'pending', label: 'Scheduled', bg: '#FEF3C7', text: '#B45309' },
      { key: 'in_progress', label: 'Active Habit', bg: '#E0E7FF', text: '#4338CA' },
      { key: 'completed', label: 'Achieved', bg: '#DCFCE7', text: '#15803D' },
    ],
    aiPromptTemplate: (title, desc) =>
      `Act as a personal wellness guide. Provide non-medical habit suggestions, streak motivation, and tracking tips for wellness target: "${title}". Activity notes: "${desc || 'None'}".`,
    notificationEvents: {
      created: 'Wellness activity logged.',
      completed: 'Milestone reached! Activity completed.',
    },
  },
  environment: {
    domainId: 'environment',
    domainName: 'EcoWatch',
    primaryEntityName: 'Environmental Incident',
    entityPluralName: 'Environmental Incidents',
    tagline: 'Community Environmental Monitoring & Conservation',
    categories: ['Air Quality', 'Waste Dumping', 'Water Contamination', 'Wildlife & Flora', 'Noise Pollution'],
    statuses: [
      { key: 'pending', label: 'Logged', bg: '#FEF3C7', text: '#B45309' },
      { key: 'in_progress', label: 'Investigating', bg: '#E0E7FF', text: '#4338CA' },
      { key: 'completed', label: 'Mitigated', bg: '#DCFCE7', text: '#15803D' },
    ],
    aiPromptTemplate: (title, desc) =>
      `Act as an environmental scientist AI. Analyze environmental incident report: "${title}". Details: "${desc || 'None'}". Summarize ecological impact risk level and suggest community remediation steps.`,
    notificationEvents: {
      created: 'Environmental report logged in local eco-register.',
      completed: 'Eco update: Incident mitigation verified.',
    },
  },
  productivity: {
    domainId: 'productivity',
    domainName: 'FlowTask AI',
    primaryEntityName: 'Task',
    entityPluralName: 'Tasks',
    tagline: 'AI-Driven High Performance Task & Workflow Organizer',
    categories: ['Deep Work', 'Meetings', 'Project Alpha', 'Admin', 'Personal'],
    statuses: [
      { key: 'pending', label: 'To Do', bg: '#FEF3C7', text: '#B45309' },
      { key: 'in_progress', label: 'Doing', bg: '#E0E7FF', text: '#4338CA' },
      { key: 'completed', label: 'Done', bg: '#DCFCE7', text: '#15803D' },
    ],
    aiPromptTemplate: (title, desc) =>
      `Act as an elite productivity assistant. Break down task "${title}" (Context: "${desc || 'None'}") into 3 clear actionable micro-steps and estimate completion time.`,
    notificationEvents: {
      created: 'Task added to sprint backlog.',
      completed: 'Task marked done! Velocity boosted.',
    },
  },
};
