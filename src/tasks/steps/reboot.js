const SSH = require('../../modules/set-ssh');
const { VPS } = require(`${process.cwd()}/.svpsrc.js`);

module.exports = async () => {

   const restarting = new Promise((resolve, reject) => {

      console.log('\n\x1b[33mRestarting...\x1b[0m');

      try {

         SSH(VPS, [ 'reboot' ]);
      }
      catch (error) { }

      let count = 0;

      const reconnect = setInterval(async () => {

         if (count >= 30) {

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
      }, 15000);
   });

   if (!await restarting) return restarting;

   await SSH(VPS, [ ...require('./apt')() ]);
};