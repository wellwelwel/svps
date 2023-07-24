import { APACHE } from '../../types/apache.js';
import { input } from './index.js';

export const apache: Required<APACHE> = {
  accessFromIP:
    typeof input.apache?.accessFromIP === 'boolean'
      ? input.apache.accessFromIP
      : false,
};
