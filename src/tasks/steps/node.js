const sh = require('../../modules/sh');
const { NODE } = require(`${process.cwd()}/.svpsrc.js`);

module.exports = () => {

   const { npm } = NODE;

   const sub_steps = [

      `echo "${sh.startTitle}Setting up Node.js${sh.endTitle}"`,
      'apt remove nodejs npm -y',
      `curl -fsSL https://deb.nodesource.com/setup_${NODE.version}.x | bash -`,
      'apt install nodejs',
      'node -v',
      'echo "{}" | cat > package.json',
      'npm install --package-lock-only'
   ];

   if (npm.global.length > 0) for (const module of npm.global) {

      Object.assign(sub_steps, [

         ...sub_steps,
         `echo "\n\x1b[33mModule:\x1b[0m ${module}"`,
         `npm install ${module} --global`,
      ]);
   }

   Object.assign(sub_steps, [

      ...sub_steps,
      'npm audit fix',
      sh.done,
   ]);

   return sub_steps;
};