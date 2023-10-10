import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import { escapeQuotes } from '../../modules/escape-quotes.js';
import { setApache } from '../../modules/configs/apache.js';
import { MOUNT } from '../../types/mount.js';
import { rootSVPS } from '../../modules/root.js';

export default (configs: MOUNT) => {
  const apache = setApache(configs);

  if (!apache) return [] as string[];

  const default_000 = `${rootSVPS}/resources/apache/virtual-host/000-default.conf`;

  const commands = [
    `echo "${sh.startTitle}Setting up Apache2${sh.endTitle}"`,
    'sudo apt-get update',
    'sudo apt-get install apache2 -y',
    'sudo mkdir -p /var/www',
    'sudo rm -rf /var/www/html',
    'sudo mkdir -p /var/www/host',
    `echo "${sh.startTitle}Setting up Rewrite Virtual Hosts${sh.endTitle}"`,
    `echo ${escapeQuotes(
      fs.readFileSync(normalize(default_000), 'utf-8')
    )} | sudo tee /etc/apache2/sites-available/000-default.conf`,
    'sudo a2enmod proxy proxy_http rewrite headers expires',
  ];

  if (!apache.accessFromIP) {
    const htaccess = `${rootSVPS}/resources/apache/html/.htaccess`;
    const _403 = `${rootSVPS}/resources/apache/html/403.html`;

    Object.assign(commands, [
      ...commands,
      ...[
        `echo ${escapeQuotes(
          fs.readFileSync(normalize(htaccess), 'utf-8')
        )} | sudo tee /var/www/host/.htaccess`,
        `echo ${escapeQuotes(
          fs.readFileSync(normalize(_403), 'utf-8')
        )} | sudo tee /var/www/host/403.html`,
        'sudo chmod 0755 /var/www/host',
      ],
    ]);
  }

  Object.assign(commands, [
    ...commands,
    'sudo systemctl restart apache2',
    'sudo systemctl reload apache2',
    sh.done,
  ]);

  return commands;
};
