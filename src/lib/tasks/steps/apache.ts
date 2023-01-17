import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import escapeQuotes from '../../modules/escape-quotes.js';
import { apache } from '../../modules/configs/apache.js';
import { __dirname } from '../../modules/root.js';
import { steps } from '../../modules/configs/steps.js';

export default async () => {
   if (!apache || !steps.apache) return [] as string[];

   const default_000 = `${__dirname}/resources/apache/virtual-host/000-default.conf`;

   const commands = [
      `echo "${sh.startTitle}Setting up Apache2${sh.endTitle}"`,
      'apt-get install apache2 -y',
      'mkdir -p /var/www',
      'find /var/www -type d -exec chmod 775 {} \\;',
      'find /var/www -type f -exec chmod 664 {} \\;',
      'setfacl -R -m u:"www-data":rwx /var/www /tmp',
      'setfacl -dR -m u:"www-data":rwx /var/www /tmp',
      'rm -rf /var/www/html/index.html',
      'mkdir -p /var/www/html',
      `echo "${sh.startTitle}Setting up Rewrite Virtual Hosts${sh.endTitle}"`,
      `echo ${escapeQuotes(
         fs.readFileSync(normalize(default_000), 'utf-8')
      )} | cat > /etc/apache2/sites-available/000-default.conf`,
      'a2enmod proxy proxy_http rewrite headers expires',
      'systemctl reload apache2',
      'systemctl restart apache2',
   ];

   if (!apache.accessFromIP) {
      const htaccess = `${__dirname}/resources/apache/html/.htaccess`;
      const _403 = `${__dirname}/resources/apache/html/403.html`;

      Object.assign(commands, [
         ...commands,
         ...[
            `echo ${escapeQuotes(fs.readFileSync(normalize(htaccess), 'utf-8'))} | cat > /var/www/html/.htaccess`,
            `echo ${escapeQuotes(fs.readFileSync(normalize(_403), 'utf-8'))} | cat > /var/www/html/403.html`,
         ],
      ]);
   }

   commands.push(sh.done);

   return commands;
};
