import { APACHE } from '../../types/apache.js';
import { MOUNT } from '../../types/mount.js';

export const setApache = (configs: MOUNT): Required<APACHE> | null => {
  if (!configs?.apache) return null;

  if (configs.apache === true)
    return {
      accessFromIP: false,
    };

  return {
    accessFromIP:
      typeof configs.apache?.accessFromIP === 'boolean'
        ? configs.apache.accessFromIP
        : false,
  };
};
