import fs from 'fs';
import { normalize } from 'path';
import { __dirname } from '../../../modules/root.js';
import escapeQuotes from '../../../modules/escape-quotes.js';
import { REQUIRED_USER } from '../../../types/users.js';

export const setFTP = (user: REQUIRED_USER) => {
  if (!user?.ftp) return [] as string[];

  const user_conf = fs
    .readFileSync(normalize(`${__dirname}/resources/ftp/user.conf`), 'utf-8')
    .replace(/{!PATH}/gm, user.ftp.directory)
    .replace(/{!MASK}/gm, user.ftp.mask);

  const commands: string[] = [`echo ${escapeQuotes(user_conf)} | cat > /etc/vsftpd/user_config_dir/${user.name}`];

  commands.push(`echo "${user.name}" | tee -a /etc/vsftpd.userlist`);

  return commands;
};
