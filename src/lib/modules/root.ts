// import { dirname, sep, resolve, normalize } from 'path';
// import { platform } from 'os';

import { resolve } from 'path';

// const isWindows = platform() === 'win32';

// export const __dirname = (() => {
//   const meta = dirname(decodeURI(new URL(import.meta.url).pathname));
//   const currentPath = isWindows ? meta.substring(1) : meta;
//   const paths = currentPath.split('/');
//   const rootIndex = paths.lastIndexOf('svps');

//   return resolve(paths.splice(0, rootIndex + 1).join(sep));
// })();

// export const cwd = normalize(`file:///${process.cwd()}`);

export const rootSVPS = resolve(`${__dirname}/../..`);
