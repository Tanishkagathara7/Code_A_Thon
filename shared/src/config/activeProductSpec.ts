import { CompleteProductSpec } from '../types/productSpec';
import { defaultProductSpec } from './productSpec.default';

/**
 * Active Product Specification
 * This is the SINGLE SOURCE OF TRUTH for the generated product.
 * When a problem statement is analyzed and transformed, this file is written
 * with the new domain-specific product specification.
 */
export const activeProductSpec: CompleteProductSpec = defaultProductSpec;
