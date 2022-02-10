const fs = require('fs');
const { normalize } = require('path');
const sh = require('../../modules/sh');
const escapeQuotes = require('../../modules/escape-quotes');

module.exports = () => {

   const root_path = `${__dirname}../../../..`;
   const default_000 = `${root_path}/resources/virtual-host/000-default.conf`;

   const sub_steps = [

      `echo "${sh.startTitle}Setting up Rewrite Virtual Hosts${sh.endTitle}"`,
      `echo ${escapeQuotes(fs.readFileSync(normalize(default_000), 'utf-8'))} | cat > /etc/apache2/sites-available/000-default.conf`,
      'a2enmod proxy proxy_http rewrite headers expires',
      'systemctl reload apache2',
      'systemctl restart apache2',
   ];

   sub_steps.push(sh.done);

   return sub_steps;
};