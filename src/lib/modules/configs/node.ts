import { NODE } from '../../types/node.js';
import { svpsOptions } from '../../types/svps.js';
import { setSteps } from './steps.js';

export const setNode = (configs: svpsOptions): Required<NODE> | null => {
  const steps = setSteps(configs);

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
