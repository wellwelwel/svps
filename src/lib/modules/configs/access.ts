import { ACCESS } from '../../types/acess.js';
import { forceArray } from '../force-array.js';
import { input } from './index.js';

export const access: ACCESS[] = (() => {
  if (!input?.access || (!Array.isArray(input.access) && typeof input.access !== 'object'))
    throw 'The field `access` is required';

  const mapVPS = forceArray(input.access);

  for (const key in mapVPS) {
    const currentVPS = mapVPS[key];

    if (!currentVPS?.host || typeof currentVPS.host !== 'string')
      throw `The field \`host\` in \`access[${key}]\` is required`;

    if (!currentVPS?.username || typeof currentVPS.username !== 'string')
      throw `The field \`username\` in \`access[${key}]\` is required`;
  }

  return mapVPS;
})();
