import fs from 'fs';
import { normalize } from 'path';
import escapeQuotes from '../../../modules/escape-quotes.js';
import { certificate } from '../../../modules/configs/certificate.js';
import sh from '../../../modules/sh.js';
import { users } from '../../../modules/configs/users.js';
import { __dirname } from '../../../modules/root.js';
import { setFTP } from './ftp.js';

export default () => {
   if (!users) return [] as string[];

   const commands: string[] = [`echo "${sh.startTitle}Setting up Users${sh.endTitle}"`];
   const hasFTP = users?.some((user) => typeof user.ftp === 'object') || false;
   const hasSFTP = users?.some((user) => typeof user.sftp === 'object') || false;
   const vsftpd_conf = escapeQuotes(
      fs.readFileSync(normalize(`${__dirname}/resources/ftp/vsftpd.conf`), 'utf-8')
   ).replace(/{!CERT}/gm, certificate?.output || '/etc/ssl/private/cert.pem');

   if (hasFTP) {
      Object.assign(commands, [
         ...commands,
         'apt-get purge vsftpd -y 2>/dev/null',
         'rm -rf /etc/vsftpd.userlist',
         'apt-get install vsftpd -y',
         'mkdir -p /etc/vsftpd/user_config_dir',
         `echo ${vsftpd_conf} | cat > /etc/vsftpd.conf`,
      ]);
   }

   for (const user of users) {
      Object.assign(commands, [
         ...commands,
         `id -u ${user.name} &>/dev/null || adduser --disabled-password --gecos "" ${user.name}`,
         `mkdir -p ${user.directory}`,
         `echo "${user.name}:${user.password}" | chpasswd`,
         `echo "${user.name}"`,
      ]);

      if (user.sudo) commands.push(`gpasswd -a "${user.name}" sudo`);
      if (user.ftp) Object.assign(commands, [...commands, ...setFTP(user)]);
      if (user.groups.length > 0) {
         user.groups.forEach((group) => {
            Object.assign(commands, [...commands, `groupadd -f ${group}`, `usermod -a -G ${group} ${user.name}`]);
         });

         const primary = user.groups.shift();

         Object.assign(commands, [
            ...commands,
            `usermod -g ${primary} ${user.name}`,
            `chown -R ${user.name}:${primary} ${user.directory}`,
         ]);
      } else commands.push(`chown -R ${user.name} ${user.directory}`);

      Object.assign(commands, [
         ...commands,
         `setfacl -Rb ${user.directory}`,
         `chown -R ${user.name} ${user.directory}`,
         `chmod -R 0755 ${user.directory}`,
         `chmod 0700 ${user.directory}`,
      ]);
   }

   if (hasFTP) commands.push('systemctl restart vsftpd');
   if (hasSFTP) commands.push('--restart-ssh');

   commands.push(sh.done);

   return commands;
};
