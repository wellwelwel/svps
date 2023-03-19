import sh from '../../modules/sh.js';
import { mysql } from '../../modules/configs/mysql.js';

export default () => {
   const commands = [
      `echo "${sh.startTitle}Setting up Firewall${sh.endTitle}"`,
      'apt-get install ufw -y',
      'ufw default deny incoming',
      'ufw default allow outgoing',
      'ufw allow ssh',
      'ufw allow 22',
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

   commands.push('echo "y" | ufw enable');
   commands.push(sh.done);

   return commands;
};
