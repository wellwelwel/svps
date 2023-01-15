import { connect, end, exec } from '../../ssh.js';
import { OPTIONS } from '../../modules/configs.js';
import apt from './apt.js';
import { VPS } from '../../index.js';

export default (VPS: VPS): Promise<true> =>
   new Promise(async (resolve, reject) => {
      console.log('\n\x1b[33mRestarting...\x1b[0m');

      try {
         await exec('reboot');
      } catch (quiet) {}

      try {
         await end();
      } catch (quiet) {}

      let count = 0;

      const reconnect = setInterval(async () => {
         if (count >= 30) {
            clearInterval(reconnect);
            reject('Restarting Failed!');
         }

         try {
            await connect(VPS);

            clearInterval(reconnect);
            if (OPTIONS?.steps?.apt) {
               const commands = apt();

               for (const command of commands) await exec(command, VPS);
            }

            await exec('history -c');

            resolve(true);
         } catch (quiet) {
            count++;
         }
      }, 15000);
   });
