import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import escapeQuotes from '../../modules/escape-quotes.js';
import { VPS as VPS } from '../../index.js';
import { CRONTAB } from '../../modules/configs.js';

export default (VPS: VPS) => {
   if (!CRONTAB || !CRONTAB?.path) return [] as string[];

   const append = CRONTAB?.append || false;
   const crons = escapeQuotes(fs.readFileSync(normalize(CRONTAB.path), 'utf-8'));
   const sub_steps = [
      `echo "${sh.startTitle}Setting up cron jobs for '${VPS.username}'${sh.endTitle}"`,
      `echo ${crons} | ${append ? 'tee -a' : 'cat >'} /var/spool/cron/crontabs/${VPS.username}`,
   ];

   if (!append) sub_steps.push(`echo ${crons}`);

   sub_steps.push(sh.done);

   return sub_steps;
};
