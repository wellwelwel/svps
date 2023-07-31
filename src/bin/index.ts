#! /usr/bin/env node

import fs from 'fs';
import { resolve } from 'path';
import { rootSVPS } from '../lib/modules/root.js';

(() => {
  try {
    const [, , ...args] = process.argv;
    const main = args[0];

    const alloweds = ['create'];

    if (!alloweds.includes(main)) {
      console.log('Enter one of the following commands: "create"');
      process.exit(1);
    }

    const readJSON = (file: string): object =>
      JSON.parse(fs.readFileSync(file, 'utf-8'));

    const buildJSON = (obj: object) => JSON.stringify(obj, null, 2);

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

    const resources = [
      {
        from: '.svpsrc.js',
        to: '.svpsrc.js',
      },
    ];

    for (const resource of resources) {
      const { from, to } = resource;

      const source = resolve(`${rootSVPS}/resources/local-module/${from}`);
      const dest = resolve(to);

      if (!fs.existsSync(dest)) fs.copyFileSync(source, dest);
    }
  } catch (error) {
    console.log(`\x1b[0m\x1b[1m\x1b[31m✖︎`, error, '\x1b[0m\n');
    process.exit(1);
  }
})();
