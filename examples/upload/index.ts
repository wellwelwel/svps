import { SVPS } from '../../lib/index.js';

const svps = new SVPS({
  access: {
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
  },
});

await svps.upload([
  {
    local: '../',
    remote: '/root/Documents/examples',
  },
]);

await svps.end();
