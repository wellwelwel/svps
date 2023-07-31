import { importFile } from '../../modules/prepare-files.js';
import { VIRTUAL_HOST } from '../../types/virtual-hosts.js';
import { escapeQuotes } from '../../modules/escape-quotes.js';
import { rootSVPS } from '../../modules/root.js';

export const createProxy = (virtualHost: VIRTUAL_HOST): string[] => {
  const proxyPath = `${rootSVPS}/resources/apache/virtual-host`;
  const domain = String(virtualHost.domain).trim();
  const port = String(virtualHost.port);
  const www = virtualHost?.www || false;

  const commands: string[] = [];

  const proxy = importFile(`${proxyPath}/${www ? 'proxy-www' : 'proxy'}.conf`)
    .replace(/{!DOMAIN}/gm, domain)
    .replace(/{!PORT}/gm, port);

  Object.assign(commands, [
    ...commands,
    `echo ${escapeQuotes(
      proxy
    )} | cat > /etc/apache2/sites-available/${domain}.conf`,
    `if a2ensite -q ${domain}; then echo 'Virtual Host for "${domain}" enabled'; fi`,
    'systemctl reload apache2',
  ]);

  return commands;
};
