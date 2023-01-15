import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import { __dirname } from '../../modules/root.js';
import escapeQuotes from '../../modules/escape-quotes.js';

export default () => {
   const root_path = `${__dirname}../../../..`;
   const default_000 = `${root_path}/resources/virtual-host/000-default.conf`;

   const sub_steps = [
      `echo "${sh.startTitle}Setting up Rewrite Virtual Hosts${sh.endTitle}"`,
      `echo ${escapeQuotes(
         fs.readFileSync(normalize(default_000), 'utf-8')
      )} | cat > /etc/apache2/sites-available/000-default.conf`,
      'a2enmod proxy proxy_http rewrite headers expires',
      'systemctl reload apache2',
      'systemctl restart apache2',
   ];

   sub_steps.push(sh.done);

   return sub_steps;
};
