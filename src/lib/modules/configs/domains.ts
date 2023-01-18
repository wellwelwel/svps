import { DOMAINS } from '../../types/domains.js';
import { input } from './index.js';

export const domains: DOMAINS = input?.domains && typeof input.domains === 'string' ? input.domains : './.domains.json';
