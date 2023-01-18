import fs from 'fs';
import { normalize } from 'path';
import { __dirname } from '../../../modules/root.js';
import escapeQuotes from '../../../modules/escape-quotes.js';
import { certificate } from '../../../modules/configs/certificate.js';
import { REQUIRED_USER } from '../../../types/users.js';

export const setFTP = (user: REQUIRED_USER) => {
   if (!user?.ftp) return [] as string[];

   const vsftpd_conf = escapeQuotes(
      fs.readFileSync(normalize(`${__dirname}/resources/ftp/vsftpd.conf`), 'utf-8')
   ).replace(/{!CERT}/gm, certificate?.output || '/etc/ssl/private/cert.pem');

   const user_conf = fs
      .readFileSync(normalize(`${__dirname}/resources/ftp/user.conf`), 'utf-8')
      .replace(/{!PATH}/gm, user.directory);

   const commands: string[] = [
      'type -P vsftpd &>/dev/null || apt-get install vsftpd',
      'mkdir -p /etc/vsftpd/user_config_dir',
      `echo ${escapeQuotes(user_conf)} | cat > /etc/vsftpd/user_config_dir/${user.name}`,
   ];

   Object.assign(commands, [
      ...commands,
      `echo ${vsftpd_conf} | cat > /etc/vsftpd.conf`,
      `echo "${user.name}" | tee -a /etc/vsftpd.userlist`,
      'systemctl restart vsftpd',
   ]);

   return commands;
};
