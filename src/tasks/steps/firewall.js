const sh = require('../../modules/sh');
const config = require(`${process.cwd()}/.svpsrc.js`);

module.exports = () => {

   const sub_steps = [

      `echo "${sh.startTitle}Setting up Firewall${sh.endTitle}"`,
      'apt install ufw',
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
      'ufw allow from 127.0.0.1 to any port 3306',
      "sed -i '/ufw-before-input.*icmp/s/ACCEPT/DROP/g' /etc/ufw/before.rules",
   ];

   if (config?.SQL) {

      const { SQL } = config;

      for (const user of SQL.users) {

         const localhost = [ '127.0.0.1', 'localhost' ];

         if (localhost.includes(user.ip)) continue;

         sub_steps.push(`ufw allow from ${user.ip} to any port 3306`);
      }
   }

   sub_steps.push('echo "y" | ufw enable');
   sub_steps.push(sh.done);

   return sub_steps;
};