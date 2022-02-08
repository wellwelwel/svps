const fs = require('fs');
const { normalize } = require('path');
const sh = require('../../modules/sh');
const { FTP } = require(`${process.cwd()}/.svpsrc.js`);
const escapeQuotes = require('../../modules/escape-quotes');

module.exports = () => {

   const sub_steps = [

      `echo "${sh.startTitle}Setting up FTP${sh.endTitle}"`,
      'apt install vsftpd',
      'mkdir -p /etc/vsftpd/user_config_dir',
   ];
   const userlist = [];
   const root_path = `${__dirname}../../../..`;
   const vsftpd_conf = `${root_path}/resources/ftp/vsftpd.conf`;

   for (const user of FTP.users) {

      const user_conf = fs.readFileSync(normalize(`${root_path}/resources/ftp/user.conf`), 'utf-8').replace(/{!PATH}/gm, user.path);

      Object.assign(sub_steps, [

         ...sub_steps,
         `id -u ${user.name} &>/dev/null || adduser --disabled-password --gecos "" ${user.name}`,
         `mkdir -p ${user.path}`,
         `setfacl -R -m u:${user.name}:rwx ${user.path}`,
         `setfacl -dR -m u:${user.name}:rwx ${user.path}`,
         `echo ${user.name}:${user.pass} | chpasswd`,
         `echo ${escapeQuotes(user_conf)} | cat > /etc/vsftpd/user_config_dir/${user.name}`,
      ]);

      if (!FTP?.append) sub_steps.push(`echo "${user.name}"`);
      userlist.push(user.name);
   }

   Object.assign(sub_steps, [

      ...sub_steps,
      `echo ${escapeQuotes(fs.readFileSync(normalize(vsftpd_conf), 'utf-8'))} | cat > /etc/vsftpd.conf`,
      `echo "${userlist.join('\n')}" | ${FTP?.append ? 'tee -a' : 'cat >'} /etc/vsftpd.userlist`,
      'find /var/www -type d -exec chmod 775 {} \\;',
      'find /var/www -type f -exec chmod 664 {} \\;',
      'systemctl restart vsftpd',
   ]);

   sub_steps.push(sh.done);

   return sub_steps;
};