import { CRONTAB } from '../../types/crontab.js';
import { svpsOptions } from '../../types/svps.js';
import { setSteps } from './steps.js';

export const setCrontab = (configs: svpsOptions): Required<CRONTAB> | null => {
  const steps = setSteps(configs);

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
