import fs from 'fs';
import { normalize } from 'path';
import { escapeQuotes } from '../../../modules/escape-quotes.js';
import { REQUIRED_USER } from '../../../types/users.js';
import { rootSVPS } from '../../../modules/root.js';

export const setFTP = (user: REQUIRED_USER) => {
  if (!user?.ftp) return [] as string[];

  const user_conf = fs
    .readFileSync(normalize(`${rootSVPS}/resources/ftp/user.conf`), 'utf-8')
    .replace(/{!PATH}/gm, user.ftp.directory)
    .replace(/{!MASK}/gm, user.ftp.mask);

  const commands: string[] = [
    `echo ${escapeQuotes(user_conf)} | sudo tee /etc/vsftpd/user_config_dir/${
      user.name
    }`,
  ];

  commands.push(`sudo echo "${user.name}" | tee -a /etc/vsftpd.userlist`);

  return commands;
};
