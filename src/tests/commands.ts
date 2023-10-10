import { SVPS } from '../lib/index.js';

(async () => {
  try {
    const svps = new SVPS({
      access: {
        host: process.env?.HOST || '127.0.0.1',
        username: String(process.env.USER),
        password: process.env.PASS,
        port: Number(process.env.PORT) || 22,
      },
    });

    const commands = await svps.commands(['crontab -l']);
    await svps.end();

    if (commands !== true) process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
