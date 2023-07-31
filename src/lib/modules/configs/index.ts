import { join } from 'path';
import { svpsOptions } from '../../types/svps.js';

export const setConfigs = (path: string = '.svpsrc.js'): Promise<svpsOptions> =>
  import(join(`./${process.cwd()}`, path)).then((module) => ({
    ...{},
    ...module.default,
  }));
