import { catchExec, connect, end, exec } from '../../ssh.js';
import { setSteps } from '../../modules/configs/steps.js';
import apt from './apt.js';
import { ACCESS } from '../../types/acess.js';
import { svpsOptions } from '../../types/svps.js';

export default async (configs: svpsOptions, VPS: ACCESS): Promise<true> => {
  const steps = setSteps(configs);

  try {
    await catchExec(
      "shutdown -r +0 \"`date '+%H:%M:%S' -d '+2 seconds'`\" & disown"
    );
  } catch (quiet) {}

  try {
    await end();
  } catch (quiet) {}

  return new Promise((resolve, reject) => {
    let count = 0;

    console.log('\n\x1b[0m\x1b[33m\x1b[1m⦿ Restarting\x1b[0m');

    const reconnect = setInterval(async () => {
      if (count >= 30) {
        clearInterval(reconnect);
        reject('Restarting Failed!');
      }

      try {
        await connect(VPS);
        clearInterval(reconnect);

        if (steps.apt) {
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
};
