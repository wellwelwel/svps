import { connect, exec } from '../../ssh.js';
import { VPS, OPTIONS } from '../../modules/configs.js';
import apt from './apt.js';

export default (): Promise<true> =>
   new Promise(async (resolve, reject) => {
      console.log('\n\x1b[33mRestarting...\x1b[0m');

      try {
         await exec('reboot');
      } catch (error) {}

      let count = 0;

      const reconnect = setInterval(async () => {
         if (count >= 30) {
            clearInterval(reconnect);
            reject('Restarting Failed!');
         }

         try {
            await connect(VPS);

            clearInterval(reconnect);
            OPTIONS?.steps?.apt && (await exec(apt().join()));
            await exec('history -c');

            resolve(true);
         } catch (error) {
            count++;
         }
      }, 15000);
   });
