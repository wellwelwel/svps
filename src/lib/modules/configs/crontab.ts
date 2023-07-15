import { CRONTAB } from '../../types/crontab.js';
import { input } from './index.js';
import { steps } from './steps.js';

export const crontab: Required<CRONTAB> | null =
  !steps.crontab || typeof input?.crontab !== 'object'
    ? null
    : {
        path:
          input.crontab?.path && typeof input.crontab.path === 'string'
            ? input.crontab.path
            : './.cronjobs.sh',
        append:
          input.crontab?.append && typeof input.crontab.append === 'string'
            ? input.crontab.append
            : false,
      };
