import assert from 'node:assert';
import { ProblemStatementAnalyzer } from '../analyzer/problemStatementAnalyzer';
import { ProductGenerationEngine } from '../analyzer/productGenerationEngine';

console.log('🧪 RUNNING PRODUCT GENERATION ENGINE VERIFICATION BATTERY...\n');

// -------------------------------------------------------------
// Test Case A: Campus Assistance Platform
// -------------------------------------------------------------
const campusProblem = `
Design an on-campus student assistance system where undergraduate and graduate students can submit requests for peer tutoring, mental health support, or course textbooks. Academic advisors and peer tutors review, claim, and resolve these assistance requests with session logging.
`;

console.log('🔹 [Test A] Analyzing Campus Assistance Problem Statement...');
const campusSpec = ProblemStatementAnalyzer.analyze({ problemStatementText: campusProblem });

assert.strictEqual(campusSpec.meta.shortName, 'Campus', 'Product short name should be Campus');
assert.strictEqual(campusSpec.entities[0].name, 'Assistance Request', 'Primary entity must be Assistance Request');
assert.ok(campusSpec.roles.some((r) => r.id === 'student'), 'Student role must be present');
assert.ok(campusSpec.roles.some((r) => r.id === 'peer_tutor'), 'Peer tutor role must be present');
assert.ok(campusSpec.landingPage.headlineHighlightWords.some((w) => w.text === 'Campus'), 'Landing page headline must be bespoke for Campus');
assert.notStrictEqual(campusSpec.meta.accentColorHex, '#DC2626', 'Campus should not use disaster red accent');

console.log('  ✅ Campus Product Spec derived successfully:');
console.log(`     Product Name:     ${campusSpec.meta.name}`);
console.log(`     Primary Entity:   ${campusSpec.entities[0].name} (${campusSpec.entities[0].pluralName})`);
console.log(`     Roles:            ${campusSpec.roles.map((r) => r.name).join(', ')}`);
console.log(`     Categories:       ${campusSpec.entities[0].categories?.join(', ')}`);
console.log(`     Workflow Name:    ${campusSpec.workflows[0]?.name}\n`);

// -------------------------------------------------------------
// Test Case B: Disaster Resource & Casualty Coordination
// -------------------------------------------------------------
const disasterProblem = `
Build an emergency disaster response platform connecting regional incident commanders with field paramedics and rescue units. Track casualty triage levels, dispatch ambulance units in flood zones, and verify hospital emergency room admissions in real time.
`;

console.log('🔹 [Test B] Analyzing Disaster Resource & Casualty Problem Statement...');
const disasterSpec = ProblemStatementAnalyzer.analyze({ problemStatementText: disasterProblem });

assert.strictEqual(disasterSpec.meta.shortName, 'Relief', 'Product short name should be Relief');
assert.strictEqual(disasterSpec.entities[0].name, 'Emergency Incident', 'Primary entity must be Emergency Incident');
assert.ok(disasterSpec.roles.some((r) => r.id === 'incident_commander'), 'Incident Commander role must be present');
assert.ok(disasterSpec.roles.some((r) => r.id === 'field_paramedic'), 'Field Paramedic role must be present');
assert.strictEqual(disasterSpec.meta.accentColorHex, '#DC2626', 'Disaster must use emergency red accent');
assert.ok(disasterSpec.entities[0].categories?.includes('Casualty Triage'), 'Casualty Triage category must exist');

console.log('  ✅ Disaster Product Spec derived successfully:');
console.log(`     Product Name:     ${disasterSpec.meta.name}`);
console.log(`     Primary Entity:   ${disasterSpec.entities[0].name}`);
console.log(`     Roles:            ${disasterSpec.roles.map((r) => r.name).join(', ')}`);
console.log(`     Categories:       ${disasterSpec.entities[0].categories?.join(', ')}`);
console.log(`     Workflow Name:    ${disasterSpec.workflows[0]?.name}\n`);

// -------------------------------------------------------------
// Test Case C: Food Rescue & Pantry Coordination
// -------------------------------------------------------------
const foodProblem = `
Create a community food surplus redistribution platform linking local restaurants and grocery stores with neighborhood food pantries. Volunteer drivers claim perishable food batches, transport them across city sectors, and confirm delivery before expiration.
`;

console.log('🔹 [Test C] Analyzing Food Rescue Problem Statement...');
const foodSpec = ProblemStatementAnalyzer.analyze({ problemStatementText: foodProblem });

assert.strictEqual(foodSpec.meta.shortName, 'Harvest', 'Product short name should be Harvest');
assert.strictEqual(foodSpec.entities[0].name, 'Food Rescue Claim', 'Primary entity must be Food Rescue Claim');
assert.ok(foodSpec.roles.some((r) => r.id === 'food_donor'), 'Food donor role must be present');
assert.ok(foodSpec.roles.some((r) => r.id === 'volunteer_driver'), 'Volunteer driver role must be present');
assert.strictEqual(foodSpec.meta.accentColorHex, '#059669', 'Food rescue must use emerald green accent');

console.log('  ✅ Food Rescue Product Spec derived successfully:');
console.log(`     Product Name:     ${foodSpec.meta.name}`);
console.log(`     Primary Entity:   ${foodSpec.entities[0].name}`);
console.log(`     Roles:            ${foodSpec.roles.map((r) => r.name).join(', ')}`);
console.log(`     Categories:       ${foodSpec.entities[0].categories?.join(', ')}\n`);

// -------------------------------------------------------------
// Test Case D: Verify Anti-Superficial Parity (Failure Test from Phase 23)
// -------------------------------------------------------------
console.log('🔹 [Phase 23 Verification] Testing Anti-Superficial Parity Assertion...');
assert.notStrictEqual(
  campusSpec.entities[0].name,
  disasterSpec.entities[0].name,
  'FAIL: Entities must not be identical across different domains'
);
assert.notStrictEqual(
  campusSpec.roles[0].name,
  disasterSpec.roles[0].name,
  'FAIL: Roles must not be identical across different domains'
);
assert.notStrictEqual(
  campusSpec.landingPage.headlineHighlightWords[0].text,
  disasterSpec.landingPage.headlineHighlightWords[0].text,
  'FAIL: Landing page headlines must not be identical across different domains'
);
assert.notStrictEqual(
  campusSpec.workflows[0].name,
  disasterSpec.workflows[0].name,
  'FAIL: Workflows must be domain-specific, not generic templates'
);

console.log('  ✅ Anti-Superficial Parity PASSED: Different problem statements generate genuinely different products!\n');

console.log('✨ ALL GENERATOR TESTS PASSED WITH 100% COMPLIANCE.\n');
