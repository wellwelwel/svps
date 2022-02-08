const fs = require('fs');
const { normalize } = require('path');
const sh = require('../../modules/sh');
const { APACHE } = require(`${process.cwd()}/.svpsrc.js`);
const escapeQuotes = require('../../modules/escape-quotes');

module.exports = () => {

   const root_path = `${__dirname}../../../..`;
   const php_ini = `${root_path}/resources/php-resources/php.ini`;
   const modules = APACHE.modules;
   const deprecated = {

      8: [ 'json' ],
   };
   const version = APACHE['php-version'];
   const remove_deprecated = v => deprecated[v.toFixed()].forEach(m => {

      const index = modules.indexOf(m);

      if (index >= 0) modules.splice(index, 1);
   });

   if (version >= 8) remove_deprecated(version);

   return [

      `echo "${sh.startTitle}Setting up PHP${sh.endTitle}"`,
      'apt -y install software-properties-common',
      'add-apt-repository ppa:ondrej/php',
      `apt install -y php${version} php${version}-{${modules.join(',')}}`,
      'curl -sS https://getcomposer.org/installer -o composer-setup.php',
      'php composer-setup.php --install-dir=/usr/local/bin --filename=composer || true',
      `echo ${escapeQuotes(fs.readFileSync(normalize(php_ini), 'utf-8'))} | cat > /etc/php/${version}/cli/php.ini`,
      'systemctl restart apache2',
      sh.done,
   ];
};