import { DOMAINS } from '../../types/domains.js';
import { svpsOptions } from '../../types/svps.js';

export const setDomains = (configs: svpsOptions): DOMAINS => {
  return configs?.domains && typeof configs.domains === 'string'
    ? configs.domains
    : './.domains.json';
};
