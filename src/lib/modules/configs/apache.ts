import { APACHE } from '../../types/apache.js';
import { input } from './index.js';
import { steps } from './steps.js';

export const apache: Required<APACHE> | null =
   !steps.apache || typeof input?.apache !== 'object'
      ? null
      : {
           defaultPage: typeof input.apache?.defaultPage === 'string' ? input.apache.defaultPage : './index.html',
           www: typeof input.apache?.www === 'boolean' ? input.apache.www : true,
           accessFromIP: typeof input.apache?.accessFromIP === 'boolean' ? input.apache.accessFromIP : false,
        };
