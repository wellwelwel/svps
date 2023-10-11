import { NODE } from '../../types/node.js';
import { MOUNT } from '../../types/mount.js';

export const setNode = (configs: MOUNT): Required<NODE> | null => {
  if (!configs?.node) return null;

  const defaults: Required<NODE> = {
    version: 18,
    packages: [],
  };

  if (configs.node === true) return defaults;

  return {
    version:
      configs?.node && typeof configs.node.version === 'number'
        ? configs.node.version
        : defaults.version,
    packages:
      configs?.node && Array.isArray(configs.node.packages)
        ? configs.node.packages
        : defaults.packages,
  };
};
