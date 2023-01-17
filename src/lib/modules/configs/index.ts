import { join } from 'path';
import { svpsOptions } from '../../index.js';
import { cwd } from '../root.js';

const configs = await import(join(`./${cwd}`, '.svpsrc.js'));

export const input: svpsOptions = { ...{}, ...configs.default };
