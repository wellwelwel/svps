import { connect, end, exec } from '../../../ssh.js';
import { ACCESS } from '../../../types/acess.js';

export default (VPS: ACCESS): Promise<true> =>
   new Promise(async (resolve, reject) => {
      console.log('\n\x1b[0m\x1b[33m\x1b[1m⦿ Restarting SSH Service\x1b[0m');

      try {
         await exec('systemctl restart ssh');
      } catch (quiet) {}

      try {
         await end();
      } catch (quiet) {}

      let count = 0;

      const reconnect = setInterval(async () => {
         if (count >= 30) {
            clearInterval(reconnect);
            reject('Restarting SSH Service Failed!');
         }

         try {
            await connect(VPS);
            clearInterval(reconnect);
            resolve(true);
         } catch (quiet) {
            count++;
         }
      }, 1500);
   });