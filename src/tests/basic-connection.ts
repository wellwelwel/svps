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
      configPath: './svpsrc-basic-connection.js',
    });

    await svps.mount();
    await svps.end();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
