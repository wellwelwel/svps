import sh from '../../modules/sh.js';
import { NODE } from '../../modules/configs.js';

export default () => {
   if (!NODE) return [] as string[];

   const { npm } = NODE;

   const sub_steps = [
      `echo "${sh.startTitle}Setting up Node.js${sh.endTitle}"`,
      'apt-get remove nodejs npm -y',
      `curl -fsSL https://deb.nodesource.com/setup_${NODE.version}.x | bash -`,
      'apt-get install nodejs',
      'node -v',
      'echo "{}" | cat > package.json',
      'npm install --package-lock-only',
      'npm i npm@latest -g 2>/dev/null',
   ];

   if (npm.global.length > 0)
      for (const module of npm.global) {
         Object.assign(sub_steps, [
            ...sub_steps,
            `echo "\n\x1b[33mModule:\x1b[0m ${module}"`,
            `npm install ${module} --global`,
         ]);
      }

   Object.assign(sub_steps, [...sub_steps, 'npm audit fix', sh.done]);

   if (npm?.global?.includes('pm2') && npm?.server?.autostart) sub_steps.push('pm2 startup');

   return sub_steps;
};
