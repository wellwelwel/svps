import fs from 'fs';
import { normalize } from 'path';
import { escapeQuotes } from '../../../modules/escape-quotes.js';
import { setCertificate } from '../../../modules/configs/certificate.js';
import { setUsers } from '../../../modules/configs/users.js';
import sh from '../../../modules/sh.js';
import { setFTP } from './ftp.js';
import { setSFTP } from './sftp.js';
import { MOUNT } from '../../../types/mount.js';
import { rootSVPS } from '../../../modules/root.js';

export default (configs: MOUNT) => {
  const certificate = setCertificate(configs);
  const users = setUsers(configs);

  if (!users) return [] as string[];

  const commands: string[] = [
    `echo "${sh.startTitle}Setting up Users${sh.endTitle}"`,
    'sudo apt-get update',
    'sudo apt-get install acl -y',
  ];
  const hasFTP = users?.some((user) => typeof user.ftp === 'object') || false;
  const hasSFTP = users?.some((user) => typeof user.sftp === 'object') || false;
  const vsftpd_conf = escapeQuotes(
    fs.readFileSync(normalize(`${rootSVPS}/resources/ftp/vsftpd.conf`), 'utf-8')
  ).replace(/{!CERT}/gm, certificate?.output || '/etc/ssl/private/cert.pem');

  const sshdConfigPath = '/etc/ssh/sshd_config';
  const sftpConfigPath = '/etc/ssh/sshd_config.d/sftp.conf';

  if (hasFTP) {
    Object.assign(commands, [
      ...commands,
      'sudo apt-get update',
      'sudo apt-get purge vsftpd -y 2>/dev/null',
      'sudo rm -rf /etc/vsftpd.userlist',
      'sudo apt-get install vsftpd -y',
      'sudo mkdir -p /etc/vsftpd/user_config_dir',
      `sudo echo ${vsftpd_conf} | tee /etc/vsftpd.conf`,
    ]);
  }

  if (hasSFTP) {
    Object.assign(commands, [
      ...commands,
      `sudo sed -i 's/Subsystem\\ssftp\\s\\/usr\\/lib\\/openssh\\/sftp-server/Subsystem\\tsftp\\tinternal-sftp/g' ${sshdConfigPath}`,
      `sudo sed -i '/#svps-start/,/#svps-end/d' ${sshdConfigPath}`,
      `sudo rm -f ${sftpConfigPath}`,
    ]);
  }

  for (const user of users) {
    Object.assign(commands, [
      ...commands,
      `sudo id -u ${user.name} &>/dev/null || sudo adduser --disabled-password --gecos "" ${user.name}`,
      `sudo mkdir -p ${user.directory}`,
      `sudo echo "${user.name}:${user.password}" | sudo chpasswd`,
      `echo "${user.name}"`,
    ]);

    if (user.sudo) commands.push(`sudo gpasswd -a "${user.name}" sudo`);
    if (user.ftp) Object.assign(commands, [...commands, ...setFTP(user)]);
    if (user.sftp) Object.assign(commands, [...commands, ...setSFTP(user)]);
    if (user.groups.length > 0) {
      user.groups.forEach((group) =>
        Object.assign(commands, [
          ...commands,
          `sudo groupadd -f ${group}`,
          `sudo usermod -a -G ${group} ${user.name}`,
        ])
      );

      const primary = user.groups.shift();

      Object.assign(commands, [
        ...commands,
        `sudo usermod -g ${primary} ${user.name}`,
        `--catch sudo chown -R ${user.name}:${primary} ${user.directory}`,
      ]);
    } else
      commands.push(`--catch sudo chown -R ${user.name} ${user.directory}`);

    Object.assign(commands, [
      ...commands,
      `--catch sudo setfacl -Rb ${user.directory}`,
      `--catch sudo chown -R ${user.name} ${user.directory}`,
      `--catch sudo chmod -R 0755 ${user.directory}`,
      `sudo chmod 0700 ${user.directory}`,
    ]);
  }

  if (hasFTP) commands.push('sudo systemctl restart vsftpd');
  if (hasSFTP) commands.push('--restart-ssh');

  commands.push(sh.done);

  return commands;
};
