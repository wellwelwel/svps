import fs from 'fs';
import { resolve } from 'path';
import { __dirname } from '../modules/root.js';

(() => {
   const resources = [
      {
         from: '.svpsrc.js',
         to: '.svpsrc.js',
      },
      {
         from: '.cronjobs.sh',
         to: '.cronjobs.sh',
      },
      {
         from: '.domains.json',
         to: '.domains.json',
      },
      {
         from: '.default.html',
         to: 'index.html',
      },
   ];

   for (const resource of resources) {
      const { from, to } = resource;

      const source = resolve(`${__dirname}/resources/local-module/${from}`);
      const dest = resolve(to);

      if (!fs.existsSync(dest)) fs.copyFileSync(source, dest);
   }
})();
