const fs = require('fs');
const { normalize } = require('path');
const sh = require('../../modules/sh');
const { APACHE } = require(`${process.cwd()}/.svpsrc.js`);
const escapeQuotes = require('../../modules/escape-quotes');

module.exports = () => {

   const sub_steps = [

      `echo "${sh.startTitle}Setting up Apache2${sh.endTitle}"`,
      'apt install apache2 -y',
      'mkdir -p /var/www',
      'setfacl -R -m u:"www-data":rwx /var/www /tmp',
      'setfacl -dR -m u:"www-data":rwx /var/www /tmp',
      'rm -rf /var/www/html/index.html',
      'mkdir -p /var/www/html',
      'systemctl restart apache2',
   ];
   const root_path = `${__dirname}../../../..`;

   if (APACHE['deny-access-to-default-virtual-host']) {

      const htaccess = `${root_path}/resources/php-resources/html/.htaccess`;
      const _403 = `${root_path}/resources/php-resources/html/403.html`;

      sub_steps.push(`echo ${escapeQuotes(fs.readFileSync(normalize(htaccess), 'utf-8'))} | cat > /var/www/html/.htaccess`);
      sub_steps.push(`echo ${escapeQuotes(fs.readFileSync(normalize(_403), 'utf-8'))} | cat > /var/www/html/403.html`);
   }

   sub_steps.push(sh.done);

   return sub_steps;
};