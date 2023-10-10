import fs from 'fs';
import { normalize } from 'path';
import sh from '../../modules/sh.js';
import { escapeQuotes } from '../../modules/escape-quotes.js';
import { setCrontab } from '../../modules/configs/crontab.js';
import { ACCESS } from '../../types/acess.js';
import { MOUNT } from '../../types/mount.js';

export default (configs: MOUNT, VPS: ACCESS) => {
  const crontab = setCrontab(configs);

  if (!crontab) return [] as string[];

  const append = crontab.append || false;
  const crons = escapeQuotes(fs.readFileSync(normalize(crontab.path), 'utf-8'));
  const commands = [
    `echo "${sh.startTitle}Setting up cron jobs for '${VPS.username}'${sh.endTitle}"`,
    'sudo mkdir -p /var/spool/cron/crontabs/',
    'sudo apt-get update',
    'sudo apt-get install -y cron',
    `echo ${crons} | sudo tee${append ? ' -a' : ''} /var/spool/cron/crontabs/${
      VPS.username
    }`,
  ];

  commands.push(`echo ${crons}`);
  commands.push(sh.done);

  return commands;
};
