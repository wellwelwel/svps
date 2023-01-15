import fs from 'fs';
import { normalize } from 'path';
import { __dirname, cwd } from '../modules/root.js';

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

      const source = normalize(`${__dirname}/resources/local-module/${from}`);
      const dest = normalize(`${cwd}/${to}`);

      if (!fs.existsSync(dest)) fs.writeFileSync(dest, fs.readFileSync(source, 'utf-8'));
   }
})();
