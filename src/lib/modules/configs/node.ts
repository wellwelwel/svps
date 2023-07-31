import { NODE } from '../../types/node.js';
import { STEPS } from '../../types/steps.js';
import { svpsOptions } from '../../types/svps.js';

export const setNode = (
  configs: svpsOptions,
  steps: Required<STEPS>
): Required<NODE> | null => {
  if (!steps.node || !configs?.node || typeof configs?.node !== 'object')
    return null;

  return {
    version:
      configs?.node && typeof configs.node.version === 'number'
        ? configs.node.version
        : 18,
    packages:
      configs?.node && Array.isArray(configs.node.packages)
        ? configs.node.packages
        : [],
  };
};
