import { svpsOptions } from '../index.js';
import { cwd } from './root.js';
import { join } from 'path';

const configs = await import(join(`./${cwd}`, '.svpsrc.js'));
const input: svpsOptions = { ...{}, ...configs.default };
const output = {
   VPS: input.VPS,

   OPTIONS: input.OPTIONS,

   CRONTAB: input.CRONTAB && typeof input.CRONTAB === 'object' ? input.CRONTAB : null,

   APACHE: input.APACHE && typeof input.APACHE === 'object' ? input.APACHE : null,

   APPEND_COMMANDS:
      input.APPEND_COMMANDS && typeof input.APPEND_COMMANDS === 'function' ? input.APPEND_COMMANDS : (): string[] => [],

   FTP: input.FTP && typeof input.FTP === 'object' ? input.FTP : null,

   NODE: input.NODE && typeof input.NODE === 'object' ? input.NODE : null,

   DOMAINS: input.DOMAINS && typeof input.DOMAINS === 'string' ? input.DOMAINS : './.domains.json',

   SQL: input.SQL && typeof input.SQL === 'object' ? input.SQL : null,
};

export const { VPS, APACHE, CRONTAB, APPEND_COMMANDS, DOMAINS, FTP, NODE, OPTIONS, SQL } = output;
