import { NODE } from '../../types/node.js';
import { input } from './index.js';
import { steps } from './steps.js';

export const node: Required<NODE> | null = (() => {
  if (!steps.node || !input?.node || typeof input?.node !== 'object')
    return null;

  return {
    version:
      input?.node && typeof input.node.version === 'number'
        ? input.node.version
        : 18,
    packages:
      input?.node && Array.isArray(input.node.packages)
        ? input.node.packages
        : ['pm2'],
  };
})();
