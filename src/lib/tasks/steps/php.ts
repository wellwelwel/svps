import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import escapeQuotes from '../../modules/escape-quotes.js';
import { php } from '../../modules/configs/php.js';
import { __dirname } from '../../modules/root.js';

export default () => {
   if (!php) return [] as string[];

   const php_ini = `${__dirname}/resources/php/php.ini`;
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
      'apt-get -y install software-properties-common',
      'add-apt-repository ppa:ondrej/php',
      `apt-get install -y php${version}`,
   ];

   if (php.modules.length > 0) commands.push(`apt-get install -y php${version}-{${modules.join(',')}}`);

   if (php.composer) {
      Object.assign(commands, [
         ...commands,
         ...[
            'curl -sS https://getcomposer.org/installer -o composer-setup.php',
            'php composer-setup.php --install-dir=/usr/local/bin --filename=composer || true',
         ],
      ]);
   }

   Object.assign(commands, [
      ...commands,
      ...[
         `echo ${escapeQuotes(fs.readFileSync(normalize(php_ini), 'utf-8'))} | cat > /etc/php/${version}/cli/php.ini`,
         'systemctl restart apache2',
         sh.done,
      ],
   ]);

   return commands;
};
