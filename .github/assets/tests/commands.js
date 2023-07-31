import { SVPS } from 'svps';

(async () => {
  const svps = new SVPS({
    access: {
      host: process.env?.HOST || '127.0.0.1',
      username: process.env.USER,
      password: process.env.PASS,
      port: Number(process.env.PORT) || 22,
    },
  });

  await svps.commands(['crontab -l']);
  await svps.end();
})();
