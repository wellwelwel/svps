'use strict';

import { VPS, OPTIONS, APPEND_COMMANDS } from '../modules/configs.js';
import { connect, end, exec } from '../ssh.js';
import repare from './steps/repare.js';
import apt from './steps/apt.js';
import apache from './steps/apache.js';
import firewall from './steps/firewall.js';
import ftp from './steps/ftp.js';
import vh from './steps/vh.js';
import php from './steps/php.js';
import node from './steps/node.js';
import mysql from './steps/mysql.js';
import crontab from './steps/crontab.js';
import reboot from './steps/reboot.js';
import { forceArray } from '../modules/force-array.js';

let errors = false;

const hosts = forceArray(VPS);
const { steps } = OPTIONS;

for (const host of hosts) {
   console.log(`\x1b[32m${host.username}@${host.host} > \x1b[0m`, '\x1b[3m');
   const commands: string[] = [];

   steps.repare && Object.assign(commands, [...commands, ...repare()]);
   steps.apt && Object.assign(commands, [...commands, ...apt()]);
   steps.apache && Object.assign(commands, [...commands, ...(await apache())]);
   steps.firewall && Object.assign(commands, [...commands, ...firewall()]);
   steps.ftp && Object.assign(commands, [...commands, ...ftp()]);
   steps.vh && Object.assign(commands, [...commands, ...vh()]);
   steps.php && Object.assign(commands, [...commands, ...php()]);
   steps.node && Object.assign(commands, [...commands, ...node()]);
   steps.mysql && Object.assign(commands, [...commands, ...mysql()]);
   steps.crontab && Object.assign(commands, [...commands, ...crontab(host)]);
   steps.user && Object.assign(commands, [...commands, ...APPEND_COMMANDS()]);

   if (OPTIONS?.verbose) console.log(commands, '\n');

   try {
      await connect(host);
      for (const command of commands) await exec(command, host);
      await exec('history -c', host);
      steps.reboot && (await reboot(host));
      await end();

      console.log('\x1b[0m');
   } catch (error) {
      console.log(`\x1b[0m${error}`);
      errors = true;
      break;
   }
}

console.log(`\x1b[0m\x1b[1m${!errors ? '\x1b[32m✔︎ Success' : '\n\x1b[31m✖︎ Fail'}\x1b[0m\n`);
process.exit(!errors ? 0 : 1);
