const fs = require('fs');
const { normalize, basename } = require('path');
const SSH = require('../modules/set-ssh');
const escapeQuotes = require('../modules/escape-quotes');
const sh = require('../modules/sh');
const { VPS, APACHE, DOMAINS, OPTIONS } = require(`${process.cwd()}/.svpsrc.js`);
const axios = require('axios');

const vh = async () => {

   console.clear();
   console.log(`${sh.startTitle}Setting up domains in "${DOMAINS}"${sh.endTitle}\n`);

   try {

      const root_path = `${__dirname}../../..`;
      const list_domains = /http/gim.test(DOMAINS) ? (await axios.get(DOMAINS)).data : JSON.parse(fs.readFileSync(DOMAINS, 'utf-8'));

      if (!list_domains || list_domains.length <= 0) throw(`Failed to find ${DOMAINS}`);

      const domains = [...new Set(list_domains)];
      const commands = [];

      for (const domain of domains) {

         const virtual_host = fs.readFileSync(normalize(`${root_path}/resources/virtual-host/source-vh.conf`), 'utf-8').replace(/{!DOMAIN}/gm, domain);
         const default_file = fs.readFileSync(normalize(APACHE['default-page']), 'utf-8');

         Object.assign(commands, [

            ...commands,
            `if ! ls /var/www/${domain}/public_html >/dev/null; then mkdir -p /var/www/${domain}/public_html; fi`,
            `if ! ls /var/www/${domain}/public_html/${basename(APACHE['default-page'])} >/dev/null; then echo ${escapeQuotes(default_file)} | cat > /var/www/${domain}/public_html/${basename(APACHE['default-page'])}; fi`,
            `if ! ls /etc/apache2/sites-available/${domain}.conf >/dev/null; then echo ${escapeQuotes(virtual_host)} | cat > /etc/apache2/sites-available/${domain}.conf; fi`,
            `if a2ensite -q ${domain}; then echo "\x1b[33m> \x1b[0m${domain} already enabled"; fi`,
         ]);

         if (APACHE['auto-assigin-www']) {

            const virtual_host_www = fs.readFileSync(normalize(`${root_path}/resources/virtual-host/source-vh-www.conf`), 'utf-8').replace(/{!DOMAIN}/gm, domain);

            Object.assign(commands, [

               ...commands,
               `if ! ls /etc/apache2/sites-available/www.${domain}.conf >/dev/null; then echo ${escapeQuotes(virtual_host_www)} | cat > /etc/apache2/sites-available/www.${domain}.conf; fi`,
               `if a2ensite -q www.${domain}; then echo "\x1b[33m> \x1b[0mwww.${domain} already enabled"; fi`,
            ]);
         }
      }

      commands.push('systemctl reload apache2');

      try {

         if (OPTIONS?.verbose) console.log(commands, '\n');
         await SSH(VPS, commands);

         return true;
      }
      catch (error) {

         return false;
      }
   }
   catch (error) {

      console.log(error.message);
      return false;
   }
};

/* Run */
(async () => console.log(`\n\x1b[33m> \x1b[0m${await vh() ? 'Success' : 'Fail'}\n`))();