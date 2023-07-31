import { catchExec, connect, end, exec } from '../../ssh.js';
import { ACCESS } from '../../types/acess.js';

export default async (VPS: ACCESS): Promise<true> => {
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

        await exec('history -c');

        resolve(true);
      } catch (quiet) {
        count++;
      }
    }, 15000);
  });
};
