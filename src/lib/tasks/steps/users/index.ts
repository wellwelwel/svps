import sh from '../../../modules/sh.js';
import { users } from '../../../modules/configs/users.js';
import { __dirname } from '../../../modules/root.js';
import { setFTP } from './ftp.js';

export default () => {
   if (!users) return [] as string[];

   const commands: string[] = [`echo "${sh.startTitle}Setting up Users${sh.endTitle}"`];

   for (const user of users) {
      Object.assign(commands, [
         ...commands,
         `id -u ${user.name} &>/dev/null || adduser --disabled-password --gecos "" ${user.name}`,
         `mkdir -p ${user.directory}`,
         `setfacl -R -m u:${user.name}:rwx ${user.directory}`,
         `setfacl -dR -m u:${user.name}:rwx ${user.directory}`,
         `echo "${user.name}:${user.password}" | chpasswd`,
         `echo "${user.name}"`,
      ]);

      if (user.sudo) commands.push(`gpasswd -a "${user.name}" sudo`);
      if (user.ftp) Object.assign(commands, [...commands, ...setFTP(user)]);
      if (user.groups.length > 0) {
         user.groups.forEach((group) => {
            commands.push(`groupadd -f ${group}`);
            commands.push(`usermod -a -G ${group} ${user.name}`);
         });

         commands.push(`usermod -g ${user.groups.shift()} ${user.name}`);
      }
   }

   commands.push(sh.done);

   return commands;
};
