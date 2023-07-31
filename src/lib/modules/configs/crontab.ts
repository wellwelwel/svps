import { CRONTAB } from '../../types/crontab.js';
import { STEPS } from '../../types/steps.js';
import { svpsOptions } from '../../types/svps.js';

export const setCrontab = (
  configs: svpsOptions,
  steps: Required<STEPS>
): Required<CRONTAB> | null => {
  return !steps.crontab || typeof configs?.crontab !== 'object'
    ? null
    : {
        path:
          configs.crontab?.path && typeof configs.crontab.path === 'string'
            ? configs.crontab.path
            : './.cronjobs.sh',
        append:
          configs.crontab?.append && typeof configs.crontab.append === 'string'
            ? configs.crontab.append
            : false,
      };
};
