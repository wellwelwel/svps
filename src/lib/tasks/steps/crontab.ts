import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import { escapeQuotes } from '../../modules/escape-quotes.js';
import { setCrontab } from '../../modules/configs/crontab.js';
import { ACCESS } from '../../types/acess.js';
import { svpsOptions } from '../../types/svps.js';
import { STEPS } from '../../types/steps.js';

export default (configs: svpsOptions, steps: Required<STEPS>, VPS: ACCESS) => {
  const crontab = setCrontab(configs, steps);

  if (!crontab || !steps.crontab) return [] as string[];

  const append = crontab.append || false;
  const crons = escapeQuotes(fs.readFileSync(normalize(crontab.path), 'utf-8'));
  const commands = [
    `echo "${sh.startTitle}Setting up cron jobs for '${VPS.username}'${sh.endTitle}"`,
    'mkdir -p /var/spool/cron/crontabs/',
    'apt-get update',
    'apt-get install -y cron',
    `echo ${crons} | ${append ? 'tee -a' : 'cat >'} /var/spool/cron/crontabs/${
      VPS.username
    }`,
  ];

  if (!append) commands.push(`echo ${crons}`);

  commands.push(sh.done);

  return commands;
};
