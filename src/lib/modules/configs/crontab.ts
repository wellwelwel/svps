import { CRONTAB } from '../../types/crontab.js';
import { MOUNT } from '../../types/mount.js';

export const setCrontab = (configs: MOUNT): Required<CRONTAB> | null => {
  return typeof configs?.crontab !== 'object'
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
