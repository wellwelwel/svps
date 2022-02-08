const fs = require('fs');
const { normalize } = require('path');

(() => {

   const resources = [
      {
         from: '../../resources/local-module/.svpsrc.js',
         to: '.svpsrc.js'
      },
      {
         from: '../../resources/local-module/.cronjobs.sh',
         to: '.cronjobs.sh'
      },
      {
         from: '../../resources/local-module/.domains.json',
         to: '.domains.json'
      },
      {
         from: '../../resources/local-module/.default.html',
         to: 'index.html'
      },
   ];

   for (const resource of resources) {

      const { from, to } = resource;

      const source = normalize(`${__dirname}/${from}`);
      const dest = normalize(`${process.cwd()}/${to}`);

      if (!fs.existsSync(dest)) fs.writeFileSync(dest, fs.readFileSync(source, 'utf-8'));
   }
})();