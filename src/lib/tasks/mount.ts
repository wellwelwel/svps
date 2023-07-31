// User options from ".svpsrc.js"
import { setConfigs } from '../modules/configs/index.js';
import { setAccess } from '../modules/configs/access.js';
import { setSteps } from '../modules/configs/steps.js';
import { uploads } from '../modules/configs/uploads.js';
import { setUsers } from '../modules/configs/users.js';
import { setAppendCommands } from '../modules/configs/append-commands.js';
import { setVerbose } from '../modules/configs/verbose.js';
import sh from '../modules/sh.js';

// SSH
import { catchExec, connect, end, exec } from '../ssh.js';

// Steps
import repair from './steps/repair.js';
import apt from './steps/apt.js';
import firewall from './steps/firewall.js';
import users from './steps/users/index.js';
import restartSSH from './steps/users/restart-ssh.js';
import certificate from './steps/certificate.js';
import apache from './steps/apache.js';
import docker from './steps/docker.js';
import php from './steps/php.js';
import node from './steps/node.js';
import mysql from './steps/mysql.js';
import crontab from './steps/crontab.js';
import desktop from './steps/deskop.js';
import reboot from './steps/reboot.js';
import { resourcesUpload } from '../modules/prepare-files.js';
import { rootSVPS } from '../modules/root.js';

/**
 *
 * Prepare the command queue, upload the files and directories and execute the commands.
 *
 * ---
 *
 * Is *.svpsrc.js* missing? Simply run `npx svps create` 🧙🏻
 */
export const mount = async (options?: {
  /** Set a custom path to `.svpsrc.js` */
  configPath?: string;
}): Promise<true | never> => {
  try {
    const configs = await setConfigs(options?.configPath || '.svpsrc.js');

    const steps = setSteps(configs);
    const appendCommands = setAppendCommands(configs);
    const configUsers = setUsers(configs);
    const verbose = setVerbose(configs);
    const hosts = setAccess(configs);

    let errors = false;

    for (const host of hosts) {
      console.log(
        `\x1b[22m\x1b[36m\x1b[1m⦿ ${host.username}@${host.host}\x1b[0m`
      );

      const commands = [
        /** Resolving `dpkg` and `apt` */
        'rm -rf /var/lib/apt/lists/lock',
        'rm -rf /var/lib/dpkg/lock',
        'rm -rf /var/lib/dpkg/lock-frontend',
        'rm -rf /var/cache/apt/archives/lock',
        'echo "Y" | dpkg --configure -a',
        'echo "debconf debconf/frontend select Noninteractive" | debconf-set-selections',
      ];

      if (steps.repair) Object.assign(commands, [...commands, ...repair()]);

      if (steps.apt) Object.assign(commands, [...commands, ...apt()]);

      if (steps.firewall)
        Object.assign(commands, [...commands, ...firewall(configs, host)]);

      if (steps.users)
        Object.assign(commands, [...commands, ...users(configs)]);

      if (steps.certificate)
        Object.assign(commands, [...commands, ...certificate(configs)]);

      if (steps.apache)
        Object.assign(commands, [...commands, ...apache(configs)]);

      if (steps.docker)
        Object.assign(commands, [...commands, ...docker(configs)]);

      if (steps.php) Object.assign(commands, [...commands, ...php(configs)]);

      if (steps.node) Object.assign(commands, [...commands, ...node(configs)]);

      if (steps.mysql)
        Object.assign(commands, [...commands, ...mysql(configs)]);

      if (steps.crontab)
        Object.assign(commands, [...commands, ...crontab(configs, host)]);

      if (steps.desktop)
        Object.assign(commands, [...commands, ...desktop(configs)]);

      if (steps.appendCommands && appendCommands) {
        Object.assign(commands, [
          ...commands,
          `echo "${sh.startTitle}Appending your personal commands${sh.endTitle}"`,
          ...(await appendCommands()),
          sh.done,
        ]);
      }

      if (verbose) console.log(commands, '\n');

      try {
        await connect(host);

        /** Just checking the connection */
        await catchExec('sleep 1');

        /** Uploading SVPS resources */
        {
          /** Desktop */
          if (configUsers && configUsers?.length > 0) {
            for (const user of configUsers) {
              await resourcesUpload({
                local: `${rootSVPS}/resources/desktop/.xsessionrc`,
                remote: `/home/${user.name}/.xsessionrc`,
              });

              await catchExec(
                `chown ${user.name} /home/${user.name}/.xsessionrc`
              );
              await catchExec(`chmod +x /home/${user.name}/.xsessionrc`);
            }
          }
        }

        /** Uploading files and directories */
        await uploads(configs);

        /** Building commands */
        for (const command of commands) {
          if (/^--restart-ssh$/.test(command)) {
            await restartSSH(host);
            continue;
          }

          if (/^--reboot$/.test(command)) {
            await reboot(configs, host);
            continue;
          }

          /** Ignore remote errors */
          if (/^--catch\s/.test(command)) {
            await catchExec(command.replace(/^--catch\s/, ''));
            continue;
          }

          await exec(command, host);
        }

        /** Clean up */
        await exec('history -c', host);

        if (steps.reboot) await reboot(configs, host);

        await end();

        console.log('\x1b[0m');
      } catch (error) {
        console.log(`\x1b[0m${error}`);
        errors = true;
        break;
      }
    }

    console.log(
      `\x1b[0m\x1b[1m${
        !errors ? '\x1b[32m✔︎ Success' : '\n\x1b[31m✖︎ Fail'
      }\x1b[0m\n`
    );

    if (errors) process.exit(1);

    return true;
  } catch (error) {
    console.log(`\x1b[0m\x1b[1m\x1b[31m✖︎`, error, '\x1b[0m\n');
    process.exit(1);
  }
};
