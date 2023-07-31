import { join } from 'path';
import { svpsOptions } from '../../types/svps.js';
import { cwd } from '../root.js';

export const setConfigs = (path: string): Promise<svpsOptions> =>
  import(join(`./${cwd}`, path)).then((module) => ({
    ...{},
    ...module.default,
  }));
