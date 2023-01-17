import sh from '../../modules/sh.js';
import { node } from '../../modules/configs/node.js';

export default () => {
   if (!node) return [] as string[];

   const commands = [
      `echo "${sh.startTitle}Setting up Node.js${sh.endTitle}"`,
      'apt-get remove nodejs npm -y',
      `curl -fsSL https://deb.nodesource.com/setup_${node.version}.x | bash -`,
      'apt-get install nodejs',
      'node -v',
      'echo "{}" | cat > package.json',
      'npm install --package-lock-only',
      'npm i npm@latest -g 2>/dev/null',
   ];

   if (node.packages.length > 0)
      for (const module of node.packages) {
         Object.assign(commands, [
            ...commands,
            `echo "\n\x1b[0m\x1b[1m\x1b[34m‣ Global Module:\x1b[0m \x1b[22m\x1b[1m${module}\x1b[0m"`,
            `npm i ${module} -g`,
         ]);
      }

   if (node.packages.includes('pm2')) commands.push('echo "\n"; pm2 startup');

   Object.assign(commands, [...commands, 'npm audit fix', sh.done]);

   return commands;
};
