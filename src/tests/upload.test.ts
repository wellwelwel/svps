import { assert } from 'poku';
import { SVPS } from '../lib/index.js';

(async () => {
  const svps = new SVPS({
    access: {
      host: process.env?.HOST || '127.0.0.1',
      username: String(process.env.USER),
      password: process.env.PASS,
      port: Number(process.env.PORT) || 22,
    },
  });

  const upload = await svps.upload([
    {
      local: '../resources',
      remote: '/root/svps',
      permissions: {
        user: 'support',
      },
    },
  ]);

  await svps.end();

  assert.strictEqual(upload, true, 'Uploading a directory');
})();
