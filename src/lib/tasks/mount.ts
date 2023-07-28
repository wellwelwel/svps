// Get user options in ".svpsrc.js"
import { access } from '../modules/configs/access.js';
import { steps } from '../modules/configs/steps.js';
import { appendCommands } from '../modules/configs/append-commands.js';
import { verbose } from '../modules/configs/verbose.js';
import sh from '../modules/sh.js';

// Get ssh
import { catchExec, connect, end, exec } from '../ssh.js';

// Get steps
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

try {
  let errors = false;

  const hosts = access;

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

    if (steps.repair) {
      Object.assign(commands, [...commands, ...repair()]);
    }

    if (steps.apt) {
      Object.assign(commands, [...commands, ...apt()]);
    }

    if (steps.firewall) {
      Object.assign(commands, [...commands, ...firewall(host)]);
    }

    if (steps.users) {
      Object.assign(commands, [...commands, ...users()]);
    }

    if (steps.certificate) {
      Object.assign(commands, [...commands, ...certificate()]);
    }

    if (steps.apache) {
      Object.assign(commands, [...commands, ...apache()]);
    }

    if (steps.docker) {
      Object.assign(commands, [...commands, ...docker()]);
    }

    if (steps.php) {
      Object.assign(commands, [...commands, ...php()]);
    }

    if (steps.node) {
      Object.assign(commands, [...commands, ...node()]);
    }

    if (steps.mysql) {
      Object.assign(commands, [...commands, ...mysql()]);
    }

    if (steps.crontab) {
      Object.assign(commands, [...commands, ...crontab(host)]);
    }

    if (steps.desktop) {
      Object.assign(commands, [...commands, ...desktop()]);
    }

    if (steps.appendCommands) {
      appendCommands &&
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

      for (const command of commands) {
        if (/^--restart-ssh$/.test(command)) {
          await restartSSH(host);
          continue;
        }

        if (/^--reboot$/.test(command)) {
          await reboot(host);
          continue;
        }

        if (/^--catch\s/.test(command)) {
          await catchExec(command.replace(/^--catch\s/, ''));
          continue;
        }

        await exec(command, host);
      }

      await exec('history -c', host);

      if (steps.reboot) await reboot(host);

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
  process.exit(!errors ? 0 : 1);
} catch (error) {
  console.log(`\x1b[0m\x1b[1m\x1b[31m✖︎`, error, '\x1b[0m\n');
  process.exit(1);
}
