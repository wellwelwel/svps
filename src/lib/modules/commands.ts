import { ACCESS } from '../types/acess.js';
import { STEPS } from '../types/steps.js';
import { svpsOptions } from '../types/svps.js';

import { catchExec, exec } from '../ssh.js';

import repair from '../tasks/steps/repair.js';
import reboot from '../tasks/steps/reboot.js';
import restartSSH from '../tasks/steps/users/restart-ssh.js';
import apt from '../tasks/steps/apt.js';
import firewall from '../tasks/steps/firewall.js';
import users from '../tasks/steps/users/index.js';
import certificate from '../tasks/steps/certificate.js';
import apache from '../tasks/steps/apache.js';
import docker from '../tasks/steps/docker.js';
import php from '../tasks/steps/php.js';
import node from '../tasks/steps/node.js';
import mysql from '../tasks/steps/mysql.js';
import crontab from '../tasks/steps/crontab.js';
import desktop from '../tasks/steps/deskop.js';

import { resourcesUpload } from './prepare-files.js';
import { rootSVPS } from './root.js';
import { setUsers } from './configs/users.js';
import { setAppendCommands } from './configs/append-commands.js';
import { setVerbose } from './configs/verbose.js';
import sh from './sh.js';

export const buildCommands = async (options: {
  commands: string[];
  steps: Required<STEPS>;
  host: ACCESS;
}) => {
  const { commands, steps, host } = options;

  for (const command of commands) {
    if (/^--restart-ssh$/.test(command)) {
      await restartSSH(host);
      continue;
    }

    if (/^--reboot$/.test(command)) {
      await reboot(steps, host);
      continue;
    }

    /** Ignore remote errors */
    if (/^--catch\s/.test(command)) {
      await catchExec(command.replace(/^--catch\s/, ''));
      continue;
    }

    await exec(command, host);
  }
};

export const setCommands = async (options: {
  host: ACCESS;
  configs: svpsOptions;
  steps: Required<STEPS>;
}) => {
  const { configs, host, steps } = options;

  const appendCommands = setAppendCommands(configs, steps);
  const configUsers = setUsers(configs, steps);
  const verbose = setVerbose(configs);

  const initialCommands = [
    /** Resolving `dpkg` and `apt` */
    'rm -rf /var/lib/apt/lists/lock',
    'rm -rf /var/lib/dpkg/lock',
    'rm -rf /var/lib/dpkg/lock-frontend',
    'rm -rf /var/cache/apt/archives/lock',
    'echo "Y" | dpkg --configure -a',
    'echo "debconf debconf/frontend select Noninteractive" | debconf-set-selections',
  ];

  if (verbose) console.log('# Initial Commands', initialCommands);

  await buildCommands({ commands: initialCommands, host, steps });

  if (steps.repair) {
    const commands = repair();

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.apt) {
    const commands = apt();

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.firewall) {
    const commands = firewall(configs, steps, host);

    if (verbose) console.log('# Repair', commands);

    await buildCommands({
      commands,
      host,
      steps,
    });
  }

  if (steps.users) {
    const commands = users(configs, steps);

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.certificate) {
    const commands = certificate(configs, steps);

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.apache) {
    const commands = apache(configs, steps);

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.docker) {
    const commands = docker(steps);

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.php) {
    const commands = php(configs, steps);

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.node) {
    const commands = node(configs, steps);

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.mysql) {
    const commands = mysql(configs, steps);

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.crontab) {
    const commands = crontab(configs, steps, host);

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.desktop) {
    /** Upload first-time XRDP scriptfor each user */
    if (configUsers && configUsers?.length > 0) {
      for (const user of configUsers) {
        await resourcesUpload({
          local: `${rootSVPS}/resources/desktop/.xsessionrc`,
          remote: `/home/${user.name}/.xsessionrc`,
        });

        await catchExec(`chown ${user.name} /home/${user.name}/.xsessionrc`);
        await catchExec(`chmod +x /home/${user.name}/.xsessionrc`);
      }
    }

    const commands = desktop(steps);

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }

  if (steps.appendCommands && appendCommands) {
    const commands = [
      `echo "${sh.startTitle}Appending your personal commands${sh.endTitle}"`,
      ...(await appendCommands()),
      sh.done,
    ];

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, host, steps });
  }
};
