import { VPS } from '../../index.js';
import { forceArray } from '../force-array.js';
import { input } from './index.js';

export const vps: VPS[] = (() => {
   if (!input?.vps || (!Array.isArray(input.vps) && typeof input.vps !== 'object')) throw 'The field `vps` is required';

   const mapVPS = forceArray(input.vps);

   for (const key in mapVPS) {
      const currentVPS = mapVPS[key];

      if (!currentVPS?.host || typeof currentVPS.host !== 'string')
         throw `The field \`host\` in \`vps[${key}]\` is required`;

      if (!currentVPS?.username || typeof currentVPS.username !== 'string')
         throw `The field \`username\` in \`vps[${key}]\` is required`;
   }

   return mapVPS;
})();
