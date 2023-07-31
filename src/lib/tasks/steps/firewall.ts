import sh from '../../modules/sh.js';
import { setMysql } from '../../modules/configs/mysql.js';
import { ACCESS } from '../../types/acess.js';
import { MOUNT } from '../../types/mount.js';

export default (configs: MOUNT, VPS: ACCESS) => {
  const mysql = setMysql(configs);

  const commands = [
    `echo "${sh.startTitle}Setting up Firewall${sh.endTitle}"`,
    'apt-get update',
    `if [ "$(grep -E '^VERSION_ID="18.04"' /etc/os-release)" ]; then apt-get install nftables -y; fi`,
    'apt-get install ufw -y',
    'ufw default deny incoming',
    'ufw default allow outgoing',
    `if [ "$(grep -E '^VERSION_ID="18.04"' /etc/os-release)" ]; then ufw allow OpenSSH; else ufw allow ssh; fi`,
    `ufw allow ${VPS?.port || 22}`,
    'ufw allow 80',
    'ufw allow 443',
    'ufw allow 20/tcp',
    'ufw allow 21/tcp',
    'ufw allow 990/tcp',
    'ufw allow 40000:50000/tcp',
    "sed -i '/ufw-before-input.*icmp/s/ACCEPT/DROP/g' /etc/ufw/before.rules",
  ];

  if (mysql) {
    commands.push(`ufw allow from 127.0.0.1 to any port 3306`);

    if (mysql.users.length > 0) {
      for (const user of mysql.users) {
        const localhost = ['127.0.0.1', 'localhost'];

        if (localhost.includes(user.host)) continue;

        commands.push(`ufw allow from ${user.host} to any port 3306`);
      }
    }
  }

  if (configs.desktop) {
    /* Open port to RDP */
    Object.assign(commands, [
      ...commands,
      'ufw allow from any to any port 3389 proto tcp',
      'ufw reload',
    ]);
  }

  commands.push('echo "y" | ufw enable');
  commands.push(sh.done);

  return commands;
};
