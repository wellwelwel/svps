// User options from ".svpsrc.js"
import { setConfigs } from '../modules/configs/index.js';
import { setSteps } from '../modules/configs/steps.js';
import { uploads } from '../modules/configs/uploads.js';
import { createBasicVirtualHost, isBasic } from './virtual-host/basic.js';
import { createProxy } from './virtual-host/apache.js';
import { pastDomains, writeLogs } from './virtual-host/logs.js';
import { setCommands, buildCommands } from '../modules/commands.js';
import sh from '../modules/sh.js';

// SSH
import { catchExec, connect, end, exec } from '../ssh.js';

import reboot from './steps/reboot.js';
import { ACCESS } from '../types/acess.js';
import { VIRTUAL_HOST, BASIC_VIRTUAL_HOST } from '../types/virtual-hosts.js';
import { UPLOAD } from '../types/upload.js';

const createSVPS = () => {
  let connected: boolean = false;
  let configPath: string;
  let access: ACCESS;

  const createConnection = async (host: ACCESS) => {
    await connect(host);

    /** Just checking the connection */
    await catchExec('sleep 1');

    connected = true;
  };

  return class SVPS {
    constructor(options: {
      /** Set the SSH access for one or more VPS */
      access: ACCESS;
      /** Set a custom path for _svpsrc.js_ */
      configPath?: string;
    }) {
      access = options.access;
      configPath = options.configPath || '.svpsrc.js';
    }

    /**
     *
     * Prepare and execute the command queue.
     *
     * ---
     *
     * Is *.svpsrc.js* missing? Simply run `npx svps create` 🧙🏻
     */
    mount = async () => {
      try {
        const configs = await setConfigs(configPath);
        const steps = setSteps(configs);

        console.log(
          `\x1b[22m\x1b[36m\x1b[1m⦿ ${access.username}@${access.host}\x1b[0m`
        );

        if (!connected) await createConnection(access);

        await setCommands({
          configs,
          access,
          steps,
        });

        /** Clean up */
        await exec('history -c', access);

        if (steps.reboot) await reboot(access);

        console.log('\x1b[0m');

        console.log(`\x1b[0m\x1b[1m\x1b[32m✔︎ Success\x1b[0m\n`);

        return true;
      } catch (error) {
        if (error instanceof Error)
          throw new Error(
            `\x1b[0m\x1b[1m\x1b[31m✖︎ ${error.message} \x1b[0m\n`
          );
      }
    };

    /**
     *
     * Create the Virtual Hosts
     *
     * ---
     *
     * Is *.svpsrc.js* missing? Simply run `npx svps create` 🧙🏻
     */
    createVirtualHosts = async (
      /**
       * The **`virtualHosts`** is used with `npx svps set domains`.
       *
       * It requires these steps from `npx svps mount`:
       *
       * ---
       *
       * Required:
       *   - `apache` (to proxy the virtual ports to `80`)
       *
       * Optionals:
       *   - `docker` (required to automatically create the **Basic Servers**)
       */
      virtualHosts: VIRTUAL_HOST[]
    ) => {
      try {
        const basicVirtualHosts: BASIC_VIRTUAL_HOST[] = [];
        const advancedVirtualHosts: VIRTUAL_HOST[] = [];
        const invalidVirtualHosts: VIRTUAL_HOST[] = [];
        const deployedVirtualHosts: VIRTUAL_HOST[] = [];
        const commands = [
          'echo "debconf debconf/frontend select Noninteractive" | debconf-set-selections',
          'mkdir -p /var/containers/images /var/containers/compositions /var/containers/domains /var/containers/databases',
          'chmod 0755 /var/containers',
          'chmod 0700 /var/containers/images',
          'chmod 0700 /var/containers/compositions',
          'chmod 0750 /var/containers/databases',
          'chmod 0755 /var/containers/domains',
        ];

        if (!virtualHosts) {
          console.log(
            `\n\x1b[0m\x1b[1m\x1b[32m✔︎ No domain has been set up\x1b[0m\n`
          );

          return true;
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
            pastDomains
              .map((domain) => ` \x1b[36m⌙\x1b[0m ${domain}`)
              .join('\n')
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

        if (deployedVirtualHosts.length === 0)
          console.log(
            `\n\x1b[0m\x1b[1m\x1b[32m✔︎ No new domain has been set up\x1b[0m`
          );
        else {
          console.log(
            `\n\x1b[22m\x1b[36m\x1b[1m⦿ Setting up Virtual Hosts: ${access.username}@${access.host}\x1b[0m`
          );

          if (!connected) await createConnection(access);

          for (const command of commands) await catchExec(command);
          await catchExec('history -c');

          writeLogs(deployedVirtualHosts);
        }

        console.log(`\n\x1b[0m\x1b[1m\x1b[32m✔︎ Success\x1b[0m\n`);
        return true;
      } catch (error) {
        if (error instanceof Error)
          throw new Error(
            `\x1b[0m\x1b[1m\x1b[31m✖︎ ${error.message} \x1b[0m\n`
          );
      }
    };

    /**
     * Mount and execute your commands
     *
     * ---
     *
     * Special commands:
     * - `['--reboot']`
     * - `['--restart-ssh']`
     * - `['--catch _your_command_']`
     */
    commands = async (commandsQueue: string[]) => {
      try {
        console.log(
          `\x1b[22m\x1b[36m\x1b[1m⦿ ${access.username}@${access.host}\x1b[0m`
        );

        if (!connected) await createConnection(access);

        const commands = [
          `echo "${sh.startTitle}Personal commands${sh.endTitle}"`,
          ...commandsQueue,
          sh.done,
        ];

        await buildCommands({ commands, access });

        /** Clean up */
        await exec('history -c', access);
        console.log('\x1b[0m');

        return true;
      } catch (error) {
        if (error instanceof Error)
          throw new Error(
            `\x1b[0m\x1b[1m\x1b[31m✖︎ ${error.message} \x1b[0m\n`
          );
      }
    };

    /**
     *
     * Upload files and directories.
     *
     * ---
     *
     * Is *.svpsrc.js* missing? Simply run `npx svps create` 🧙🏻
     */
    upload = async (paths: UPLOAD[]) => {
      try {
        console.log(
          `\x1b[22m\x1b[36m\x1b[1m⦿ ${access.username}@${access.host}\x1b[0m`
        );

        if (!connected) await createConnection(access);

        /** Uploading files and directories */
        await uploads(paths);

        console.log(`\x1b[0m\x1b[1m\x1b[32m✔︎ Success\x1b[0m\n`);

        return true;
      } catch (error) {
        if (error instanceof Error)
          throw new Error(
            `\x1b[0m\x1b[1m\x1b[31m✖︎ ${error.message} \x1b[0m\n`
          );
      }
    };

    end = end;
  };
};

export const SVPS = createSVPS();
