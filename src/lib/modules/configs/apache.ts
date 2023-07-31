import { APACHE } from '../../types/apache.js';
import { svpsOptions } from '../../types/svps.js';

export const setApache = (configs: svpsOptions): Required<APACHE> => {
  return {
    accessFromIP:
      typeof configs.apache?.accessFromIP === 'boolean'
        ? configs.apache.accessFromIP
        : false,
  };
};
