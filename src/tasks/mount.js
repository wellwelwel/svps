'use strict';

const SSH = require('../modules/set-ssh');
const { VPS, APPEND_COMMANDS, OPTIONS } = require(`${process.cwd()}/.svpsrc.js`);

const mount = async () => {

   console.clear();

   const commands = [];
   const steps = {

      repare: require('./steps/repare'),
      apt: require('./steps/apt'),
      apache: require('./steps/apache'),
      firewall: require('./steps/firewall'),
      ftp: require('./steps/ftp'),
      vh: require('./steps/vh'),
      php: require('./steps/php'),
      mysql: require('./steps/mysql'),
      crontab: require('./steps/crontab'),
      user: APPEND_COMMANDS,
      reboot: require('./steps/reboot'),
   };

   for (const step in OPTIONS.steps) {

      if (step === 'reboot') continue;

      if (OPTIONS.steps[step]) Object.assign(commands, [

         ...commands,
         ...steps[step](),
      ]);
   }

   Object.assign(commands, [

      ...commands,
      ...steps.user(),
   ]);

   if (OPTIONS?.verbose) console.log(commands, '\n'); // DEBUG
   console.log(`\x1b[32m${VPS.username}@${VPS.host} > \x1b[0m`, '\x1b[3m');

   try {

      await SSH(VPS, commands);
      if (OPTIONS.steps.reboot) await steps.reboot();

      console.log('\x1b[0m');
      return true;
   }
   catch (error) {

      console.log(`\x1b[0m${error}`);
      return false;
   }
};

/* Run */
(async () => console.log(`\x1b[33m> \x1b[0m${await mount() ? 'Success' : 'Fail'}\n`))();