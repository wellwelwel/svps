import { ACCESS } from '../types/acess.js';
import { MOUNT } from '../types/mount.js';

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
import { setVerbose } from './configs/verbose.js';

export const buildCommands = async (options: {
  commands: string[];
  access: ACCESS;
}) => {
  const { commands, access } = options;

  for (const command of commands) {
    if (/^--restart-ssh$/.test(command)) {
      await restartSSH(access);
      continue;
    }

    if (/^--reboot$/.test(command)) {
      await reboot(access);
      continue;
    }

    /** Ignore remote errors */
    if (/^--catch\s/.test(command)) {
      await catchExec(command.replace(/^--catch\s/, ''));
      continue;
    }

    await exec(command, access);
  }
};

export const setCommands = async (options: {
  access: ACCESS;
  configs: MOUNT;
}) => {
  const { configs, access } = options;

  const configUsers = setUsers(configs);
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

  if (verbose) console.log('# Initial Commands', '\n', initialCommands);

  await buildCommands({ commands: initialCommands, access });

  if (configs.repair) {
    const commands = repair();

    if (verbose) console.log('# Repair', commands);

    await buildCommands({ commands, access });
  }

  if (configs.apt) {
    const commands = apt();

    if (verbose) console.log('# Repair', '\n', commands);

    await buildCommands({ commands, access });
  }

  if (configs.firewall) {
    const commands = firewall(configs, access);

    if (verbose) console.log('# Firewall', '\n', commands);

    await buildCommands({
      commands,
      access,
    });
  }

  if (configs.users) {
    const commands = users(configs);

    if (verbose) console.log('# Users', '\n', commands);

    await buildCommands({ commands, access });
  }

  if (configs.certificate) {
    const commands = certificate(configs);

    if (verbose) console.log('# RSA Certificate', '\n', commands);

    await buildCommands({ commands, access });
  }

  if (configs.apache) {
    const commands = apache(configs);

    if (verbose) console.log('# Apache2', '\n', commands);

    await buildCommands({ commands, access });
  }

  if (configs.docker) {
    const commands = docker(configs);

    if (verbose) console.log('# Docker', '\n', commands);

    await buildCommands({ commands, access });
  }

  if (configs.php) {
    const commands = php(configs);

    if (verbose) console.log('# PHP', '\n', commands);

    await buildCommands({ commands, access });
  }

  if (configs.node) {
    const commands = node(configs);

    if (verbose) console.log('# Node.js', '\n', commands);

    await buildCommands({ commands, access });
  }

  if (configs.mysql) {
    const commands = mysql(configs);

    if (verbose) console.log('# MySQL', '\n', commands);

    await buildCommands({ commands, access });
  }

  if (configs.crontab) {
    const commands = crontab(configs, access);

    if (verbose) console.log('# Crontab', '\n', commands);

    await buildCommands({ commands, access });
  }

  if (configs.desktop) {
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

    const commands = desktop(configs);

    if (verbose) console.log('# Remote Desktop Protocol (RDP)', '\n', commands);

    await buildCommands({ commands, access });
  }
};
