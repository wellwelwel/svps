import fs from 'fs';
import { resolve } from 'path';
import { __dirname } from '../modules/root.js';
import { buildJSON, readJSON } from '../modules/json.js';

/** package.json */
(() => {
  const packagePath = 'package.json';

  if (!fs.existsSync(packagePath)) fs.writeFileSync(packagePath, '{}');

  const packageFile: { type?: string } = readJSON(packagePath) || {};

  if (!('type' in packageFile)) {
    packageFile.type = 'module';

    fs.writeFileSync(packagePath, buildJSON(packageFile));
  } else if ('type' in packageFile && packageFile.type !== 'module') {
    throw new Error(
      'SVPS is designed to be used with ECMAScript Modules (ESM)'
    );
  }
})();

/** resources */
(() => {
  const resources = [
    {
      from: '.svpsrc.js',
      to: '.svpsrc.js',
    },
  ];

  for (const resource of resources) {
    const { from, to } = resource;

    const source = resolve(`${__dirname}/resources/local-module/${from}`);
    const dest = resolve(to);

    if (!fs.existsSync(dest)) fs.copyFileSync(source, dest);
  }
})();
