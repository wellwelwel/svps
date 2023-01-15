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

const mount = async () => {
   const commands: string[] = [];
   const { steps } = OPTIONS;

   steps.repare && Object.assign(commands, [...commands, ...repare()]);
   steps.apt && Object.assign(commands, [...commands, ...apt()]);
   steps.apache && Object.assign(commands, [...commands, ...(await apache())]);
   steps.firewall && Object.assign(commands, [...commands, ...firewall()]);
   steps.ftp && Object.assign(commands, [...commands, ...ftp()]);
   steps.vh && Object.assign(commands, [...commands, ...vh()]);
   steps.php && Object.assign(commands, [...commands, ...php()]);
   steps.node && Object.assign(commands, [...commands, ...node()]);
   steps.mysql && Object.assign(commands, [...commands, ...mysql()]);
   steps.crontab && Object.assign(commands, [...commands, ...crontab()]);
   steps.user && Object.assign(commands, [...commands, ...APPEND_COMMANDS()]);

   if (OPTIONS?.verbose) console.log(commands, '\n');
   console.log(`\x1b[32m${VPS.username}@${VPS.host} > \x1b[0m`, '\x1b[3m');

   try {
      await connect(VPS);
      for (const command of commands) await exec(command);
      await exec('history -c');
      steps.reboot && (await reboot());
      await end();

      console.log('\x1b[0m');
      return true;
   } catch (error) {
      console.log(`\x1b[0m${error}`);
      return false;
   }
};

const result = await mount();

console.log(`\x1b[33m> \x1b[0m${result ? 'Success' : 'Fail'}\n`);
process.exit(result ? 0 : 1);
