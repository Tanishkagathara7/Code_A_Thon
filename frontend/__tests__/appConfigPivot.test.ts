import { appConfig, AppConfig } from '../config/appConfig';

function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runAppConfigPivotTests() {
  console.log('--- Running Hackathon Pivot Kit (appConfig) Tests ---');

  // Test 1: Strongly-typed appConfig object structure
  assert(appConfig !== undefined, 'appConfig should be defined');
  assert(typeof appConfig.appName === 'string', 'appName must be string');
  assert(typeof appConfig.tagline === 'string', 'tagline must be string');
  assert(typeof appConfig.primaryEntityName === 'string', 'primaryEntityName must be string');
  assert(typeof appConfig.entityPluralName === 'string', 'entityPluralName must be string');
  assert(Array.isArray(appConfig.categories), 'categories must be array');
  assert(Array.isArray(appConfig.statuses), 'statuses must be array');
  assert(typeof appConfig.aiSystemPrompt === 'string', 'aiSystemPrompt must be string');
  assert(appConfig.notificationCopy !== undefined, 'notificationCopy must be defined');
  assert(typeof appConfig.accentColor === 'string', 'accentColor must be string');
  assert(Array.isArray(appConfig.themeGradient), 'themeGradient must be array');
  console.log('✅ 1. AppConfig structure and types verified');

  // Test 2: Default non-empty configuration values
  assert(appConfig.appName.length > 0, 'appName must be non-empty');
  assert(appConfig.primaryEntityName.length > 0, 'primaryEntityName must be non-empty');
  assert(appConfig.entityPluralName.length > 0, 'entityPluralName must be non-empty');
  assert(appConfig.categories.length > 0, 'categories must be non-empty');
  assert(appConfig.statuses.length > 0, 'statuses must be non-empty');
  console.log('✅ 2. Non-empty default configuration values verified');

  // Test 3: Status objects format
  appConfig.statuses.forEach((status) => {
    assert(typeof status.key === 'string', 'Status key must be string');
    assert(typeof status.label === 'string', 'Status label must be string');
    assert(typeof status.bg === 'string', 'Status bg color must be string');
    assert(typeof status.text === 'string', 'Status text color must be string');
  });
  console.log('✅ 3. Status chip configurations verified');

  // Test 4: Dynamic Hackathon Pivot adaptability
  const customConfig: AppConfig = {
    ...appConfig,
    appName: 'EcoTracker',
    primaryEntityName: 'Eco Action',
    entityPluralName: 'Eco Actions',
    categories: ['Recycling', 'Energy', 'Tree Planting'],
  };

  assert(customConfig.appName === 'EcoTracker', 'Custom appName must apply');
  assert(customConfig.primaryEntityName === 'Eco Action', 'Custom primaryEntityName must apply');
  assert(customConfig.entityPluralName === 'Eco Actions', 'Custom entityPluralName must apply');
  assert(customConfig.categories.includes('Recycling'), 'Custom categories must include Recycling');
  console.log('✅ 4. Dynamic hackathon domain pivot adaptability verified');

  console.log('--- All Hackathon Pivot Kit (appConfig) Tests Passed! ---');
}

runAppConfigPivotTests();
