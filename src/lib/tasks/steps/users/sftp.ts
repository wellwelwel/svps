import fs from 'fs';
import { normalize } from 'path';
import { escapeQuotes } from '../../../modules/escape-quotes.js';
import { REQUIRED_USER } from '../../../types/users.js';
import { rootSVPS } from '../../../modules/root.js';

export const setSFTP = (user: REQUIRED_USER) => {
  if (!user?.sftp) return [] as string[];

  const sshdConfigPath = '/etc/ssh/sshd_config';

  const user_conf = fs
    .readFileSync(normalize(`${rootSVPS}/resources/sftp/user.conf`), 'utf-8')
    .replace(/{!USER}/gm, user.name)
    .replace(/{!CHROOT}/gm, user.sftp.chRoot)
    .replace(/{!CHUSER}/gm, user.sftp.chUser)
    .replace(/{!MASK}/gm, user.sftp.mask);

  const commands: string[] = [
    `echo ${escapeQuotes(user_conf)} | sudo tee -a ${sshdConfigPath}`,
    `sudo mkdir -p ${user.sftp.chRoot} ${user.sftp.chUser}`,
    `sudo chown root:root ${user.sftp.chRoot}`,
    `sudo chmod 0755 ${user.sftp.chRoot}`,
    `sudo groupadd -f ${user.name}`,
    `sudo chown -R ${user.name}:${user.name} ${user.sftp.chUser}`,
    `sudo chmod -R 0755 ${user.sftp.chUser}`,
  ];

  return commands;
};
