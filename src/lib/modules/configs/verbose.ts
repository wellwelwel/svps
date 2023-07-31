import { MOUNT } from '../../types/mount.js';
import { VERBOSE } from '../../types/verbose.js';

export const setVerbose = (configs: MOUNT): VERBOSE => {
  return typeof configs.verbose === 'boolean' ? configs.verbose : false;
};
