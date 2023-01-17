import fs from 'fs';
import { normalize } from 'path';
import { __dirname } from '../../../modules/root.js';
import escapeQuotes from '../../../modules/escape-quotes.js';
import { REQUIRED_USER } from '../../../../types/required-types.js';

export const setFTP = (user: REQUIRED_USER) => {
   if (!user?.ftp) return [] as string[];

   const vsftpd_conf = `${__dirname}/resources/ftp/vsftpd.conf`;
   const user_conf = fs
      .readFileSync(normalize(`${__dirname}/resources/ftp/user.conf`), 'utf-8')
      .replace(/{!PATH}/gm, user.directory);

   const commands: string[] = [
      'apt-get install vsftpd',
      'mkdir -p /etc/vsftpd/user_config_dir',
      `echo ${escapeQuotes(user_conf)} | cat > /etc/vsftpd/user_config_dir/${user.name}`,
   ];

   const { certificate } = user.ftp;

   Object.assign(commands, [
      ...commands,
      'echo "Generating FTP SSL Certificate..."',
      `if openssl req -x509 -nodes -days ${certificate.days} -new -newkey rsa:${certificate.rsa} -keyout /etc/ssl/private/vsftpd.pem -out /etc/ssl/private/vsftpd.pem -subj "/C=${certificate.country}/ST=${certificate.state}/L=${certificate.location}/O=${certificate.organization}/OU=${certificate.organizationUnit}/CN=${certificate.commonName}" 2>/dev/null; then echo true; else echo false; fi;`,
      `echo ${escapeQuotes(fs.readFileSync(normalize(vsftpd_conf), 'utf-8'))} | cat > /etc/vsftpd.conf`,
      `echo "${user.name}" | tee -a /etc/vsftpd.userlist`,
      'systemctl restart vsftpd',
   ]);

   return commands;
};
