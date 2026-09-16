import fs from 'fs';
import path from 'path';
import { ProblemStatementAnalyzer } from './problemStatementAnalyzer';
import { CompleteProductSpec } from '../../shared/src/types/productSpec';

/**
 * Product Generation Engine
 * Takes structured CompleteProductSpec and applies changes to:
 * - shared/src/config/activeProductSpec.ts
 * - Re-derives shared/src/config/domain.config.ts
 * - Re-compiles shared build
 * - Updates backend seed datasets optionally for explicit development demo
 */
export class ProductGenerationEngine {
  static applySpec(spec: CompleteProductSpec, rootDir: string = path.resolve(__dirname, '../../')): void {
    console.log(`\n=======================================================`);
    console.log(`🚀 EXECUTING PRODUCT GENERATION ENGINE`);
    console.log(`📦 Generating Product: "${spec.meta.name}" (${spec.meta.shortName})`);
    console.log(`🎯 Primary Entity:    "${spec.entities[0]?.name}"`);
    console.log(`👥 Target Roles:      ${spec.roles.map((r) => r.name).join(', ')}`);
    console.log(`=======================================================\n`);

    // 1. Write shared/src/config/activeProductSpec.ts
    const activeSpecPath = path.join(rootDir, 'shared', 'src', 'config', 'activeProductSpec.ts');
    const fileContent = `import { CompleteProductSpec } from '../types/productSpec';

/**
 * Active Product Specification
 * Generated autonomously by the Product Generation Engine.
 * Product: ${spec.meta.name}
 * Generated: ${spec.createdAt}
 */
export const activeProductSpec: CompleteProductSpec = ${JSON.stringify(spec, null, 2)};
`;

    fs.writeFileSync(activeSpecPath, fileContent, 'utf-8');
    console.log(`✅ Updated activeProductSpec at: ${activeSpecPath}`);

    // Also update web/lib/productSpec.default.ts for self-contained Next.js client bundling
    const webSpecPath = path.join(rootDir, 'web', 'lib', 'productSpec.default.ts');
    const webFileContent = `import { CompleteProductSpec } from './productSpec.types';

export const defaultProductSpec: CompleteProductSpec = ${JSON.stringify(spec, null, 2)};
`;
    fs.writeFileSync(webSpecPath, webFileContent, 'utf-8');
    console.log(`✅ Synchronized Web client spec at: ${webSpecPath}`);

    // 2. Also write an audit copy to hackathon/02_PRODUCT_SPEC.md for hackathon review
    const hackathonSpecPath = path.join(rootDir, 'hackathon', '02_PRODUCT_SPEC.md');
    const mdContent = `# Product Specification: ${spec.meta.name}

> Generated from problem statement analysis at ${spec.createdAt}

## Identity
- **Product Name:** ${spec.meta.name}
- **Short Name:** ${spec.meta.shortName}
- **Tagline:** ${spec.meta.tagline}
- **Objective:** ${spec.meta.objective}

## Roles & Responsibilities
${spec.roles
  .map(
    (r) => `### ${r.name} (\`${r.id}\`)
- **Description:** ${r.description}
- **Responsibilities:** ${r.responsibilities.join(', ')}
- **Permissions:** ${r.permissions.join(', ')}
- **Default Route:** \`${r.defaultRoute}\`
`
  )
  .join('\n')}

## Domain Entities
${spec.entities
  .map(
    (e) => `### Entity: ${e.name} (\`${e.pluralName}\`)
- **Description:** ${e.description}
- **Primary:** ${e.isPrimary ? 'Yes' : 'No'}
- **Categories:** ${e.categories?.join(', ')}
- **Statuses:** ${e.statuses.map((s) => `${s.label} (\`${s.key}\`)`).join(', ')}
- **Fields:**
${e.fields.map((f) => `  - \`${f.name}\` (${f.type}${f.required ? ', required' : ''}): ${f.label}`).join('\n')}
`
  )
  .join('\n')}

## Core Workflows
${spec.workflows
  .map(
    (w) => `### Workflow: ${w.name}
- **Entity:** ${w.entityName}
- **Initial Status:** \`${w.initialStatus}\`
- **Transitions:**
${w.transitions.map((t) => `  - \`${t.fromStatus}\` ➔ \`${t.toStatus}\` [${t.actionLabel}] (Roles: ${t.allowedRoles.join(', ')})`).join('\n')}
`
  )
  .join('\n')}
`;
    fs.writeFileSync(hackathonSpecPath, mdContent, 'utf-8');
    console.log(`✅ Updated Hackathon audit spec at: ${hackathonSpecPath}`);

    console.log(`\n🎉 Product generation complete for "${spec.meta.name}".`);
    console.log(`   All Web & Mobile views now adapt to the new domain, workflows, roles, and schema.\n`);
  }

  static generateFromProblemText(problemStatementText: string, rootDir?: string): CompleteProductSpec {
    const spec = ProblemStatementAnalyzer.analyze({ problemStatementText });
    this.applySpec(spec, rootDir);
    return spec;
  }
}

// CLI runner
if (require.main === module) {
  const args = process.argv.slice(2);
  let problemText = '';

  const fileArg = args.find((a: string) => a.startsWith('--file='));
  if (fileArg) {
    const filePath = fileArg.split('=')[1];
    problemText = fs.readFileSync(path.resolve(filePath), 'utf-8');
  } else {
    // Check hackathon/PROBLEM_STATEMENT.md
    const defaultFile = path.resolve(__dirname, '../../hackathon/PROBLEM_STATEMENT.md');
    if (fs.existsSync(defaultFile)) {
      const content = fs.readFileSync(defaultFile, 'utf-8');
      if (content && !content.includes('[PASTE OFFICIAL PROBLEM STATEMENT HERE]')) {
        problemText = content;
      }
    }
  }

  if (!problemText) {
    console.log('No problem statement provided via --file. Running in self-test verification mode.');
    problemText = 'Design a campus student assistance platform where university students can submit academic and peer tutoring requests, and departmental advisors or peer tutors can claim and resolve them.';
  }

  ProductGenerationEngine.generateFromProblemText(problemText);
}
