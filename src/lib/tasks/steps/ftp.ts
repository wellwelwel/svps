import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import { FTP } from '../../modules/configs.js';
import { __dirname } from '../../modules/root.js';
import escapeQuotes from '../../modules/escape-quotes.js';

export default () => {
   if (!FTP) return [] as string[];

   const sub_steps = [
      `echo "${sh.startTitle}Setting up FTP${sh.endTitle}"`,
      'apt install vsftpd',
      'mkdir -p /etc/vsftpd/user_config_dir',
   ];
   const userlist: string[] = [];
   const root_path = `${__dirname}../../../..`;
   const vsftpd_conf = `${root_path}/resources/ftp/vsftpd.conf`;

   for (const user of FTP.users) {
      const user_conf = fs
         .readFileSync(normalize(`${root_path}/resources/ftp/user.conf`), 'utf-8')
         .replace(/{!PATH}/gm, user.path);

      Object.assign(sub_steps, [
         ...sub_steps,
         `id -u ${user.name} &>/dev/null || adduser --disabled-password --gecos "" ${user.name}`,
         `mkdir -p ${user.path}`,
         `setfacl -R -m u:${user.name}:rwx ${user.path}`,
         `setfacl -dR -m u:${user.name}:rwx ${user.path}`,
         `echo "${user.name}:${user.pass}" | chpasswd`,
         `echo ${escapeQuotes(user_conf)} | cat > /etc/vsftpd/user_config_dir/${user.name}`,
      ]);

      if (user?.administrator) sub_steps.push(`gpasswd -a "${user.name}" sudo`);
      if (!FTP?.append) sub_steps.push(`echo "${user.name}"`);

      userlist.push(user.name);
   }

   if (!FTP?.ssl || typeof FTP?.ssl !== 'object') {
      FTP.ssl = {
         days: 365,
         rsa: 4096,
         country: "''",
         state: "''",
         location: "''",
         organization: "''",
         organizationUnit: "''",
         commonName: "''",
      };
   }

   if (!FTP.ssl?.days || FTP.ssl?.days <= 0) FTP.ssl.days = 365;
   if (!FTP.ssl?.rsa || FTP.ssl?.rsa <= 0) FTP.ssl.rsa = 4096;
   if (FTP.ssl?.country?.trim().length === 0) FTP.ssl.country = "''";
   if (FTP.ssl?.state?.trim().length === 0) FTP.ssl.state = "''";
   if (FTP.ssl?.location?.trim().length === 0) FTP.ssl.location = "''";
   if (FTP.ssl?.organization?.trim().length === 0) FTP.ssl.organization = "''";
   if (FTP.ssl?.organizationUnit?.trim().length === 0) FTP.ssl.organizationUnit = "''";
   if (FTP.ssl?.commonName?.trim().length === 0) FTP.ssl.commonName = "''";

   const { ssl } = FTP;

   Object.assign(sub_steps, [
      ...sub_steps,
      'echo "Generating the FTP SSL Certificate..."',
      `openssl req -x509 -nodes -days ${ssl.days} -new -newkey rsa:${ssl.rsa} -keyout /etc/ssl/private/vsftpd.pem -out /etc/ssl/private/vsftpd.pem -subj "/C=${ssl.country}/ST=${ssl.state}/L=${ssl.location}/O=${ssl.organization}/OU=${ssl.organizationUnit}/CN=${ssl.commonName}"`,
   ]);

   Object.assign(sub_steps, [
      ...sub_steps,
      `echo ${escapeQuotes(fs.readFileSync(normalize(vsftpd_conf), 'utf-8'))} | cat > /etc/vsftpd.conf`,
      `echo "${userlist.join('\n')}" | ${FTP?.append ? 'tee -a' : 'cat >'} /etc/vsftpd.userlist`,
      'find /var/www -type d -exec chmod 775 {} \\;',
      'find /var/www -type f -exec chmod 664 {} \\;',
      'systemctl restart vsftpd',
   ]);

   sub_steps.push(sh.done);

   return sub_steps;
};
