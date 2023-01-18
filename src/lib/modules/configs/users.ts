import { REQUIRED_USER } from '../../types/users.js';
import { forceArray } from '../force-array.js';
import { input } from './index.js';
import { steps } from './steps.js';

export const users = (() => {
   if (!steps.users || !input?.users) return null;

   const mapUsers = forceArray(input.users) as REQUIRED_USER[];

   for (const key in mapUsers) {
      const user = mapUsers[key];

      if (!user?.name || typeof user.name !== 'string') throw 'The field `name` in `users` is required';
      if (!user?.password || typeof user.password !== 'string') throw 'The field `password` in `users` is required';

      mapUsers[key].directory =
         user?.directory && typeof user.directory === 'string' ? user.directory : `/home/${user.name}`;
      mapUsers[key].sudo = 'sudo' in user && typeof user.sudo === 'boolean' ? user.sudo : false;
      mapUsers[key].groups = user?.groups && Array.isArray(user.groups) ? user.groups : ([] as string[]);
      mapUsers[key].ftp = !user?.ftp
         ? false
         : {
              directory: typeof user?.ftp?.directory === 'string' ? user.ftp.directory : mapUsers[key].directory,
           };
      mapUsers[key].sftp = !user.sftp
         ? false
         : {
              chRoot: typeof user.sftp?.chRoot === 'string' ? user.sftp.chRoot : '/home',
              chUser: typeof user.sftp?.chUser === 'string' ? user.sftp.chUser : `/home/${user.name}`,
              mask: user.sftp?.mask && typeof user.sftp.mask === 'string' ? user.sftp.mask : '0022',
           };
   }

   return mapUsers;
})();
