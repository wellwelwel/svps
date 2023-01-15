import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import escapeQuotes from '../../modules/escape-quotes.js';
import { APACHE } from '../../modules/configs.js';
import { __dirname } from '../../modules/root.js';

export default () => {
   if (!APACHE) return [] as string[];

   const php_ini = `${__dirname}/resources/php-resources/php.ini`;
   const modules = APACHE.modules;
   const deprecated: { [key: number]: string[] } = {
      8: ['json'],
   };
   const version = APACHE['php-version'];

   const remove_deprecated = (version: number): void =>
      deprecated?.[+version.toFixed()].forEach((module: string) => {
         const index = modules.indexOf(module);

         if (index >= 0) modules.splice(index, 1);
      });

   if (version >= 8) remove_deprecated(version);

   return [
      `echo "${sh.startTitle}Setting up PHP${sh.endTitle}"`,
      'apt-get -y install software-properties-common',
      'add-apt-repository ppa:ondrej/php',
      `apt-get install -y php${version} php${version}-{${modules.join(',')}}`,
      'curl -sS https://getcomposer.org/installer -o composer-setup.php',
      'php composer-setup.php --install-dir=/usr/local/bin --filename=composer || true',
      `echo ${escapeQuotes(fs.readFileSync(normalize(php_ini), 'utf-8'))} | cat > /etc/php/${version}/cli/php.ini`,
      'systemctl restart apache2',
      sh.done,
   ];
};
