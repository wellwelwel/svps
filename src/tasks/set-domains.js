const fs = require('fs');
const { normalize, basename } = require('path');
const SSH = require('../modules/set-ssh');
const escapeQuotes = require('../modules/escape-quotes');
const sh = require('../modules/sh');
const { VPS, APACHE, DOMAINS, OPTIONS, NODE } = require(`${process.cwd()}/.svpsrc.js`);
const axios = require('axios');

const vh = async () => {

   console.log(`${sh.startTitle}Setting up domains in "${DOMAINS}"${sh.endTitle}\n`);

   const fileNormalize = path => fs.readFileSync(normalize(path), 'utf-8');

   try {

      const root_path = `${__dirname}../../..`;
      const vh_path = '/resources/virtual-host/';
      const list_domains = /http/gim.test(DOMAINS) ? (await axios.get(DOMAINS)).data : JSON.parse(fs.readFileSync(DOMAINS, 'utf-8'));

      if (!list_domains || list_domains.length <= 0) throw(`Failed to find ${DOMAINS}`);

      const domains = [...new Set(list_domains)];
      const commands = [];

      for (const full_domain of domains) {

         const split_domain = full_domain.split(':');
         const domain = split_domain[0] || full_domain;
         const isProxy = /:/gm.test(full_domain);
         const port = isProxy ? split_domain[1] : '';
         const default_file = fileNormalize(APACHE['default-page']);

         const virtual_host = () => fileNormalize(`${root_path}${vh_path}${isProxy ? 'proxy.conf' : 'vh.conf'}`).replace(/{!DOMAIN}/gm, domain).replace(/{!PORT}/gm, port);

         Object.assign(commands, [

            ...commands,
            `if ! ls /var/www/${domain}/public_html &> /dev/null; then mkdir -p /var/www/${domain}/public_html; fi`,
            `if ! ls /var/www/${domain}/public_html/${basename(APACHE['default-page'])} &> /dev/null; then echo ${escapeQuotes(default_file)} | cat > /var/www/${domain}/public_html/${basename(APACHE['default-page'])}; fi`,
            `if ! ls /etc/apache2/sites-available/${domain}.conf &> /dev/null; then echo ${escapeQuotes(virtual_host())} | cat > /etc/apache2/sites-available/${domain}.conf; fi`,
            `if a2ensite -q ${domain}; then echo "\x1b[33m> \x1b[0m${domain} already enabled"; fi`,
         ]);

         if (APACHE['auto-assigin-www']) {

            const virtual_host_www = () => fileNormalize(`${root_path}${vh_path}${isProxy ? 'proxy-www.conf' : 'vh-www.conf'}`).replace(/{!DOMAIN}/gm, domain).replace(/{!PORT}/gm, port);

            Object.assign(commands, [

               ...commands,
               `if ! ls /etc/apache2/sites-available/www.${domain}.conf &> /dev/null; then echo ${escapeQuotes(virtual_host_www())} | cat > /etc/apache2/sites-available/www.${domain}.conf; fi`,
               `if a2ensite -q www.${domain}; then echo "\x1b[33m> \x1b[0mwww.${domain} already enabled"; fi`,
            ]);
         }

         if (!isProxy) continue;

         /* Creates app.js */
         const app_js = fileNormalize(`${root_path}/resources/node/app.js`).replace(/'{!PORT}'/gm, port);

         Object.assign(commands, [

            ...commands,
            `if ! ls /var/www/${domain}/app.js &> /dev/null; then echo ${escapeQuotes(app_js)} | cat > /var/www/${domain}/app.js && (pm2 delete ${domain} || true) && pm2 start /var/www/${domain}/app.js --name ${domain} --watch --ignore-watch="node_modules"; fi`,
            'pm2 save',
         ]);
      }

      commands.push('systemctl reload apache2');

      try {

         if (OPTIONS?.verbose) console.log(commands, '\n');
         await SSH(VPS, commands);

         return true;
      }
      catch (error) {

         console.log(`\x1b[0m${error}`);
         return false;
      }
   }
   catch (error) {

      console.log(`\x1b[0m${error}`);
      return false;
   }
};

/* Run */
(async () => console.log(`\n\x1b[33m> \x1b[0m${await vh() ? 'Success' : 'Fail'}\n`))();