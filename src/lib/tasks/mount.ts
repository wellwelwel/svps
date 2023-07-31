// User options from ".svpsrc.js"
import { setConfigs } from '../modules/configs/index.js';
import { setAccess } from '../modules/configs/access.js';
import { setSteps } from '../modules/configs/steps.js';
import { uploads } from '../modules/configs/uploads.js';

// SSH
import { catchExec, connect, end, exec } from '../ssh.js';

import { setCommands } from '../modules/commands.js';
import reboot from './steps/reboot.js';

/**
 *
 * Prepare the command queue, upload the files and directories and execute the commands.
 *
 * ---
 *
 * Is *.svpsrc.js* missing? Simply run `npx svps create` 🧙🏻
 */
export const mount = async (options?: {
  /** Set a custom path to `.svpsrc.js` */
  configPath?: string;
}): Promise<true | never> => {
  try {
    const configs = await setConfigs(options?.configPath || '.svpsrc.js');

    const steps = setSteps(configs);
    const hosts = setAccess(configs);

    let errors = false;

    for (const host of hosts) {
      console.log(
        `\x1b[22m\x1b[36m\x1b[1m⦿ ${host.username}@${host.host}\x1b[0m`
      );

      try {
        await connect(host);

        /** Just checking the connection */
        await catchExec('sleep 1');

        /** Uploading files and directories */
        await uploads(configs, steps);

        await setCommands({
          configs,
          host,
          steps,
        });

        /** Clean up */
        await exec('history -c', host);

        if (steps.reboot) await reboot(steps, host);

        await end();

        console.log('\x1b[0m');
      } catch (error) {
        console.log(`\x1b[0m${error}`);
        errors = true;
        break;
      }
    }

    console.log(
      `\x1b[0m\x1b[1m${
        !errors ? '\x1b[32m✔︎ Success' : '\n\x1b[31m✖︎ Fail'
      }\x1b[0m\n`
    );

    if (errors) process.exit(1);

    return true;
  } catch (error) {
    console.log(`\x1b[0m\x1b[1m\x1b[31m✖︎`, error, '\x1b[0m\n');
    process.exit(1);
  }
};
