import { VERBOSE } from '../../types/verbose.js';
import { input } from './index.js';

export const verbose: VERBOSE = typeof input.verbose === 'boolean' ? input.verbose : false;
