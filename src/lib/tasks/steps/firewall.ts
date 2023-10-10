import sh from '../../modules/sh.js';
import { setMysql } from '../../modules/configs/mysql.js';
import { ACCESS } from '../../types/acess.js';
import { MOUNT } from '../../types/mount.js';

export default (configs: MOUNT, VPS: ACCESS) => {
  const mysql = setMysql(configs);

  const commands = [
    `echo "${sh.startTitle}Setting up Firewall${sh.endTitle}"`,
    'sudo apt-get update',
    `if [ "$(sudo grep -E '^VERSION_ID="18.04"' /etc/os-release)" ]; then sudo apt-get install nftables -y; fi`,
    'sudo apt-get install ufw -y',
    'sudo ufw default deny incoming',
    'sudo ufw default allow outgoing',
    `if [ "$(sudo grep -E '^VERSION_ID="18.04"' /etc/os-release)" ]; then sudo ufw allow OpenSSH; else sudo ufw allow ssh; fi`,
    `sudo ufw allow ${VPS?.port || 22}`,
    'sudo ufw allow 80',
    'sudo ufw allow 443',
    'sudo ufw allow 20/tcp',
    'sudo ufw allow 21/tcp',
    'sudo ufw allow 990/tcp',
    'sudo ufw allow 40000:50000/tcp',
    "sudo sed -i '/ufw-before-input.*icmp/s/ACCEPT/DROP/g' /etc/ufw/before.rules",
  ];

  if (mysql) {
    commands.push(`sudo ufw allow from 127.0.0.1 to any port 3306`);

    if (mysql.users.length > 0) {
      for (const user of mysql.users) {
        const localhost = ['127.0.0.1', 'localhost'];

        if (localhost.includes(user.host)) continue;

        commands.push(`sudo ufw allow from ${user.host} to any port 3306`);
      }
    }
  }

  if (configs.desktop) {
    /* Open port to RDP */
    Object.assign(commands, [
      ...commands,
      'sudo ufw allow from any to any port 3389 proto tcp',
      'sudo ufw reload',
    ]);
  }

  commands.push('echo "y" | sudo ufw enable');
  commands.push(sh.done);

  return commands;
};
