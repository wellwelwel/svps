import { svpsOptions } from '../../types/svps.js';
import { VERBOSE } from '../../types/verbose.js';

export const setVerbose = (configs: svpsOptions): VERBOSE => {
  return typeof configs.verbose === 'boolean' ? configs.verbose : false;
};
