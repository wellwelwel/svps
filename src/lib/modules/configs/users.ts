import { REQUIRED_USER } from '../../types/required-types.js';
import { forceArray } from '../force-array.js';
import { input } from './index.js';
import { steps } from './steps.js';

export const users = (() => {
   if (!steps.users || !input?.users) return null;

   const mapUsers = forceArray(input.users) as REQUIRED_USER[];
   const emptyString = "''";

   for (const key in mapUsers) {
      const user = mapUsers[key];

      if (!user?.name || typeof user.name !== 'string') throw 'The field `name` in `users` is required';
      if (!user?.password || typeof user.password !== 'string') throw 'The field `password` in `users` is required';

      mapUsers[key].directory =
         user?.directory && typeof user.directory === 'string' ? user.directory : `/home/${user.name}`;
      mapUsers[key].sudo = 'sudo' in user && typeof user.sudo === 'boolean' ? user.sudo : false;
      mapUsers[key].groups = user?.groups && Array.isArray(user.groups) ? user.groups : ([] as string[]);

      if (!user?.ftp) mapUsers[key].ftp = false;
      else {
         mapUsers[key].ftp = {
            certificate: {
               days:
                  user.ftp?.certificate && typeof user.ftp.certificate?.days === 'number'
                     ? user.ftp.certificate.days
                     : 365,
               rsa:
                  user.ftp?.certificate && typeof user.ftp.certificate?.rsa === 'number'
                     ? user.ftp.certificate.rsa
                     : 4096,
               country:
                  user.ftp?.certificate && typeof user.ftp.certificate?.country === 'string'
                     ? user.ftp.certificate.country
                     : emptyString,
               state:
                  user.ftp?.certificate && typeof user.ftp.certificate?.state === 'string'
                     ? user.ftp.certificate.state
                     : emptyString,
               location:
                  user.ftp?.certificate && typeof user.ftp.certificate?.location === 'string'
                     ? user.ftp.certificate.location
                     : emptyString,
               organization:
                  user.ftp?.certificate && typeof user.ftp.certificate?.organization === 'string'
                     ? user.ftp.certificate.organization
                     : emptyString,
               organizationUnit:
                  user.ftp?.certificate && typeof user.ftp.certificate?.organizationUnit === 'string'
                     ? user.ftp.certificate.organizationUnit
                     : emptyString,
               commonName:
                  user.ftp?.certificate && typeof user.ftp.certificate?.commonName === 'string'
                     ? user.ftp.certificate.commonName
                     : emptyString,
            },
         };
      }
      if (!user.sftp) mapUsers[key].sftp = false;
      else {
         mapUsers[key].sftp = {
            chRoot: typeof user.sftp?.chRoot === 'string' ? user.sftp.chRoot : '/home',
            chUser: typeof user.sftp?.chUser === 'string' ? user.sftp.chUser : `/home/${user.name}`,
            mask: user.sftp?.mask && typeof user.sftp.mask === 'string' ? user.sftp.mask : '0022',
         };
      }
   }

   return mapUsers;
})();
