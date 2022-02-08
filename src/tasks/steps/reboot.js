const SSH = require('../../modules/set-ssh');
const { VPS } = require(`${process.cwd()}/.svpsrc.js`);

module.exports = () => new Promise((resolve, reject) => {

   console.log('\n\x1b[33mRestarting...\x1b[0m');

   try {

      SSH(VPS, [ 'reboot' ]);
   }
   catch (error) { }

   let count = 0;

   const reconnect = setInterval(async () => {

      if (count > 10) {

         clearInterval(reconnect);
         reject('Restarting Failed!');
      }

      try {

         await SSH(VPS, [ 'history -c' ]);
         clearInterval(reconnect);
         resolve(true);
      }
      catch (error) {

         count++;
      }
   }, 10000);
});