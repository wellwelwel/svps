import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import escapeQuotes from '../../modules/escape-quotes.js';
import { crontab } from '../../modules/configs/crontab.js';
import { steps } from '../../modules/configs/steps.js';
import { ACCESS } from '../../types/acess.js';

export default (VPS: ACCESS) => {
  if (!crontab || !steps.crontab) return [] as string[];

  const append = crontab.append || false;
  const crons = escapeQuotes(fs.readFileSync(normalize(crontab.path), 'utf-8'));
  const commands = [
    `echo "${sh.startTitle}Setting up cron jobs for '${VPS.username}'${sh.endTitle}"`,
    `echo ${crons} | ${append ? 'tee -a' : 'cat >'} /var/spool/cron/crontabs/${VPS.username}`,
  ];

  if (!append) commands.push(`echo ${crons}`);

  commands.push(sh.done);

  return commands;
};
