import { ACCESS } from '../../types/acess.js';
import { svpsOptions } from '../../types/svps.js';
import { forceArray } from '../force-array.js';

export const setAccess = (configs: svpsOptions): ACCESS[] => {
  if (
    !configs?.access ||
    (!Array.isArray(configs.access) && typeof configs.access !== 'object')
  )
    throw 'The field `access` is required';

  const mapVPS = forceArray(configs.access);

  for (const key in mapVPS) {
    const currentVPS = mapVPS[key];

    if (!currentVPS?.host || typeof currentVPS.host !== 'string')
      throw `The field \`host\` in \`access[${key}]\` is required`;

    if (!currentVPS?.username || typeof currentVPS.username !== 'string')
      throw `The field \`username\` in \`access[${key}]\` is required`;
  }

  return mapVPS;
};
