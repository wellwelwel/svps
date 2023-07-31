import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import { escapeQuotes } from '../../modules/escape-quotes.js';
import { setApache } from '../../modules/configs/apache.js';
import { svpsOptions } from '../../types/svps.js';
import { rootSVPS } from '../../modules/root.js';

export default (configs: svpsOptions) => {
  const apache = setApache(configs);

  if (!apache) return [] as string[];

  const default_000 = `${rootSVPS}/resources/apache/virtual-host/000-default.conf`;

  const commands = [
    `echo "${sh.startTitle}Setting up Apache2${sh.endTitle}"`,
    'apt-get update',
    'apt-get install apache2 -y',
    'mkdir -p /var/www',
    'rm -rf /var/www/html',
    'mkdir -p /var/www/host',
    `echo "${sh.startTitle}Setting up Rewrite Virtual Hosts${sh.endTitle}"`,
    `echo ${escapeQuotes(
      fs.readFileSync(normalize(default_000), 'utf-8')
    )} | cat > /etc/apache2/sites-available/000-default.conf`,
    'a2enmod proxy proxy_http rewrite headers expires',
  ];

  if (!apache.accessFromIP) {
    const htaccess = `${rootSVPS}/resources/apache/html/.htaccess`;
    const _403 = `${rootSVPS}/resources/apache/html/403.html`;

    Object.assign(commands, [
      ...commands,
      ...[
        `echo ${escapeQuotes(
          fs.readFileSync(normalize(htaccess), 'utf-8')
        )} | cat > /var/www/host/.htaccess`,
        `echo ${escapeQuotes(
          fs.readFileSync(normalize(_403), 'utf-8')
        )} | cat > /var/www/host/403.html`,
        'chmod 0755 /var/www/host',
      ],
    ]);
  }

  Object.assign(commands, [
    ...commands,
    'systemctl restart apache2',
    'systemctl reload apache2',
    sh.done,
  ]);

  return commands;
};
