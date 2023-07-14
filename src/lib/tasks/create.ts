import fs from 'fs';
import { resolve } from 'path';
import { __dirname } from '../modules/root.js';
import { buildJSON, readJSON } from '../modules/json.js';

const packagePath = 'package.json';

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

if (!fs.existsSync(packagePath)) fs.writeFileSync(packagePath, '{}');

const packageFile: { type?: string } = readJSON(packagePath) || {};

if (!('type' in packageFile)) {
  packageFile.type = 'module';

  fs.writeFileSync(packagePath, buildJSON(packageFile));
}

for (const resource of resources) {
  const { from, to } = resource;

  const source = resolve(`${__dirname}/resources/local-module/${from}`);
  const dest = resolve(to);

  if (!fs.existsSync(dest)) fs.copyFileSync(source, dest);
}
