const fs = require('fs');
const { normalize } = require('path');
const sh = require('../../modules/sh');
const { VPS } = require(`${process.cwd()}/.svpsrc.js`);
const escapeQuotes = require('../../modules/escape-quotes');

module.exports = () => {

   if (!VPS?.crontab?.path) return [];

   const crons = escapeQuotes(fs.readFileSync(normalize(VPS.crontab.path), 'utf-8'));
   const sub_steps = [

      `echo "${sh.startTitle}Setting up cron jobs for '${VPS.username}'${sh.endTitle}"`,
      `echo ${crons} | ${VPS?.crontab?.append ? 'tee -a' : 'cat >' } /var/spool/cron/crontabs/${VPS.username}`,
   ];

   if (!VPS?.crontab?.append) sub_steps.push(`echo ${crons}`);

   sub_steps.push(sh.done);

   return sub_steps;
};