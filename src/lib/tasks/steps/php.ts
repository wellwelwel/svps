import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import { escapeQuotes } from '../../modules/escape-quotes.js';
import { setPHP } from '../../modules/configs/php.js';
import { MOUNT } from '../../types/mount.js';
import { rootSVPS } from '../../modules/root.js';

export default (configs: MOUNT) => {
  const php = setPHP(configs);

  if (!php) return [] as string[];

  const php_ini = `${rootSVPS}/resources/php/php.ini`;
  const modules = php.modules;
  const deprecated: { [key: number]: string[] } = {
    8: ['json'],
  };
  const version = php.version;

  const remove_deprecated = (version: number): void =>
    deprecated?.[+version.toFixed()].forEach((module: string) => {
      const index = modules.indexOf(module);

      if (index >= 0) modules.splice(index, 1);
    });

  if (version >= 8) remove_deprecated(version);

  const commands: string[] = [
    `echo "${sh.startTitle}Setting up PHP${sh.endTitle}"`,
    'sudo apt-get update',
    'sudo apt-get -y install acl software-properties-common',
    'sudo add-apt-repository ppa:ondrej/php',
    `sudo apt-get install -y php${version}`,
  ];

  if (php.modules.length > 0)
    commands.push(
      `sudo apt-get install -y php${version}-{${modules.join(',')}}`
    );

  if (php.composer) {
    Object.assign(commands, [
      ...commands,
      ...[
        'curl -sS https://getcomposer.org/installer -o composer-setup.php',
        'sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer || true',
      ],
    ]);
  }

  Object.assign(commands, [
    ...commands,
    ...[
      `echo ${escapeQuotes(
        fs.readFileSync(normalize(php_ini), 'utf-8')
      )} | sudo tee /etc/php/${version}/cli/php.ini > /dev/null`,
      'find /var/www/ -type d -exec sudo chmod 775 {} \\;',
      'find /var/www/ -type f -exec sudo chmod 664 {} \\;',
      'sudo setfacl -dR -m u:"www-data":rwx /var/www/ /tmp/',
      'sudo chown root:www-data /var/www',
      'sudo chmod 0755 /var/www',
      'sudo systemctl reload apache2',
      'sudo systemctl restart apache2',
      sh.done,
    ],
  ]);

  return commands;
};
