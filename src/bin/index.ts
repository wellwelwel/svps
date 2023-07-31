#! /usr/bin/env node

import fs from 'fs';
import { resolve } from 'path';
import { rootSVPS } from '../lib/modules/root.js';

(() => {
  try {
    const resources = [
      {
        from: '.svpsrc.js',
        to: '.svpsrc.js',
      },
    ];

    for (const resource of resources) {
      const { from, to } = resource;

      const source = resolve(`${rootSVPS}/../resources/local-module/${from}`);
      const dest = resolve(to);

      if (!fs.existsSync(dest)) fs.copyFileSync(source, dest);
    }
  } catch (error) {
    console.log(`\x1b[0m\x1b[1m\x1b[31m✖︎`, error, '\x1b[0m\n');
    process.exit(1);
  }
})();
