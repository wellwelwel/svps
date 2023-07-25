import { input } from '../modules/configs/index.js';
import { connect, catchExec, end } from '../ssh.js';
import sh from '../modules/sh.js';
import { BASIC_VIRTUAL_HOST, VIRTUAL_HOST } from '../types/virtual-hosts.js';
import { createBasicVirtualHost, isBasic } from './virtual-host/basic.js';
import { access } from '../modules/configs/access.js';
import { verbose } from '../modules/configs/verbose.js';
import { createProxy } from './virtual-host/apache.js';
import { pastDomains, writeLogs } from './virtual-host/logs.js';

try {
  const virtualHosts = input.virtualHosts;
  const basicVirtualHosts: BASIC_VIRTUAL_HOST[] = [];
  const advancedVirtualHosts: VIRTUAL_HOST[] = [];
  const invalidVirtualHosts: VIRTUAL_HOST[] = [];
  const deployedVirtualHosts: VIRTUAL_HOST[] = [];
  const commands = [
    'echo "debconf debconf/frontend select Noninteractive" | debconf-set-selections',
    'mkdir -p /var/containers/images /var/containers/compositions /var/containers/domains /var/containers/databases',
    'chmod -R 0750 /var/containers',
  ];

  if (!virtualHosts) {
    console.log(
      `\n\x1b[0m\x1b[1m\x1b[32m✔︎ No domain has been set up\x1b[0m\n`
    );
    process.exit(0);
  }

  /** Preparing Virtual Hosts */
  virtualHosts.forEach((virtualHost) => {
    if (typeof virtualHost === 'object' && !('server' in virtualHost))
      advancedVirtualHosts.push(virtualHost);
    else if (isBasic(virtualHost)) basicVirtualHosts.push(virtualHost);
    else invalidVirtualHosts.push(virtualHost);
  });

  /** Wrong Virtual Hosts */
  if (invalidVirtualHosts.length > 0)
    throw `Invalid Virtual Hosts: ${invalidVirtualHosts
      .map((vh) => `\n  - ${vh.domain}`)
      .join('')}`;

  if (pastDomains.length > 0) {
    console.log(
      `\n\x1b[22m\x1b[36m\x1b[1m▸ Skipping already created domains \x1b[2m\x1b[3m(./.svps/domains.json)\x1b[0m`
    );
    console.log(
      pastDomains.map((domain) => ` \x1b[36m⌙\x1b[0m ${domain}`).join('\n')
    );
  }

  /** Advanced (Manual) Virtual Hosts */
  if (advancedVirtualHosts.length > 0) {
    advancedVirtualHosts.forEach((virtualHost) => {
      if (pastDomains.includes(virtualHost.domain)) return;

      deployedVirtualHosts.push(virtualHost);

      Object.assign(commands, [
        ...commands,
        `echo "${sh.startTitle}Proxy Port: ${virtualHost.domain} on port ${virtualHost.port}${sh.endTitle}"`,
        ...createProxy(virtualHost),
        'systemctl reload apache2',
        sh.done,
      ]);
    });
    commands.push('systemctl restart apache2');
  }

  /** Basic Virtual Hosts Servers */
  if (basicVirtualHosts.length > 0) {
    basicVirtualHosts.forEach((virtualHost) => {
      if (pastDomains.includes(virtualHost.domain)) return;

      deployedVirtualHosts.push(virtualHost);

      Object.assign(commands, [
        ...commands,
        ...createBasicVirtualHost(virtualHost),
      ]);
    });
    commands.push('systemctl restart apache2');
  }

  if (verbose) console.log(commands, '\n');

  const hosts = access;

  if (deployedVirtualHosts.length === 0)
    console.log(
      `\n\x1b[0m\x1b[1m\x1b[32m✔︎ No new domain has been set up\x1b[0m`
    );
  else {
    for (const host of hosts) {
      console.log(
        `\n\x1b[22m\x1b[36m\x1b[1m⦿ Setting up Virtual Hosts: ${host.username}@${host.host}\x1b[0m`
      );

      await connect(host);
      for (const command of commands) await catchExec(command);
      await catchExec('history -c');
      await end();
    }

    writeLogs(deployedVirtualHosts);
  }

  console.log(`\n\x1b[0m\x1b[1m\x1b[32m✔︎ Success\x1b[0m\n`);
  process.exit(0);
} catch (error) {
  console.log(`\x1b[0m\x1b[1m\n\x1b[31m✖︎ Fail\x1b[0m\n  ${error}`);
  process.exit(1);
}
