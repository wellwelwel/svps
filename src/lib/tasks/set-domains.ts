import fs from 'fs';
import { normalize, basename } from 'path';
import { connect, exec, end } from '../ssh.js';
import { __dirname } from '../modules/root.js';
import escapeQuotes from '../modules/escape-quotes.js';
import sh from '../modules/sh.js';
import { access } from '../modules/configs/access.js';
import { apache as APACHE } from '../modules/configs/apache.js';
import { domains as domainsFile } from '../modules/configs/domains.js';
import { verbose } from '../modules/configs/verbose.js';
import { APACHE as I_APACHE } from '../types/apache.js';

console.log(`${sh.startTitle}Setting up domains in "${domainsFile}"${sh.endTitle}\n`);

const apache = APACHE as Required<I_APACHE>;
const fileNormalize = (path: string) => fs.readFileSync(normalize(path), 'utf-8');

try {
  const vh_path = '/resources/apache/virtual-host/';
  const list_domains: string[] = JSON.parse(fs.readFileSync(domainsFile, 'utf-8'));

  if (!list_domains || list_domains.length <= 0) throw `Failed to find ${domainsFile}`;

  const domains = [...new Set(list_domains)];
  const commands: string[] = [];

  for (const full_domain of domains) {
    const split_domain = full_domain.split(':');
    const domain = split_domain[0] || full_domain;
    const isProxy = /:/gm.test(full_domain);
    const port = isProxy ? split_domain[1] : '';
    const default_file = fileNormalize(apache.defaultPage);

    const virtual_host = () =>
      fileNormalize(`${__dirname}${vh_path}${isProxy ? 'proxy.conf' : 'vh.conf'}`)
        .replace(/{!DOMAIN}/gm, domain)
        .replace(/{!PORT}/gm, port);

    Object.assign(commands, [
      ...commands,
      `if ! ls /var/www/${domain}/public_html &> /dev/null; then mkdir -p /var/www/${domain}/public_html; fi`,
      `if ! ls /var/www/${domain}/public_html/${basename(apache.defaultPage)} &> /dev/null; then echo ${escapeQuotes(
        default_file
      )} | cat > /var/www/${domain}/public_html/${basename(apache.defaultPage)}; fi`,
      `if ! ls /etc/apache2/sites-available/${domain}.conf &> /dev/null; then echo ${escapeQuotes(
        virtual_host()
      )} | cat > /etc/apache2/sites-available/${domain}.conf; fi`,
      `if a2ensite -q ${domain}; then echo "\x1b[33m> \x1b[0m${domain} already enabled"; fi`,
    ]);

    if (apache.www) {
      const virtual_host_www = () =>
        fileNormalize(`${__dirname}${vh_path}${isProxy ? 'proxy-www.conf' : 'vh-www.conf'}`)
          .replace(/{!DOMAIN}/gm, domain)
          .replace(/{!PORT}/gm, port);

      Object.assign(commands, [
        ...commands,
        `if ! ls /etc/apache2/sites-available/www.${domain}.conf &> /dev/null; then echo ${escapeQuotes(
          virtual_host_www()
        )} | cat > /etc/apache2/sites-available/www.${domain}.conf; fi`,
        `if a2ensite -q www.${domain}; then echo "\x1b[33m> \x1b[0mwww.${domain} already enabled"; fi`,
      ]);
    }

    commands.push('systemctl reload apache2');

    if (!isProxy) continue;

    /* Creates app.js */
    const app_js = fileNormalize(`${__dirname}/resources/node/app.js`).replace(/'{!PORT}'/gm, port);
    const pm2Start = `pm2 start -f /var/www/${domain}/app.js --name ${domain} --watch --ignore-watch="node_modules"`;

    Object.assign(commands, [
      ...commands,
      `if ! ls /var/www/${domain}/app.js &> /dev/null; then echo ${escapeQuotes(
        app_js
      )} | cat > /var/www/${domain}/app.js && (pm2 delete ${domain} &> /dev/null || true) && ${pm2Start}; fi`,
      `pm2 list | grep -q "${domain}" &> /dev/null || ${pm2Start}`,
      'pm2 update',
      'pm2 save',
    ]);
  }

  if (verbose) console.log(commands, '\n');

  const hosts = access;

  for (const host of hosts) {
    await connect(host);
    for (const command of commands) await exec(command, host);
    await exec('history -c', host);
    await end();
  }

  console.log(`\x1b[0m\x1b[1m\x1b[32m✔︎ Success\x1b[0m\n`);
  process.exit(0);
} catch (error) {
  console.log(`\x1b[0m\x1b[1m\n\x1b[31m✖︎ Fail\x1b[0m\n  ${error}`);
  process.exit(1);
}
