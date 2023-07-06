import { APACHE } from '../../types/apache.js';
import { input } from './index.js';

export const apache: Required<APACHE> = {
  defaultPage: typeof input.apache?.defaultPage === 'string' ? input.apache.defaultPage : './index.html',
  www: typeof input.apache?.www === 'boolean' ? input.apache.www : true,
  accessFromIP: typeof input.apache?.accessFromIP === 'boolean' ? input.apache.accessFromIP : false,
};
