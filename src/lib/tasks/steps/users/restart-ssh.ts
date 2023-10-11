import { connect, end, catchExec } from '../../../ssh.js';
import { ACCESS } from '../../../types/acess.js';

export default async (VPS: ACCESS): Promise<true> => {
  try {
    await catchExec('sudo systemctl restart sshd');
  } catch (quiet) {}

  try {
    await end();
  } catch (quiet) {}

  return new Promise((resolve, reject) => {
    console.log('\n\x1b[0m\x1b[33m\x1b[1m⦿ Restarting SSH Service\x1b[0m');

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
    }, 5000);
  });
};
