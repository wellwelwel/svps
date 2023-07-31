import { SVPS } from '../../lib/index.js';

const svps = new SVPS({
  access: {
    host: process.env?.HOST || '127.0.0.1',
    username: String(process.env.USER),
    password: process.env.PASS,
    port: Number(process.env.PORT) || 22,
  },
});

await svps.upload([
  {
    local: '../',
    remote: '/root/Documents/examples',
  },
]);

await svps.end();
